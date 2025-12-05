import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Platform,
    Dimensions,
    Modal,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Tính toán chiều rộng tối ưu cho web
const getMaxWidth = () => {
    if (isWeb && width > 1200) return 1200;
    return width;
};

interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    category: number;
    stock: number;
    promo: boolean;
}

interface QuickAction {
    id: number;
    name: string;
    icon: string;
    color: string;
}

const categories: Category[] = [
    { id: 1, name: "Tất cả", icon: "🍽️", color: "#FF6B9D" },
    { id: 2, name: "Đồ ăn", icon: "🍔", color: "#FFA94D" },
    { id: 3, name: "Đồ uống", icon: "🥤", color: "#4ECDC4" },
    { id: 4, name: "Tráng miệng", icon: "🍰", color: "#A78BFA" },
    { id: 5, name: "Khuyến mãi", icon: "🎉", color: "#F87171" },
];

const products: Product[] = [
    { id: 1, name: "Burger Bò Đặc Biệt", price: "75,000", image: "🍔", category: 2, stock: 25, promo: false },
    { id: 2, name: "Pizza Hải Sản", price: "120,000", image: "🍕", category: 2, stock: 15, promo: true },
    { id: 3, name: "Trà Sữa Trân Châu", price: "35,000", image: "🧋", category: 3, stock: 50, promo: false },
    { id: 4, name: "Cà Phê Đá", price: "25,000", image: "☕", category: 3, stock: 40, promo: false },
    { id: 5, name: "Bánh Kem Socola", price: "45,000", image: "🍰", category: 4, stock: 20, promo: true },
    { id: 6, name: "Mì Ý Carbonara", price: "65,000", image: "🍝", category: 2, stock: 30, promo: false },
    { id: 7, name: "Sinh Tố Bơ", price: "40,000", image: "🥑", category: 3, stock: 35, promo: false },
    { id: 8, name: "Gà Rán Giòn", price: "85,000", image: "🍗", category: 2, stock: 18, promo: true },
];

