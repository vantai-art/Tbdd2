import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ✅ Import API Config
import { API_CONFIG } from '../config/api';

const isWeb = Platform.OS === 'web';

// ✅ ĐỊNH NGHĨA TYPES
interface User {
    id: number;
    username: string;
    fullName?: string;
    email?: string;
}

interface Employee {
    id: number;
    username: string;
    fullName?: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
    isActive: boolean;
}

interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    product: Product;
    quantity: number;
    price: number;
    subtotal: number;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SERVED' | 'PAID' | 'CANCELLED';

interface Order {
    id: number;
    userId?: number;
    employeeId?: number;
    tableId?: number;
    status: OrderStatus;
    totalAmount: number;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
    user?: User;
    employee?: Employee;
}

interface StatusInfo {
    label: string;
    color: string;
    icon: string;
}

type TabKey = 'ALL' | OrderStatus;

interface Tab {
    key: TabKey;
    label: string;
    icon: string;
}

// Màu sắc theme
const COLORS = {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#34C759',
    warning: '#FFD93D',
    danger: '#FF3B30',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    background: '#F8F9FA',
    white: '#FFFFFF',
    border: '#E8E8E8',
};

// Status mapping
const ORDER_STATUS: Record<OrderStatus, StatusInfo> = {
    PENDING: { label: 'Chờ xác nhận', color: '#FFD93D', icon: '⏳' },
    CONFIRMED: { label: 'Đã xác nhận', color: '#4ECDC4', icon: '✅' },
    PREPARING: { label: 'Đang chuẩn bị', color: '#FF8A3D', icon: '👨‍🍳' },
    SERVED: { label: 'Đã phục vụ', color: '#34C759', icon: '🍽️' },
    PAID: { label: 'Đã thanh toán', color: '#8B5CF6', icon: '💳' },
    CANCELLED: { label: 'Đã hủy', color: '#FF3B30', icon: '❌' },
};

