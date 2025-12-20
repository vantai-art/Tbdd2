// app/admin/dashboard.tsx
// @ts-nocheck
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Animated Card Component
const AnimatedCard = ({ children, delay = 0, style }: any) => {
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(600).springify()}
            style={style}
        >
            {children}
        </Animated.View>
    );
};

export default function AdminDashboard() {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [selectedPeriod, setSelectedPeriod] = useState('today'); // today, week, month, year

    // Animation values
    const pulseValue = useSharedValue(1);

    useEffect(() => {
        pulseValue.value = withRepeat(
            withSequence(
                withSpring(1.05, { damping: 2 }),
                withSpring(1, { damping: 2 })
            ),
            -1,
            false
        );
    }, []);

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

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
    }));

    // Mock data
    const stats = [
        {
            id: 1,
            title: 'Tổng doanh thu',
            value: '₫45.2M',
            change: '+12.5%',
            changeType: 'up',
            icon: '💰',
            color: '#10B981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
        },
        {
            id: 2,
            title: 'Đơn hàng',
            value: '1,234',
            change: '+8.2%',
            changeType: 'up',
            icon: '📦',
            color: '#3B82F6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
        },
        {
            id: 3,
            title: 'Khách hàng',
            value: '892',
            change: '+23.1%',
            changeType: 'up',
            icon: '👥',
            color: '#8B5CF6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
        },
        {
            id: 4,
            title: 'Sản phẩm',
            value: '156',
            change: '+5.4%',
            changeType: 'up',
            icon: '🍔',
            color: '#F59E0B',
            bgColor: 'rgba(245, 158, 11, 0.1)',
        },
    ];

    const recentOrders = [
        {
            id: '#ORD-001',
            customer: 'Nguyễn Văn A',
            items: 3,
            total: '₫245,000',
            status: 'pending',
            time: '5 phút trước',
        },
        {
            id: '#ORD-002',
            customer: 'Trần Thị B',
            items: 2,
            total: '₫180,000',
            status: 'processing',
            time: '12 phút trước',
        },
        {
            id: '#ORD-003',
            customer: 'Lê Văn C',
            items: 5,
            total: '₫420,000',
            status: 'completed',
            time: '25 phút trước',
        },
        {
            id: '#ORD-004',
            customer: 'Phạm Thị D',
            items: 1,
            total: '₫95,000',
            status: 'cancelled',
            time: '1 giờ trước',
        },
    ];

    const quickActions = [
        { id: 1, title: 'Đơn hàng', icon: '📋', route: '/admin/orders', color: '#3B82F6' },
        { id: 2, title: 'Sản phẩm', icon: '🍽️', route: '/admin/products', color: '#10B981' },
        { id: 3, title: 'Người dùng', icon: '👤', route: '/admin/users', color: '#8B5CF6' },
        { id: 4, title: 'Nhân viên', icon: '👨‍💼', route: '/admin/staff', color: '#F59E0B' },
        { id: 5, title: 'Shipper', icon: '🚚', route: '/admin/shippers', color: '#06B6D4' },
        { id: 6, title: 'Doanh thu', icon: '📊', route: '/admin/revenue', color: '#EC4899' },
    ];

    const notifications = [
        {
            id: 1,
            type: 'order',
            message: 'Đơn hàng mới #ORD-001 cần xử lý',
            time: '2 phút trước',
            read: false,
        },
        {
            id: 2,
            type: 'alert',
            message: 'Sản phẩm "Phở bò" sắp hết hàng',
            time: '15 phút trước',
            read: false,
        },
        {
            id: 3,
            type: 'success',
            message: 'Đơn hàng #ORD-245 đã hoàn thành',
            time: '1 giờ trước',
            read: true,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'processing': return '#3B82F6';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'processing': return 'Đang xử lý';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleLogout = () => {
        setShowLogoutDialog(false);
        setTimeout(() => {
            router.replace('/admin/auth/login');
        }, 200);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>🔐</Text>
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Admin Dashboard</Text>
                            <Text style={styles.headerSubtitle}>Chào mừng trở lại, Admin</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.notificationBtn}
                            onPress={() => setShowNotifications(true)}
                        >
                            <Text style={styles.notificationIcon}>🔔</Text>
                            <Animated.View style={[styles.notificationBadge, pulseStyle]}>
                                <Text style={styles.notificationBadgeText}>2</Text>
                            </Animated.View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={() => setShowLogoutDialog(true)}
                        >
                            <Text style={styles.logoutIcon}>🚪</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* PERIOD SELECTOR */}
                <View style={styles.periodSelector}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['today', 'week', 'month', 'year'].map((period) => (
                            <TouchableOpacity
                                key={period}
                                style={[
                                    styles.periodBtn,
                                    selectedPeriod === period && styles.periodBtnActive
                                ]}
                                onPress={() => setSelectedPeriod(period)}
                            >
                                <Text style={[
                                    styles.periodText,
                                    selectedPeriod === period && styles.periodTextActive
                                ]}>
                                    {period === 'today' ? 'Hôm nay' :
                                        period === 'week' ? 'Tuần này' :
                                            period === 'month' ? 'Tháng này' : 'Năm nay'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* STATS CARDS */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <AnimatedCard
                            key={stat.id}
                            delay={index * 100}
                            style={[
                                styles.statCard,
                                { backgroundColor: stat.bgColor, borderColor: stat.color }
                            ]}
                        >
                            <View style={styles.statHeader}>
                                <View style={[styles.statIconBox, { backgroundColor: stat.color }]}>
                                    <Text style={styles.statIcon}>{stat.icon}</Text>
                                </View>
                                <View style={[
                                    styles.changeBox,
                                    { backgroundColor: stat.changeType === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
                                ]}>
                                    <Text style={[
                                        styles.changeText,
                                        { color: stat.changeType === 'up' ? '#10B981' : '#EF4444' }
                                    ]}>
                                        {stat.change}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                        </AnimatedCard>
                    ))}
                </View>

                {/* QUICK ACTIONS */}
                <AnimatedCard delay={400} style={styles.section}>
                    <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action, index) => (
                            <Animated.View
                                key={action.id}
                                entering={FadeInRight.delay(500 + index * 50).duration(500)}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.quickActionCard,
                                        { borderColor: action.color }
                                    ]}
                                    onPress={() => router.push(action.route)}
                                >
                                    <View style={[
                                        styles.quickActionIcon,
                                        { backgroundColor: action.color + '20' }
                                    ]}>
                                        <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                                    </View>
                                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </AnimatedCard>

                {/* RECENT ORDERS */}
                <AnimatedCard delay={600} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
                        <TouchableOpacity onPress={() => router.push('/admin/orders')}>
                            <Text style={styles.seeAllText}>Xem tất cả →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ordersContainer}>
                        {recentOrders.map((order, index) => (
                            <Animated.View
                                key={order.id}
                                entering={FadeInDown.delay(700 + index * 100).duration(500)}
                            >
                                <TouchableOpacity style={styles.orderCard}>
                                    <View style={styles.orderLeft}>
                                        <Text style={styles.orderId}>{order.id}</Text>
                                        <Text style={styles.orderCustomer}>{order.customer}</Text>
                                        <Text style={styles.orderItems}>{order.items} món</Text>
                                    </View>
                                    <View style={styles.orderRight}>
                                        <Text style={styles.orderTotal}>{order.total}</Text>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(order.status) + '20' }
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                { color: getStatusColor(order.status) }
                                            ]}>
                                                {getStatusText(order.status)}
                                            </Text>
                                        </View>
                                        <Text style={styles.orderTime}>{order.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </AnimatedCard>

                {/* BOTTOM SPACING */}
                <View style={{ height: 30 }} />
            </ScrollView>

            {/* NOTIFICATIONS MODAL */}
            <Modal
                visible={showNotifications}
                transparent
                animationType="slide"
                onRequestClose={() => setShowNotifications(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.notificationModal}>
                        <View style={styles.notificationHeader}>
                            <Text style={styles.notificationTitle}>Thông báo</Text>
                            <TouchableOpacity onPress={() => setShowNotifications(false)}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {notifications.map((notif) => (
                                <TouchableOpacity
                                    key={notif.id}
                                    style={[
                                        styles.notificationItem,
                                        !notif.read && styles.notificationUnread
                                    ]}
                                >
                                    <View style={styles.notificationDot}>
                                        <Text style={styles.notificationEmoji}>
                                            {notif.type === 'order' ? '📋' :
                                                notif.type === 'alert' ? '⚠️' : '✅'}
                                        </Text>
                                    </View>
                                    <View style={styles.notificationContent}>
                                        <Text style={styles.notificationMessage}>
                                            {notif.message}
                                        </Text>
                                        <Text style={styles.notificationTime}>{notif.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* LOGOUT DIALOG */}
            <Modal visible={showLogoutDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogIcon}>🚪</Text>
                        <Text style={styles.dialogTitle}>Đăng xuất khỏi Admin Panel?</Text>
                        <Text style={styles.dialogMessage}>
                            Bạn sẽ cần đăng nhập lại để tiếp tục
                        </Text>
                        <Text style={styles.dialogCountdown}>({countdown}s)</Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogBtnCancel}
                                onPress={() => setShowLogoutDialog(false)}
                            >
                                <Text style={styles.dialogBtnCancelText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnConfirm}
                                onPress={handleLogout}
                            >
                                <Text style={styles.dialogBtnConfirmText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: isWeb ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderWidth: 2,
        borderColor: 'rgba(168, 85, 247, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#C084FC',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    notificationBtn: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationIcon: {
        fontSize: 22,
    },
    notificationBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: '#EF4444',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#0F172A',
    },
    notificationBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
    logoutBtn: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutIcon: {
        fontSize: 22,
    },
    periodSelector: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    periodBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    periodBtnActive: {
        backgroundColor: '#A855F7',
        borderColor: '#A855F7',
    },
    periodText: {
        color: '#C084FC',
        fontSize: 14,
        fontWeight: '600',
    },
    periodTextActive: {
        color: '#FFF',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 15,
        marginBottom: 20,
    },
    statCard: {
        width: isWeb ? 'calc(25% - 12px)' : (width - 55) / 2,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        minHeight: 150,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    statIconBox: {
        width: 45,
        height: 45,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIcon: {
        fontSize: 22,
    },
    changeBox: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    changeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 90,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 60,
    },
    seeAllText: {
        fontSize: 14,
        color: '#A855F7',
        fontWeight: '600',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickActionCard: {
        width: isWeb ? 'calc(33.33% - 8px)' : (width - 52) / 3,
        aspectRatio: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    quickActionIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    quickActionEmoji: {
        fontSize: 24,
    },
    quickActionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFF',
        textAlign: 'center',
    },
    ordersContainer: {
        gap: 12,
    },
    orderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    orderLeft: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    orderCustomer: {
        fontSize: 14,
        color: '#C084FC',
        marginBottom: 4,
    },
    orderItems: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    orderRight: {
        alignItems: 'flex-end',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '800',
        color: '#10B981',
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    orderTime: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationModal: {
        width: isWeb ? 400 : '90%',
        maxHeight: '70%',
        backgroundColor: '#1E293B',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)',
        overflow: 'hidden',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    notificationTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
    },
    closeIcon: {
        fontSize: 24,
        color: '#C084FC',
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    notificationUnread: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
    },
    notificationDot: {
        marginRight: 12,
    },
    notificationEmoji: {
        fontSize: 24,
    },
    notificationContent: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#FFF',
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    dialogContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#1E293B',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    dialogIcon: {
        fontSize: 50,
        marginBottom: 16,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        color: '#FFF',
    },
    dialogMessage: {
        fontSize: 14,
        color: '#C084FC',
        textAlign: 'center',
        marginBottom: 12,
    },
    dialogCountdown: {
        color: '#A855F7',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 24,
    },
    dialogButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    dialogBtnCancel: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dialogBtnCancelText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 16,
    },
    dialogBtnConfirm: {
        flex: 1,
        backgroundColor: '#EF4444',
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogBtnConfirmText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#FFF',
    },
});