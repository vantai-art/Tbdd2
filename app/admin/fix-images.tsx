// app/admin/fix-images.tsx
// @ts-nocheck
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { API_CONFIG, getAuthHeaders } from '../config/api';
import { TokenStorage } from '../utils/tokenStorage';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    isActive: boolean;
    categoryId: number;
}

const IMAGE_MAP: Record<string, string> = {
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    chicken: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    fried: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    gà: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    phở: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400',
    bún: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
    cơm: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    'cà phê': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    trà: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    tea: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    nước: 'https://images.unsplash.com/photo-1523677011781-c91d1eba5c04?w=400',
};

const SUGGESTED_IMAGES = [
    { name: '🍔 Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: '🍕 Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
    { name: '🍗 Gà rán', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
    { name: '🥪 Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
    { name: '🍜 Phở', url: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400' },
    { name: '🍚 Cơm', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
    { name: '☕ Cà phê', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400' },
    { name: '🍵 Trà sữa', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
];

export default function AdminFixImages() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [fixing, setFixing] = useState(false);
    const [logs, setLogs] = useState<{ message: string; type: 'info' | 'success' | 'error' }[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { message: `[${timestamp}] ${message}`, type }]);
    };

    const loadProducts = async () => {
        try {
            setLoading(true);
            addLog('Đang tải danh sách sản phẩm...', 'info');

            const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to load products');

            const data = await response.json();
            setProducts(data);
            addLog(`✅ Đã tải ${data.length} sản phẩm`, 'success');
        } catch (error) {
            console.error('Error loading products:', error);
            addLog('❌ Lỗi tải sản phẩm: ' + error.message, 'error');
            Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const getNewImageUrl = (productName: string): string => {
        const name = productName.toLowerCase();
        for (const [keyword, url] of Object.entries(IMAGE_MAP)) {
            if (name.includes(keyword)) {
                return url;
            }
        }
        return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&random=${Math.random()}`;
    };

    const fixAllImages = async () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc muốn sửa tất cả hình ảnh bị lỗi?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Sửa ngay',
                    onPress: async () => {
                        try {
                            setFixing(true);
                            const token = await TokenStorage.getToken();
                            const brokenProducts = products.filter(p =>
                                p.imageUrl.includes('via.placeholder.com') ||
                                p.imageUrl.includes('placeholder')
                            );

                            addLog(`🔧 Bắt đầu sửa ${brokenProducts.length} sản phẩm...`, 'info');

                            let successCount = 0;
                            let errorCount = 0;

                            for (const product of brokenProducts) {
                                const newImageUrl = getNewImageUrl(product.name);

                                try {
                                    const response = await fetch(
                                        `${API_CONFIG.BASE_URL}/products/${product.id}`,
                                        {
                                            method: 'PUT',
                                            headers: getAuthHeaders(token),
                                            body: JSON.stringify({
                                                name: product.name,
                                                description: product.description,
                                                price: product.price,
                                                stockQuantity: product.stockQuantity,
                                                imageUrl: newImageUrl,
                                                categoryId: product.categoryId,
                                                isActive: product.isActive,
                                            }),
                                        }
                                    );

                                    if (!response.ok) throw new Error('Update failed');

                                    addLog(`✅ Đã sửa: ${product.name}`, 'success');
                                    product.imageUrl = newImageUrl;
                                    successCount++;
                                } catch (error) {
                                    addLog(`❌ Lỗi sửa ${product.name}: ${error.message}`, 'error');
                                    errorCount++;
                                }
                            }

                            addLog(
                                `🎉 Hoàn thành! Thành công: ${successCount}, Lỗi: ${errorCount}`,
                                'success'
                            );

                            Alert.alert(
                                'Hoàn thành',
                                `Đã sửa ${successCount} sản phẩm thành công!\nLỗi: ${errorCount}`,
                                [{ text: 'OK' }]
                            );

                            // Reload products
                            setTimeout(() => {
                                loadProducts();
                            }, 1000);
                        } catch (error) {
                            console.error('Error fixing images:', error);
                            addLog('❌ Lỗi: ' + error.message, 'error');
                            Alert.alert('Lỗi', 'Không thể sửa hình ảnh');
                        } finally {
                            setFixing(false);
                        }
                    },
                },
            ]
        );
    };

    const brokenProductsCount = products.filter(p =>
        p.imageUrl.includes('via.placeholder.com') || p.imageUrl.includes('placeholder')
    ).length;

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
                    <Text style={styles.headerTitle}>Sửa Hình Ảnh</Text>
                    <Text style={styles.headerSubtitle}>
                        {brokenProductsCount > 0
                            ? `${brokenProductsCount} hình ảnh cần sửa`
                            : 'Tất cả hình ảnh OK'}
                    </Text>
                </View>
                <View style={{ width: 45 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* INFO CARD */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Công cụ sửa lỗi hình ảnh</Text>
                        <Text style={styles.infoDesc}>
                            Tự động phát hiện và thay thế các URL hình ảnh bị lỗi
                            (via.placeholder.com) bằng hình ảnh đẹp từ Unsplash
                        </Text>
                    </View>
                </View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                        <Text style={styles.statValue}>{products.length - brokenProductsCount}</Text>
                        <Text style={styles.statLabel}>✅ OK</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                        <Text style={styles.statValue}>{brokenProductsCount}</Text>
                        <Text style={styles.statLabel}>❌ Lỗi</Text>
                    </View>
                </View>

                {/* FIX BUTTON */}
                {brokenProductsCount > 0 && (
                    <TouchableOpacity
                        style={styles.fixButton}
                        onPress={fixAllImages}
                        disabled={fixing}
                    >
                        {fixing ? (
                            <>
                                <ActivityIndicator size="small" color="#FFF" />
                                <Text style={styles.fixButtonText}>Đang sửa...</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.fixButtonIcon}>✨</Text>
                                <Text style={styles.fixButtonText}>
                                    Sửa {brokenProductsCount} hình ảnh
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* PRODUCTS LIST */}
                <Text style={styles.sectionTitle}>📦 Danh sách sản phẩm</Text>
                <View style={styles.productsGrid}>
                    {products.map((product, index) => {
                        const hasError =
                            product.imageUrl.includes('via.placeholder.com') ||
                            product.imageUrl.includes('placeholder');

                        return (
                            <Animated.View
                                key={product.id}
                                entering={FadeInDown.delay(index * 30).duration(400)}
                            >
                                <View style={styles.productCard}>
                                    <Image
                                        source={{ uri: product.imageUrl }}
                                        style={styles.productImage}
                                        onError={() => console.log('Image load error:', product.name)}
                                    />
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            hasError
                                                ? { backgroundColor: '#FEE' }
                                                : { backgroundColor: '#D1FAE5' },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                hasError ? { color: '#E53E3E' } : { color: '#059669' },
                                            ]}
                                        >
                                            {hasError ? '❌ Lỗi' : '✅ OK'}
                                        </Text>
                                    </View>
                                </View>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* SUGGESTED IMAGES */}
                <Text style={styles.sectionTitle}>🖼️ URL hình ảnh gợi ý</Text>
                <View style={styles.suggestionsGrid}>
                    {SUGGESTED_IMAGES.map((img, index) => (
                        <View key={index} style={styles.suggestionCard}>
                            <Image source={{ uri: img.url }} style={styles.suggestionImage} />
                            <Text style={styles.suggestionName}>{img.name}</Text>
                            <Text style={styles.suggestionUrl} numberOfLines={2}>
                                {img.url}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* LOGS */}
                <Text style={styles.sectionTitle}>📋 Nhật ký</Text>
                <View style={styles.logsContainer}>
                    {logs.length === 0 ? (
                        <Text style={styles.logsEmpty}>Chưa có hoạt động...</Text>
                    ) : (
                        logs.map((log, index) => (
                            <Text
                                key={index}
                                style={[
                                    styles.logText,
                                    log.type === 'success' && { color: '#10B981' },
                                    log.type === 'error' && { color: '#EF4444' },
                                ]}
                            >
                                {log.message}
                            </Text>
                        ))
                    )}
                </View>
            </ScrollView>
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
    scrollContent: { padding: 20 },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    infoIcon: { fontSize: 24, marginRight: 12 },
    infoContent: { flex: 1 },
    infoTitle: { fontSize: 16, fontWeight: '800', color: '#3B82F6', marginBottom: 4 },
    infoDesc: { fontSize: 13, color: 'rgba(59, 130, 246, 0.8)', lineHeight: 18 },
    statsRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    statBox: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statValue: { fontSize: 32, fontWeight: '900', color: '#FFF', marginBottom: 4 },
    statLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
    fixButton: {
        flexDirection: 'row',
        backgroundColor: '#10B981',
        height: 55,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    fixButtonIcon: { fontSize: 24 },
    fixButtonText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 15,
        marginTop: 10,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
    },
    productCard: {
        width: isWeb ? 'calc(25% - 9px)' : (width - 52) / 3,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    productImage: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        backgroundColor: '#1E293B',
        marginBottom: 8,
    },
    productName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 6,
        minHeight: 32,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statusText: { fontSize: 10, fontWeight: '700' },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 30,
    },
    suggestionCard: {
        width: isWeb ? 'calc(25% - 9px)' : (width - 52) / 2,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    suggestionImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    suggestionName: { fontSize: 14, fontWeight: '700', color: '#FFF', marginBottom: 4 },
    suggestionUrl: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 14,
    },
    logsContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 15,
        maxHeight: 300,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logsEmpty: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' },
    logText: {
        fontSize: 12,
        color: '#C084FC',
        marginBottom: 6,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
});