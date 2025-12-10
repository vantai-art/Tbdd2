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

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirm: ""
    });

    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const confirmInputRef = useRef<TextInput>(null);

    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(10);

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

    const validateName = (name: string) => {
        if (!name) return "Vui lòng nhập họ và tên";
        if (name.length < 2) return "Tên phải có ít nhất 2 ký tự";
        return "";
    };

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

    const validateConfirm = (confirm: string, password: string) => {
        if (!confirm) return "Vui lòng nhập lại mật khẩu";
        if (confirm !== password) return "Mật khẩu không trùng khớp";
        return "";
    };

    const handleRegister = async () => {
        Keyboard.dismiss();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmError = validateConfirm(confirm, password);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            confirm: confirmError
        });

        if (nameError || emailError || passwordError || confirmError) return;

        setIsLoading(true);
        logoScale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        await new Promise(res => setTimeout(res, 1500));

        setIsLoading(false);
        alert("Đăng ký thành công!");
        router.replace("/auth/login");
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
                <View style={styles.bgCircle3} />

                {/* LOGO */}
                <Animated.View entering={FadeInDown.duration(800)} style={[styles.logoSection, logoStyle]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🍽️</Text>
                    </View>
                    <Text style={styles.logoText}>Tạo tài khoản mới</Text>
                    <Text style={styles.logoSubtext}>Bắt đầu quản lý bán hàng</Text>
                </Animated.View>

                {/* FORM */}
                <View style={styles.formCard}>

                    <Text style={styles.welcomeText}>Xin chào! 🎉</Text>
                    <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>

                    {/* NAME */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "name" && styles.inputFocused,
                            errors.name && styles.inputError
                        ]}
                    >
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput
                            ref={nameInputRef}
                            placeholder="Họ và tên"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            autoCorrect={false}
                            onFocus={() => setFocusedInput("name")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => emailInputRef.current?.focus()}
                        />
                    </View>
                    {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : <View style={{ height: 18 }} />}

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
                            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                            value={password}
                            secureTextEntry={!showPassword}
                            onChangeText={setPassword}
                            style={styles.input}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmInputRef.current?.focus()}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Text style={{ fontSize: 20 }}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : <View style={{ height: 18 }} />}

                    {/* CONFIRM PASSWORD */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "confirm" && styles.inputFocused,
                            errors.confirm && styles.inputError
                        ]}
                    >
                        <Text style={styles.inputIcon}>✅</Text>
                        <TextInput
                            ref={confirmInputRef}
                            placeholder="Nhập lại mật khẩu"
                            value={confirm}
                            secureTextEntry={!showConfirm}
                            onChangeText={setConfirm}
                            style={styles.input}
                            onFocus={() => setFocusedInput("confirm")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="done"
                            onSubmitEditing={handleRegister}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <Text style={{ fontSize: 20 }}>{showConfirm ? "👁️" : "👁️‍🗨️"}</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.confirm ? <Text style={styles.errorText}>{errors.confirm}</Text> : <View style={{ height: 18 }} />}

                    {/* TERMS */}
                    <Text style={styles.termsText}>
                        Bằng việc đăng ký, bạn đồng ý với{' '}
                        <Text style={styles.termsLink}>Điều khoản</Text>
                        {' '}và{' '}
                        <Text style={styles.termsLink}>Chính sách</Text>
                        {' '}của chúng tôi
                    </Text>

                    {/* REGISTER BUTTON */}
                    <TouchableOpacity
                        style={[styles.registerBtn, isLoading && { opacity: 0.7 }]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.registerBtnText}>
                            {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
                        </Text>
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* LOGIN LINK */}
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.push("/auth/login")}
                    >
                        <Text style={styles.loginBtnText}>
                            Đã có tài khoản?
                            <Text style={styles.loginHighlight}> Đăng nhập</Text>
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
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: "#D0FFE5",
        top: -80,
        right: -80,
        opacity: 0.3,
        pointerEvents: "none",
    },
    bgCircle2: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#FFE5D0",
        top: 200,
        left: -70,
        opacity: 0.3,
        pointerEvents: "none",
    },
    bgCircle3: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#E5D0FF",
        bottom: 50,
        right: -60,
        opacity: 0.3,
        pointerEvents: "none",
    },

    /* LOGO */
    logoSection: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 25,
        pointerEvents: "none",
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#28A745",
        alignItems: "center",
        justifyContent: "center",
    },
    logoEmoji: { fontSize: 50 },
    logoText: { fontSize: 26, fontWeight: "800", color: "#2C3E50" },
    logoSubtext: { fontSize: 14, color: "#7F8C8D", marginTop: 5 },

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
        borderColor: "#28A745",
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

    termsText: {
        fontSize: 12,
        color: "#7F8C8D",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 18,
    },
    termsLink: {
        color: "#28A745",
        fontWeight: "600",
    },

    registerBtn: {
        backgroundColor: "#28A745",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    registerBtnText: {
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

    loginBtn: {
        backgroundColor: "#F8F9FA",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#E0E0E0",
    },
    loginBtnText: { color: "#7F8C8D" },
    loginHighlight: { color: "#28A745", fontWeight: "700" },

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
    dialogCountdown: { color: "#28A745", marginBottom: 20 },

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