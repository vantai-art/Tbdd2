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

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState({ email: "" });

    const emailInputRef = useRef<TextInput>(null);
    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(-10);

    useEffect(() => {
        logoScale.value = withSpring(1);
        logoRotate.value = withSpring(0);

        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            router.back();
            return true;
        });

        return () => backHandler.remove();
    }, []);

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

    const handleResetPassword = async () => {
        Keyboard.dismiss();

        const emailError = validateEmail(email);
        setErrors({ email: emailError });

        if (emailError) return;

        setIsLoading(true);
        logoScale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        // Simulate API call
        await new Promise(res => setTimeout(res, 1500));

        setIsLoading(false);
        setShowSuccessModal(true);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        setTimeout(() => {
            router.replace("/auth/login");
        }, 300);
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

                {/* BACK BUTTON */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>

                {/* LOGO */}
                <Animated.View entering={FadeInDown.duration(800)} style={[styles.logoSection, logoStyle]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🔐</Text>
                    </View>
                    <Text style={styles.logoText}>Quên mật khẩu</Text>
                    <Text style={styles.logoSubtext}>Đặt lại mật khẩu của bạn</Text>
                </Animated.View>

                {/* FORM */}
                <View style={styles.formCard}>

                    <Text style={styles.welcomeText}>Không vấn đề gì! 🤗</Text>
                    <Text style={styles.subtitle}>
                        Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                    </Text>

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
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="done"
                            onSubmitEditing={handleResetPassword}
                        />
                    </View>
                    {errors.email ? (
                        <Text style={styles.errorText}>{errors.email}</Text>
                    ) : (
                        <View style={{ height: 18 }} />
                    )}

                    {/* INFO BOX */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoIcon}>💡</Text>
                        <Text style={styles.infoText}>
                            Link đặt lại mật khẩu sẽ được gửi đến email của bạn và có hiệu lực trong 15 phút
                        </Text>
                    </View>

                    {/* RESET BUTTON */}
                    <TouchableOpacity
                        style={[styles.resetBtn, isLoading && { opacity: 0.7 }]}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                    >
                        <Text style={styles.resetBtnText}>
                            {isLoading ? "Đang gửi..." : "Gửi link đặt lại"}
                        </Text>
                    </TouchableOpacity>

                    {/* DIVIDER */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* BACK TO LOGIN */}
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.loginBtnText}>
                            Nhớ mật khẩu rồi?
                            <Text style={styles.loginHighlight}> Đăng nhập</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* SUCCESS MODAL */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.dialogContainer}>
                        <View style={styles.successIconContainer}>
                            <Text style={styles.successIcon}>✉️</Text>
                        </View>
                        <Text style={styles.dialogTitle}>
                            Email đã được gửi!
                        </Text>
                        <Text style={styles.dialogMessage}>
                            Vui lòng kiểm tra email <Text style={styles.emailHighlight}>{email}</Text> để đặt lại mật khẩu
                        </Text>

                        <TouchableOpacity
                            style={styles.dialogBtn}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.dialogBtnText}>Đã hiểu</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSuccessClose}>
                            <Text style={styles.resendText}>
                                Không nhận được email? <Text style={styles.resendLink}>Gửi lại</Text>
                            </Text>
                        </TouchableOpacity>
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
        backgroundColor: "#E5D0FF",
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
        backgroundColor: "#D0E5FF",
        bottom: -50,
        right: -50,
        opacity: 0.3,
        pointerEvents: "none",
    },

    /* BACK BUTTON */
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: "#F8F9FA",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    backIcon: {
        fontSize: 24,
        color: "#2C3E50",
    },

    /* LOGO */
    logoSection: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
        pointerEvents: "none",
    },
    logoCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#6C63FF",
        alignItems: "center",
        justifyContent: "center",
    },
    logoEmoji: { fontSize: 55 },
    logoText: { fontSize: 28, fontWeight: "800", color: "#2C3E50", marginTop: 15 },
    logoSubtext: { fontSize: 15, color: "#7F8C8D", marginTop: 5 },

    formCard: {
        backgroundColor: "#FFF",
        borderRadius: 25,
        padding: 25,
        elevation: 3,
        pointerEvents: "auto",
    },

    welcomeText: { fontSize: 26, fontWeight: "700", marginBottom: 5 },
    subtitle: {
        color: "#7F8C8D",
        marginBottom: 25,
        lineHeight: 20,
    },

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
        borderColor: "#6C63FF",
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

    /* INFO BOX */
    infoBox: {
        flexDirection: "row",
        backgroundColor: "#F0F8FF",
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#6C63FF",
    },
    infoIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: "#5A6C7D",
        lineHeight: 18,
    },

    resetBtn: {
        backgroundColor: "#6C63FF",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    resetBtnText: {
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
    loginHighlight: { color: "#6C63FF", fontWeight: "700" },

    /* SUCCESS MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    dialogContainer: {
        width: "85%",
        backgroundColor: "#FFF",
        padding: 30,
        borderRadius: 20,
        alignItems: "center",
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F0F8FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    successIcon: {
        fontSize: 45,
    },
    dialogTitle: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
        color: "#2C3E50",
    },
    dialogMessage: {
        fontSize: 15,
        color: "#7F8C8D",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 25,
    },
    emailHighlight: {
        color: "#6C63FF",
        fontWeight: "600",
    },

    dialogBtn: {
        width: "100%",
        backgroundColor: "#6C63FF",
        height: 55,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    dialogBtnText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },

    resendText: {
        fontSize: 14,
        color: "#7F8C8D",
    },
    resendLink: {
        color: "#6C63FF",
        fontWeight: "600",
    },
});