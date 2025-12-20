// ==================== STAFF HOME DASHBOARD ====================
// File: app/staff/home.tsx

import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

// Type definitions
interface StaffData {
    name: string;
    staffId: string;
    position: string;
    shift: string;
    avatar: string;
}

interface TodayStats {
    ordersCompleted: number;
    revenue: string;
    customersServed: number;
    averageRating: number;
}

interface Task {
    id: number;
    icon: string;
    title: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
}

interface QuickActionCardProps {
    icon: string;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
    delay?: number;
}

interface StatCardProps {
    icon: string;
    label: string;
    value: number | string;
    color: string;
    delay?: number;
}

interface TaskCardProps {
    task: Task;
    delay?: number;
}

export default function StaffHome() {
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [staffData] = useState<StaffData>({
        name: "Nguyễn Văn A",
        staffId: "NV001",
        position: "Nhân viên bán hàng",
        shift: "Ca sáng (7:00 - 15:00)",
        avatar: "👨‍💼",
    });

    const [todayStats] = useState<TodayStats>({
        ordersCompleted: 24,
        revenue: "3,450,000",
        customersServed: 18,
        averageRating: 4.8,
    });

    const [pendingTasks] = useState<Task[]>([
        { id: 1, icon: "⏳", title: "Đơn hàng #12345 cần xác nhận", time: "5 phút trước", priority: "high" },
        { id: 2, icon: "📦", title: "Kiểm tra hàng tồn kho", time: "15 phút trước", priority: "medium" },
        { id: 3, icon: "💰", title: "Đối soát tiền mặt ca trước", time: "30 phút trước", priority: "low" },
    ]);

    // Pulse animation for notification badge
    const pulseScale = useSharedValue(1);

    useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            false
        );

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [pulseScale]);

    const notificationBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const onRefresh = async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRefreshing(false);
    };

    const handleLogout = () => {
        setShowLogoutDialog(false);
        setTimeout(() => {
            router.replace("/staff/auth/login");
        }, 200);
    };

    const QuickActionCard: React.FC<QuickActionCardProps> = ({
        icon,
        title,
        subtitle,
        color,
        onPress,
        delay = 0
    }) => (
        <Animated.View entering={FadeInDown.delay(delay).springify()}>
            <TouchableOpacity
                style={[styles.quickActionCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <View style={styles.quickActionContent}>
                    <View style={[styles.quickActionIconBox, { backgroundColor: color + "20" }]}>
                        <Text style={styles.quickActionIcon}>{icon}</Text>
                    </View>
                    <View style={styles.quickActionText}>
                        <Text style={styles.quickActionTitle}>{title}</Text>
                        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
                    </View>
                    <Text style={styles.quickActionArrow}>›</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const StatCard: React.FC<StatCardProps> = ({
        icon,
        label,
        value,
        color,
        delay = 0
    }) => (
        <Animated.View
            entering={FadeInRight.delay(delay).springify()}
            style={[styles.statCard, { borderTopColor: color, borderTopWidth: 4 }]}
        >
            <View style={styles.statCardHeader}>
                <View style={[styles.statIconBox, { backgroundColor: color + "15" }]}>
                    <Text style={styles.statIcon}>{icon}</Text>
                </View>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </Animated.View>
    );

    const TaskCard: React.FC<TaskCardProps> = ({ task, delay = 0 }) => {
        const priorityColors: Record<Task['priority'], string> = {
            high: "#EF4444",
            medium: "#F59E0B",
            low: "#10B981"
        };

        return (
            <Animated.View
                entering={FadeInDown.delay(delay).springify()}
                style={[styles.taskCard, { borderLeftColor: priorityColors[task.priority], borderLeftWidth: 4 }]}
            >
                <View style={styles.taskContent}>
                    <Text style={styles.taskIcon}>{task.icon}</Text>
                    <View style={styles.taskInfo}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.taskTime}>🕐 {task.time}</Text>
                    </View>
                    <TouchableOpacity style={[styles.taskBtn, { backgroundColor: priorityColors[task.priority] }]}>
                        <Text style={styles.taskBtnText}>Xem</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

            {/* HEADER */}
            <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarBox}>
                            <Text style={styles.avatarEmoji}>{staffData.avatar}</Text>
                            <View style={styles.onlineDot} />
                        </View>
                        <View>
                            <Text style={styles.greeting}>Xin chào 👋</Text>
                            <Text style={styles.staffName}>{staffData.name}</Text>
                            <Text style={styles.staffInfo}>{staffData.staffId} • {staffData.position}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationBtn} onPress={() => { }}>
                            <Text style={styles.notificationIcon}>🔔</Text>
                            <Animated.View style={[styles.notificationBadge, notificationBadgeStyle]}>
                                <Text style={styles.notificationBadgeText}>3</Text>
                            </Animated.View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.logoutBtnHeader}
                            onPress={() => setShowLogoutDialog(true)}
                        >
                            <Text style={styles.logoutIcon}>🚪</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* TIME & SHIFT INFO */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.shiftCard}>
                    <View style={styles.shiftLeft}>
                        <Text style={styles.shiftIcon}>⏰</Text>
                        <View>
                            <Text style={styles.shiftTime}>
                                {currentTime.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                })}
                            </Text>
                            <Text style={styles.shiftLabel}>{staffData.shift}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.clockInBtn}>
                        <Text style={styles.clockInIcon}>✓</Text>
                        <Text style={styles.clockInBtnText}>Đã chấm công</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#10B981"
                        colors={["#10B981"]}
                    />
                }
            >
                {/* TODAY'S PERFORMANCE */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📊 Hiệu suất hôm nay</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Xem chi tiết ›</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statsGrid}>
                        <StatCard
                            icon="✅"
                            label="Đơn hoàn thành"
                            value={todayStats.ordersCompleted}
                            color="#10B981"
                            delay={100}
                        />
                        <StatCard
                            icon="💰"
                            label="Doanh thu"
                            value={`${todayStats.revenue.substring(0, 5)}K`}
                            color="#F59E0B"
                            delay={200}
                        />
                        <StatCard
                            icon="👥"
                            label="Khách phục vụ"
                            value={todayStats.customersServed}
                            color="#3B82F6"
                            delay={300}
                        />
                        <StatCard
                            icon="⭐"
                            label="Đánh giá TB"
                            value={todayStats.averageRating}
                            color="#EF4444"
                            delay={400}
                        />
                    </View>
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Thao tác nhanh</Text>
                    <QuickActionCard
                        icon="➕"
                        title="Tạo đơn hàng mới"
                        subtitle="Nhận đơn từ khách hàng"
                        color="#10B981"
                        onPress={() => { }}
                        delay={100}
                    />
                    <QuickActionCard
                        icon="📋"
                        title="Xem đơn hàng đang xử lý"
                        subtitle="5 đơn đang chờ"
                        color="#F59E0B"
                        onPress={() => { }}
                        delay={200}
                    />
                    <QuickActionCard
                        icon="🔍"
                        title="Tra cứu sản phẩm"
                        subtitle="Tìm kiếm & kiểm tra kho"
                        color="#3B82F6"
                        onPress={() => { }}
                        delay={300}
                    />
                    <QuickActionCard
                        icon="💳"
                        title="Thu ngân"
                        subtitle="Xử lý thanh toán"
                        color="#8B5CF6"
                        onPress={() => { }}
                        delay={400}
                    />
                </View>

                {/* PENDING TASKS */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>📌 Công việc cần làm</Text>
                        <View style={styles.taskBadge}>
                            <Text style={styles.taskBadgeText}>{pendingTasks.length}</Text>
                        </View>
                    </View>
                    {pendingTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} delay={100 * (index + 1)} />
                    ))}
                </View>

                {/* ANNOUNCEMENTS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📢 Thông báo quan trọng</Text>
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        style={styles.announcementCard}
                    >
                        <View style={styles.announcementHeader}>
                            <Text style={styles.announcementIcon}>🎉</Text>
                            <View style={styles.announcementBadge}>
                                <Text style={styles.announcementBadgeText}>MỚI</Text>
                            </View>
                        </View>
                        <Text style={styles.announcementTitle}>Chương trình khuyến mãi mới</Text>
                        <Text style={styles.announcementText}>
                            Giảm giá 20% cho tất cả combo trong tuần này. Hãy thông báo cho khách hàng để tăng doanh số! 🚀
                        </Text>
                        <View style={styles.announcementFooter}>
                            <Text style={styles.announcementTime}>🕐 2 giờ trước</Text>
                            <TouchableOpacity>
                                <Text style={styles.announcementLink}>Xem chi tiết →</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={[styles.announcementCard, { backgroundColor: "#DBEAFE" }]}
                    >
                        <View style={styles.announcementHeader}>
                            <Text style={styles.announcementIcon}>ℹ️</Text>
                        </View>
                        <Text style={[styles.announcementTitle, { color: "#1E40AF" }]}>
                            Cập nhật quy trình làm việc
                        </Text>
                        <Text style={[styles.announcementText, { color: "#1E3A8A" }]}>
                            Từ ngày mai, tất cả nhân viên cần check-in qua app trước khi bắt đầu ca làm.
                        </Text>
                        <View style={styles.announcementFooter}>
                            <Text style={[styles.announcementTime, { color: "#1E40AF" }]}>
                                🕐 1 ngày trước
                            </Text>
                        </View>
                    </Animated.View>
                </View>

                {/* PERFORMANCE CHART PLACEHOLDER */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Hiệu suất tuần này</Text>
                    <Animated.View
                        entering={FadeInUp.delay(100).springify()}
                        style={styles.chartCard}
                    >
                        <View style={styles.chartPlaceholder}>
                            <Text style={styles.chartIcon}>📊</Text>
                            <Text style={styles.chartText}>Biểu đồ hiệu suất</Text>
                            <Text style={styles.chartSubtext}>Đang phát triển...</Text>
                        </View>
                    </Animated.View>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* LOGOUT CONFIRMATION MODAL */}
            <Modal visible={showLogoutDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View
                        entering={FadeInDown.springify()}
                        style={styles.dialogContainer}
                    >
                        <Text style={styles.dialogIcon}>👋</Text>
                        <Text style={styles.dialogTitle}>Đăng xuất</Text>
                        <Text style={styles.dialogMessage}>
                            Bạn có chắc muốn đăng xuất khỏi hệ thống không?
                        </Text>

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
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F4F6",
    },

    /* HEADER */
    header: {
        backgroundColor: "#064E3B",
        paddingTop: StatusBar.currentHeight || 40,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatarBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        position: "relative",
        borderWidth: 3,
        borderColor: "#10B981",
    },
    avatarEmoji: {
        fontSize: 32,
    },
    onlineDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#10B981",
        borderWidth: 2,
        borderColor: "#064E3B",
    },
    greeting: {
        fontSize: 14,
        color: "#6EE7B7",
        marginBottom: 2,
    },
    staffName: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFF",
        marginBottom: 2,
    },
    staffInfo: {
        fontSize: 11,
        color: "rgba(110, 231, 183, 0.7)",
    },
    headerRight: {
        flexDirection: "row",
        gap: 10,
    },
    notificationBtn: {
        position: "relative",
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    notificationIcon: {
        fontSize: 22,
    },
    notificationBadge: {
        position: "absolute",
        top: 6,
        right: 6,
        backgroundColor: "#EF4444",
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    notificationBadgeText: {
        color: "#FFF",
        fontSize: 11,
        fontWeight: "700",
    },
    logoutBtnHeader: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    logoutIcon: {
        fontSize: 22,
    },

    /* SHIFT CARD */
    shiftCard: {
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.3)",
    },
    shiftLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    shiftIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    shiftTime: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFF",
        marginBottom: 2,
    },
    shiftLabel: {
        fontSize: 12,
        color: "#6EE7B7",
    },
    clockInBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#10B981",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    clockInIcon: {
        fontSize: 16,
        color: "#FFF",
    },
    clockInBtnText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 13,
    },

    /* SCROLL VIEW */
    scrollView: {
        flex: 1,
    },

    /* SECTION */
    section: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
    },
    seeAllText: {
        fontSize: 13,
        color: "#10B981",
        fontWeight: "600",
    },
    taskBadge: {
        backgroundColor: "#EF4444",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    taskBadgeText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "700",
    },

    /* STATS GRID */
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statCard: {
        width: (width - 52) / 2,
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statCardHeader: {
        marginBottom: 12,
    },
    statIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    statIcon: {
        fontSize: 24,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
    },

    /* QUICK ACTIONS */
    quickActionCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quickActionContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    quickActionIconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    quickActionIcon: {
        fontSize: 24,
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 2,
    },
    quickActionSubtitle: {
        fontSize: 13,
        color: "#6B7280",
    },
    quickActionArrow: {
        fontSize: 32,
        color: "#D1D5DB",
    },

    /* TASK CARD */
    taskCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    taskIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 4,
    },
    taskTime: {
        fontSize: 12,
        color: "#6B7280",
    },
    taskBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    taskBtnText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 13,
    },

    /* ANNOUNCEMENT */
    announcementCard: {
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FCD34D",
        marginBottom: 12,
    },
    announcementHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    announcementIcon: {
        fontSize: 24,
    },
    announcementBadge: {
        backgroundColor: "#EF4444",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    announcementBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "700",
    },
    announcementTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#92400E",
        marginBottom: 8,
    },
    announcementText: {
        fontSize: 13,
        color: "#78350F",
        lineHeight: 20,
        marginBottom: 12,
    },
    announcementFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    announcementTime: {
        fontSize: 11,
        color: "#92400E",
        fontStyle: "italic",
    },
    announcementLink: {
        fontSize: 12,
        color: "#10B981",
        fontWeight: "600",
    },

    /* CHART CARD */
    chartCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartPlaceholder: {
        alignItems: "center",
        paddingVertical: 40,
    },
    chartIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    chartText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 4,
    },
    chartSubtext: {
        fontSize: 13,
        color: "#6B7280",
    },

    /* LOGOUT MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    dialogContainer: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#FFF",
        padding: 30,
        borderRadius: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    dialogIcon: {
        fontSize: 56,
        marginBottom: 16
    },
    dialogTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F2937",
        marginBottom: 12,
    },
    dialogMessage: {
        fontSize: 15,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    dialogButtons: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
    },
    dialogBtnCancel: {
        flex: 1,
        backgroundColor: "#E5E7EB",
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnCancelText: {
        color: "#1F2937",
        fontWeight: "700",
        fontSize: 16,
    },
    dialogBtnConfirm: {
        flex: 1,
        backgroundColor: "#EF4444",
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnConfirmText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
});