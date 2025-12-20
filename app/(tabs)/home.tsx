// app/(tabs)/home.tsx
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from '../context/AppContext';

const isWeb = Platform.OS === "web";
const { width } = Dimensions.get("window");

const getResponsiveWidth = () => {
    if (isWeb) {
        return ((width > 1200 ? 1200 : width) - 80) / 3;
    } else {
        // Mobile: 2 cột đều nhau
        return (width - 52) / 2; // 20px padding mỗi bên + 12px gap
    }
};

// Component chạy chữ
type MarqueeTextProps = {
    texts: string[];
    speed?: number;
};

const MarqueeText = ({ texts, speed = 50 }: MarqueeTextProps) => {
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const [containerWidth, setContainerWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [textWidth, setTextWidth] = useState(0);

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
                    {
                        transform: [{ translateX: scrollAnim }],
                    },
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

export default function CustomerHome() {
    const { setSelectedProduct, getCartCount, addToCart } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showFloatingCart, setShowFloatingCart] = useState(false);

    const cartCount = getCartCount();

    const searchPlaceholders = [
        "Tìm món ăn, đồ uống yêu thích...",
        "Phở bò, bún chả, cơm tấm...",
        "Trà sữa, cà phê, nước ép...",
        "Món Việt, món Á, món Âu...",
        "Giao nhanh 30 phút...",
    ];

    const categories = [
        { id: "all", name: "Tất cả", icon: "🍽️", color: "#FF6B6B" },
        { id: "rice", name: "Cơm", icon: "🍚", color: "#4ECDC4" },
        { id: "noodles", name: "Mì & Phở", icon: "🍜", color: "#FFE66D" },
        { id: "drinks", name: "Đồ uống", icon: "🥤", color: "#95E1D3" },
        { id: "snacks", name: "Ăn vặt", icon: "🍿", color: "#F38181" },
    ];

    const products = [
        {
            id: 1,
            name: "Cơm tấm sườn bì chả",
            desc: "Cơm tấm thơm ngon với sườn nướng, bì và chả",
            category: "rice",
            price: 45000,
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
            rating: 4.8,
            soldCount: 234,
            prepTime: "15-20 phút",
            tags: ["Bán chạy", "Món chính"],
            discount: 10,
        },
        {
            id: 2,
            name: "Phở bò tái",
            desc: "Phở bò truyền thống nước dùng đậm đà",
            category: "noodles",
            price: 55000,
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
            rating: 4.9,
            soldCount: 456,
            prepTime: "10-15 phút",
            tags: ["Hot", "Món chính"],
            isNew: true,
        },
        {
            id: 3,
            name: "Bún bò Huế",
            desc: "Bún bò Huế cay nồng đặc trưng",
            category: "noodles",
            price: 50000,
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
            rating: 4.7,
            soldCount: 189,
            prepTime: "15-20 phút",
            tags: ["Cay", "Món chính"],
        },
        {
            id: 4,
            name: "Cơm gà xối mỡ",
            desc: "Cơm gà thơm ngon kiểu Hội An",
            category: "rice",
            price: 40000,
            image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400",
            rating: 4.6,
            soldCount: 167,
            prepTime: "10-15 phút",
            tags: ["Món chính"],
            discount: 15,
        },
        {
            id: 5,
            name: "Trà sữa trân châu",
            desc: "Trà sữa trân châu đường đen",
            category: "drinks",
            price: 35000,
            image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400",
            rating: 4.8,
            soldCount: 678,
            prepTime: "5-10 phút",
            tags: ["Bán chạy", "Đồ uống"],
        },
        {
            id: 6,
            name: "Cà phê sữa đá",
            desc: "Cà phê phin truyền thống",
            category: "drinks",
            price: 25000,
            image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
            rating: 4.9,
            soldCount: 892,
            prepTime: "5 phút",
            tags: ["Bán chạy"],
        },
        {
            id: 7,
            name: "Bánh mì thịt",
            desc: "Bánh mì giòn tan với nhân thịt đầy đủ",
            category: "snacks",
            price: 20000,
            image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400",
            rating: 4.7,
            soldCount: 543,
            prepTime: "5-10 phút",
            tags: ["Ăn vặt"],
        },
        {
            id: 8,
            name: "Nước ép cam",
            desc: "Nước cam vắt tươi 100%",
            category: "drinks",
            price: 30000,
            image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
            rating: 4.5,
            soldCount: 234,
            prepTime: "5 phút",
            tags: ["Healthy"],
            isNew: true,
        },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
        router.push('../../product/ProductDetail');
    };

    const handleAddToCart = (product: any) => {
        addToCart?.(product);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Hiển thị floating cart khi cuộn xuống quá 200px
        setShowFloatingCart(offsetY > 200);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.logo}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoIcon}>🍜</Text>
                            </View>
                            <View>
                                <Text style={styles.logoText}>Quán Ngon</Text>
                                <Text style={styles.logoSubtext}>Đặt món nhanh - Giao tận nơi</Text>
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
                                onPress={() => router.push('/(tabs)/cart')}
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
                                        />
                                    )}
                                    {searchQuery === "" && (
                                        <TouchableOpacity
                                            style={styles.searchInputOverlay}
                                            onPress={() => setSearchQuery(" ")}
                                        />
                                    )}
                                </View>
                                <TouchableOpacity style={styles.searchButton}>
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
                        contentContainerStyle={[
                            styles.categoriesScroll,
                            isWeb && { justifyContent: 'center', width: '100%' }
                        ]}
                    >
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryCard,
                                    selectedCategory === cat.id && {
                                        backgroundColor: cat.color,
                                        borderColor: cat.color,
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
                </View>

                {/* Products Section */}
                <View style={styles.productsSection}>
                    <View style={styles.productHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>📈 Món phổ biến</Text>
                            <Text style={styles.productCount}>🔥 {filteredProducts.length} món đang hot</Text>
                        </View>
                    </View>

                    <View style={styles.productsGrid}>
                        {filteredProducts.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() => handleProductClick(product)}
                            >
                                <View style={styles.productImageBox}>
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />

                                    {/* Badges */}
                                    {product.isNew && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newText}>MỚI</Text>
                                        </View>
                                    )}
                                    {product.discount && (
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>-{product.discount}%</Text>
                                        </View>
                                    )}

                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.starIcon}>⭐</Text>
                                        <Text style={styles.ratingText}>{product.rating}</Text>
                                    </View>
                                </View>

                                <View style={styles.productInfo}>
                                    {/* Tags */}
                                    <View style={styles.tagsRow}>
                                        {product.tags.map((tag, i) => (
                                            <View key={i} style={styles.tagBadge}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <Text style={styles.productName} numberOfLines={1}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.productDesc} numberOfLines={2}>
                                        {product.desc}
                                    </Text>

                                    <View style={styles.productMeta}>
                                        <View style={styles.metaItem}>
                                            <Text style={styles.metaIcon}>🕐</Text>
                                            <Text style={styles.metaText}>{product.prepTime}</Text>
                                        </View>
                                        <Text style={styles.metaDivider}>•</Text>
                                        <Text style={styles.metaText}>Đã bán {product.soldCount}</Text>
                                    </View>

                                    <View style={styles.productFooter}>
                                        <View>
                                            {product.discount ? (
                                                <View>
                                                    <Text style={styles.productPrice}>
                                                        {(product.price * (1 - product.discount / 100)).toLocaleString('vi-VN')}đ
                                                    </Text>
                                                    <Text style={styles.productOldPrice}>
                                                        {product.price.toLocaleString('vi-VN')}đ
                                                    </Text>
                                                </View>
                                            ) : (
                                                <Text style={styles.productPrice}>
                                                    {product.price.toLocaleString('vi-VN')}đ
                                                </Text>
                                            )}
                                        </View>

                                        <TouchableOpacity
                                            style={styles.addCartBtn}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                        >
                                            <Text style={styles.cartIconSmall}>➕</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
                                    <Text style={styles.footerLogoText}>Quán Ngon</Text>
                                </View>
                                <Text style={styles.footerDesc}>
                                    Mang đến trải nghiệm ẩm thực tuyệt vời nhất cho bạn
                                </Text>
                            </View>

                            <View style={styles.footerCol}>
                                <Text style={styles.footerTitle}>Liên hệ</Text>
                                <Text style={styles.footerContact}>📍 123 Nguyễn Huệ, Q.1, TP.HCM</Text>
                                <Text style={styles.footerContact}>📞 1900 1234</Text>
                                <Text style={styles.footerContact}>✉️ hello@quanngon.vn</Text>
                            </View>

                            <View style={styles.footerCol}>
                                <Text style={styles.footerTitle}>Giờ mở cửa</Text>
                                <Text style={styles.footerContact}>Thứ 2 - Thứ 6: 7:00 - 22:00</Text>
                                <Text style={styles.footerContact}>Thứ 7 - CN: 7:00 - 23:00</Text>
                            </View>
                        </View>

                        <View style={styles.footerBottom}>
                            <Text style={styles.footerCopyright}>
                                © 2025 Quán Ngon. All rights reserved.
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Floating Cart Button - Only show when scrolled down and has items */}
            {!isWeb && showFloatingCart && cartCount > 0 && (
                <TouchableOpacity
                    style={styles.floatingCartButton}
                    onPress={() => router.push('/(tabs)/cart')}
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
        backgroundColor: "#FFFFFF",
    },
    header: {
        backgroundColor: "#FFFFFF",
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
        backgroundColor: "#FF6B6B",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF6B6B",
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
        color: "#2C3E50",
    },
    logoSubtext: {
        fontSize: 12,
        color: "#7F8C8D",
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
        color: "#FF6B6B",
    },
    cartButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FF6B6B",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        shadowColor: "#FF6B6B",
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
        borderColor: "#FFFFFF",
    },
    cartBadgeText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    heroBanner: {
        backgroundColor: "#FF6B6B",
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
        color: "#FFFFFF",
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: isWeb ? 52 : 40,
        fontWeight: "900",
        color: "#FFFFFF",
        marginBottom: 16,
        lineHeight: isWeb ? 62 : 48,
    },
    heroTitleHighlight: {
        color: "#FFD93D",
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
        backgroundColor: "#FFFFFF",
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
        color: "#2C3E50",
        fontWeight: "500",
    },
    searchButton: {
        backgroundColor: "#2C3E50",
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
        color: "#FFFFFF",
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
        backgroundColor: "#FFD93D",
        top: 20,
        right: 10,
        opacity: 0.3,
    },
    floatingCircle2: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFFFFF",
        bottom: 30,
        left: 10,
        opacity: 0.3,
    },
    categoriesSection: {
        paddingVertical: 30,
        backgroundColor: "#FAFAFA",
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
        color: "#2C3E50",
    },
    categoriesScroll: {
        paddingHorizontal: 30,
        gap: 12,
    },
    categoryCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    categoryIcon: {
        fontSize: 22,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#7F8C8D",
    },
    categoryNameActive: {
        color: "#FFFFFF",
    },
    productsSection: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        maxWidth: isWeb ? 1200 : undefined,
        width: "100%",
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
    },
    productHeader: {
        marginBottom: 25,
    },
    productCount: {
        fontSize: 14,
        color: "#FF6B6B",
        marginTop: 6,
        fontWeight: "700",
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: isWeb ? 20 : 12,
        justifyContent: isWeb ? "flex-start" : "space-between",
    },
    productCard: {
        backgroundColor: "#FFFFFF",
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
    newBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#34C759",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: "#34C759",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    newText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    discountBadge: {
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
    discountText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    ratingBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    starIcon: {
        fontSize: 14,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: "800",
        color: "#2C3E50",
    },
    productInfo: {
        padding: isWeb ? 18 : 14,
    },
    tagsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 10,
    },
    tagBadge: {
        backgroundColor: "#FFF3E0",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FF6B6B",
    },
    productName: {
        fontSize: isWeb ? 18 : 16,
        fontWeight: "900",
        color: "#2C3E50",
        marginBottom: 6,
    },
    productDesc: {
        fontSize: isWeb ? 13 : 12,
        color: "#7F8C8D",
        lineHeight: isWeb ? 20 : 18,
        marginBottom: 10,
    },
    productMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        flexWrap: "wrap",
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaIcon: {
        fontSize: 12,
    },
    metaText: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "600",
    },
    metaDivider: {
        marginHorizontal: 8,
        color: "#7F8C8D",
    },
    productFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: isWeb ? 24 : 20,
        fontWeight: "900",
        color: "#FF6B6B",
    },
    productOldPrice: {
        fontSize: isWeb ? 14 : 12,
        color: "#95A5A6",
        textDecorationLine: "line-through",
        marginTop: 2,
        fontWeight: "600",
    },
    addCartBtn: {
        backgroundColor: "#FF6B6B",
        width: isWeb ? 50 : 45,
        height: isWeb ? 50 : 45,
        borderRadius: isWeb ? 25 : 22,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF6B6B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
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
        backgroundColor: "#FF6B6B",
        alignItems: "center",
        justifyContent: "center",
    },
    footerLogoIcon: {
        fontSize: 26,
    },
    footerLogoText: {
        fontSize: 22,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    footerDesc: {
        fontSize: 14,
        color: "#95A5A6",
        lineHeight: 22,
    },
    footerTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
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
    // Floating Cart Button Styles
    floatingCartButton: {
        position: "absolute",
        bottom: 90,
        right: 16,
        backgroundColor: "#FFFFFF",
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
        borderColor: "#FF6B6B",
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
        backgroundColor: "#FF6B6B",
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
        color: "#2C3E50",
        marginBottom: 2,
    },
    floatingCartLabel: {
        fontSize: 12,
        color: "#FF6B6B",
        fontWeight: "700",
    },
    floatingCartArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FF6B6B",
        alignItems: "center",
        justifyContent: "center",
    },
    floatingCartArrowIcon: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "700",
    },
});