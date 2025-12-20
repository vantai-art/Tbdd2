// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Dimensions,
    BackHandler,
    Modal,
} from "react-native";
import { router } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    withRepeat,
    FadeInDown,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    // Animations
    const logoScale = useSharedValue(0);
    const logoFloat = useSharedValue(0);

    useEffect(() => {
        logoScale.value = withSpring(1);
        logoFloat.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 1500 }),
                withTiming(0, { duration: 1500 })
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
            { translateY: logoFloat.value }
        ]
    }));

    const validateEmail = (email: string) => {
        if (!email) return "Vui lòng nhập email";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email không hợp lệ";
        return "";
    };

    const validatePassword = (password: string) => {
        if (!password) return "Vui lòng nhập mật khẩu";
        if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
        return "";
    };

    const handleLogin = async () => {
        Keyboard.dismiss();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({ email: emailError, password: passwordError });

        if (emailError || passwordError) return;

        setIsLoading(true);
        logoScale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        await new Promise(res => setTimeout(res, 1500));

        setIsLoading(false);
        // Navigate to admin dashboard
        router.replace("/admin/dashboard");
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
                        <Text style={styles.logoIcon}>🔐</Text>
                    </View>
                    <Text style={styles.logoText}>Admin Portal</Text>
                    <Text style={styles.logoSubtext}>Secure access to your dashboard</Text>
                </Animated.View>

                {/* FORM CARD */}
                <View style={styles.formCard}>

                    <Text style={styles.welcomeText}>Welcome back! 👋</Text>
                    <Text style={styles.subtitle}>Enter your credentials to continue</Text>

                    {/* EMAIL INPUT */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === "email" && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>📧</Text>
                            <TextInput
                                ref={emailInputRef}
                                placeholder="admin@example.com"
                                placeholderTextColor="rgba(168, 85, 247, 0.4)"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setFocusedInput("email")}
                                onBlur={() => setFocusedInput("")}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInputRef.current?.focus()}
                            />
                        </View>
                        {errors.email ? (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        ) : (
                            <View style={{ height: 18 }} />
                        )}
                    </View>

                    {/* PASSWORD INPUT */}
                    <View>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === "password" && styles.inputFocused,
                                errors.password && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>🔒</Text>
                            <TextInput
                                ref={passwordInputRef}
                                placeholder="••••••••"
                                placeholderTextColor="rgba(168, 85, 247, 0.4)"
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
                            <Text style={styles.rememberText}>Remember me</Text>
                        </TouchableOpacity>
                    </View>

                    {/* HELP TEXT */}
                    <Text style={styles.helpText}>
                        Quên mật khẩu? Liên hệ Super Admin để được hỗ trợ
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
                                <Text style={styles.loginBtnText}>Signing in...</Text>
                            </View>
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* SECURITY INFO */}
                    <View style={styles.securityBox}>
                        <Text style={styles.securityIcon}>🛡️</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.securityTitle}>Secure Connection</Text>
                            <Text style={styles.securityDesc}>
                                Your data is encrypted and protected
                            </Text>
                        </View>
                    </View>

                </View>

                {/* FOOTER */}
                <Text style={styles.footerText}>
                    © 2024 Food & Drink. Admin access only.
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
        backgroundColor: "#0F172A", // Dark slate
        justifyContent: "flex-start"
    },

    /* ANIMATED BACKGROUND */
    bgCircle1: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "#A855F7", // Purple
        top: -100,
        left: -80,
        opacity: 0.15,
        pointerEvents: "none",
    },
    bgCircle2: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: "#06B6D4", // Cyan
        top: 100,
        right: -100,
        opacity: 0.15,
        pointerEvents: "none",
    },
    bgCircle3: {
        position: "absolute",
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: "#EC4899", // Pink
        bottom: -50,
        left: -60,
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
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        borderWidth: 2,
        borderColor: "rgba(168, 85, 247, 0.3)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    logoIcon: { fontSize: 40 },
    logoText: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFF",
        marginTop: 15,
        letterSpacing: -1,
    },
    logoSubtext: {
        fontSize: 14,
        color: "#C084FC",
        marginTop: 5,
    },

    /* FORM CARD */
    formCard: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 25,
        padding: 25,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        pointerEvents: "auto",
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFF",
        marginBottom: 5,
    },
    subtitle: {
        color: "#C084FC",
        fontSize: 14,
    },

    /* INPUT */
    inputLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#C084FC",
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.15)",
    },
    inputFocused: {
        borderColor: "#A855F7",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        transform: [{ scale: 1.02 }],
    },
    inputError: {
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    inputIcon: { fontSize: 20, marginRight: 12 },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#FFF",
    },
    errorText: {
        fontSize: 13,
        color: "#EF4444",
        marginTop: 5,
        marginLeft: 10,
    },

    /* REMEMBER & HELP */
    rememberRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 12,
    },
    rememberBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxChecked: {
        backgroundColor: "#A855F7",
        borderColor: "#A855F7",
    },
    checkmark: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
    },
    rememberText: {
        color: "#C084FC",
        fontSize: 13,
    },
    helpText: {
        color: "rgba(192, 132, 252, 0.6)",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
        fontStyle: "italic",
    },

    /* LOGIN BUTTON */
    loginBtn: {
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#A855F7",
        shadowColor: "#A855F7",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
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
        fontSize: 20,
        marginRight: 10,
    },

    /* SECURITY BOX */
    securityBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(6, 182, 212, 0.3)",
        borderRadius: 15,
        padding: 15,
        marginTop: 20,
    },
    securityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    securityTitle: {
        color: "#22D3EE",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 3,
    },
    securityDesc: {
        color: "rgba(34, 211, 238, 0.7)",
        fontSize: 11,
    },

    /* FOOTER */
    footerText: {
        textAlign: "center",
        color: "rgba(192, 132, 252, 0.5)",
        fontSize: 11,
        marginTop: 20,
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
        backgroundColor: "#1E293B",
        padding: 25,
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.3)",
    },
    dialogIcon: { fontSize: 40, marginBottom: 10 },
    dialogTitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
        color: "#FFF",
    },
    dialogCountdown: { color: "#A855F7", marginBottom: 20 },

    dialogButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    dialogBtnConfirm: {
        flex: 1,
        marginRight: 10,
        backgroundColor: "#EF4444",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnConfirmText: { color: "#FFF", fontWeight: "700" },

    dialogBtnCancel: {
        flex: 1,
        backgroundColor: "#06B6D4",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnCancelText: { color: "#FFF", fontWeight: "700" },
});