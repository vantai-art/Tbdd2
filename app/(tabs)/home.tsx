import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
    yellow: "#FFC529",
};

export default function HomeScreen() {
    // State Management
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<number | string>("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    // API Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all data
    const fetchData = async (): Promise<void> => {
        setLoading(true);

        try {
            await Promise.all([
                fetchProducts(),
                fetchCategories(),
            ]);
        } catch (error) {
            console.error("Error fetching critical data:", error);
            Alert.alert("Lỗi", "Không thể tải dữ liệu sản phẩm. Vui lòng thử lại!");
        }

        try {
            await fetchSettings();
        } catch (error) {
            console.warn("⚠️ Settings not available, using defaults");
        }

        setLoading(false);
        setRefreshing(false);
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
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data: Settings = await response.json();
            setSettings(data);
        } catch (error) {
            setSettings({
                storeName: "Quán Ngon",
                storeEmail: "hello@quanngon.vn",
                storePhone: "1900 1234",
                storeAddress: "123 Nguyễn Huệ, Q.1, TP.HCM",
                currency: "VND",
                timezone: "Asia/Ho_Chi_Minh",
                language: "vi"
            });
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
            {/* Fixed Header with Search and Cart */}
            <View style={styles.fixedHeader}>
                <View style={styles.headerTop}>
                    <View style={styles.searchContainer}>
                        <Text style={styles.searchIconFixed}>🔍</Text>
                        <TextInput
                            style={styles.searchInputFixed}
                            placeholder="Tìm bún gà"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.cartButtonFixed}
                        onPress={handleCartClick}
                    >
                        <Text style={styles.cartIconFixed}>🛒</Text>
                        {cartCount > 0 && (
                            <View style={styles.cartBadgeFixed}>
                                <Text style={styles.cartBadgeTextFixed}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Horizontal Scrolling Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesHorizontal}
                >
                    {categories.map((cat) => {
                        const getDefaultEmoji = (name: string): string => {
                            const lowerName = name.toLowerCase();
                            if (lowerName.includes("tất cả") || lowerName.includes("all")) return "🍽️";
                            if (lowerName.includes("phở") || lowerName.includes("bún")) return "🍜";
                            if (lowerName.includes("cơm")) return "🍚";
                            if (lowerName.includes("trà") || lowerName.includes("tea")) return "🧋";
                            if (lowerName.includes("cà phê") || lowerName.includes("coffee")) return "☕";
                            if (lowerName.includes("nước")) return "🥤";
                            if (lowerName.includes("bánh")) return "🍰";
                            return "🍽️";
                        };

                        const isImageUrl = cat.imageUrl &&
                            cat.imageUrl.trim() !== "" &&
                            (cat.imageUrl.startsWith('http://') ||
                                cat.imageUrl.startsWith('https://'));

                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === cat.id && styles.categoryChipActive
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Text style={styles.categoryChipIcon}>
                                    {isImageUrl ? "📦" : (cat.imageUrl || getDefaultEmoji(cat.name))}
                                </Text>
                                <Text style={[
                                    styles.categoryChipText,
                                    selectedCategory === cat.id && styles.categoryChipTextActive
                                ]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {/* Promotion Banner */}
                <View style={styles.promoBanner}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                    >
                        <View style={styles.promoCard}>
                            <View style={styles.promoTag}>
                                <Text style={styles.promoTagText}>🔥 Giảm 80K</Text>
                            </View>
                            <Text style={styles.promoRating}>⭐ 4.9</Text>
                            <Text style={styles.promoDistance}>📍 2.7 km</Text>
                        </View>
                        <View style={[styles.promoCard, { backgroundColor: '#FFE5E5' }]}>
                            <View style={styles.promoTag}>
                                <Text style={styles.promoTagText}>🔥 Giảm 50%</Text>
                            </View>
                            <Text style={styles.promoRating}>⭐ 4.8</Text>
                            <Text style={styles.promoDistance}>📍 2.9 km</Text>
                        </View>
                        <View style={[styles.promoCard, { backgroundColor: '#FFF4E5' }]}>
                            <View style={styles.promoTag}>
                                <Text style={styles.promoTagText}>🔥 Giảm 15K</Text>
                            </View>
                            <Text style={styles.promoRating}>⭐ 4.8</Text>
                            <Text style={styles.promoDistance}>📍 2.8 km</Text>
                        </View>
                    </ScrollView>
                </View>

                {/* Section: Quán mới đổ bộ */}
                <View style={styles.sectionTitleContainer}>
                    <View>
                        <Text style={styles.sectionMainTitle}>Quán mới đổ bộ</Text>
                        <Text style={styles.sectionSubtitle}>Khám phá ngay!</Text>
                    </View>
                </View>

                {filteredProducts.length === 0 ? (
                    <View style={styles.emptyProducts}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
                    </View>
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalProductsList}
                    >
                        {filteredProducts.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.horizontalProductCard}
                                onPress={() => handleProductClick(product)}
                            >
                                <Image
                                    source={{ uri: product.imageUrl }}
                                    style={styles.horizontalProductImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.horizontalProductBadge}>
                                    <Text style={styles.horizontalProductBadgeText}>
                                        ✓ {product.category?.name || "Món ăn"}
                                    </Text>
                                </View>
                                <View style={styles.horizontalProductInfo}>
                                    <Text style={styles.horizontalProductName} numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.horizontalProductDistance}>
                                        📍 2.5 km
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Section: Đã xem gần đây */}
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionMainTitle}>Đã xem gần đây</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeMoreText}>Xem thêm →</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recentProductsGrid}>
                    {filteredProducts.slice(0, 6).map((product) => (
                        <TouchableOpacity
                            key={`recent-${product.id}`}
                            style={styles.gridProductCard}
                            onPress={() => handleProductClick(product)}
                        >
                            <Image
                                source={{ uri: product.imageUrl }}
                                style={styles.gridProductImage}
                                resizeMode="cover"
                            />
                            {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                                <View style={styles.gridProductTag}>
                                    <Text style={styles.gridProductTagText}>SIÊU XIN</Text>
                                </View>
                            )}
                            <View style={styles.gridProductInfo}>
                                <Text style={styles.gridProductName} numberOfLines={2}>
                                    {product.name}
                                </Text>
                                <View style={styles.gridProductMeta}>
                                    <Text style={styles.gridProductRating}>⭐ 4.9</Text>
                                    <Text style={styles.gridProductDistance}>📍 4 km</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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

    // Fixed Header Styles
    fixedHeader: {
        backgroundColor: COLORS.yellow,
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        paddingBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 12,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 25,
        paddingHorizontal: 16,
        height: 45,
    },
    searchIconFixed: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInputFixed: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text,
    },
    cartButtonFixed: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cartIconFixed: {
        fontSize: 22,
    },
    cartBadgeFixed: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF3B30',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    cartBadgeTextFixed: {
        fontSize: 11,
        fontWeight: '900',
        color: COLORS.white,
    },

    // Horizontal Categories
    categoriesHorizontal: {
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 8,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    categoryChipActive: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    categoryChipIcon: {
        fontSize: 18,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    categoryChipTextActive: {
        color: COLORS.primary,
        fontWeight: '800',
    },

    // Scroll Content
    scrollContent: {
        paddingBottom: 20,
    },

    // Promo Banner
    promoBanner: {
        paddingVertical: 16,
        backgroundColor: COLORS.white,
    },
    promoCard: {
        width: width * 0.85,
        height: 120,
        backgroundColor: '#FFE5CC',
        borderRadius: 12,
        marginHorizontal: 8,
        padding: 16,
        justifyContent: 'space-between',
    },
    promoTag: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-start',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    promoTagText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '800',
    },
    promoRating: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    promoDistance: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
    },

    // Section Titles
    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    sectionMainTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.text,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    seeMoreText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },

    // Horizontal Products List
    horizontalProductsList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    horizontalProductCard: {
        width: 240,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    horizontalProductImage: {
        width: '100%',
        height: 140,
    },
    horizontalProductBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    horizontalProductBadgeText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '800',
    },
    horizontalProductInfo: {
        padding: 12,
    },
    horizontalProductName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    horizontalProductDistance: {
        fontSize: 13,
        color: COLORS.textLight,
    },

    // Grid Products (Recent)
    recentProductsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 8,
        gap: 8,
    },
    gridProductCard: {
        width: (width - 24) / 2,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    gridProductImage: {
        width: '100%',
        height: 140,
    },
    gridProductTag: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FFD700',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    gridProductTagText: {
        fontSize: 10,
        fontWeight: '900',
        color: COLORS.text,
    },
    gridProductInfo: {
        padding: 12,
    },
    gridProductName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 8,
        lineHeight: 18,
    },
    gridProductMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    gridProductRating: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
    },
    gridProductDistance: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textLight,
    },

    emptyProducts: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
});