import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';

const isWeb = Platform.OS === 'web';
const windowWidth = Dimensions.get('window').width;

export default function CartScreen() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Phở bò tái',
            price: 65000,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
            note: 'Không hành',
        },
        {
            id: 2,
            name: 'Bún bò Huế',
            price: 70000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
            note: '',
        },
        {
            id: 3,
            name: 'Cơm tấm sườn nướng',
            price: 75000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
            note: 'Thêm trứng',
        },
        {
            id: 4,
            name: 'Trà đá chanh',
            price: 15000,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
            note: '',
        },
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items =>
            items.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 0 ? 20000 : 0;
    const discount = subtotal > 200000 ? 30000 : 0;
    const total = subtotal + shippingFee - discount;

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.headerTitleBox}>
                            <Text style={styles.headerIcon}>🛒</Text>
                            <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
                        </View>
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                        </View>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {cartItems.length === 0 ? (
                        // Empty Cart
                        <View style={styles.emptyCart}>
                            <View style={styles.emptyCartIcon}>
                                <Text style={styles.emptyCartEmoji}>🛒</Text>
                            </View>
                            <Text style={styles.emptyCartTitle}>Giỏ hàng trống</Text>
                            <Text style={styles.emptyCartDesc}>
                                Hãy thêm món ăn yêu thích vào giỏ hàng nhé!
                            </Text>
                            <TouchableOpacity style={styles.shopNowButton}>
                                <Text style={styles.shopNowText}>Khám phá món ngon</Text>
                                <Text style={styles.shopNowIcon}>→</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.contentWrapper}>
                            {/* Cart Items Section */}
                            <View style={styles.leftSection}>
                                {/* Promo Banner */}
                                <View style={styles.promoBanner}>
                                    <Text style={styles.promoIcon}>🎁</Text>
                                    <View style={styles.promoTextBox}>
                                        <Text style={styles.promoTitle}>Miễn phí vận chuyển!</Text>
                                        <Text style={styles.promoDesc}>
                                            Cho đơn hàng từ 200.000đ
                                        </Text>
                                    </View>
                                </View>

                                {/* Cart Items List */}
                                <View style={styles.cartItemsContainer}>
                                    <View style={styles.cartHeader}>
                                        <Text style={styles.cartHeaderTitle}>
                                            Món đã chọn ({cartItems.length})
                                        </Text>
                                        <TouchableOpacity>
                                            <Text style={styles.clearAllText}>🗑️ Xóa tất cả</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {cartItems.map((item) => (
                                        <View key={item.id} style={styles.cartItem}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.cartItemImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.cartItemInfo}>
                                                <Text style={styles.cartItemName}>{item.name}</Text>
                                                {item.note && (
                                                    <View style={styles.noteBox}>
                                                        <Text style={styles.noteIcon}>📝</Text>
                                                        <Text style={styles.noteText}>{item.note}</Text>
                                                    </View>
                                                )}
                                                <View style={styles.cartItemFooter}>
                                                    <Text style={styles.cartItemPrice}>
                                                        {formatCurrency(item.price)}
                                                    </Text>
                                                    <View style={styles.quantityControl}>
                                                        <TouchableOpacity
                                                            style={styles.quantityButton}
                                                            onPress={() => updateQuantity(item.id, -1)}
                                                        >
                                                            <Text style={styles.quantityButtonText}>−</Text>
                                                        </TouchableOpacity>
                                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                                        <TouchableOpacity
                                                            style={styles.quantityButton}
                                                            onPress={() => updateQuantity(item.id, 1)}
                                                        >
                                                            <Text style={styles.quantityButtonText}>+</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => removeItem(item.id)}
                                            >
                                                <Text style={styles.removeIcon}>×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>

                                {/* Voucher Section */}
                                <View style={styles.voucherSection}>
                                    <Text style={styles.voucherTitle}>🎫 Mã giảm giá</Text>
                                    <TouchableOpacity style={styles.voucherInput}>
                                        <Text style={styles.voucherPlaceholder}>Nhập mã giảm giá</Text>
                                        <Text style={styles.voucherArrow}>→</Text>
                                    </TouchableOpacity>
                                    <View style={styles.availableVouchers}>
                                        <TouchableOpacity style={styles.voucherTag}>
                                            <Text style={styles.voucherTagText}>FREESHIP30K</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.voucherTag}>
                                            <Text style={styles.voucherTagText}>GIAM20%</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Order Summary Section */}
                            <View style={styles.rightSection}>
                                <View style={styles.summaryCard}>
                                    <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Tạm tính</Text>
                                        <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                                    </View>

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                                        <Text style={styles.summaryValue}>{formatCurrency(shippingFee)}</Text>
                                    </View>

                                    {discount > 0 && (
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Giảm giá</Text>
                                            <Text style={styles.summaryDiscount}>
                                                -{formatCurrency(discount)}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.summaryDivider} />

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
                                        <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
                                    </View>

                                    <TouchableOpacity style={styles.checkoutButton}>
                                        <Text style={styles.checkoutButtonText}>Thanh toán</Text>
                                        <Text style={styles.checkoutButtonIcon}>→</Text>
                                    </TouchableOpacity>

                                    <View style={styles.paymentMethods}>
                                        <Text style={styles.paymentTitle}>Thanh toán qua</Text>
                                        <View style={styles.paymentIcons}>
                                            <View style={styles.paymentIcon}>
                                                <Text style={styles.paymentEmoji}>💳</Text>
                                            </View>
                                            <View style={styles.paymentIcon}>
                                                <Text style={styles.paymentEmoji}>🏦</Text>
                                            </View>
                                            <View style={styles.paymentIcon}>
                                                <Text style={styles.paymentEmoji}>📱</Text>
                                            </View>
                                            <View style={styles.paymentIcon}>
                                                <Text style={styles.paymentEmoji}>💵</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Benefits Section */}
                                <View style={styles.benefitsCard}>
                                    <View style={styles.benefitItem}>
                                        <Text style={styles.benefitIcon}>✅</Text>
                                        <Text style={styles.benefitText}>Miễn phí đổi trả trong 7 ngày</Text>
                                    </View>
                                    <View style={styles.benefitItem}>
                                        <Text style={styles.benefitIcon}>⚡</Text>
                                        <Text style={styles.benefitText}>Giao hàng nhanh 30-45 phút</Text>
                                    </View>
                                    <View style={styles.benefitItem}>
                                        <Text style={styles.benefitIcon}>🎁</Text>
                                        <Text style={styles.benefitText}>Tích điểm đổi quà miễn phí</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? '100%' : undefined,
        alignSelf: isWeb ? 'center' : undefined,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#2C3E50',
    },
    headerTitleBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    headerIcon: {
        fontSize: 28,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2C3E50',
    },
    cartBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF8A3D',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#FFFFFF',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? '100%' : undefined,
        alignSelf: isWeb ? 'center' : undefined,
    },
    emptyCart: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyCartIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyCartEmoji: {
        fontSize: 60,
        opacity: 0.5,
    },
    emptyCartTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#2C3E50',
        marginBottom: 12,
    },
    emptyCartDesc: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 30,
    },
    shopNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF8A3D',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        gap: 10,
        shadowColor: '#FF8A3D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    shopNowText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    shopNowIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    contentWrapper: {
        flexDirection: isWeb ? 'row' : 'column',
        gap: 24,
    },
    leftSection: {
        flex: isWeb ? 2 : 1,
    },
    rightSection: {
        flex: isWeb ? 1 : 1,
    },
    promoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E6',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#FFD93D',
        gap: 12,
    },
    promoIcon: {
        fontSize: 32,
    },
    promoTextBox: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FF8A3D',
        marginBottom: 4,
    },
    promoDesc: {
        fontSize: 13,
        color: '#7F8C8D',
    },
    cartItemsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cartHeaderTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
    },
    clearAllText: {
        fontSize: 14,
        color: '#FF3B30',
        fontWeight: '600',
    },
    cartItem: {
        flexDirection: 'row',
        gap: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
    },
    cartItemInfo: {
        flex: 1,
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 6,
    },
    noteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    noteIcon: {
        fontSize: 12,
    },
    noteText: {
        fontSize: 12,
        color: '#7F8C8D',
        fontStyle: 'italic',
    },
    cartItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartItemPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: '#FF8A3D',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        gap: 12,
        paddingHorizontal: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: 16,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFE5E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    removeIcon: {
        fontSize: 20,
        color: '#FF3B30',
        fontWeight: '700',
    },
    voucherSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    voucherTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 12,
    },
    voucherInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        marginBottom: 12,
    },
    voucherPlaceholder: {
        fontSize: 14,
        color: '#95A5A6',
    },
    voucherArrow: {
        fontSize: 18,
        color: '#FF8A3D',
    },
    availableVouchers: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    voucherTag: {
        backgroundColor: '#FFF5E6',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FFD93D',
    },
    voucherTagText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FF8A3D',
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#2C3E50',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#7F8C8D',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
    },
    summaryDiscount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#34C759',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginVertical: 16,
    },
    summaryTotalLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
    },
    summaryTotalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FF8A3D',
    },
    checkoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF8A3D',
        paddingVertical: 18,
        borderRadius: 30,
        marginTop: 20,
        gap: 10,
        shadowColor: '#FF8A3D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    checkoutButtonIcon: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    paymentMethods: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    paymentTitle: {
        fontSize: 13,
        color: '#7F8C8D',
        marginBottom: 12,
        textAlign: 'center',
    },
    paymentIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    paymentEmoji: {
        fontSize: 24,
    },
    benefitsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    benefitIcon: {
        fontSize: 20,
    },
    benefitText: {
        fontSize: 14,
        color: '#2C3E50',
        fontWeight: '600',
        flex: 1,
    },
});