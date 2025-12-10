import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Platform,
    Image,
    Animated,
} from "react-native";

const isWeb = Platform.OS === "web";
const getResponsiveWidth = () => {
    const windowWidth = Dimensions.get("window").width;
    return isWeb ? ((windowWidth > 1200 ? 1200 : windowWidth) - 80) / 3 : (windowWidth - 52) / 2;
};

// Component chạy chữ đã được fix
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

            // Đặt vị trí bắt đầu: text nằm ngoài bên trái
            scrollAnim.setValue(-textWidth);

            const animation = Animated.timing(scrollAnim, {
                toValue: containerWidth,
                duration: duration,
                useNativeDriver: true,
                isInteraction: false,
            });

            animation.start(({ finished }) => {
                if (finished) {
                    // Chuyển sang text tiếp theo
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("fast");

    const searchPlaceholders = [
        "Tìm món ăn, đồ uống yêu thích...",
        "Phở bò, bún chả, cơm tấm...",
        "Trà sữa, cà phê, nước ép...",
        "Món Việt, món Á, món Âu...",
        "Giao nhanh 30 phút...",
    ];

    const categories = [
        { id: 1, name: "Đồ ăn", icon: "🍽️", color: "#FFE5CC" },
        { id: 2, name: "Nước uống", icon: "🥤", color: "#E5F3FF" },
        { id: 3, name: "Món chính", icon: "🍜", color: "#FFE5E5" },
        { id: 4, name: "Món phụ", icon: "🍱", color: "#E5FFE5" },
        { id: 5, name: "Nước giải khát", icon: "🧃", color: "#F3E5FF" },
    ];

    const products = [
        {
            id: 1,
            name: "Phở bò tái",
            desc: "Phở bò truyền thống với thịt bò tái, nước dùng đậm đà từ xương bò ninh nhiều giờ",
            price: "65.000đ",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
            rating: "4.8",
            discount: "10%",
        },
        {
            id: 2,
            name: "Bún bò Huế",
            desc: "Bún bò Huế cay nồng đặc trưng miền Trung, có chả cua, giò heo, thịt bò",
            price: "70.000đ",
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",
            rating: "4.9",
            isNew: true,
        },
        {
            id: 3,
            name: "Cơm tấm sườn nướng",
            desc: "Cơm tấm thơm với sườn nướng ngọt, chả trứng, bì và nước mắm pha",
            price: "75.000đ",
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
            rating: "4.7",
        },
        {
            id: 4,
            name: "Nem nướng",
            desc: "Nem nướng thơm lừng, ăn kèm bánh tráng, rau sống và nước chấm đặc biệt",
            price: "45.000đ",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
            rating: "4.6",
            discount: "15%",
        },
        {
            id: 5,
            name: "Trà đá chanh",
            desc: "Trà đá mát lạnh pha với chanh tươi, vị chua ngọt thanh mát",
            price: "15.000đ",
            image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
            rating: "4.5",
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.logo}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoIcon}>🍔</Text>
                            </View>
                            <View>
                                <Text style={styles.logoText}>Food & Drink</Text>
                                <Text style={styles.logoSubtext}>Quản lý bán hàng</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContentWrapper}>
                        <View style={styles.heroLeft}>
                            <View style={styles.promoBadge}>
                                <Text style={styles.promoIcon}>✨</Text>
                                <Text style={styles.promoText}>KHUYẾN MÃI HÔM NAY</Text>
                            </View>

                            <Text style={styles.heroTitle}>
                                Đặt món ngon,{"\n"}
                                <Text style={styles.heroTitleHighlight}>Giao nhanh chóng</Text>
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Khám phá hàng trăm món ăn và đồ uống yêu thích của bạn với giá tốt nhất
                            </Text>

                            {/* Search Bar đã fix */}
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
                                    <Text style={styles.searchButtonText}>Tìm kiếm</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Filter Buttons */}
                            <View style={styles.filterRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterBtn,
                                        selectedFilter === "fast" && styles.filterBtnActive,
                                    ]}
                                    onPress={() => setSelectedFilter("fast")}
                                >
                                    <Text style={styles.filterIcon}>⚡</Text>
                                    <Text
                                        style={[
                                            styles.filterText,
                                            selectedFilter === "fast" && styles.filterTextActive,
                                        ]}
                                    >
                                        Giao nhanh
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterBtn,
                                        selectedFilter === "discount" && styles.filterBtnActive,
                                    ]}
                                    onPress={() => setSelectedFilter("discount")}
                                >
                                    <Text style={styles.filterIcon}>🎁</Text>
                                    <Text
                                        style={[
                                            styles.filterText,
                                            selectedFilter === "discount" && styles.filterTextActive,
                                        ]}
                                    >
                                        Giảm giá
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.filterBtn,
                                        selectedFilter === "new" && styles.filterBtnActive,
                                    ]}
                                    onPress={() => setSelectedFilter("new")}
                                >
                                    <Text style={styles.filterIcon}>🔥</Text>
                                    <Text
                                        style={[
                                            styles.filterText,
                                            selectedFilter === "new" && styles.filterTextActive,
                                        ]}
                                    >
                                        Món mới
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Stats */}
                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statNumber}>1000+</Text>
                                    <Text style={styles.statLabel}>Món ăn</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statBox}>
                                    <Text style={styles.statNumber}>50K+</Text>
                                    <Text style={styles.statLabel}>Khách hàng</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statBox}>
                                    <Text style={styles.statNumber}>4.9⭐</Text>
                                    <Text style={styles.statLabel}>Đánh giá</Text>
                                </View>
                            </View>
                        </View>

                        {/* Hero Image - Only show on web */}
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

                {/* Categories Section */}
                <View style={styles.categoriesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Danh mục phổ biến</Text>
                        <Text style={styles.sectionSubtitle}>
                            Khám phá các món ăn yêu thích của bạn
                        </Text>
                    </View>

                    {isWeb ? (
                        <View style={styles.categoriesContainer}>
                            <View style={styles.categoriesGrid}>
                                {categories.map((cat) => (
                                    <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
                                        <View style={styles.categoryIconBox}>
                                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                        </View>
                                        <Text style={styles.categoryName}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesScroll}
                        >
                            {categories.map((cat) => (
                                <TouchableOpacity key={cat.id} style={[styles.categoryCard, { backgroundColor: cat.color }]}>
                                    <View style={styles.categoryIconBox}>
                                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                                    </View>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Products Section */}
                <View style={styles.productsSection}>
                    <View style={styles.productHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>Món phổ biến nhất</Text>
                            <Text style={styles.productCount}>🔥 {products.length} món đang hot</Text>
                        </View>
                        <View style={styles.filterTabs}>
                            <TouchableOpacity style={styles.filterTab}>
                                <Text style={styles.filterTabText}>Mặc định</Text>
                                <Text style={styles.filterTabIcon}>▼</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.filterTab}>
                                <Text style={styles.filterTabText}>Bộ lọc</Text>
                                <Text style={styles.filterTabIcon}>⚙️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.productsGrid}>
                        {products.map((product) => (
                            <TouchableOpacity key={product.id} style={styles.productCard}>
                                <View style={styles.productImageBox}>
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
                                    {product.discount && (
                                        <View style={styles.discountBadge}>
                                            <Text style={styles.discountText}>-{product.discount}</Text>
                                        </View>
                                    )}
                                    {product.isNew && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newText}>MỚI</Text>
                                        </View>
                                    )}
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.starIcon}>⭐</Text>
                                        <Text style={styles.ratingText}>{product.rating}</Text>
                                    </View>
                                </View>

                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{product.name}</Text>
                                    <Text style={styles.productDesc} numberOfLines={2}>
                                        {product.desc}
                                    </Text>

                                    <View style={styles.productFooter}>
                                        <View>
                                            <Text style={styles.productPrice}>{product.price}</Text>
                                            {product.discount && (
                                                <Text style={styles.productOldPrice}>80.000đ</Text>
                                            )}
                                        </View>
                                        <TouchableOpacity style={styles.addCartBtn}>
                                            <Text style={styles.cartIcon}>🛒</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <View style={styles.footerCol}>
                            <View style={styles.footerLogo}>
                                <View style={styles.footerLogoCircle}>
                                    <Text style={styles.footerLogoIcon}>🍔</Text>
                                </View>
                                <Text style={styles.footerLogoText}>Food & Drink</Text>
                            </View>
                            <Text style={styles.footerDesc}>
                                Hệ thống quản lý bán đồ ăn nước uống đa vai trò.
                                Mang đến trải nghiệm tuyệt vời nhất cho khách hàng.
                            </Text>
                        </View>

                        <View style={styles.footerCol}>
                            <Text style={styles.footerTitle}>Liên kết nhanh</Text>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>📱 Giới thiệu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>🍽️ Thực đơn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>💼 Tuyển dụng</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerCol}>
                            <Text style={styles.footerTitle}>Liên hệ</Text>
                            <Text style={styles.footerContact}>📧 contact@fooddrink.vn</Text>
                            <Text style={styles.footerContact}>📞 1900 1234</Text>
                            <Text style={styles.footerContact}>📍 TP. Hồ Chí Minh</Text>
                        </View>
                    </View>
                    <View style={styles.footerBottom}>
                        <Text style={styles.footerCopyright}>
                            © 2025 Food & Drink. All rights reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    // Marquee styles - ĐÃ FIX
    marqueeContainer: {
        flex: 1,
        overflow: "hidden",
        height: 20,
        justifyContent: "center",
    },
    marqueeAnimationWrapper: {
        flex: 1,
        overflow: "hidden",
    },
    marqueeWrapper: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
    },
    marqueeText: {
        fontSize: 15,
        color: "#999",
        ...(isWeb && {
            whiteSpace: "nowrap",
        }),
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
    header: {
        backgroundColor: "#FFFFFF",
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
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
        backgroundColor: "#FF8A3D",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF8A3D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    logoIcon: {
        fontSize: 26,
    },
    logoText: {
        fontSize: 22,
        fontWeight: "900",
        color: "#2C3E50",
    },
    logoSubtext: {
        fontSize: 12,
        color: "#7F8C8D",
        marginTop: 2,
    },
    heroSection: {
        backgroundColor: "#FFF5E6",
        paddingVertical: isWeb ? 60 : 40,
        paddingHorizontal: 20,
    },
    heroContentWrapper: {
        flexDirection: isWeb ? "row" : "column",
        alignItems: "center",
        gap: isWeb ? 50 : 0,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    heroLeft: {
        flex: 1,
        width: "100%",
    },
    promoBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        gap: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    promoIcon: {
        fontSize: 16,
    },
    promoText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#FF8A3D",
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: isWeb ? 48 : 36,
        fontWeight: "900",
        color: "#2C3E50",
        marginBottom: 16,
        lineHeight: isWeb ? 58 : 44,
    },
    heroTitleHighlight: {
        color: "#FF8A3D",
    },
    heroSubtitle: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 30,
        lineHeight: 24,
    },
    searchRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 18,
        borderRadius: 30,
        height: 55,
        borderWidth: 2,
        borderColor: "#E8E8E8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
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
    },
    searchButton: {
        backgroundColor: "#FF8A3D",
        paddingHorizontal: 28,
        borderRadius: 30,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#FF8A3D",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    searchButtonText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    filterRow: {
        flexDirection: "row",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 30,
    },
    filterBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        gap: 8,
        borderWidth: 2,
        borderColor: "#E8E8E8",
    },
    filterBtnActive: {
        backgroundColor: "#FF8A3D",
        borderColor: "#FF8A3D",
    },
    filterIcon: {
        fontSize: 18,
    },
    filterText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#7F8C8D",
    },
    filterTextActive: {
        color: "#FFFFFF",
    },
    statsRow: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statBox: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "900",
        color: "#FF8A3D",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "600",
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#E8E8E8",
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
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFD93D",
        top: 20,
        right: 10,
        opacity: 0.3,
    },
    floatingCircle2: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FF8A3D",
        bottom: 30,
        left: 10,
        opacity: 0.3,
    },
    categoriesSection: {
        paddingVertical: 50,
        backgroundColor: "#FAFAFA",
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 30,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: "900",
        color: "#2C3E50",
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: "#7F8C8D",
    },
    categoriesContainer: {
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
        paddingHorizontal: 20,
    },
    categoriesGrid: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 16,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 16,
    },
    categoryCard: {
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        minWidth: 130,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryIconBox: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIcon: {
        fontSize: 35,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C3E50",
    },
    productsSection: {
        paddingHorizontal: 20,
        paddingVertical: 50,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
        backgroundColor: "#FFFFFF",
    },
    productHeader: {
        flexDirection: isWeb ? "row" : "column",
        justifyContent: "space-between",
        alignItems: isWeb ? "center" : "flex-start",
        marginBottom: 30,
        gap: 15,
    },
    productCount: {
        fontSize: 14,
        color: "#FF8A3D",
        marginTop: 4,
        fontWeight: "600",
    },
    filterTabs: {
        flexDirection: "row",
        gap: 12,
    },
    filterTab: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: "#E8E8E8",
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2C3E50",
    },
    filterTabIcon: {
        fontSize: 12,
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
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        width: getResponsiveWidth(),
    },
    productImageBox: {
        backgroundColor: "#FFF5E6",
        height: isWeb ? 200 : 140,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    discountBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#FF3B30",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    discountText: {
        fontSize: 12,
        fontWeight: "900",
        color: "#FFFFFF",
    },
    newBadge: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "#34C759",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    newText: {
        fontSize: 12,
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
        padding: isWeb ? 20 : 12,
    },
    productName: {
        fontSize: isWeb ? 19 : 15,
        fontWeight: "900",
        color: "#2C3E50",
        marginBottom: isWeb ? 8 : 6,
    },
    productDesc: {
        fontSize: isWeb ? 13 : 11,
        color: "#7F8C8D",
        lineHeight: isWeb ? 20 : 16,
        marginBottom: isWeb ? 16 : 10,
    },
    productFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: isWeb ? 22 : 17,
        fontWeight: "900",
        color: "#FF8A3D",
    },
    productOldPrice: {
        fontSize: isWeb ? 14 : 12,
        color: "#95A5A6",
        textDecorationLine: "line-through",
        marginTop: 2,
    },
    addCartBtn: {
        backgroundColor: "#FF8A3D",
        width: isWeb ? 50 : 40,
        height: isWeb ? 50 : 40,
        borderRadius: isWeb ? 25 : 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF8A3D",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    cartIcon: {
        fontSize: isWeb ? 24 : 20,
    },
    footer: {
        backgroundColor: "#2C3E50",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    footerContent: {
        flexDirection: isWeb ? "row" : "column",
        gap: 30,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
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
        width: 55,
        height: 55,
        borderRadius: 28,
        backgroundColor: "#FF8A3D",
        alignItems: "center",
        justifyContent: "center",
    },
    footerLogoIcon: {
        fontSize: 28,
    },
    footerLogoText: {
        fontSize: 20,
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
    footerLink: {
        fontSize: 14,
        color: "#95A5A6",
        marginBottom: 10,
    },
    footerContact: {
        fontSize: 14,
        color: "#95A5A6",
        lineHeight: 24,
        marginBottom: 6,
    },
    footerBottom: {
        borderTopWidth: 1,
        borderTopColor: "#34495E",
        paddingTop: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    footerCopyright: {
        fontSize: 13,
        color: "#7F8C8D",
        textAlign: "center",
    },
});