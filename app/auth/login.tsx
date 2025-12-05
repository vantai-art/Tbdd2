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

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (emailError || passwordError) return;

        setIsLoading(true);
        logoScale.value = withSequence(
            withTiming(1.1, { duration: 100 }),
            withTiming(1, { duration: 100 })
        );

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.replace("/(tabs)/home");
        } catch (error) {
        } finally {
            setIsLoading(false);
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

                <Animated.View
                    entering={FadeInDown.duration(800).springify()}
                    style={[styles.logoSection, logoStyle]}
                >
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🍔</Text>
                    </View>
                    <Text style={styles.logoText}>Food & Drink</Text>
                    <Text style={styles.logoSubtext}>Quản lý bán hàng</Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200).duration(800).springify()}
                    style={styles.formCard}
                >
                    <Text style={styles.welcomeText}>Chào mừng trở lại! 👋</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

                    {/* Email Input */}
                    <Animated.View entering={FadeInUp.delay(400).duration(600)}>
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
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
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
                    <Animated.View entering={FadeInUp.delay(500).duration(600)}>
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
                                placeholder="Mật khẩu"
                                placeholderTextColor="#999"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={handlePasswordChange}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput('')}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
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

                    <Animated.View entering={FadeInUp.delay(600).duration(600)}>
                        <TouchableOpacity>
                            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(700).duration(600)}>
                        <TouchableOpacity
                            style={[styles.loginBtn, isLoading && styles.btnDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginBtnText}>
                                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                            </Text>
                            {!isLoading && <Text style={styles.btnIcon}>→</Text>}
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInUp.delay(800).duration(600)}
                        style={styles.divider}
                    >
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(900).duration(600)}>
                        <TouchableOpacity
                            style={styles.registerBtn}
                            onPress={() => router.push("/auth/register")}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.registerBtnText}>
                                Chưa có tài khoản?
                                <Text style={styles.registerHighlight}> Đăng ký ngay</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>

                <Animated.Text
                    entering={FadeIn.delay(1000).duration(800)}
                    style={styles.floatingIcon1}
                >
                    🍕
                </Animated.Text>
                <Animated.Text
                    entering={FadeIn.delay(1100).duration(800)}
                    style={styles.floatingIcon2}
                >
                    🥤
                </Animated.Text>
                <Animated.Text
                    entering={FadeIn.delay(1200).duration(800)}
                    style={styles.floatingIcon3}
                >
                    ☕
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
        paddingTop: isWeb ? 80 : 60,
        maxWidth: isWeb ? 500 : '100%',
        width: '100%',
        alignSelf: 'center',
    },
    bgCircle1: {
        position: 'absolute',
        width: isWeb ? 200 : 300,
        height: isWeb ? 200 : 300,
        borderRadius: isWeb ? 100 : 150,
        backgroundColor: '#FFE5D0',
        top: isWeb ? -50 : -100,
        left: isWeb ? -50 : -100,
        opacity: 0.3,
    },
    bgCircle2: {
        position: 'absolute',
        width: isWeb ? 150 : 200,
        height: isWeb ? 150 : 200,
        borderRadius: isWeb ? 75 : 100,
        backgroundColor: '#FFD0D0',
        bottom: isWeb ? -30 : -50,
        right: isWeb ? -30 : -50,
        opacity: 0.3,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: isWeb ? 30 : 40,
    },
    logoCircle: {
        width: isWeb ? 80 : 100,
        height: isWeb ? 80 : 100,
        borderRadius: isWeb ? 40 : 50,
        backgroundColor: '#FF8C42',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isWeb ? 12 : 15,
        ...Platform.select({
            ios: {
                shadowColor: '#FF8C42',
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
        fontSize: isWeb ? 24 : 28,
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
        marginBottom: isWeb ? 25 : 30,
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
        borderColor: '#FF8C42',
        backgroundColor: '#FFF',
        ...Platform.select({
            ios: {
                shadowColor: '#FF8C42',
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
        marginBottom: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: isWeb ? 12 : 13,
        marginLeft: 15,
        fontWeight: '500',
    },
    forgotText: {
        textAlign: 'right',
        color: '#FF8C42',
        fontSize: isWeb ? 13 : 14,
        fontWeight: '600',
        marginBottom: isWeb ? 20 : 25,
    },
    loginBtn: {
        backgroundColor: '#FF8C42',
        borderRadius: isWeb ? 12 : 15,
        height: isWeb ? 50 : 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FF8C42',
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
    loginBtnText: {
        color: '#FFF',
        fontSize: isWeb ? 16 : 17,
        fontWeight: '700',
        marginRight: 5,
    },
    btnIcon: {
        color: '#FFF',
        fontSize: isWeb ? 18 : 20,
        fontWeight: '700',
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
    registerBtn: {
        backgroundColor: '#F8F9FA',
        borderRadius: isWeb ? 12 : 15,
        height: isWeb ? 50 : 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    registerBtnText: {
        color: '#7F8C8D',
        fontSize: isWeb ? 14 : 15,
        fontWeight: '600',
    },
    registerHighlight: {
        color: '#FF8C42',
        fontWeight: '700',
    },
    floatingIcon1: {
        position: 'absolute',
        fontSize: isWeb ? 24 : 30,
        top: isWeb ? 100 : 120,
        right: isWeb ? 40 : 20,
        opacity: 0.3,
    },
    floatingIcon2: {
        position: 'absolute',
        fontSize: isWeb ? 20 : 25,
        top: isWeb ? 200 : 250,
        left: isWeb ? 20 : 10,
        opacity: 0.3,
    },
    floatingIcon3: {
        position: 'absolute',
        fontSize: isWeb ? 22 : 28,
        bottom: isWeb ? 80 : 100,
        right: isWeb ? 50 : 30,
        opacity: 0.3,
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
        backgroundColor: '#FFF5E6',
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
        color: '#FF8C42',
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