// app/admin/products.tsx
// @ts-nocheck
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { API_CONFIG, getAuthHeaders } from '../config/api';
import { TokenStorage } from '../utils/tokenStorage';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface Category {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    isActive: boolean;
    categoryId: number;
    category?: Category;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        imageUrl: '',
        categoryId: '',
        isActive: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchCategories()]);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreate = () => {
        setEditMode(false);
        setSelectedProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            imageUrl: '',
            categoryId: categories[0]?.id.toString() || '',
            isActive: true,
        });
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditMode(true);
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stockQuantity: product.stockQuantity.toString(),
            imageUrl: product.imageUrl,
            categoryId: product.categoryId.toString(),
            isActive: product.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = (product: Product) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa "${product.name}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await TokenStorage.getToken();
                            const response = await fetch(
                                `${API_CONFIG.BASE_URL}/products/${product.id}`,
                                {
                                    method: 'DELETE',
                                    headers: getAuthHeaders(token),
                                }
                            );

                            if (!response.ok) throw new Error('Delete failed');

                            Alert.alert('Thành công', 'Đã xóa sản phẩm');
                            fetchProducts();
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            Alert.alert('Lỗi', 'Không thể xóa sản phẩm');
                        }
                    },
                },
            ]
        );
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
            return;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            Alert.alert('Lỗi', 'Giá phải lớn hơn 0');
            return;
        }
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            Alert.alert('Lỗi', 'Số lượng không hợp lệ');
            return;
        }
        if (!formData.categoryId) {
            Alert.alert('Lỗi', 'Vui lòng chọn danh mục');
            return;
        }

        try {
            const token = await TokenStorage.getToken();
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                imageUrl: formData.imageUrl.trim(),
                categoryId: parseInt(formData.categoryId),
                isActive: formData.isActive,
            };

            const url = editMode
                ? `${API_CONFIG.BASE_URL}/products/${selectedProduct.id}`
                : `${API_CONFIG.BASE_URL}/products`;

            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Submit failed');

            Alert.alert('Thành công', editMode ? 'Đã cập nhật sản phẩm' : 'Đã tạo sản phẩm mới');
            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error submitting product:', error);
            Alert.alert('Lỗi', 'Không thể lưu sản phẩm');
        }
    };

    const filteredProducts = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#A855F7" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Quản lý Sản phẩm</Text>
                    <Text style={styles.headerSubtitle}>{products.length} sản phẩm</Text>
                </View>
                <TouchableOpacity onPress={handleCreate} style={styles.addBtn}>
                    <Text style={styles.addIcon}>+</Text>
                </TouchableOpacity>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* PRODUCTS LIST */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {filteredProducts.map((product, index) => (
                    <Animated.View
                        key={product.id}
                        entering={FadeInDown.delay(index * 50).duration(400)}
                    >
                        <View style={styles.productCard}>
                            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {product.name}
                                </Text>
                                <Text style={styles.productDesc} numberOfLines={2}>
                                    {product.description}
                                </Text>
                                <View style={styles.productMeta}>
                                    <Text style={styles.productPrice}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(product.price)}
                                    </Text>
                                    <Text style={styles.productStock}>Kho: {product.stockQuantity}</Text>
                                </View>
                                <View style={styles.statusRow}>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: product.isActive ? '#10B98120' : '#EF444420' },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: product.isActive ? '#10B981' : '#EF4444' },
                                            ]}
                                        >
                                            {product.isActive ? 'Hoạt động' : 'Ngừng bán'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.productActions}>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => handleEdit(product)}
                                >
                                    <Text style={styles.actionIcon}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.2)' }]}
                                    onPress={() => handleDelete(product)}
                                >
                                    <Text style={styles.actionIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                ))}
            </ScrollView>

            {/* MODAL */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode ? 'Cập nhật Sản phẩm' : 'Tạo Sản phẩm mới'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Tên sản phẩm *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="VD: Phở bò đặc biệt"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Mô tả</Text>
                                <TextInput
                                    style={[styles.input, { height: 80 }]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                    placeholder="Mô tả sản phẩm..."
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    multiline
                                />
                            </View>

                            <View style={styles.formRow}>
                                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.label}>Giá (VND) *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.price}
                                        onChangeText={(text) => setFormData({ ...formData, price: text })}
                                        placeholder="50000"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={[styles.formGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Số lượng *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData.stockQuantity}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, stockQuantity: text })
                                        }
                                        placeholder="100"
                                        placeholderTextColor="rgba(255,255,255,0.3)"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>URL hình ảnh</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.imageUrl}
                                    onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                                    placeholder="https://example.com/image.jpg"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Danh mục *</Text>
                                <View style={styles.pickerContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.categoryChip,
                                                    formData.categoryId === cat.id.toString() &&
                                                    styles.categoryChipActive,
                                                ]}
                                                onPress={() =>
                                                    setFormData({ ...formData, categoryId: cat.id.toString() })
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.categoryChipText,
                                                        formData.categoryId === cat.id.toString() &&
                                                        styles.categoryChipTextActive,
                                                    ]}
                                                >
                                                    {cat.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>

                            <View style={styles.formGroup}>
                                <TouchableOpacity
                                    style={styles.switchRow}
                                    onPress={() =>
                                        setFormData({ ...formData, isActive: !formData.isActive })
                                    }
                                >
                                    <Text style={styles.label}>Trạng thái hoạt động</Text>
                                    <View
                                        style={[
                                            styles.switch,
                                            formData.isActive && styles.switchActive,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.switchThumb,
                                                formData.isActive && styles.switchThumbActive,
                                            ]}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.btnCancel}
                                    onPress={() => setShowModal(false)}
                                >
                                    <Text style={styles.btnCancelText}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
                                    <Text style={styles.btnSubmitText}>
                                        {editMode ? 'Cập nhật' : 'Tạo mới'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A' },
    loadingText: { marginTop: 10, color: '#C084FC', fontSize: 16 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backBtn: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 24, color: '#FFF' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 13, color: '#C084FC', marginTop: 2 },
    addBtn: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#A855F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIcon: { fontSize: 28, color: '#FFF', fontWeight: '700' },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: { fontSize: 20, marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: '#FFF' },
    scrollContent: { padding: 20, paddingTop: 10 },
    productCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    productImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#1E293B' },
    productInfo: { flex: 1, marginLeft: 12 },
    productName: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 4 },
    productDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
    productMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
    productPrice: { fontSize: 16, fontWeight: '800', color: '#10B981' },
    productStock: { fontSize: 13, color: '#C084FC' },
    statusRow: { flexDirection: 'row' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    productActions: { flexDirection: 'column', gap: 8 },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(168,85,247,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: { fontSize: 18 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
    closeIcon: { fontSize: 24, color: '#C084FC' },
    formGroup: { marginBottom: 20 },
    formRow: { flexDirection: 'row' },
    label: { fontSize: 14, fontWeight: '600', color: '#C084FC', marginBottom: 8 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 15,
        color: '#FFF',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    pickerContainer: { marginTop: 5 },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginRight: 10,
    },
    categoryChipActive: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
    categoryChipText: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
    categoryChipTextActive: { color: '#FFF', fontWeight: '700' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    switch: {
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 2,
    },
    switchActive: { backgroundColor: '#10B981' },
    switchThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    switchThumbActive: { transform: [{ translateX: 22 }] },
    modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
    btnCancel: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    btnCancelText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
    btnSubmit: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#A855F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSubmitText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});