import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_CONFIG } from '../config/api';

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");
const API_BASE_URL = API_CONFIG.BASE_URL;
// ✅ ĐỊNH NGHĨA TYPES CHO TYPESCRIPT
interface Category {
    id: number | string;
    name: string;
    description?: string;
    imageUrl?: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    isActive: boolean;
    category?: Category;
}

interface Settings {
    id?: number;
    storeName?: string;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
    currency?: string;
    timezone?: string;
    language?: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface MarqueeTextProps {
    texts: string[];
    speed?: number;
}

// Theme Colors
const COLORS = {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    accent: "#FFD93D",
    success: "#34C759",
    text: "#2C3E50",
    textLight: "#7F8C8D",
    background: "#F8F9FA",
    white: "#FFFFFF",
    border: "#E8E8E8",
};

// Responsive width calculation
const getResponsiveWidth = (): number => {
    if (isWeb) {
        return ((width > 1200 ? 1200 : width) - 80) / 3;
    }
    return (width - 52) / 2;
};

// Marquee Text Component
const MarqueeText: React.FC<MarqueeTextProps> = ({ texts, speed = 50 }) => {
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [textWidth, setTextWidth] = useState<number>(0);

    useEffect(() => {
        if (containerWidth > 0 && textWidth > 0) {
            const totalDistance = containerWidth + textWidth;
            const duration = (totalDistance / speed) * 1000;
            scrollAnim.setValue(-textWidth);

            const animation = Animated.timing(scrollAnim, {
                toValue: containerWidth,
                duration: duration,
                useNativeDriver: true,
                isInteraction: false,
            });

            animation.start(({ finished }) => {
                if (finished) {
                    setCurrentIndex((prev) => (prev + 1) % texts.length);
                }
            });

            return () => animation.stop();
        }
    }, [containerWidth, textWidth, currentIndex, texts.length, speed, scrollAnim]);

    return (
        <View
            style={styles.marqueeContainer}
            onLayout={(e) => {
                if (containerWidth === 0) {
                    setContainerWidth(e.nativeEvent.layout.width);
                }
            }}
        >
            <Animated.View
                style={[
                    styles.marqueeWrapper,
                    { transform: [{ translateX: scrollAnim }] },
                ]}
            >
                <Text
                    style={styles.marqueeText}
                    onLayout={(e) => {
                        if (textWidth === 0) {
                            setTextWidth(e.nativeEvent.layout.width);
                        }
                    }}
                >
                    {texts[currentIndex]}
                </Text>
            </Animated.View>
        </View>
    );
};

export default function HomeScreen() {
    // State Management
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | string>("all");
    const [showFloatingCart, setShowFloatingCart] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // API Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);

    const searchPlaceholders = [
        "Tìm món ăn, đồ uống yêu thích...",
        "Phở bò, bún chả, cơm tấm...",
        "Trà sữa, cà phê, nước ép...",
        "Món Việt, món Á, món Âu...",
        "Giao nhanh 30 phút...",
    ];

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch all data
    const fetchData = async (): Promise<void> => {
        try {
            setLoading(true);
            await Promise.all([
                fetchProducts(),
                fetchCategories(),
                fetchSettings(),
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Lỗi", "Không thể tải dữ liệu. Vui lòng thử lại!");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch Products
    const fetchProducts = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data: Product[] = await response.json();

            console.log("✅ Products loaded:", data.length);
            setProducts(data);
        } catch (error) {
            console.error("❌ Error fetching products:", error);
        }
    };

    // Fetch Categories
    const fetchCategories = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data: Category[] = await response.json();

            // Add "All" category
            const allCategory: Category = {
                id: "all",
                name: "Tất cả",
                description: "Tất cả sản phẩm",
                imageUrl: "🍽️"
            };

            console.log("✅ Categories loaded:", data.length);
            setCategories([allCategory, ...data]);
        } catch (error) {
            console.error("❌ Error fetching categories:", error);
        }
    };

    // Fetch Settings
    const fetchSettings = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`);
            if (!response.ok) throw new Error("Failed to fetch settings");
            const data: Settings = await response.json();

            console.log("✅ Settings loaded:", data);
            setSettings(data);
        } catch (error) {
            console.error("❌ Error fetching settings:", error);
        }
    };

    // Add to Cart
    const handleAddToCart = (product: Product): void => {
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        Alert.alert(
            "✅ Thành công",
            `Đã thêm ${product.name} vào giỏ hàng!`,
            [{ text: "OK" }]
        );
    };

    // Navigate to Product Detail
    const handleProductClick = (product: Product): void => {
        console.log("Navigate to product:", product);
        Alert.alert("Thông báo", `Xem chi tiết: ${product.name}`);
    };

    // Navigate to Cart
    const handleCartClick = (): void => {
        console.log("Navigate to cart with items:", cart.length);
        Alert.alert("Giỏ hàng", `Bạn có ${cartCount} món trong giỏ hàng`);
    };

    // Filter Products
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "all" ||
            product.category?.id === selectedCategory;

        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch && product.isActive;
    });

    // Format Currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Calculate Cart Count
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Handle Scroll
    const handleScroll = (event: any): void => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowFloatingCart(offsetY > 200);
    };

    // Refresh Handler
    const onRefresh = (): void => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.logo}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoIcon}>🍜</Text>
                            </View>
                            <View>
                                <Text style={styles.logoText}>
                                    {settings?.storeName || "Quán Ngon"}
                                </Text>
                                <Text style={styles.logoSubtext}>
                                    Đặt món nhanh - Giao tận nơi
                                </Text>
                            </View>
                        </View>

                        <View style={styles.headerRight}>
                            {isWeb && (
                                <View style={styles.openTimeBox}>
                                    <Text style={styles.clockIcon}>🕐</Text>
                                    <Text style={styles.openTimeText}>Mở cửa: 7:00 - 22:00</Text>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.cartButton}
                                onPress={handleCartClick}
                            >
                                <Text style={styles.cartIcon}>🛒</Text>
                                {cartCount > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Hero Banner */}
                <View style={styles.heroBanner}>
                    <View style={styles.heroContent}>
                        <View style={styles.heroLeft}>
                            <View style={styles.promoBadge}>
                                <Text style={styles.promoIcon}>✨</Text>
                                <Text style={styles.promoText}>KHUYẾN MÃI HOT</Text>
                            </View>

                            <Text style={styles.heroTitle}>
                                Món ngon{"\n"}
                                <Text style={styles.heroTitleHighlight}>Giá hời</Text> hôm nay!
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Giảm giá đến 20% cho đơn hàng đầu tiên
                            </Text>

                            {/* Search Bar */}
                            <View style={styles.searchRow}>
                                <View style={styles.searchBox}>
                                    <Text style={styles.searchIcon}>🔍</Text>
                                    {searchQuery === "" ? (
                                        <View style={styles.marqueeHolder}>
                                            <MarqueeText texts={searchPlaceholders} speed={60} />
                                        </View>
                                    ) : (
                                        <TextInput
                                            style={styles.searchInput}
                                            value={searchQuery}
                                            onChangeText={setSearchQuery}
                                            autoFocus
                                            placeholder="Tìm kiếm..."
                                        />
                                    )}
                                    {searchQuery === "" && (
                                        <TouchableOpacity
                                            style={styles.searchInputOverlay}
                                            onPress={() => setSearchQuery(" ")}
                                        />
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.searchButton}
                                    onPress={() => console.log("Search:", searchQuery)}
                                >
                                    <Text style={styles.searchButtonText}>Tìm</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isWeb && (
                            <View style={styles.heroRight}>
                                <View style={styles.foodImageContainer}>
                                    <View style={styles.floatingCircle1} />
                                    <View style={styles.floatingCircle2} />
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' }}
                                        style={styles.mainFoodImage}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📋 Danh mục món ăn</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryCard,
                                    selectedCategory === cat.id && styles.categoryCardActive
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Text style={styles.categoryIcon}>
                                    {cat.imageUrl || "🍽️"}
                                </Text>
                                <Text style={[
                                    styles.categoryName,
                                    selectedCategory === cat.id && styles.categoryNameActive
                                ]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products Section */}
                <View style={styles.productsSection}>
                    <View style={styles.productHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>📈 Món phổ biến</Text>
                            <Text style={styles.productCount}>
                                🔥 {filteredProducts.length} món đang hot
                            </Text>
                        </View>
                    </View>

                    {filteredProducts.length === 0 ? (
                        <View style={styles.emptyProducts}>
                            <Text style={styles.emptyIcon}>🔍</Text>
                            <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                            <Text style={styles.emptyDesc}>
                                Thử tìm kiếm với từ khóa khác
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.productsGrid}>
                            {filteredProducts.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.productCard}
                                    onPress={() => handleProductClick(product)}
                                >
                                    <View style={styles.productImageBox}>
                                        <Image
                                            source={{ uri: product.imageUrl }}
                                            style={styles.productImage}
                                            resizeMode="cover"
                                        />

                                        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                                            <View style={styles.stockBadge}>
                                                <Text style={styles.stockText}>
                                                    Còn {product.stockQuantity}
                                                </Text>
                                            </View>
                                        )}

                                        {product.stockQuantity === 0 && (
                                            <View style={styles.outOfStockBadge}>
                                                <Text style={styles.outOfStockText}>Hết hàng</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName} numberOfLines={2}>
                                            {product.name}
                                        </Text>
                                        <Text style={styles.productDesc} numberOfLines={2}>
                                            {product.description}
                                        </Text>

                                        <View style={styles.productMeta}>
                                            <Text style={styles.categoryLabel}>
                                                {product.category?.name || "Khác"}
                                            </Text>
                                        </View>

                                        <View style={styles.productFooter}>
                                            <View>
                                                <Text style={styles.productPrice}>
                                                    {formatCurrency(product.price)}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                style={[
                                                    styles.addCartBtn,
                                                    product.stockQuantity === 0 && styles.addCartBtnDisabled
                                                ]}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    if (product.stockQuantity > 0) {
                                                        handleAddToCart(product);
                                                    }
                                                }}
                                                disabled={product.stockQuantity === 0}
                                            >
                                                <Text style={styles.cartIconSmall}>
                                                    {product.stockQuantity === 0 ? "🚫" : "➕"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Footer */}
                {isWeb && (
                    <View style={styles.footer}>
                        <View style={styles.footerContent}>
                            <View style={styles.footerCol}>
                                <View style={styles.footerLogo}>
                                    <View style={styles.footerLogoCircle}>
                                        <Text style={styles.footerLogoIcon}>🍜</Text>
                                    </View>
                                    <Text style={styles.footerLogoText}>
                                        {settings?.storeName || "Quán Ngon"}
                                    </Text>
                                </View>
                                <Text style={styles.footerDesc}>
                                    Mang đến trải nghiệm ẩm thực tuyệt vời nhất cho bạn
                                </Text>
                            </View>

                            <View style={styles.footerCol}>
                                <Text style={styles.footerTitle}>Liên hệ</Text>
                                <Text style={styles.footerContact}>
                                    📍 {settings?.storeAddress || "123 Nguyễn Huệ, Q.1, TP.HCM"}
                                </Text>
                                <Text style={styles.footerContact}>
                                    📞 {settings?.storePhone || "1900 1234"}
                                </Text>
                                <Text style={styles.footerContact}>
                                    ✉️ {settings?.storeEmail || "hello@quanngon.vn"}
                                </Text>
                            </View>

                            <View style={styles.footerCol}>
                                <Text style={styles.footerTitle}>Giờ mở cửa</Text>
                                <Text style={styles.footerContact}>Thứ 2 - Thứ 6: 7:00 - 22:00</Text>
                                <Text style={styles.footerContact}>Thứ 7 - CN: 7:00 - 23:00</Text>
                            </View>
                        </View>

                        <View style={styles.footerBottom}>
                            <Text style={styles.footerCopyright}>
                                © 2025 {settings?.storeName || "Quán Ngon"}. All rights reserved.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Button */}
            {!isWeb && showFloatingCart && cartCount > 0 && (
                <TouchableOpacity
                    style={styles.floatingCartButton}
                    onPress={handleCartClick}
                    activeOpacity={0.9}
                >
                    <View style={styles.floatingCartContent}>
                        <View style={styles.floatingCartLeft}>
                            <View style={styles.floatingCartIconBox}>
                                <Text style={styles.floatingCartIcon}>🛒</Text>
                            </View>
                            <View style={styles.floatingCartInfo}>
                                <Text style={styles.floatingCartCount}>{cartCount} món</Text>
                                <Text style={styles.floatingCartLabel}>Xem giỏ hàng</Text>
                            </View>
                        </View>
                        <View style={styles.floatingCartArrow}>
                            <Text style={styles.floatingCartArrowIcon}>→</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textLight,
        fontWeight: "600",
    },
    header: {
        backgroundColor: COLORS.white,
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#FFE5D9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
    },
    logo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    logoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    logoIcon: {
        fontSize: 26,
    },
    logoText: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.text,
    },
    logoSubtext: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: "600",
        marginTop: 2,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    openTimeBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3E0",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
    },
    clockIcon: {
        fontSize: 16,
    },
    openTimeText: {
        fontSize: 13,
        fontWeight: "800",
        color: COLORS.primary,
    },
    cartButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    cartIcon: {
        fontSize: 24,
    },
    cartBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#FF3B30",
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    cartBadgeText: {
        fontSize: 11,
        fontWeight: "900",
        color: COLORS.white,
    },
    heroBanner: {
        backgroundColor: COLORS.primary,
        paddingVertical: isWeb ? 60 : 40,
        paddingHorizontal: 20,
    },
    heroContent: {
        flexDirection: isWeb ? "row" : "column",
        alignItems: "center",
        gap: isWeb ? 50 : 0,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
    },
    heroLeft: {
        flex: 1,
        width: "100%",
    },
    promoBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        gap: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
    },
    promoIcon: {
        fontSize: 16,
    },
    promoText: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.white,
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: isWeb ? 52 : 40,
        fontWeight: "900",
        color: COLORS.white,
        marginBottom: 16,
        lineHeight: isWeb ? 62 : 48,
    },
    heroTitleHighlight: {
        color: COLORS.accent,
    },
    heroSubtitle: {
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.9)",
        marginBottom: 30,
        lineHeight: 26,
        fontWeight: "600",
    },
    searchRow: {
        flexDirection: "row",
        gap: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingHorizontal: 18,
        borderRadius: 30,
        height: 55,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        position: "relative",
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
        fontWeight: "500",
    },
    searchButton: {
        backgroundColor: COLORS.text,
        paddingHorizontal: 32,
        borderRadius: 30,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.white,
    },
    marqueeContainer: {
        flex: 1,
        overflow: "hidden",
        height: 20,
        justifyContent: "center",
    },
    marqueeWrapper: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
    },
    marqueeText: {
        fontSize: 15,
        color: "#999",
        fontWeight: "500",
    },
    marqueeHolder: {
        flex: 1,
        height: 20,
        justifyContent: "center",
    },
    searchInputOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
    },
    heroRight: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    foodImageContainer: {
        position: "relative",
        width: 350,
        height: 350,
        alignItems: "center",
        justifyContent: "center",
    },
    mainFoodImage: {
        width: "100%",
        height: "100%",
        borderRadius: 175,
    },
    floatingCircle1: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.accent,
        top: 20,
        right: 10,
        opacity: 0.3,
    },
    floatingCircle2: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        bottom: 30,
        left: 10,
        opacity: 0.3,
    },
    categoriesSection: {
        paddingVertical: 30,
        backgroundColor: COLORS.background,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.text,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
        borderWidth: 2,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    categoryCardActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryIcon: {
        fontSize: 22,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.textLight,
    },
    categoryNameActive: {
        color: COLORS.white,
    },
    productsSection: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
        backgroundColor: COLORS.white,
    },
    productHeader: {
        marginBottom: 25,
    },
    productCount: {
        fontSize: 14,
        color: COLORS.primary,
        marginTop: 6,
        fontWeight: "700",
    },
    emptyProducts: {
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text,
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: isWeb ? 20 : 12,
        justifyContent: isWeb ? "flex-start" : "space-between",
    },
    productCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: "#F0F0F0",
        width: getResponsiveWidth(),
    },
    productImageBox: {
        backgroundColor: "#FFF8F3",
        height: isWeb ? 200 : 160,
        position: "relative",
        overflow: "hidden",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    stockBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#FF9500",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: "#FF9500",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    stockText: {
        fontSize: 11,
        fontWeight: "900",
        color: COLORS.white,
    },
    outOfStockBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#FF3B30",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: "#FF3B30",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    outOfStockText: {
        fontSize: 11,
        fontWeight: "900",
        color: COLORS.white,
    },
    productInfo: {
        padding: isWeb ? 18 : 14,
    },
    productName: {
        fontSize: isWeb ? 18 : 16,
        fontWeight: "900",
        color: COLORS.text,
        marginBottom: 6,
    },
    productDesc: {
        fontSize: isWeb ? 13 : 12,
        color: COLORS.textLight,
        lineHeight: isWeb ? 20 : 18,
        marginBottom: 10,
    },
    productMeta: {
        marginBottom: 12,
    },
    categoryLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.secondary,
        backgroundColor: COLORS.secondary + "20",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    productFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: isWeb ? 24 : 20,
        fontWeight: "900",
        color: COLORS.primary,
    },
    addCartBtn: {
        backgroundColor: COLORS.primary,
        width: isWeb ? 50 : 45,
        height: isWeb ? 50 : 45,
        borderRadius: isWeb ? 25 : 22,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    addCartBtnDisabled: {
        backgroundColor: COLORS.textLight,
        opacity: 0.5,
    },
    cartIconSmall: {
        fontSize: isWeb ? 24 : 20,
    },
    footer: {
        backgroundColor: "#1A1A2E",
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginTop: 40,
    },
    footerContent: {
        flexDirection: isWeb ? "row" : "column",
        gap: 30,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
        marginBottom: 30,
    },
    footerCol: {
        flex: 1,
    },
    footerLogo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 16,
    },
    footerLogoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    footerLogoIcon: {
        fontSize: 26,
    },
    footerLogoText: {
        fontSize: 22,
        fontWeight: "900",
        color: COLORS.white,
    },
    footerDesc: {
        fontSize: 14,
        color: "#95A5A6",
        lineHeight: 22,
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.white,
        marginBottom: 16,
    },
    footerContact: {
        fontSize: 14,
        color: "#95A5A6",
        lineHeight: 26,
        marginBottom: 6,
    },
    footerBottom: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
        paddingTop: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
    },
    footerCopyright: {
        fontSize: 13,
        color: "#7F8C8D",
        textAlign: "center",
    },
    floatingCartButton: {
        position: "absolute",
        bottom: 90,
        right: 16,
        backgroundColor: COLORS.white,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    floatingCartContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    floatingCartLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    floatingCartIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    floatingCartIcon: {
        fontSize: 20,
    },
    floatingCartInfo: {
        justifyContent: "center",
    },
    floatingCartCount: {
        fontSize: 15,
        fontWeight: "900",
        color: COLORS.text,
        marginBottom: 2,
    },
    floatingCartLabel: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: "700",
    },
    floatingCartArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    floatingCartArrowIcon: {
        fontSize: 16,
        color: COLORS.white,
        fontWeight: "700",
    },
});