export default function OrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<TabKey>('ALL');
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loadingItems, setLoadingItems] = useState<boolean>(false);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getToken = (): string | null => {
        // ✅ Sử dụng AsyncStorage cho mobile
        if (Platform.OS === 'web') {
            return localStorage.getItem('token');
        }
        // TODO: Implement AsyncStorage for mobile
        return null;
    };

    const fetchOrders = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = getToken();

            const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const data: Order[] = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchOrderItems = async (orderId: number): Promise<void> => {
        try {
            setLoadingItems(true);
            const token = getToken();

            const response = await fetch(`${API_CONFIG.BASE_URL}/order-items/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) throw new Error('Failed to fetch order items');

            const data: OrderItem[] = await response.json();
            setOrderItems(data);
        } catch (error) {
            console.error('Error fetching order items:', error);
            Alert.alert('Lỗi', 'Không thể tải chi tiết đơn hàng');
        } finally {
            setLoadingItems(false);
        }
    };

    const onRefresh = (): void => {
        setRefreshing(true);
        fetchOrders();
    };

    const handleOrderPress = async (order: Order): Promise<void> => {
        setSelectedOrder(order);
        setShowDetailModal(true);
        await fetchOrderItems(order.id);
    };

    const updateOrderStatus = async (orderId: number, newStatus: OrderStatus): Promise<void> => {
        try {
            const token = getToken();

            const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update order');

            Alert.alert('Thành công', 'Cập nhật trạng thái đơn hàng thành công');
            fetchOrders();
            setShowDetailModal(false);
        } catch (error) {
            console.error('Error updating order:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredOrders = (): Order[] => {
        if (selectedTab === 'ALL') return orders;
        return orders.filter(order => order.status === selectedTab);
    };

    const tabs: Tab[] = [
        { key: 'ALL', label: 'Tất cả', icon: '📋' },
        { key: 'PENDING', label: 'Chờ xác nhận', icon: '⏳' },
        { key: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅' },
        { key: 'PREPARING', label: 'Đang chuẩn bị', icon: '👨‍🍳' },
        { key: 'SERVED', label: 'Đã giao', icon: '🍽️' },
    ];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>📦 Đơn hàng của tôi</Text>
                        <Text style={styles.headerSubtitle}>
                            {orders.length} đơn hàng
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                    >
                        <Text style={styles.refreshIcon}>🔄</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={styles.tabsContent}
                >
                    {tabs.map(tab => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tab,
                                selectedTab === tab.key && styles.tabActive
                            ]}
                            onPress={() => setSelectedTab(tab.key)}
                        >
                            <Text style={styles.tabIcon}>{tab.icon}</Text>
                            <Text style={[
                                styles.tabText,
                                selectedTab === tab.key && styles.tabTextActive
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {getFilteredOrders().length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
                        <Text style={styles.emptyDesc}>
                            Bạn chưa có đơn hàng nào trong danh mục này
                        </Text>
                    </View>
                ) : (
                    <View style={styles.ordersContainer}>
                        {getFilteredOrders().map(order => {
                            const status = ORDER_STATUS[order.status] || ORDER_STATUS.PENDING;
                            return (
                                <TouchableOpacity
                                    key={order.id}
                                    style={styles.orderCard}
                                    onPress={() => handleOrderPress(order)}
                                >
                                    {/* Order Header */}
                                    <View style={styles.orderHeader}>
                                        <View style={styles.orderHeaderLeft}>
                                            <Text style={styles.orderIcon}>🛍️</Text>
                                            <View>
                                                <Text style={styles.orderId}>
                                                    Đơn hàng #{order.id}
                                                </Text>
                                                <Text style={styles.orderDate}>
                                                    {formatDate(order.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: status.color + '20' }
                                        ]}>
                                            <Text style={styles.statusIcon}>{status.icon}</Text>
                                            <Text style={[
                                                styles.statusText,
                                                { color: status.color }
                                            ]}>
                                                {status.label}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Order Info */}
                                    <View style={styles.orderInfo}>
                                        {order.user && (
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoIcon}>👤</Text>
                                                <Text style={styles.infoText}>
                                                    Khách hàng: {order.user.username}
                                                </Text>
                                            </View>
                                        )}

                                        {order.employee && (
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoIcon}>👨‍💼</Text>
                                                <Text style={styles.infoText}>
                                                    Nhân viên: {order.employee.username}
                                                </Text>
                                            </View>
                                        )}

                                        {order.notes && (
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoIcon}>📝</Text>
                                                <Text style={styles.infoText}>
                                                    {order.notes}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Order Footer */}
                                    <View style={styles.orderFooter}>
                                        <View>
                                            <Text style={styles.totalLabel}>Tổng cộng</Text>
                                            <Text style={styles.totalAmount}>
                                                {formatCurrency(order.totalAmount)}
                                            </Text>
                                        </View>
                                        <View style={styles.viewDetailButton}>
                                            <Text style={styles.viewDetailText}>Chi tiết</Text>
                                            <Text style={styles.arrowIcon}>→</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Detail Modal */}
            <Modal
                visible={showDetailModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDetailModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Chi tiết đơn hàng #{selectedOrder?.id}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDetailModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeIcon}>×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalContent}>
                            {/* Order Status */}
                            {selectedOrder && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Trạng thái</Text>
                                    <View style={[
                                        styles.currentStatus,
                                        { backgroundColor: ORDER_STATUS[selectedOrder.status].color + '20' }
                                    ]}>
                                        <Text style={styles.currentStatusIcon}>
                                            {ORDER_STATUS[selectedOrder.status].icon}
                                        </Text>
                                        <Text style={[
                                            styles.currentStatusText,
                                            { color: ORDER_STATUS[selectedOrder.status].color }
                                        ]}>
                                            {ORDER_STATUS[selectedOrder.status].label}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Order Items */}
                            <View style={styles.modalSection}>
                                <Text style={styles.sectionTitle}>Món ăn đã đặt</Text>
                                {loadingItems ? (
                                    <ActivityIndicator size="small" color={COLORS.primary} />
                                ) : (
                                    orderItems.map(item => (
                                        <View key={item.id} style={styles.itemCard}>
                                            <Image
                                                source={{ uri: item.product.imageUrl }}
                                                style={styles.itemImage}
                                                resizeMode="cover"
                                            />
                                            <View style={styles.itemInfo}>
                                                <Text style={styles.itemName}>
                                                    {item.product.name}
                                                </Text>
                                                <Text style={styles.itemPrice}>
                                                    {formatCurrency(item.price)} x {item.quantity}
                                                </Text>
                                            </View>
                                            <Text style={styles.itemSubtotal}>
                                                {formatCurrency(item.subtotal)}
                                            </Text>
                                        </View>
                                    ))
                                )}
                            </View>

                            {/* Order Info */}
                            {selectedOrder && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                                    <View style={styles.infoCard}>
                                        <View style={styles.infoCardRow}>
                                            <Text style={styles.infoCardLabel}>Thời gian:</Text>
                                            <Text style={styles.infoCardValue}>
                                                {formatDate(selectedOrder.createdAt)}
                                            </Text>
                                        </View>
                                        {selectedOrder.user && (
                                            <View style={styles.infoCardRow}>
                                                <Text style={styles.infoCardLabel}>Khách hàng:</Text>
                                                <Text style={styles.infoCardValue}>
                                                    {selectedOrder.user.username}
                                                </Text>
                                            </View>
                                        )}
                                        {selectedOrder.employee && (
                                            <View style={styles.infoCardRow}>
                                                <Text style={styles.infoCardLabel}>Nhân viên:</Text>
                                                <Text style={styles.infoCardValue}>
                                                    {selectedOrder.employee.username}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={styles.infoCardDivider} />
                                        <View style={styles.infoCardRow}>
                                            <Text style={styles.totalLabelModal}>Tổng cộng:</Text>
                                            <Text style={styles.totalAmountModal}>
                                                {formatCurrency(selectedOrder.totalAmount)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Action Buttons */}
                            {selectedOrder && selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'PAID' && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Thao tác</Text>
                                    <View style={styles.actionButtons}>
                                        {selectedOrder.status === 'PENDING' && (
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                                                onPress={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                                            >
                                                <Text style={styles.actionButtonText}>✅ Xác nhận</Text>
                                            </TouchableOpacity>
                                        )}
                                        {selectedOrder.status === 'CONFIRMED' && (
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: COLORS.warning }]}
                                                onPress={() => updateOrderStatus(selectedOrder.id, 'PREPARING')}
                                            >
                                                <Text style={styles.actionButtonText}>👨‍🍳 Chuẩn bị</Text>
                                            </TouchableOpacity>
                                        )}
                                        {selectedOrder.status === 'PREPARING' && (
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
                                                onPress={() => updateOrderStatus(selectedOrder.id, 'SERVED')}
                                            >
                                                <Text style={styles.actionButtonText}>🍽️ Đã giao</Text>
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={[styles.actionButton, { backgroundColor: COLORS.danger }]}
                                            onPress={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                                        >
                                            <Text style={styles.actionButtonText}>❌ Hủy đơn</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textLight,
    },
    header: {
        backgroundColor: COLORS.white,
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    refreshIcon: {
        fontSize: 24,
    },
    tabsContainer: {
        paddingLeft: 20,
    },
    tabsContent: {
        paddingRight: 20,
        gap: 12,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: COLORS.background,
        gap: 6,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabIcon: {
        fontSize: 16,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textLight,
    },
    tabTextActive: {
        color: COLORS.white,
    },
    scrollContent: {
        padding: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 80,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    ordersContainer: {
        gap: 16,
    },
    orderCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    orderHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    orderIcon: {
        fontSize: 32,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 4,
    },
    statusIcon: {
        fontSize: 14,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    orderInfo: {
        gap: 8,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoIcon: {
        fontSize: 14,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalLabel: {
        fontSize: 13,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },
    viewDetailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 6,
    },
    viewDetailText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },
    arrowIcon: {
        fontSize: 16,
        color: COLORS.white,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.text,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        fontSize: 28,
        color: COLORS.text,
        fontWeight: '300',
    },
    modalContent: {
        padding: 20,
    },
    modalSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 12,
    },
    currentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    currentStatusIcon: {
        fontSize: 24,
    },
    currentStatusText: {
        fontSize: 16,
        fontWeight: '700',
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.background,
        borderRadius: 12,
        marginBottom: 12,
        gap: 12,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 13,
        color: COLORS.textLight,
    },
    itemSubtotal: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primary,
    },
    infoCard: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 12,
    },
    infoCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoCardLabel: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    infoCardValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    infoCardDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 8,
    },
    totalLabelModal: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
    totalAmountModal: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },
    actionButtons: {
        gap: 12,
    },
    actionButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
});