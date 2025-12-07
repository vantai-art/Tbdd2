import React, { useState } from "react";
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
} from "react-native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function CustomerHome() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("fast");

    const categories = [
        { id: 1, name: "Đồ ăn", icon: "🍽️" },
        { id: 2, name: "Nước uống", icon: "🥤" },
        { id: 3, name: "Món chính", icon: "🍜" },
        { id: 4, name: "Món phụ", icon: "🍱" },
        { id: 5, name: "Nước giải khát", icon: "🧃" },
    ];

    const products = [
        {
            id: 1,
            name: "Phở bò tái",
            desc: "Phở bò truyền thống với thịt bò tái, nước dùng đậm đà từ xương bò ninh nhiều giờ",
            price: "65.000đ",
            image: require("../../assets/images/Phobotai.png"),
            rating: "4.8",
        },
        {
            id: 2,
            name: "Bún bò Huế",
            desc: "Bún bò Huế cay nồng đặc trưng miền Trung, có chả cua, giò heo, thịt bò",
            price: "70.000đ",
            image: require("../../assets/images/Bunbohue.png"),
            rating: "4.9",
        },
        {
            id: 3,
            name: "Cơm tấm sườn nướng",
            desc: "Cơm tấm thơm với sườn nướng ngọt, chả trứng, bì và nước mắm pha",
            price: "75.000đ",
            image: require("../../assets/images/Comtam.png"),
            rating: "4.7",
        },
        {
            id: 4,
            name: "Nem nướng",
            desc: "Nem nướng thơm lừng, ăn kèm bánh tráng, rau sống và nước chấm đặc biệt",
            price: "45.000đ",
            image: require("../../assets/images/Nemnuong.png"),
            rating: "4.6",
        },
        {
            id: 5,
            name: "Trà đá chanh",
            desc: "Trà đá mát lạnh pha với chanh tươi, vị chua ngọt thanh mát",
            price: "15.000đ",
            image: require("../../assets/images/Tradachanh.png"),
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
                                <Text style={styles.logoIcon}>🍽️</Text>
                            </View>
                            <Text style={styles.logoText}>Food & Drink</Text>
                        </View>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity style={styles.homeBtn}>
                                <Text style={styles.homeBtnIcon}>🏠</Text>
                                <Text style={styles.homeBtnText}>Trang chủ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContentWrapper}>
                        <View style={styles.heroLeft}>
                            <View style={styles.promoBadge}>
                                <Text style={styles.promoIcon}>✨</Text>
                                <Text style={styles.promoText}>KHUYẾN MÃI</Text>
                            </View>

                            <Text style={styles.heroTitle}>Đặt món ngon,{"\n"}giao nhanh chóng</Text>

                            <Text style={styles.heroSubtitle}>
                                Khám phá hàng trăm món ăn và đồ uống yêu thích của bạn
                            </Text>

                            {/* Search Bar */}
                            <View style={styles.searchRow}>
                                <View style={styles.searchBox}>
                                    <Text style={styles.searchIcon}>🔍</Text>
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Tìm món ăn, đồ uống..."
                                        placeholderTextColor="#999"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
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
                        </View>


                        {/* Hero Image - Only show on web */}
                        {isWeb && (
                            <View style={styles.heroRight}>
                                <View style={styles.foodImageContainer}>
                                    <Image
                                        source={require('../../assets/images/Comtam.png')}
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
                        <Text style={styles.sectionTitle}>Danh mục</Text>
                        <Text style={styles.sectionSubtitle}>
                            Khám phá các món ăn yêu thích
                        </Text>
                    </View>

                    {isWeb ? (
                        <View style={styles.categoriesContainer}>
                            <View style={styles.categoriesGrid}>
                                {categories.map((cat) => (
                                    <TouchableOpacity key={cat.id} style={styles.categoryCard}>
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
                                <TouchableOpacity key={cat.id} style={styles.categoryCard}>
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
                            <Text style={styles.sectionTitle}>Món phổ biến</Text>
                            <Text style={styles.productCount}>5 món</Text>
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
                            <View key={product.id} style={styles.productCard}>
                                <View style={styles.productImageBox}>
                                    <Image
                                        source={product.image}
                                        style={styles.productImage}
                                        resizeMode="cover"
                                    />
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
                                        <Text style={styles.productPrice}>{product.price}</Text>
                                        <TouchableOpacity style={styles.addCartBtn}>
                                            <Text style={styles.cartIcon}>🛒</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <View style={styles.footerCol}>
                            <View style={styles.footerLogo}>
                                <View style={styles.footerLogoCircle}>
                                    <Text style={styles.footerLogoIcon}>🍽️</Text>
                                </View>
                                <Text style={styles.footerLogoText}>Food & Drink</Text>
                            </View>
                            <Text style={styles.footerDesc}>
                                Hệ thống quản lý bán đồ ăn nước uống đa vai trò
                            </Text>
                        </View>

                        <View style={styles.footerCol}>
                            <Text style={styles.footerTitle}>Liên kết nhanh</Text>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Trang chủ</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerCol}>
                            <Text style={styles.footerTitle}>Liên hệ</Text>
                            <Text style={styles.footerContact}>✉️ contact@fooddrink.vn</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFBF5",
    },

    // Header
    header: {
        backgroundColor: "#FFFFFF",
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
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
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: "#FF8A3D",
        alignItems: "center",
        justifyContent: "center",
    },
    logoIcon: {
        fontSize: 24,
    },
    logoText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#2C3E50",
    },
    headerButtons: {
        flexDirection: "row",
        gap: 10,
    },
    homeBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5E6",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    homeBtnIcon: {
        fontSize: 16,
    },
    homeBtnText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FF8A3D",
    },

    // Hero Section
    heroSection: {
        backgroundColor: "#FFF5E6",
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    heroContentWrapper: {
        flexDirection: isWeb ? "row" : "column",
        alignItems: "center",
        gap: isWeb ? 40 : 0,
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
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
        marginBottom: 20,
    },
    promoIcon: {
        fontSize: 14,
    },
    promoText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FF8A3D",
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: isWeb ? 40 : 32,
        fontWeight: "900",
        color: "#2C3E50",
        marginBottom: 12,
        lineHeight: isWeb ? 50 : 40,
    },
    heroSubtitle: {
        fontSize: 15,
        color: "#7F8C8D",
        marginBottom: 25,
        lineHeight: 22,
    },
    searchRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    searchBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        borderRadius: 25,
        height: 50,
        borderWidth: 2,
        borderColor: "#E8E8E8",
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#2C3E50",
    },
    searchButton: {
        backgroundColor: "#FF8A3D",
        paddingHorizontal: 24,
        borderRadius: 25,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    searchButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    filterRow: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
    },
    filterBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
        borderWidth: 2,
        borderColor: "#E8E8E8",
    },
    filterBtnActive: {
        backgroundColor: "#FF8A3D",
        borderColor: "#FF8A3D",
    },
    filterIcon: {
        fontSize: 16,
    },
    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#7F8C8D",
    },
    filterTextActive: {
        color: "#FFFFFF",
    },
    heroRight: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    foodImageContainer: {
        position: "relative",
        width: 280,
        height: 280,
        alignItems: "center",
        justifyContent: "center",
    },
    mainFoodImage: {
        width: 600,
        height: 780,
        borderRadius: 150,

    },
    floatingBadge1: {
        position: "absolute",
        top: 15,
        right: 25,
        backgroundColor: "#FFFFFF",
        width: 65,
        height: 65,
        borderRadius: 33,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    floatingBadge2: {
        position: "absolute",
        bottom: 35,
        left: 8,
        backgroundColor: "#FFFFFF",
        width: 55,
        height: 55,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    floatingBadge3: {
        position: "absolute",
        top: 50,
        left: 15,
        backgroundColor: "#FFFFFF",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    badgeEmoji: {
        fontSize: 32,
    },

    // Categories
    categoriesSection: {
        paddingVertical: 40,
        backgroundColor: "#FFFFFF",
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#2C3E50",
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
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
        gap: 12,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryCard: {
        backgroundColor: "#FFF5E6",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        minWidth: 110,
        borderWidth: 1,
        borderColor: "#FFE5CC",
    },
    categoryIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    categoryIcon: {
        fontSize: 30,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2C3E50",
    },

    // Products
    productsSection: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    productHeader: {
        flexDirection: isWeb ? "row" : "column",
        justifyContent: "space-between",
        alignItems: isWeb ? "center" : "flex-start",
        marginBottom: 20,
        gap: 15,
    },
    productCount: {
        fontSize: 13,
        color: "#7F8C8D",
        marginTop: 2,
    },
    filterTabs: {
        flexDirection: "row",
        gap: 10,
    },
    filterTab: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 16,
        gap: 6,
        borderWidth: 1,
        borderColor: "#E8E8E8",
    },
    filterTabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#2C3E50",
    },
    filterTabIcon: {
        fontSize: 11,
    },
    productsGrid: {
        flexDirection: isWeb ? "row" : "column",
        flexWrap: isWeb ? "wrap" : "nowrap",
        gap: 16,
    },
    productCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        width: isWeb ? ((width > 1200 ? 1200 : width) - 72) / 3 : "100%",
    },
    productImageBox: {
        backgroundColor: "#FFF5E6",
        height: 180,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    ratingBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 16,
        gap: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    starIcon: {
        fontSize: 13,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2C3E50",
    },
    productInfo: {
        padding: 16,
    },
    productName: {
        fontSize: 18,
        fontWeight: "800",
        color: "#2C3E50",
        marginBottom: 6,
    },
    productDesc: {
        fontSize: 13,
        color: "#7F8C8D",
        lineHeight: 19,
        marginBottom: 12,
    },
    productFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    productPrice: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FF8A3D",
    },
    addCartBtn: {
        backgroundColor: "#FF8A3D",
        width: 45,
        height: 45,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#FF8A3D",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    cartIcon: {
        fontSize: 22,
    },

    // Footer
    footer: {
        backgroundColor: "#2C3E50",
        paddingVertical: 35,
        paddingHorizontal: 20,
    },
    footerContent: {
        flexDirection: isWeb ? "row" : "column",
        gap: 25,
        maxWidth: isWeb ? 1200 : undefined,
        width: isWeb ? "100%" : undefined,
        alignSelf: isWeb ? "center" : undefined,
    },
    footerCol: {
        flex: 1,
    },
    footerLogo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    footerLogoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FF8A3D",
        alignItems: "center",
        justifyContent: "center",
    },
    footerLogoIcon: {
        fontSize: 26,
    },
    footerLogoText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    footerDesc: {
        fontSize: 13,
        color: "#95A5A6",
        lineHeight: 20,
    },
    footerTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 12,
    },
    footerLink: {
        fontSize: 13,
        color: "#95A5A6",
        marginBottom: 8,
    },
    footerContact: {
        fontSize: 13,
        color: "#95A5A6",
        lineHeight: 20,
    },
});