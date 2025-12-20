import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
    Platform,
    Modal
} from 'react-native';
import { router } from 'expo-router';

const isWeb = Platform.OS === 'web';

type MenuItemProps = {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    badge?: string;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
};

type SectionHeaderProps = {
    title: string;
};

export default function ProfileScreen() {
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

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
        setShowLogoutDialog(false);
        setTimeout(() => {
            router.replace('/auth/login');
        }, 200);
    };

    const MenuItem = ({ icon, title, subtitle, onPress, showArrow = true, badge, showSwitch, switchValue, onSwitchChange }: MenuItemProps) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                    <Text style={styles.menuIcon}>{icon}</Text>
                </View>
                <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{title}</Text>
                    {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <View style={styles.menuRight}>
                {badge && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                )}
                {showSwitch ? (
                    <Switch
                        value={switchValue}
                        onValueChange={onSwitchChange}
                        trackColor={{ false: '#D1D5DB', true: '#FF8A3D' }}
                        thumbColor="#FFFFFF"
                    />
                ) : showArrow && (
                    <Text style={styles.arrowIcon}>›</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }: SectionHeaderProps) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileTop}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={require('../../assets/images/f2.png')}
                                style={styles.avatar}
                            />
                            <View style={styles.editBadge}>
                                <Text style={styles.editIcon}>✏️</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Text style={styles.settingsIcon}>⚙️</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Ngô Văn Tài</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.starIcon}>⭐</Text>
                            <Text style={styles.ratingText}>5</Text>
                            <Text style={styles.ratingDivider}>•</Text>
                            <Text style={styles.phoneText}>+84328778198</Text>
                        </View>
                        <View style={styles.memberBadge}>
                            <Text style={styles.memberIcon}>💎</Text>
                            <Text style={styles.memberText}>THÀNH VIÊN</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>24</Text>
                        <Text style={styles.statLabel}>Đơn hàng</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Đang giao</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>₫2.5M</Text>
                        <Text style={styles.statLabel}>Tích lũy</Text>
                    </View>
                </View>

                {/* Quản lý */}
                <SectionHeader title="Quản lý" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="📊"
                        title="Quản lý chi tiêu"
                        subtitle="Theo dõi chi tiêu của bạn"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="📅"
                        title="Kế hoạch di chuyển"
                        subtitle="Lên lịch đặt xe trước"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="💳"
                        title="Ví trả sau - bePaylater"
                        subtitle="Hạn mức 10.000.000đ"
                        onPress={() => { }}
                        badge="Mới"
                    />
                    <MenuItem
                        icon="🔗"
                        title="Liên kết tài khoản"
                        subtitle="Ngân hàng, ví điện tử"
                        onPress={() => { }}
                    />
                </View>

                {/* Dịch vụ */}
                <SectionHeader title="Dịch vụ" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="🚗"
                        title="Cài đặt chuyến đi"
                        subtitle="Tùy chỉnh trải nghiệm"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="🛡️"
                        title="Bảo hiểm OPES"
                        subtitle="Bảo vệ mọi chuyến đi"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="🎫"
                        title="Khuyến mại"
                        subtitle="Mã giảm giá của bạn"
                        onPress={() => { }}
                        badge="5"
                    />
                    <MenuItem
                        icon="💎"
                        title="Gói tiết kiệm"
                        subtitle="Đăng ký gói ưu đãi"
                        onPress={() => { }}
                    />
                </View>

                {/* Đối tác */}
                <SectionHeader title="Đối tác" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="📢"
                        title="Giới thiệu & Nhận ưu đãi"
                        subtitle="Mời bạn bè nhận quà"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="💳"
                        title="Thanh toán"
                        subtitle="Quản lý phương thức"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="💼"
                        title="Mở tài khoản Doanh nghiệp"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="👥"
                        title="Trở thành đối tác Giúp Việc"
                        onPress={() => { }}
                        badge="Mới"
                    />
                    <MenuItem
                        icon="🏪"
                        title="Trở thành đối tác beFood"
                        onPress={() => { }}
                    />
                </View>

                {/* Thông tin & Hỗ trợ */}
                <SectionHeader title="Thông tin & Hỗ trợ" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="📧"
                        title="Hộp thư"
                        subtitle="Thông báo và tin nhắn"
                        onPress={() => { }}
                        badge="2"
                    />
                    <MenuItem
                        icon="🎧"
                        title="Hỗ trợ"
                        subtitle="Trung tâm trợ giúp"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="⚙️"
                        title="Cài đặt"
                        subtitle="Tùy chỉnh ứng dụng"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="📋"
                        title="Điều khoản & Chính sách"
                        onPress={() => { }}
                    />
                </View>

                {/* Thông báo */}
                <SectionHeader title="Thông báo" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="🔔"
                        title="Thông báo đẩy"
                        subtitle="Nhận thông báo từ ứng dụng"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={pushNotifications}
                        onSwitchChange={setPushNotifications}
                    />
                    <MenuItem
                        icon="📨"
                        title="Thông báo email"
                        subtitle="Nhận thông tin qua email"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={emailNotifications}
                        onSwitchChange={setEmailNotifications}
                    />
                </View>

                {/* Giao diện */}
                <SectionHeader title="Giao diện" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="🌙"
                        title="Chế độ tối"
                        subtitle="Giao diện tối bảo vệ mắt"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={darkMode}
                        onSwitchChange={setDarkMode}
                    />
                    <MenuItem
                        icon="🌐"
                        title="Ngôn ngữ"
                        subtitle="Tiếng Việt"
                        onPress={() => { }}
                    />
                </View>

                {/* Tài khoản */}
                <SectionHeader title="Tài khoản" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="🔐"
                        title="Bảo mật"
                        subtitle="Mật khẩu, xác thực 2 lớp"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="🔒"
                        title="Quyền riêng tư"
                        subtitle="Quản lý dữ liệu cá nhân"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="📱"
                        title="Thiết bị đã đăng nhập"
                        subtitle="Quản lý thiết bị truy cập"
                        onPress={() => { }}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => setShowLogoutDialog(true)}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>

                {/* Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Phiên bản 2.6.122</Text>
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* LOGOUT MODAL */}
            <Modal visible={showLogoutDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogIcon}>👋</Text>
                        <Text style={styles.dialogTitle}>
                            Bạn có chắc muốn đăng xuất không?
                        </Text>
                        <Text style={styles.dialogSubtitle}>
                            Bạn sẽ cần đăng nhập lại để tiếp tục
                        </Text>
                        <Text style={styles.dialogCountdown}>({countdown}s)</Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogBtnCancel}
                                onPress={() => setShowLogoutDialog(false)}
                            >
                                <Text style={styles.dialogBtnCancelText}>Ở lại</Text>
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
        backgroundColor: '#F8F9FA',
    },
    profileHeader: {
        backgroundColor: '#FFD93D',
        paddingTop: isWeb ? 30 : 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFD93D',
    },
    editIcon: {
        fontSize: 14,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsIcon: {
        fontSize: 24,
    },
    profileInfo: {
        alignItems: 'flex-start',
    },
    profileName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#2C3E50',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    starIcon: {
        fontSize: 18,
        marginRight: 4,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
    },
    ratingDivider: {
        fontSize: 16,
        color: '#7F8C8D',
        marginHorizontal: 8,
    },
    phoneText: {
        fontSize: 15,
        color: '#2C3E50',
        fontWeight: '600',
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139, 69, 19, 0.8)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 6,
    },
    memberIcon: {
        fontSize: 16,
    },
    memberText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FF8A3D',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#7F8C8D',
        fontWeight: '600',
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#2C3E50',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuSection: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        fontSize: 22,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#7F8C8D',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    arrowIcon: {
        fontSize: 28,
        color: '#BDC3C7',
        fontWeight: '300',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        borderWidth: 2,
        borderColor: '#FF3B30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    logoutIcon: {
        fontSize: 22,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FF3B30',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    versionText: {
        fontSize: 13,
        color: '#95A5A6',
    },
    bottomSpacer: {
        height: 40,
    },
    // Logout Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    dialogIcon: {
        fontSize: 50,
        marginBottom: 16,
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        color: '#2C3E50',
    },
    dialogSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 12,
    },
    dialogCountdown: {
        color: '#FF8A3D',
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
        backgroundColor: '#00B4D8',
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#00B4D8',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    dialogBtnCancelText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 16,
    },
    dialogBtnConfirm: {
        flex: 1,
        backgroundColor: '#FF3B30',
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    dialogBtnConfirmText: {
        fontWeight: '800',
        fontSize: 16,
        color: '#FFFFFF',
    },
});