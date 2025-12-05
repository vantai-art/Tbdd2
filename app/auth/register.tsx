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
    ScrollView,
    Dimensions,
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
    FadeInUp,
    FadeIn,
} from "react-native-reanimated";

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

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
        logoScale.value = withSpring(1, {
            damping: 10,
            stiffness: 100,
        });
        logoRotate.value = withSpring(0, {
            damping: 12,
        });

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                setShowExitDialog(true);
                return true;
            }
        );

        return () => {
            backHandler.remove();
        };
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
            { rotate: `${logoRotate.value}deg` },
        ],
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

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert("Đăng ký thành công!");
            router.replace("/auth/login");
        } catch (error) {
            alert("Đăng ký thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: "" }));
        }
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: "" }));
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: "" }));
        }
        if (confirm && errors.confirm) {
            setErrors(prev => ({ ...prev, confirm: "" }));
        }
    };

    const handleConfirmChange = (text: string) => {
        setConfirm(text);
        if (errors.confirm) {
            setErrors(prev => ({ ...prev, confirm: "" }));
        }
    };

    const handleExitApp = () => {
        setShowExitDialog(false);
        setTimeout(() => {
            BackHandler.exitApp();
        }, 100);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <View style={styles.bgCircle1} />
                <View style={styles.bgCircle2} />
                <View style={styles.bgCircle3} />

                <Animated.View
                    entering={FadeInDown.duration(800).springify()}
                    style={[styles.logoSection, logoStyle]}
                >
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🍽️</Text>
                    </View>
                    <Text style={styles.logoText}>Tạo tài khoản mới</Text>
                    <Text style={styles.logoSubtext}>Bắt đầu quản lý bán hàng</Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(800).springify()}
                    style={styles.formCard}
                >
                    <Text style={styles.welcomeText}>Xin chào! 🎉</Text>
                    <Text style={styles.subtitle}>Điền thông tin để đăng ký</Text>

                    {/* Name Input */}
                    <Animated.View entering={FadeInUp.delay(400).duration(600)}>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === 'name' && styles.inputFocused,
                                errors.name && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>👤</Text>
                            <TextInput
                                ref={nameInputRef}
                                style={styles.input}
                                placeholder="Họ và tên"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={handleNameChange}
                                onFocus={() => setFocusedInput('name')}
                                onBlur={() => setFocusedInput('')}
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => emailInputRef.current?.focus()}
                            />
                            {name && !errors.name && focusedInput !== 'name' && (
                                <Text style={styles.successIcon}>✓</Text>
                            )}
                        </View>
                        <View style={styles.errorContainer}>
                            {errors.name ? (
                                <Text style={styles.errorText}>{errors.name}</Text>
                            ) : null}
                        </View>
                    </Animated.View>

                    {/* Email Input */}
                    <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === 'email' && styles.inputFocused,
                                errors.email && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>📧</Text>
                            <TextInput
                                ref={emailInputRef}
                                style={styles.input}
                                placeholder="Email của bạn"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={handleEmailChange}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput('')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="next"
                                onSubmitEditing={() => passwordInputRef.current?.focus()}
                            />
                            {email && !errors.email && focusedInput !== 'email' && (
                                <Text style={styles.successIcon}>✓</Text>
                            )}
                        </View>
                        <View style={styles.errorContainer}>
                            {errors.email ? (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            ) : null}
                        </View>
                    </Animated.View>

                    {/* Password Input */}
                    <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === 'password' && styles.inputFocused,
                                errors.password && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>🔒</Text>
                            <TextInput
                                ref={passwordInputRef}
                                style={styles.input}
                                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={handlePasswordChange}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput('')}
                                returnKeyType="next"
                                onSubmitEditing={() => confirmInputRef.current?.focus()}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.errorContainer}>
                            {errors.password ? (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            ) : null}
                        </View>
                    </Animated.View>

                    {/* Confirm Password Input */}
                    <Animated.View entering={FadeInUp.delay(700).duration(600)}>
                        <View
                            style={[
                                styles.inputContainer,
                                focusedInput === 'confirm' && styles.inputFocused,
                                errors.confirm && styles.inputError
                            ]}
                        >
                            <Text style={styles.inputIcon}>✅</Text>
                            <TextInput
                                ref={confirmInputRef}
                                style={styles.input}
                                placeholder="Nhập lại mật khẩu"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirm}
                                value={confirm}
                                onChangeText={handleConfirmChange}
                                onFocus={() => setFocusedInput('confirm')}
                                onBlur={() => setFocusedInput('')}
                                returnKeyType="done"
                                onSubmitEditing={handleRegister}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirm(!showConfirm)}
                                style={styles.eyeButton}
                            >
                                <Text style={styles.eyeIcon}>
                                    {showConfirm ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.errorContainer}>
                            {errors.confirm ? (
                                <Text style={styles.errorText}>{errors.confirm}</Text>
                            ) : null}
                        </View>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                        <Text style={styles.termsText}>
                            Bằng việc đăng ký, bạn đồng ý với{' '}
                            <Text style={styles.termsLink}>Điều khoản</Text>
                            {' '}và{' '}
                            <Text style={styles.termsLink}>Chính sách</Text>
                            {' '}của chúng tôi
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(900).duration(600)}>
                        <TouchableOpacity
                            style={[styles.registerBtn, isLoading && styles.btnDisabled]}
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.registerBtnText}>
                                {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
                            </Text>
                            {!isLoading && <Text style={styles.btnIcon}>✨</Text>}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(1000).duration(600)}
                        style={styles.divider}
                    >
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(1100).duration(600)}>
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => router.push("/auth/login")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginBtnText}>
                                Đã có tài khoản?
                                <Text style={styles.loginHighlight}> Đăng nhập</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                <Animated.Text
                    entering={FadeIn.delay(1200).duration(800)}
                    style={styles.floatingIcon1}
                >
                    🍔
                </Animated.Text>
                <Animated.Text
                    entering={FadeIn.delay(1300).duration(800)}
                    style={styles.floatingIcon2}
                >
                    🧁
                </Animated.Text>
                <Animated.Text
                    entering={FadeIn.delay(1400).duration(800)}
                    style={styles.floatingIcon3}
                >
                    🍩
                </Animated.Text>
                <Animated.Text
                    entering={FadeIn.delay(1500).duration(800)}
                    style={styles.floatingIcon4}
                >
                    🥤
                </Animated.Text>
            </ScrollView>

            <Modal
                transparent={true}
                visible={showExitDialog}
                animationType="fade"
                onRequestClose={() => setShowExitDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        entering={FadeInDown.duration(300).springify()}
                        style={styles.dialogContainer}
                    >
                        <View style={styles.dialogIcon}>
                            <Text style={styles.dialogIconText}>📝</Text>
                        </View>

                        <Text style={styles.dialogTitle}>
                            Thật sự muốn đi sao? Còn rất nhiều đồ ăn và nước uống đang chờ bạn thưởng thức, nhớ quay lại sớm nhé!
                        </Text>

                        <Text style={styles.dialogCountdown}>
                            ({countdown}s sau tự động tắt)
                        </Text>

                        <View style={styles.dialogButtons}>
                            <TouchableOpacity
                                style={styles.dialogBtnConfirm}
                                onPress={handleExitApp}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dialogBtnConfirmText}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnCancel}
                                onPress={() => setShowExitDialog(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.dialogBtnCancelText}>Suy nghĩ đã</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    scrollContent: {
        flexGrow: 1,
        padding: isWeb ? 40 : 20,
        paddingTop: isWeb ? 60 : 50,
        maxWidth: isWeb ? 500 : '100%',
        width: '100%',
        alignSelf: 'center',
    },
    bgCircle1: {
        position: 'absolute',
        width: isWeb ? 180 : 250,
        height: isWeb ? 180 : 250,
        borderRadius: isWeb ? 90 : 125,
        backgroundColor: '#D0FFE5',
        top: isWeb ? -60 : -80,
        right: isWeb ? -60 : -80,
        opacity: 0.3,
    },
    bgCircle2: {
        position: 'absolute',
        width: isWeb ? 150 : 200,
        height: isWeb ? 150 : 200,
        borderRadius: isWeb ? 75 : 100,
        backgroundColor: '#FFE5D0',
        top: isWeb ? 150 : 200,
        left: isWeb ? -50 : -70,
        opacity: 0.3,
    },
    bgCircle3: {
        position: 'absolute',
        width: isWeb ? 130 : 180,
        height: isWeb ? 130 : 180,
        borderRadius: isWeb ? 65 : 90,
        backgroundColor: '#E5D0FF',
        bottom: isWeb ? 40 : 50,
        right: isWeb ? -40 : -60,
        opacity: 0.3,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: isWeb ? 25 : 30,
    },
    logoCircle: {
        width: isWeb ? 80 : 100,
        height: isWeb ? 80 : 100,
        borderRadius: isWeb ? 40 : 50,
        backgroundColor: '#28A745',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isWeb ? 12 : 15,
        ...Platform.select({
            ios: {
                shadowColor: '#28A745',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    logoEmoji: {
        fontSize: isWeb ? 40 : 50,
    },
    logoText: {
        fontSize: isWeb ? 22 : 26,
        fontWeight: '800',
        color: '#2C3E50',
    },
    logoSubtext: {
        fontSize: isWeb ? 13 : 14,
        color: '#7F8C8D',
        marginTop: 5,
    },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: isWeb ? 25 : 30,
        padding: isWeb ? 30 : 25,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    welcomeText: {
        fontSize: isWeb ? 22 : 26,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: isWeb ? 14 : 15,
        color: '#7F8C8D',
        marginBottom: isWeb ? 20 : 25,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: isWeb ? 12 : 15,
        paddingHorizontal: 15,
        marginBottom: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    inputFocused: {
        borderColor: '#28A745',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#28A745',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    inputIcon: {
        fontSize: isWeb ? 18 : 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: isWeb ? 50 : 55,
        color: '#2C3E50',
        fontSize: isWeb ? 14 : 15,
        fontWeight: '500',
    },
    eyeButton: {
        padding: 5,
    },
    eyeIcon: {
        fontSize: 20,
    },
    successIcon: {
        color: '#28A745',
        fontSize: 20,
        fontWeight: 'bold',
    },
    errorContainer: {
        height: 28,
        justifyContent: 'center',
        marginBottom: 4,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: isWeb ? 12 : 13,
        marginLeft: 15,
        fontWeight: '500',
    },
    termsText: {
        fontSize: isWeb ? 11 : 12,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: isWeb ? 18 : 20,
        lineHeight: isWeb ? 16 : 18,
    },
    termsLink: {
        color: '#28A745',
        fontWeight: '600',
    },
    registerBtn: {
        backgroundColor: '#28A745',
        borderRadius: isWeb ? 12 : 15,
        height: isWeb ? 50 : 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#28A745',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    btnDisabled: {
        opacity: 0.6,
    },
    registerBtnText: {
        color: '#FFF',
        fontSize: isWeb ? 16 : 17,
        fontWeight: '700',
        marginRight: 5,
    },
    btnIcon: {
        fontSize: isWeb ? 18 : 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: isWeb ? 20 : 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#7F8C8D',
        fontSize: isWeb ? 13 : 14,
    },
    loginBtn: {
        backgroundColor: '#F8F9FA',
        borderRadius: isWeb ? 12 : 15,
        height: isWeb ? 50 : 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    loginBtnText: {
        color: '#7F8C8D',
        fontSize: isWeb ? 14 : 15,
        fontWeight: '600',
    },
    loginHighlight: {
        color: '#28A745',
        fontWeight: '700',
    },
    floatingIcon1: {
        position: 'absolute',
        fontSize: isWeb ? 28 : 35,
        top: isWeb ? 60 : 80,
        left: isWeb ? 25 : 15,
        opacity: 0.2,
    },
    floatingIcon2: {
        position: 'absolute',
        fontSize: isWeb ? 22 : 28,
        top: isWeb ? 120 : 150,
        right: isWeb ? 30 : 20,
        opacity: 0.2,
    },
    floatingIcon3: {
        position: 'absolute',
        fontSize: isWeb ? 26 : 32,
        bottom: isWeb ? 160 : 200,
        left: isWeb ? 30 : 20,
        opacity: 0.2,
    },
    floatingIcon4: {
        position: 'absolute',
        fontSize: isWeb ? 24 : 30,
        bottom: isWeb ? 100 : 120,
        right: isWeb ? 25 : 15,
        opacity: 0.2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialogContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    dialogIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    dialogIconText: {
        fontSize: 30,
    },
    dialogTitle: {
        fontSize: 16,
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
    },
    dialogCountdown: {
        fontSize: 14,
        color: '#28A745',
        marginBottom: 20,
        fontWeight: '600',
    },
    dialogButtons: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    dialogBtnCancel: {
        flex: 1,
        height: 50,
        backgroundColor: '#00B4D8',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#00B4D8',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    dialogBtnCancelText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dialogBtnConfirm: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFD93D',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FFD93D',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    dialogBtnConfirmText: {
        color: '#2C3E50',
        fontSize: 16,
        fontWeight: '700',
    },
});