// @ts-nocheck
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
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
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { AuthAPI } from '../services/api';

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function Register() {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [focusedInput, setFocusedInput] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const [errors, setErrors] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirm: ""
    });

    const usernameInputRef = useRef<TextInput>(null);
    const fullNameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const phoneInputRef = useRef<TextInput>(null);
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

    const validateUsername = (username: string) => {
        if (!username) return "Vui lòng nhập tên đăng nhập";
        if (username.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
        return "";
    };

    const validateFullName = (fullName: string) => {
        if (!fullName) return "Vui lòng nhập họ và tên";
        if (fullName.length < 2) return "Họ tên phải có ít nhất 2 ký tự";
        return "";
    };

    const validateEmail = (email: string) => {
        if (!email) return "Vui lòng nhập email";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Email không hợp lệ";
        return "";
    };

    const validatePhone = (phone: string) => {
        if (!phone) return "Vui lòng nhập số điện thoại";
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ";
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

        // Validate all fields
        const usernameError = validateUsername(username);
        const fullNameError = validateFullName(fullName);
        const emailError = validateEmail(email);
        const phoneError = validatePhone(phone);
        const passwordError = validatePassword(password);
        const confirmError = validateConfirm(confirm, password);

        setErrors({
            username: usernameError,
            fullName: fullNameError,
            email: emailError,
            phone: phoneError,
            password: passwordError,
            confirm: confirmError
        });

        if (usernameError || fullNameError || emailError || phoneError || passwordError || confirmError) {
            return;
        }

        setIsLoading(true);
        logoScale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        try {
            // ✅ GỌI API SIGNUP
            // async signup(username, password, fullName, email, phone)
            await AuthAPI.signup(username, password, fullName, email, phone);

            console.log('✅ Signup success');

            Alert.alert(
                'Đăng ký thành công! 🎉',
                'Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.',
                [
                    {
                        text: 'Đăng nhập ngay',
                        onPress: () => router.replace('/auth/login')
                    }
                ]
            );

        } catch (error: any) {
            console.error('❌ Signup error:', error);

            // Xử lý lỗi
            let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';

            if (error.message) {
                if (error.message.includes('already exists') || error.message.includes('đã tồn tại')) {
                    errorMessage = 'Tên đăng nhập hoặc email đã được sử dụng';
                } else if (error.message.includes('Network')) {
                    errorMessage = 'Không thể kết nối đến server. Kiểm tra kết nối mạng.';
                } else {
                    errorMessage = error.message;
                }
            }

            Alert.alert(
                'Đăng ký thất bại',
                errorMessage,
                [{ text: 'OK' }]
            );

        } finally {
            setIsLoading(false);
        }
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

                    {/* USERNAME */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "username" && styles.inputFocused,
                            errors.username && styles.inputError
                        ]}
                    >
                        <Text style={styles.inputIcon}>👤</Text>
                        <TextInput
                            ref={usernameInputRef}
                            placeholder="Tên đăng nhập"
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                if (errors.username) {
                                    setErrors(prev => ({ ...prev, username: "" }));
                                }
                            }}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setFocusedInput("username")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => fullNameInputRef.current?.focus()}
                            editable={!isLoading}
                        />
                    </View>
                    {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : <View style={{ height: 18 }} />}

                    {/* FULL NAME */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "fullName" && styles.inputFocused,
                            errors.fullName && styles.inputError
                        ]}
                    >
                        <Text style={styles.inputIcon}>✏️</Text>
                        <TextInput
                            ref={fullNameInputRef}
                            placeholder="Họ và tên"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.fullName) {
                                    setErrors(prev => ({ ...prev, fullName: "" }));
                                }
                            }}
                            style={styles.input}
                            autoCorrect={false}
                            onFocus={() => setFocusedInput("fullName")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => emailInputRef.current?.focus()}
                            editable={!isLoading}
                        />
                    </View>
                    {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : <View style={{ height: 18 }} />}

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
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: "" }));
                                }
                            }}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={() => setFocusedInput("email")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => phoneInputRef.current?.focus()}
                            editable={!isLoading}
                        />
                    </View>
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : <View style={{ height: 18 }} />}

                    {/* PHONE */}
                    <View
                        style={[
                            styles.inputContainer,
                            focusedInput === "phone" && styles.inputFocused,
                            errors.phone && styles.inputError
                        ]}
                    >
                        <Text style={styles.inputIcon}>📱</Text>
                        <TextInput
                            ref={phoneInputRef}
                            placeholder="Số điện thoại"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                if (errors.phone) {
                                    setErrors(prev => ({ ...prev, phone: "" }));
                                }
                            }}
                            style={styles.input}
                            keyboardType="phone-pad"
                            onFocus={() => setFocusedInput("phone")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordInputRef.current?.focus()}
                            editable={!isLoading}
                        />
                    </View>
                    {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : <View style={{ height: 18 }} />}

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
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                    setErrors(prev => ({ ...prev, password: "" }));
                                }
                            }}
                            style={styles.input}
                            onFocus={() => setFocusedInput("password")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="next"
                            onSubmitEditing={() => confirmInputRef.current?.focus()}
                            editable={!isLoading}
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
                            onChangeText={(text) => {
                                setConfirm(text);
                                if (errors.confirm) {
                                    setErrors(prev => ({ ...prev, confirm: "" }));
                                }
                            }}
                            style={styles.input}
                            onFocus={() => setFocusedInput("confirm")}
                            onBlur={() => setFocusedInput("")}
                            returnKeyType="done"
                            onSubmitEditing={handleRegister}
                            editable={!isLoading}
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
                        disabled={isLoading}
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