import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Platform,
    Modal,
} from 'react-native';
import { router } from 'expo-router';

const isWeb = Platform.OS === 'web';

type Addon = {
    id: number;
    name: string;
    price: number;
};

export default function ProductDetail() {
    const [quantity, setQuantity] = useState(1);
    const [selectedAddon, setSelectedAddon] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Sample product data
    const product = {
        id: 1,
        name: 'Phở tái',
        category: 'Bò tái',
        price: 50000,
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
        rating: 4.8,
        soldCount: 200,
        reviews: 1,
    };

    const addons: Addon[] = [
        { id: 1, name: 'Tô muống dứa', price: 3000 },
        { id: 2, name: 'Bánh phở chiên', price: 5000 },
        { id: 3, name: 'Chả giò', price: 10000 },
    ];

    const calculateTotal = () => {
        let total = product.price * quantity;
        if (selectedAddon) {
            const addon = addons.find(a => a.id === selectedAddon);
            if (addon) {
                total += addon.price * quantity;
            }
        }
        return total;
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    const handleAddToCart = () => {
        if (quantity === 0) {
            setShowConfirmDialog(true);
        } else {
            // Add to cart logic here
            setShowSuccessDialog(true);
            setTimeout(() => {
                setShowSuccessDialog(false);
                router.back();
            }, 1500);
        }
    };

    const handleConfirmRemove = () => {
        setShowConfirmDialog(false);
        // Remove from cart logic
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Header Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.closeIcon}>×</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Text style={styles.shareIcon}>🔗</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Product Info */}
                <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                        <View style={styles.productTitleBox}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>
                                {formatCurrency(product.price)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.categoryText}>{product.category}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>🛒</Text>
                            <Text style={styles.statText}>{product.soldCount}+ đã bán</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>👍</Text>
                            <Text style={styles.statText}>{product.reviews}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <TouchableOpacity style={styles.statItem}>
                            <Text style={styles.reviewLink}>Xem đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Addons Section */}
                <View style={styles.addonsSection}>
                    <Text style={styles.sectionTitle}>Dụng Cụ Ăn Uống</Text>
                    <Text style={styles.sectionSubtitle}>Chọn tối đa 1</Text>

                    {addons.map((addon) => (
                        <TouchableOpacity
                            key={addon.id}
                            style={[
                                styles.addonItem,
                                selectedAddon === addon.id && styles.addonItemSelected,
                            ]}
                            onPress={() =>
                                setSelectedAddon(selectedAddon === addon.id ? null : addon.id)
                            }
                        >
                            <View style={styles.addonLeft}>
                                <View
                                    style={[
                                        styles.checkbox,
                                        selectedAddon === addon.id && styles.checkboxSelected,
                                    ]}
                                >
                                    {selectedAddon === addon.id && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.addonName}>{addon.name}</Text>
                            </View>
                            <Text style={styles.addonPrice}>{formatCurrency(addon.price)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Note Section */}
                <View style={styles.noteSection}>
                    <Text style={styles.sectionTitle}>Ghi chú cho quán</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="Cho quán biết thêm về yêu cầu của bạn."
                        placeholderTextColor="#95A5A6"
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomLeft}>
                    <Text style={styles.totalPrice}>{formatCurrency(calculateTotal())}</Text>
                </View>

                <View style={styles.bottomRight}>
                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(Math.max(0, quantity - 1))}
                        >
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButtonAdd}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <Text style={styles.quantityButtonAddText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddToCart}
            >
                <Text style={styles.addButtonText}>
                    {quantity === 0 ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ'}
                </Text>
            </TouchableOpacity>

            {/* Confirm Remove Dialog */}
            <Modal visible={showConfirmDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogTitle}>Cập nhật giỏ hàng</Text>
                        <Text style={styles.dialogMessage}>
                            Bạn có chắc sẽ xóa món này khỏi giỏ hàng?
                        </Text>
                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogButtonCancel}
                                onPress={() => setShowConfirmDialog(false)}
                            >
                                <Text style={styles.dialogButtonCancelText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogButtonConfirm}
                                onPress={handleConfirmRemove}
                            >
                                <Text style={styles.dialogButtonConfirmText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success Dialog */}
            <Modal visible={showSuccessDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.successDialog}>
                        <Text style={styles.successIcon}>✅</Text>
                        <Text style={styles.successText}>Đã thêm vào giỏ hàng!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        width: '100%',
        height: isWeb ? 400 : 300,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: isWeb ? 20 : 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    closeIcon: {
        fontSize: 32,
        color: '#2C3E50',
        fontWeight: '300',
    },
    shareButton: {
        position: 'absolute',
        top: isWeb ? 20 : 50,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    shareIcon: {
        fontSize: 22,
    },
    contentContainer: {
        flex: 1,
    },
    productInfo: {
        padding: 20,
        borderBottomWidth: 8,
        borderBottomColor: '#F8F9FA',
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    productTitleBox: {
        flex: 1,
    },
    productName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#2C3E50',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2C3E50',
    },
    categoryText: {
        fontSize: 15,
        color: '#7F8C8D',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statIcon: {
        fontSize: 16,
    },
    statText: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: '#E8E8E8',
        marginHorizontal: 12,
    },
    reviewLink: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    addonsSection: {
        padding: 20,
        borderBottomWidth: 8,
        borderBottomColor: '#F8F9FA',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 16,
    },
    addonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    addonItemSelected: {
        backgroundColor: '#FFF5E6',
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    addonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#FFD93D',
        borderColor: '#FFD93D',
    },
    checkmark: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '900',
    },
    addonName: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
    },
    addonPrice: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '700',
    },
    noteSection: {
        padding: 20,
    },
    noteInput: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#2C3E50',
        minHeight: 80,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomLeft: {
        flex: 1,
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: '900',
        color: '#2C3E50',
    },
    bottomRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 30,
        padding: 4,
        gap: 16,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        minWidth: 30,
        textAlign: 'center',
    },
    quantityButtonAdd: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFD93D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonAddText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#FFD93D',
        height: 56,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2C3E50',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 12,
    },
    dialogMessage: {
        fontSize: 15,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    dialogButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    dialogButtonCancel: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    dialogButtonCancelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
    },
    dialogButtonConfirm: {
        flex: 1,
        backgroundColor: '#FFD93D',
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogButtonConfirmText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2C3E50',
    },
    successDialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    successIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    successText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
    },
});