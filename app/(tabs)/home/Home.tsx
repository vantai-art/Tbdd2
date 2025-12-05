import { ChevronRight, Clock, Coffee, IceCream, Package, ShoppingBag, Sparkles, Star, TrendingUp, Truck, UtensilsCrossed } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    popular?: boolean;
}

interface Order {
    id: string;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
    total: number;
    createdAt: string;
}

interface HomeProps {
    onNavigate: (view: 'home' | 'menu' | 'cart' | 'orders') => void;
    cartItemCount?: number;
    orders?: Order[];
    popularProducts?: Product[];
}

export default function Home({
    onNavigate,
    cartItemCount = 0,
    orders = [],
    popularProducts = []
}: HomeProps) {
    const categories = [
        { id: 'food', name: 'Đồ ăn', icon: UtensilsCrossed, color: '#f97316', count: '200+' },
        { id: 'drink', name: 'Đồ uống', icon: Coffee, color: '#3b82f6', count: '150+' },
        { id: 'dessert', name: 'Tráng miệng', icon: IceCream, color: '#ec4899', count: '100+' },
    ];

    const features = [
        { icon: Star, text: 'Món ngon chất lượng', color: '#f59e0b', bgColor: '#fef3c7' },
        { icon: Clock, text: 'Giao nhanh 30 phút', color: '#10b981', bgColor: '#d1fae5' },
        { icon: Truck, text: 'Freeship > 100k', color: '#3b82f6', bgColor: '#dbeafe' },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const activeOrders = orders.filter(o => o.status !== 'delivered').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <ScrollView style={styles.container}>
            {/* Hero Banner */}
            <View style={styles.heroBanner}>
                <View style={styles.heroContent}>
                    <View style={styles.promoTag}>
                        <Sparkles size={20} color="#fff" />
                        <View style={styles.promoTagBadge}>
                            <Text style={styles.promoTagText}>Khuyến mãi đặc biệt</Text>
                        </View>
                    </View>
                    <Text style={styles.heroTitle}>Chào mừng bạn! 🎉</Text>
                    <Text style={styles.heroSubtitle}>
                        Khám phá hàng trăm món ăn ngon từ nhà hàng yêu thích của bạn
                    </Text>
                    <TouchableOpacity
                        style={styles.heroCTA}
                        onPress={() => onNavigate('menu')}
                    >
                        <Text style={styles.heroCTAText}>Đặt món ngay</Text>
                        <ChevronRight size={20} color="#f97316" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mainContent}>
                {/* Quick Stats Cards */}
                <View style={styles.statsGrid}>
                    {/* Cart Card */}
                    <TouchableOpacity
                        style={styles.statCard}
                        onPress={() => onNavigate('cart')}
                    >
                        <View style={styles.statCardHeader}>
                            <ShoppingBag size={32} color="#f97316" />
                            {cartItemCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{cartItemCount}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.statNumber}>{cartItemCount}</Text>
                        <Text style={styles.statLabel}>Món trong giỏ</Text>
                    </TouchableOpacity>

                    {/* Orders Card */}
                    <TouchableOpacity
                        style={styles.statCard}
                        onPress={() => onNavigate('orders')}
                    >
                        <View style={styles.statCardHeader}>
                            <Package size={32} color="#a855f7" />
                            {activeOrders > 0 && (
                                <View style={[styles.badge, styles.badgeGreen]}>
                                    <Text style={styles.badgeText}>{activeOrders}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.statNumber}>{orders.length}</Text>
                        <Text style={styles.statLabel}>Đơn hàng</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Order Alert */}
                {activeOrders > 0 && (
                    <TouchableOpacity
                        style={styles.activeOrderAlert}
                        onPress={() => onNavigate('orders')}
                    >
                        <View style={styles.activeOrderIcon}>
                            <Clock size={24} color="#fff" />
                        </View>
                        <View style={styles.activeOrderContent}>
                            <Text style={styles.activeOrderTitle}>
                                Bạn có {activeOrders} đơn hàng đang xử lý
                            </Text>
                            <Text style={styles.activeOrderSubtitle}>Nhấn để xem chi tiết</Text>
                        </View>
                        <ChevronRight size={20} color="#f97316" />
                    </TouchableOpacity>
                )}

                {/* Features */}
                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <View key={index} style={[styles.featureCard, { backgroundColor: feature.bgColor }]}>
                            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                                <feature.icon size={24} color="#fff" />
                            </View>
                            <Text style={[styles.featureText, { color: feature.color }]}>
                                {feature.text}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Danh mục món ăn</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => onNavigate('menu')}
                                style={styles.categoryItem}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                                    <category.icon size={32} color="#fff" />
                                </View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryCount}>{category.count} món</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Popular Products */}
                {popularProducts.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <TrendingUp size={20} color="#f97316" />
                                <Text style={styles.sectionTitle}>Món phổ biến</Text>
                            </View>
                            <TouchableOpacity onPress={() => onNavigate('menu')}>
                                <View style={styles.seeAllButton}>
                                    <Text style={styles.seeAllText}>Xem tất cả</Text>
                                    <ChevronRight size={16} color="#f97316" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.productsList}>
                            {popularProducts.slice(0, 3).map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.productItem}
                                    onPress={() => onNavigate('menu')}
                                >
                                    <View style={styles.productIcon}>
                                        <UtensilsCrossed size={32} color="#f97316" />
                                    </View>
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
                                    </View>
                                    <ChevronRight size={20} color="#9ca3af" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Promotional Banner */}
                <View style={styles.promoBanner}>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>Ưu đãi đặc biệt</Text>
                        <Text style={styles.promoSubtitle}>
                            Giảm 20% cho đơn hàng đầu tiên
                        </Text>
                        <View style={styles.promoCode}>
                            <Text style={styles.promoCodeText}>FIRST20</Text>
                        </View>
                    </View>
                    <Sparkles size={48} color="#fde047" />
                </View>

                {/* User Stats */}
                {orders.length > 0 && (
                    <View style={styles.userStatsGrid}>
                        <View style={styles.userStatCard}>
                            <Text style={styles.userStatNumber}>{completedOrders}</Text>
                            <Text style={styles.userStatLabel}>Đơn hoàn thành</Text>
                        </View>
                        <View style={[styles.userStatCard, styles.userStatCardBlue]}>
                            <Text style={[styles.userStatNumber, styles.userStatNumberBlue]}>
                                {formatPrice(totalSpent)}
                            </Text>
                            <Text style={[styles.userStatLabel, styles.userStatLabelBlue]}>
                                Tổng chi tiêu
                            </Text>
                        </View>
                    </View>
                )}

                {/* Quick Links */}
                <View style={styles.quickLinksGrid}>
                    <TouchableOpacity
                        style={styles.quickLinkButton}
                        onPress={() => onNavigate('menu')}
                    >
                        <UtensilsCrossed size={20} color="#fff" />
                        <Text style={styles.quickLinkText}>Xem thực đơn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickLinkButton, styles.quickLinkButtonPurple]}
                        onPress={() => onNavigate('orders')}
                    >
                        <Package size={20} color="#fff" />
                        <Text style={styles.quickLinkText}>Đơn hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fef3f2',
    },
    heroBanner: {
        backgroundColor: '#f97316',
        paddingTop: 32,
        paddingBottom: 96,
        paddingHorizontal: 16,
    },
    heroContent: {
        maxWidth: 600,
        marginHorizontal: 'auto',
    },
    promoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    promoTagBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    promoTagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    heroSubtitle: {
        color: '#fed7aa',
        fontSize: 16,
        marginBottom: 24,
    },
    heroCTA: {
        backgroundColor: '#fff',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
    },
    heroCTAText: {
        color: '#f97316',
        fontSize: 16,
        fontWeight: '600',
    },
    mainContent: {
        marginTop: -64,
        paddingHorizontal: 16,
        paddingBottom: 32,
        gap: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeGreen: {
        backgroundColor: '#10b981',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    activeOrderAlert: {
        backgroundColor: '#fff7ed',
        borderWidth: 2,
        borderColor: '#fed7aa',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    activeOrderIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#f97316',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeOrderContent: {
        flex: 1,
    },
    activeOrderTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    activeOrderSubtitle: {
        fontSize: 12,
        color: '#6b7280',
    },
    featuresGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    featureCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        color: '#f97316',
        fontSize: 14,
        fontWeight: '500',
    },
    categoriesGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    categoryItem: {
        flex: 1,
        alignItems: 'center',
    },
    categoryIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 10,
        color: '#6b7280',
    },
    productsList: {
        gap: 12,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
    },
    productIcon: {
        width: 64,
        height: 64,
        backgroundColor: '#fff7ed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    productPrice: {
        fontSize: 14,
        color: '#f97316',
        fontWeight: '500',
    },
    promoBanner: {
        backgroundColor: '#a855f7',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    promoContent: {
        flex: 1,
    },
    promoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    promoSubtitle: {
        color: '#e9d5ff',
        marginBottom: 16,
    },
    promoCode: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignSelf: 'flex-start',
    },
    promoCodeText: {
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 2,
    },
    userStatsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    userStatCard: {
        flex: 1,
        backgroundColor: '#d1fae5',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#10b981',
    },
    userStatCardBlue: {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
    },
    userStatNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#059669',
        marginBottom: 4,
    },
    userStatNumberBlue: {
        color: '#2563eb',
    },
    userStatLabel: {
        fontSize: 12,
        color: '#047857',
    },
    userStatLabelBlue: {
        color: '#1d4ed8',
    },
    quickLinksGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    quickLinkButton: {
        flex: 1,
        backgroundColor: '#f97316',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    quickLinkButtonPurple: {
        backgroundColor: '#a855f7',
    },
    quickLinkText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});