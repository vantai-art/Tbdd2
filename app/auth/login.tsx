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
    FadeInDown,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(-10);

    useEffect(() => {
        logoScale.value = withSpring(1);
        logoRotate.value = withSpring(0);

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
            { rotate: `${logoRotate.value}deg` }
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
        router.replace("/(tabs)/home");
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

                {/* BG CIRCLES */}
                <View style={styles.bgCircle1} />
                <View style={styles.bgCircle2} />

                {/* LOGO */}
                <Animated.View entering={FadeInDown.duration(800)} style={[styles.logoSection, logoStyle]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🍔</Text>
                    </View>
                    <Text style={styles.logoText}>Food & Drink</Text>
                    <Text style={styles.logoSubtext}>Quản lý bán hàng</Text>
                </Animated.View>

                {/* FORM */}
                <View style={styles.formCard}>

                    <Text style={styles.welcomeText}>Chào mừng trở lại! 👋</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

                    {/* EMAIL */}
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
                            placeholder="Email"
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
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : <View style={{ height: 18 }} />}

                    {/* PASSWORD */}
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
                            placeholder="Mật khẩu"
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
                            <Text style={{ fontSize: 20 }}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : <View style={{ height: 18 }} />}

                    {/* FORGOT PASSWORD */}
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* LOGIN BUTTON */}
                    <TouchableOpacity
                        style={[styles.loginBtn, isLoading && { opacity: 0.7 }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginBtnText}>
                            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                        </Text>
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* REGISTER */}
                    <TouchableOpacity
                        style={styles.registerBtn}
                        onPress={() => router.push("/auth/register")}
                    >
                        <Text style={styles.registerBtnText}>
                            Chưa có tài khoản?
                            <Text style={styles.registerHighlight}> Đăng ký ngay</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* EXIT MODAL */}
            <Modal visible={showExitDialog} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogIcon}>📝</Text>
                        <Text style={styles.dialogTitle}>
                            Bạn có chắc muốn thoát không?
                        </Text>
                        <Text style={styles.dialogCountdown}>({countdown}s)</Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity style={styles.dialogBtnConfirm} onPress={handleExitApp}>
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
        backgroundColor: "#FFF",
        justifyContent: "flex-start"
    },

    bgCircle1: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "#FFE5D0",
        top: -80,
        left: -80,
        opacity: 0.3,
        pointerEvents: "none",
    },
    bgCircle2: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#FFD0D0",
        bottom: -50,
        right: -50,
        opacity: 0.3,
        pointerEvents: "none",
    },

    /* LOGO */
    logoSection: {
        alignItems: "center",
        marginTop: 40,
        marginBottom: 30,
        pointerEvents: "none",
    },
    logoCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#FF8C42",
        alignItems: "center",
        justifyContent: "center",
    },
    logoEmoji: { fontSize: 55 },
    logoText: { fontSize: 28, fontWeight: "800", color: "#2C3E50" },
    logoSubtext: { fontSize: 15, color: "#7F8C8D", marginTop: 5 },

    formCard: {
        backgroundColor: "#FFF",
        borderRadius: 25,
        padding: 25,
        elevation: 3,
        pointerEvents: "auto",
    },

    welcomeText: { fontSize: 26, fontWeight: "700", marginBottom: 5 },
    subtitle: { color: "#7F8C8D", marginBottom: 20 },

    /* INPUT */
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        borderWidth: 2,
        borderColor: "transparent",
    },
    inputFocused: {
        borderColor: "#FF8C42",
        backgroundColor: "#FFF",
    },
    inputError: {
        borderColor: "#FF3B30",
        backgroundColor: "#FFF5F5",
    },
    inputIcon: { fontSize: 20, marginRight: 10 },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#2C3E50",
    },
    errorText: {
        fontSize: 13,
        color: "#FF3B30",
        marginTop: 5,
        marginLeft: 10,
    },

    forgotText: {
        textAlign: "right",
        marginTop: 8,
        fontWeight: "600",
        color: "#FF8C42",
    },

    loginBtn: {
        backgroundColor: "#FF8C42",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    loginBtnText: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "700",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 25,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
    dividerText: { marginHorizontal: 10, color: "#7F8C8D" },

    registerBtn: {
        backgroundColor: "#F8F9FA",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#E0E0E0",
    },
    registerBtnText: { color: "#7F8C8D" },
    registerHighlight: { color: "#FF8C42", fontWeight: "700" },

    /* EXIT MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialogContainer: {
        width: "85%",
        backgroundColor: "#FFF",
        padding: 25,
        borderRadius: 20,
        alignItems: "center",
    },
    dialogIcon: { fontSize: 40, marginBottom: 10 },
    dialogTitle: { fontSize: 16, textAlign: "center", marginBottom: 10 },
    dialogCountdown: { color: "#FF8C42", marginBottom: 20 },

    dialogButtons: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
    },
    dialogBtnConfirm: {
        flex: 1,
        marginRight: 10,
        backgroundColor: "#FFD93D",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnConfirmText: { fontWeight: "700" },

    dialogBtnCancel: {
        flex: 1,
        backgroundColor: "#00B4D8",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dialogBtnCancelText: { color: "#FFF", fontWeight: "700" },
});