const quickActions: QuickAction[] = [
    { id: 1, name: "Đơn hàng", icon: "📦", color: "#FF6B9D" },
    { id: 2, name: "Sản phẩm", icon: "🏪", color: "#4ECDC4" },
    { id: 3, name: "Thống kê", icon: "📊", color: "#FFA94D" },
    { id: 4, name: "Khách hàng", icon: "👥", color: "#A78BFA" },
];

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(10);

    useEffect(() => {
        if (showLogoutDialog) {
            setCountdown(10);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setShowLogoutDialog(false);
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showLogoutDialog]);

    const handleLogout = () => {
        setShowMenu(false);
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        setShowLogoutDialog(false);
        setTimeout(() => {
            router.replace('/auth/login');
        }, 100);
    };

    const filteredProducts = products.filter(product => {
        const matchCategory = selectedCategory === 1 || product.category === selectedCategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const maxWidth = getMaxWidth();

    return (
        <View style={styles.container}>
            {/* Overlay để đóng menu khi click bên ngoài */}
            {showMenu && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                />
            )}

            {/* Header với Gradient */}
            <View style={styles.header}>
                <View style={[styles.headerGradient, isWeb && { paddingHorizontal: Math.max((width - maxWidth) / 2, 20) }]}>
                    <View style={[styles.headerContent, isWeb && { maxWidth }]}>
                        <View style={styles.headerTop}>
                            <View>
                                <Text style={styles.greeting}>Chào Ngô văn Tài! 👋</Text>
                                <Text style={styles.headerTitle}>Bắt đầu bán hàng nào</Text>
                            </View>
                            <View style={styles.headerActions}>
                                <TouchableOpacity style={styles.notificationBtn}>
                                    <Text style={styles.notificationIcon}>🔔</Text>
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.badgeText}>3</Text>
                                    </View>
                                </TouchableOpacity>
                                <View
                                    style={styles.profileContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.profileBtn}
                                        onPress={() => setShowMenu(!showMenu)}
                                    >
                                        <Text style={styles.profileIcon}>👤</Text>
                                    </TouchableOpacity>

                                    {/* Dropdown Menu */}
                                    {showMenu && (
                                        <View style={styles.dropdownMenu}>
                                            <TouchableOpacity style={styles.menuItem}>
                                                <Text style={styles.menuIcon}>👤</Text>
                                                <Text style={styles.menuText}>Thông tin cá nhân</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.menuItem}>
                                                <Text style={styles.menuIcon}>⚙️</Text>
                                                <Text style={styles.menuText}>Cài đặt</Text>
                                            </TouchableOpacity>
                                            <View style={styles.menuDivider} />
                                            <TouchableOpacity
                                                style={[styles.menuItem, styles.logoutItem]}
                                                onPress={handleLogout}
                                            >
                                                <Text style={styles.menuIcon}>🚪</Text>
                                                <Text style={[styles.menuText, styles.logoutText]}>Đăng xuất</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View style={styles.quickStats}>
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>2.45M</Text>
                                <Text style={styles.statLabel}>Doanh thu</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>24</Text>
                                <Text style={styles.statLabel}>Đơn hàng</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statBox}>
                                <Text style={styles.statValue}>180</Text>
                                <Text style={styles.statLabel}>Sản phẩm</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    isWeb && {
                        paddingHorizontal: Math.max((width - maxWidth) / 2, 20),
                        alignItems: 'center'
                    }
                ]}
            >
                <View style={[styles.mainContent, isWeb && { maxWidth, width: '100%' }]}>
                    {/* Search Bar */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(600)}
                        style={styles.searchContainer}
                    >
                        <View style={styles.searchBox}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Tìm kiếm sản phẩm..."
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                        <TouchableOpacity style={styles.filterBtn}>
                            <Text style={styles.filterIcon}>⚙️</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Quick Actions */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(600)}
                        style={styles.quickActionsContainer}
                    >
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.quickActionCard}
                            >
                                <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
                                    <Text style={styles.actionIcon}>{action.icon}</Text>
                                </View>
                                <Text style={styles.actionName}>{action.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>

                    {/* Categories */}
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(600)}
                        style={styles.sectionContainer}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Danh mục</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>Xem tất cả →</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoriesScroll}
                            contentContainerStyle={styles.categoriesContent}
                        >
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryCard,
                                        selectedCategory === cat.id && {
                                            backgroundColor: cat.color,
                                        }
                                    ]}
                                    onPress={() => setSelectedCategory(cat.id)}
                                >
                                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                    <Text style={[
                                        styles.categoryName,
                                        selectedCategory === cat.id && styles.categoryNameActive
                                    ]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>

                    {/* Products Section */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(600)}
                        style={styles.sectionContainer}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                Sản phẩm ({filteredProducts.length})
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>Xem tất cả →</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.productsGrid}>
                            {filteredProducts.map((product, index) => (
                                <Animated.View
                                    key={product.id}
                                    entering={FadeInUp.delay(index * 50).duration(500)}
                                    style={styles.productCard}
                                >
                                    <TouchableOpacity style={styles.productContent}>
                                        {product.promo && (
                                            <View style={styles.promoBadge}>
                                                <Text style={styles.promoText}>Giảm 20%</Text>
                                            </View>
                                        )}
                                        <View style={styles.productImageBox}>
                                            <Text style={styles.productImage}>{product.image}</Text>
                                        </View>
                                        <Text style={styles.productName} numberOfLines={1}>
                                            {product.name}
                                        </Text>
                                        <View style={styles.productFooter}>
                                            <View>
                                                <Text style={styles.productPrice}>{product.price}đ</Text>
                                                <Text style={styles.stockText}>
                                                    Còn {product.stock}
                                                </Text>
                                            </View>
                                            <TouchableOpacity style={styles.addToCartBtn}>
                                                <Text style={styles.addToCartIcon}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>

                    <View style={styles.bottomSpacing} />
                </View>
            </ScrollView>

            {/* Logout Dialog */}
            <Modal
                transparent={true}
                visible={showLogoutDialog}
                animationType="fade"
                onRequestClose={() => setShowLogoutDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        entering={FadeInDown.duration(300).springify()}
                        style={styles.dialogContainer}
                    >
                        <View style={styles.dialogIcon}>
                            <Text style={styles.dialogIconText}>👋</Text>
                        </View>

                        <Text style={styles.dialogTitle}>
                            Bạn thật sự muốn đăng xuất? Còn nhiều đơn hàng và món ngon đang chờ bạn xử lý đấy!
                        </Text>

                        <Text style={styles.dialogCountdown}>
                            ({countdown}s sau tự động đóng)
                        </Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogBtnConfirm}
                                onPress={confirmLogout}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dialogBtnConfirmText}>Đăng xuất</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnCancel}
                                onPress={() => setShowLogoutDialog(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dialogBtnCancelText}>Ở lại thôi</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 99,
    },
    header: {
        backgroundColor: "#FFF",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'visible',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            },
        }),
        zIndex: 100,
    },
    headerGradient: {
        backgroundColor: '#667eea',
        paddingTop: isWeb ? 30 : 50,
        paddingBottom: 25,
    },
    headerContent: {
        width: '100%',
        paddingHorizontal: 20,
        alignSelf: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        position: 'relative',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
        zIndex: 10000,
    },
    greeting: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.9,
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: isWeb ? 28 : 26,
        fontWeight: '800',
        color: '#FFF',
    },
    notificationBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationIcon: {
        fontSize: 24,
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#FF3B30',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    profileBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        fontSize: 24,
    },
    profileContainer: {
        position: 'relative',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 60,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 15,
        minWidth: 200,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
        zIndex: 9999,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 12,
    },
    menuIcon: {
        fontSize: 20,
    },
    menuText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 5,
    },
    logoutItem: {
        backgroundColor: '#FFF',
    },
    logoutText: {
        color: '#FF3B30',
    },
    quickStats: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 15,
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 13,
        color: '#FFF',
        opacity: 0.9,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 10,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    mainContent: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        borderRadius: 15,
        marginRight: 12,
        height: 55,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#2C3E50",
        outlineStyle: 'none',
    } as any,
    filterBtn: {
        width: 55,
        height: 55,
        backgroundColor: '#667eea',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: "#667eea",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    filterIcon: {
        fontSize: 22,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 12,
    },
    quickActionCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    actionIconContainer: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    actionIcon: {
        fontSize: 26,
    },
    actionName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2C3E50',
        textAlign: 'center',
    },
    sectionContainer: {
        marginTop: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2C3E50',
    },
    seeAll: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '600',
    },
    categoriesScroll: {
        paddingLeft: 20,
    },
    categoriesContent: {
        paddingRight: 20,
        gap: 12,
    },
    categoryCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        minWidth: 100,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    categoryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    categoryNameActive: {
        color: '#FFF',
        fontWeight: '700',
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 15,
    },
    productCard: {
        width: isWeb ? 'calc(25% - 12px)' : (width - 52) / 2,
        minWidth: isWeb ? 200 : undefined,
        maxWidth: isWeb ? 280 : undefined,
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    } as any,
    productContent: {
        padding: 15,
    },
    promoBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF3B30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        zIndex: 1,
    },
    promoText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    productImageBox: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    productImage: {
        fontSize: 52,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 17,
        fontWeight: '800',
        color: '#667eea',
        marginBottom: 3,
    },
    stockText: {
        fontSize: 12,
        color: '#28A745',
        fontWeight: '600',
    },
    addToCartBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: "#667eea",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    addToCartIcon: {
        fontSize: 22,
        color: '#FFF',
        fontWeight: '700',
    },
    bottomSpacing: {
        height: 30,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialogContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    dialogIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF5E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    dialogIconText: {
        fontSize: 30,
    },
    dialogTitle: {
        fontSize: 16,
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
    },
    dialogCountdown: {
        fontSize: 14,
        color: '#FF8C42',
        marginBottom: 20,
        fontWeight: '600',
    },
    dialogButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    dialogBtnConfirm: {
        flex: 1,
        height: 50,
        backgroundColor: '#FF8C42',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FF8C42',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    dialogBtnConfirmText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dialogBtnCancel: {
        flex: 1,
        height: 50,
        backgroundColor: '#00B4D8',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#00B4D8',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    dialogBtnCancelText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});