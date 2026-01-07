// app/admin/categories.tsx
// @ts-nocheck
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
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
    description: string;
    imageUrl: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
    });

    // Emoji presets
    const emojiPresets = [
        '🍽️', '🍜', '🍲', '🍛', '🍱', '🍝', '🍕', '🍔',
        '🌮', '🌯', '🥗', '🥙', '🍗', '🍖', '🥩', '🍤',
        '🍣', '🍙', '🍚', '🍞', '🥐', '🥖', '🥨', '🧀',
        '☕', '🍵', '🧃', '🥤', '🍹', '🍺', '🍻', '🧊',
        '🍰', '🎂', '🍮', '🍦', '🍧', '🍨', '🍩', '🍪',
    ];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_CONFIG.BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Alert.alert('Lỗi', 'Không thể tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditMode(false);
        setSelectedCategory(null);
        setFormData({
            name: '',
            description: '',
            imageUrl: '🍽️',
        });
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditMode(true);
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            imageUrl: category.imageUrl,
        });
        setShowModal(true);
    };

    const handleDelete = (category: Category) => {
        Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa "${category.name}"?`, [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = await TokenStorage.getToken();
                        const response = await fetch(
                            `${API_CONFIG.BASE_URL}/categories/${category.id}`,
                            {
                                method: 'DELETE',
                                headers: getAuthHeaders(token),
                            }
                        );

                        if (!response.ok) throw new Error('Delete failed');

                        Alert.alert('Thành công', 'Đã xóa danh mục');
                        fetchCategories();
                    } catch (error) {
                        console.error('Error deleting category:', error);
                        Alert.alert('Lỗi', 'Không thể xóa danh mục');
                    }
                },
            },
        ]);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
            return;
        }
        if (!formData.imageUrl.trim()) {
            Alert.alert('Lỗi', 'Vui lòng chọn emoji');
            return;
        }

        try {
            const token = await TokenStorage.getToken();
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim(),
            };

            const url = editMode
                ? `${API_CONFIG.BASE_URL}/categories/${selectedCategory.id}`
                : `${API_CONFIG.BASE_URL}/categories`;

            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Submit failed');

            Alert.alert('Thành công', editMode ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục mới');
            setShowModal(false);
            fetchCategories();
        } catch (error) {
            console.error('Error submitting category:', error);
            Alert.alert('Lỗi', 'Không thể lưu danh mục');
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <Text style={styles.headerTitle}>Quản lý Danh mục</Text>
                    <Text style={styles.headerSubtitle}>{categories.length} danh mục</Text>
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
                    placeholder="Tìm kiếm danh mục..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* CATEGORIES GRID */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.categoriesGrid}>
                    {filteredCategories.map((category, index) => (
                        <Animated.View
                            key={category.id}
                            entering={FadeInDown.delay(index * 50).duration(400)}
                            style={styles.categoryCard}
                        >
                            <View style={styles.categoryContent}>
                                <View style={styles.categoryIconBox}>
                                    <Text style={styles.categoryEmoji}>{category.imageUrl}</Text>
                                </View>
                                <Text style={styles.categoryName} numberOfLines={1}>
                                    {category.name}
                                </Text>
                                <Text style={styles.categoryDesc} numberOfLines={2}>
                                    {category.description || 'Không có mô tả'}
                                </Text>
                            </View>
                            <View style={styles.categoryActions}>
                                <TouchableOpacity
                                    style={styles.actionBtn}
                                    onPress={() => handleEdit(category)}
                                >
                                    <Text style={styles.actionIcon}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.2)' }]}
                                    onPress={() => handleDelete(category)}
                                >
                                    <Text style={styles.actionIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>

            {/* MODAL */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editMode ? 'Cập nhật Danh mục' : 'Tạo Danh mục mới'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Tên danh mục *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    placeholder="VD: Món chính"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Mô tả</Text>
                                <TextInput
                                    style={[styles.input, { height: 80 }]}
                                    value={formData.description}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, description: text })
                                    }
                                    placeholder="Mô tả ngắn gọn về danh mục..."
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                    multiline
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Chọn Emoji *</Text>
                                <View style={styles.selectedEmoji}>
                                    <Text style={styles.selectedEmojiText}>{formData.imageUrl}</Text>
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.emojiScroll}
                                >
                                    {emojiPresets.map((emoji) => (
                                        <TouchableOpacity
                                            key={emoji}
                                            style={[
                                                styles.emojiBtn,
                                                formData.imageUrl === emoji && styles.emojiBtnActive,
                                            ]}
                                            onPress={() => setFormData({ ...formData, imageUrl: emoji })}
                                        >
                                            <Text style={styles.emojiBtnText}>{emoji}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
    },
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
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    categoryCard: {
        width: isWeb ? 'calc(25% - 12px)' : (width - 55) / 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        minHeight: 180,
    },
    categoryContent: { flex: 1, alignItems: 'center' },
    categoryIconBox: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(168,85,247,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    categoryEmoji: { fontSize: 36 },
    categoryName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 6,
    },
    categoryDesc: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        lineHeight: 16,
    },
    categoryActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(168,85,247,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionIcon: { fontSize: 16 },
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
        maxHeight: '85%',
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
    selectedEmoji: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(168,85,247,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#A855F7',
    },
    selectedEmojiText: { fontSize: 40 },
    emojiScroll: { marginTop: 10 },
    emojiBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    emojiBtnActive: {
        backgroundColor: '#A855F7',
        borderColor: '#A855F7',
        transform: [{ scale: 1.1 }],
    },
    emojiBtnText: { fontSize: 24 },
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