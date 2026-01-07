import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { API_CONFIG } from '../config/api';

const isWeb = Platform.OS === 'web';
const API_BASE_URL = API_CONFIG.BASE_URL;

// Types
interface Settings {
    id?: number;
    storeName?: string;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
    emailNotifications?: boolean;
    orderNotifications?: boolean;
    promotionNotifications?: boolean;
    currency?: string;
    timezone?: string;
    language?: string;
    taxRate?: number;
    themeColor?: string;
    darkMode?: boolean;
    freeShippingThreshold?: number;
    shippingFee?: number;
}

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
    // Settings State
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);

    // Local UI State
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        fetchSettings();
    }, []);

    // Fetch Settings from Backend
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/settings`);

            if (!response.ok) {
                console.warn("⚠️ Settings endpoint not available, using defaults");
                setSettings({
                    storeName: "Quán Ngon",
                    storeEmail: "hello@quanngon.vn",
                    storePhone: "1900 1234",
                    storeAddress: "123 Nguyễn Huệ, Q.1, TP.HCM",
                    emailNotifications: false,
                    orderNotifications: true,
                    promotionNotifications: true,
                    darkMode: false,
                    language: "vi"
                });
                return;
            }

            const data: Settings = await response.json();
            console.log("✅ Settings loaded:", data);
            setSettings(data);
        } catch (error) {
            console.error("❌ Error fetching settings:", error);
            Alert.alert("Lỗi", "Không thể tải cài đặt");
        } finally {
            setLoading(false);
        }
    };

    // Update Settings to Backend
    const updateSettings = async (updatedSettings: Partial<Settings>) => {
        try {
            const response = await fetch(`${API_BASE_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...settings,
                    ...updatedSettings
                }),
            });

            if (!response.ok) throw new Error('Failed to update settings');

            const data: Settings = await response.json();
            setSettings(data);
            console.log("✅ Settings updated:", data);
        } catch (error) {
            console.error("❌ Error updating settings:", error);
            Alert.alert("Lỗi", "Không thể cập nhật cài đặt");
        }
    };

    // Handle notification switches
    const handleEmailNotifications = (value: boolean) => {
        setSettings(prev => prev ? { ...prev, emailNotifications: value } : null);
        updateSettings({ emailNotifications: value });
    };

    const handleOrderNotifications = (value: boolean) => {
        setSettings(prev => prev ? { ...prev, orderNotifications: value } : null);
        updateSettings({ orderNotifications: value });
    };

    const handlePromotionNotifications = (value: boolean) => {
        setSettings(prev => prev ? { ...prev, promotionNotifications: value } : null);
        updateSettings({ promotionNotifications: value });
    };

    const handleDarkMode = (value: boolean) => {
        setSettings(prev => prev ? { ...prev, darkMode: value } : null);
        updateSettings({ darkMode: value });
    };

    // Logout countdown timer
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

    // Components
    const MenuItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showArrow = true,
        badge,
        showSwitch,
        switchValue,
        onSwitchChange
    }: MenuItemProps) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={showSwitch}
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF8A3D" />
                <Text style={styles.loadingText}>Đang tải cài đặt...</Text>
            </View>
        );
    }

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
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => Alert.alert("Cài đặt", "Chức năng đang phát triển")}
                        >
                            <Text style={styles.settingsIcon}>⚙️</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Ngô Văn Tài</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.starIcon}>⭐</Text>
                            <Text style={styles.ratingText}>5.0</Text>
                            <Text style={styles.ratingDivider}>•</Text>
                            <Text style={styles.phoneText}>+84 328 778 198</Text>
                        </View>
                        <View style={styles.memberBadge}>
                            <Text style={styles.memberIcon}>💎</Text>
                            <Text style={styles.memberText}>THÀNH VIÊN VIP</Text>
                        </View>
                    </View>
                </View>

                {/* Store Info Card */}
                <View style={styles.storeInfoCard}>
                    <Text style={styles.storeInfoTitle}>🏪 Thông tin cửa hàng</Text>
                    <View style={styles.storeInfoRow}>
                        <Text style={styles.storeInfoLabel}>Tên:</Text>
                        <Text style={styles.storeInfoValue}>{settings?.storeName || "Chưa cập nhật"}</Text>
                    </View>
                    <View style={styles.storeInfoRow}>
                        <Text style={styles.storeInfoLabel}>Email:</Text>
                        <Text style={styles.storeInfoValue}>{settings?.storeEmail || "Chưa cập nhật"}</Text>
                    </View>
                    <View style={styles.storeInfoRow}>
                        <Text style={styles.storeInfoLabel}>Điện thoại:</Text>
                        <Text style={styles.storeInfoValue}>{settings?.storePhone || "Chưa cập nhật"}</Text>
                    </View>
                    <View style={styles.storeInfoRow}>
                        <Text style={styles.storeInfoLabel}>Địa chỉ:</Text>
                        <Text style={styles.storeInfoValue}>{settings?.storeAddress || "Chưa cập nhật"}</Text>
                    </View>
                </View>

                {/* Thông báo */}
                <SectionHeader title="🔔 Thông báo" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="📧"
                        title="Thông báo Email"
                        subtitle="Nhận thông tin qua email"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={settings?.emailNotifications ?? false}
                        onSwitchChange={handleEmailNotifications}
                    />
                    <MenuItem
                        icon="📦"
                        title="Thông báo Đơn hàng"
                        subtitle="Cập nhật trạng thái đơn hàng"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={settings?.orderNotifications ?? true}
                        onSwitchChange={handleOrderNotifications}
                    />
                    <MenuItem
                        icon="🎁"
                        title="Thông báo Khuyến mại"
                        subtitle="Nhận ưu đãi và giảm giá"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={settings?.promotionNotifications ?? true}
                        onSwitchChange={handlePromotionNotifications}
                    />
                </View>

                {/* Giao diện */}
                <SectionHeader title="🎨 Giao diện" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="🌙"
                        title="Chế độ tối"
                        subtitle="Giao diện tối bảo vệ mắt"
                        showArrow={false}
                        showSwitch={true}
                        switchValue={settings?.darkMode ?? false}
                        onSwitchChange={handleDarkMode}
                    />
                    <MenuItem
                        icon="🌐"
                        title="Ngôn ngữ"
                        subtitle={settings?.language === 'vi' ? 'Tiếng Việt' : 'English'}
                        onPress={() => Alert.alert("Ngôn ngữ", "Chức năng đang phát triển")}
                    />
                    <MenuItem
                        icon="🎨"
                        title="Màu chủ đạo"
                        subtitle={settings?.themeColor || "#FF6B6B"}
                        onPress={() => Alert.alert("Màu sắc", "Chức năng đang phát triển")}
                    />
                </View>

                {/* Hỗ trợ */}
                <SectionHeader title="💁 Hỗ trợ" />
                <View style={styles.menuSection}>
                    <MenuItem
                        icon="📋"
                        title="Điều khoản sử dụng"
                        onPress={() => Alert.alert("Điều khoản", "Chức năng đang phát triển")}
                    />
                    <MenuItem
                        icon="🔒"
                        title="Chính sách bảo mật"
                        onPress={() => Alert.alert("Bảo mật", "Chức năng đang phát triển")}
                    />
                    <MenuItem
                        icon="❓"
                        title="Trợ giúp"
                        onPress={() => Alert.alert("Trợ giúp", "Liên hệ: " + (settings?.storePhone || "1900 1234"))}
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
                    <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '600',
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
    storeInfoCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    storeInfoTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C3E50',
        marginBottom: 16,
    },
    storeInfoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    storeInfoLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#7F8C8D',
        width: 90,
    },
    storeInfoValue: {
        flex: 1,
        fontSize: 14,
        color: '#2C3E50',
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