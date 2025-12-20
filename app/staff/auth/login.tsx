import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    BackHandler,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function StaffLogin() {
    const [staffId, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [errors, setErrors] = useState({
        staffId: "",
        password: ""
    });

    const staffIdInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    // Animations
    const logoScale = useSharedValue(0);
    const logoFloat = useSharedValue(0);
    const logoRotate = useSharedValue(0);

    useEffect(() => {
        // Logo entrance animation
        logoScale.value = withSpring(1, { damping: 10 });

        // Floating animation
        logoFloat.value = withRepeat(
            withSequence(
                withTiming(-8, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            false
        );

        // Subtle rotation animation
        logoRotate.value = withRepeat(
            withSequence(
                withTiming(-3, { duration: 2000 }),
                withTiming(3, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            false
        );

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            setShowExitDialog(true);
            return true;
        });

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (showExitDialog) {
            setCountdown(10);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setShowExitDialog(false);
                        return 10;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showExitDialog]);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value },
            { translateY: logoFloat.value },
            { rotate: `${logoRotate.value}deg` }
        ]
    }));

    const validateStaffId = (id: string) => {
        if (!id) return "Vui lòng nhập mã nhân viên";
        if (id.length < 4) return "Mã nhân viên phải có ít nhất 4 ký tự";
        return "";
    };

    const validatePassword = (password: string) => {
        if (!password) return "Vui lòng nhập mật khẩu";
        if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        return "";
    };

    const handleLogin = async () => {
        Keyboard.dismiss();

        const staffIdError = validateStaffId(staffId);
        const passwordError = validatePassword(password);

        setErrors({ staffId: staffIdError, password: passwordError });

        if (staffIdError || passwordError) return;

        setIsLoading(true);

        // Button press animation
        logoScale.value = withSequence(
            withTiming(1.15, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        await new Promise(res => setTimeout(res, 1500));

        setIsLoading(false);
        // ✅ Navigate to staff home
        router.replace("/staff/home");
    };

    const handleExitApp = () => {
        setShowExitDialog(false);
        setTimeout(() => {
            BackHandler.exitApp();
        }, 200);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>

                {/* ANIMATED BACKGROUND CIRCLES */}
                <View style={styles.bgCircle1} />
                <View style={styles.bgCircle2} />
                <View style={styles.bgCircle3} />

                {/* GRID PATTERN OVERLAY */}
                <View style={styles.gridPattern} />

                {/* LOGO SECTION */}
                <Animated.View entering={FadeInDown.duration(800)} style={[styles.logoSection, logoStyle]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>👤</Text>
                    </View>
                    <Text style={styles.logoText}>Staff Portal</Text>
                    <Text style={styles.logoSubtext}>Đăng nhập để bắt đầu làm việc</Text>
                </Animated.View>

                {/* FORM CARD */}
                <View style={styles.formCard}>

                    <Text style={styles.welcomeText}>Xin chào! 👋</Text>
                    <Text style={styles.subtitle}>Nhập thông tin đăng nhập của bạn</Text>

                    {/* STAFF ID INPUT */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.inputLabel}>Mã Nhân Viên</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === "staffId" && styles.inputFocused,
                                errors.staffId && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>🆔</Text>
                            <TextInput
                                ref={staffIdInputRef}
                                placeholder="Ví dụ: NV001"
                                placeholderTextColor="rgba(16, 185, 129, 0.4)"
                                value={staffId}
                                onChangeText={setStaffId}
                                style={styles.input}
                                autoCapitalize="characters"
                                onFocus={() => setFocusedInput("staffId")}
                                onBlur={() => setFocusedInput("")}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInputRef.current?.focus()}
                            />
                        </View>
                        {errors.staffId ? (
                            <Text style={styles.errorText}>{errors.staffId}</Text>
                        ) : (
                            <View style={{ height: 18 }} />
                        )}
                    </View>

                    {/* PASSWORD INPUT */}
                    <View>
                        <Text style={styles.inputLabel}>Mật Khẩu</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === "password" && styles.inputFocused,
                                errors.password && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>🔑</Text>
                            <TextInput
                                ref={passwordInputRef}
                                placeholder="••••••••"
                                placeholderTextColor="rgba(16, 185, 129, 0.4)"
                                value={password}
                                secureTextEntry={!showPassword}
                                onChangeText={setPassword}
                                style={styles.input}
                                onFocus={() => setFocusedInput("password")}
                                onBlur={() => setFocusedInput("")}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={{ fontSize: 20 }}>
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : (
                            <View style={{ height: 18 }} />
                        )}
                    </View>

                    {/* REMEMBER ME */}
                    <View style={styles.rememberRow}>
                        <TouchableOpacity
                            style={styles.rememberBtn}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                    {/* HELP TEXT */}
                    <Text style={styles.helpText}>
                        ⚠️ Quên mật khẩu? Liên hệ quản lý hoặc bộ phận IT để được hỗ trợ
                    </Text>

                    {/* LOGIN BUTTON */}
                    <TouchableOpacity
                        style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View style={styles.loadingRow}>
                                <Text style={styles.spinner}>⏳</Text>
                                <Text style={styles.loginBtnText}>Đang xử lý...</Text>
                            </View>
                        ) : (
                            <Text style={styles.loginBtnText}>Đăng Nhập</Text>
                        )}
                    </TouchableOpacity>

                    {/* SECURITY INFO */}
                    <View style={styles.securityBox}>
                        <Text style={styles.securityIcon}>🔐</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.securityTitle}>Kết nối an toàn</Text>
                            <Text style={styles.securityDesc}>
                                Thông tin của bạn được mã hóa và bảo mật
                            </Text>
                        </View>
                    </View>

                </View>

                {/* FOOTER */}
                <Text style={styles.footerText}>
                    © 2024 Food & Drink. Dành cho nhân viên.
                </Text>

            </View>

            {/* EXIT MODAL */}
            <Modal visible={showExitDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogIcon}>🚪</Text>
                        <Text style={styles.dialogTitle}>
                            Bạn có chắc muốn thoát không?
                        </Text>
                        <Text style={styles.dialogCountdown}>({countdown}s)</Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogBtnConfirm}
                                onPress={handleExitApp}
                            >
                                <Text style={styles.dialogBtnConfirmText}>Thoát</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnCancel}
                                onPress={() => setShowExitDialog(false)}
                            >
                                <Text style={styles.dialogBtnCancelText}>Ở lại</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </KeyboardAvoidingView>
    );
}

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#064E3B", // Dark emerald
        justifyContent: "flex-start"
    },

    /* ANIMATED BACKGROUND */
    bgCircle1: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: 160,
        backgroundColor: "#10B981", // Emerald
        top: -120,
        left: -100,
        opacity: 0.15,
        pointerEvents: "none",
    },
    bgCircle2: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "#14B8A6", // Teal
        top: 80,
        right: -90,
        opacity: 0.15,
        pointerEvents: "none",
    },
    bgCircle3: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "#06B6D4", // Cyan
        bottom: -70,
        left: -50,
        opacity: 0.15,
        pointerEvents: "none",
    },

    gridPattern: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        pointerEvents: "none",
    },

    /* LOGO */
    logoSection: {
        alignItems: "center",
        marginTop: 50,
        marginBottom: 40,
        pointerEvents: "none",
    },
    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: "rgba(16, 185, 129, 0.25)",
        borderWidth: 2,
        borderColor: "rgba(16, 185, 129, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 12,
    },
    logoIcon: { fontSize: 48 },
    logoText: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFF",
        marginTop: 16,
        letterSpacing: -1,
    },
    logoSubtext: {
        fontSize: 14,
        color: "#6EE7B7",
        marginTop: 6,
    },

    /* FORM CARD */
    formCard: {
        backgroundColor: "rgba(255, 255, 255, 0.09)",
        borderRadius: 26,
        padding: 26,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        pointerEvents: "auto",
    },

    welcomeText: {
        fontSize: 25,
        fontWeight: "700",
        color: "#FFF",
        marginBottom: 6,
    },
    subtitle: {
        color: "#6EE7B7",
        fontSize: 14,
    },

    /* INPUT */
    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6EE7B7",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    inputFocused: {
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        transform: [{ scale: 1.02 }],
    },
    inputError: {
        borderColor: "#F87171",
        backgroundColor: "rgba(248, 113, 113, 0.1)",
    },
    inputIcon: { fontSize: 22, marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#FFF",
    },
    errorText: {
        fontSize: 13,
        color: "#FCA5A5",
        marginTop: 6,
        marginLeft: 10,
    },

    /* REMEMBER & HELP */
    rememberRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 12,
    },
    rememberBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: "#10B981",
        borderColor: "#10B981",
    },
    checkmark: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: "700",
    },
    rememberText: {
        color: "#6EE7B7",
        fontSize: 14,
    },
    helpText: {
        color: "rgba(252, 211, 77, 0.9)",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 22,
        fontStyle: "italic",
        lineHeight: 18,
    },

    /* LOGIN BUTTON */
    loginBtn: {
        height: 56,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        shadowColor: "#10B981",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 18,
        elevation: 10,
    },
    loginBtnText: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "700",
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    spinner: {
        fontSize: 22,
        marginRight: 10,
    },

    /* SECURITY BOX */
    securityBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        borderWidth: 1,
        borderColor: "rgba(14, 165, 233, 0.3)",
        borderRadius: 16,
        padding: 16,
        marginTop: 22,
    },
    securityIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    securityTitle: {
        color: "#38BDF8",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 4,
    },
    securityDesc: {
        color: "rgba(56, 189, 248, 0.8)",
        fontSize: 12,
    },

    /* FOOTER */
    footerText: {
        textAlign: "center",
        color: "rgba(110, 231, 183, 0.5)",
        fontSize: 11,
        marginTop: 22,
    },

    /* EXIT MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialogContainer: {
        width: "85%",
        backgroundColor: "#1F2937",
        padding: 26,
        borderRadius: 22,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.3)",
    },
    dialogIcon: { fontSize: 44, marginBottom: 12 },
    dialogTitle: {
        fontSize: 17,
        textAlign: "center",
        marginBottom: 10,
        color: "#FFF",
        fontWeight: "600",
    },
    dialogCountdown: {
        color: "#10B981",
        marginBottom: 22,
        fontSize: 15,
        fontWeight: "600",
    },

    dialogButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    dialogBtnConfirm: {
        flex: 1,
        marginRight: 12,
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

    dialogBtnCancel: {
        flex: 1,
        backgroundColor: "#10B981",
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnCancelText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
});