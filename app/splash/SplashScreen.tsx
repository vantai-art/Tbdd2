import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Component cho từng icon đồ ăn bay
const FloatingFood = ({
    emoji,
    startX,
    startY,
    delay
}: {
    emoji: string;
    startX: number;
    startY: number;
    delay: number;
}) => {
    const translateX = useSharedValue(startX);
    const translateY = useSharedValue(startY);
    const scale = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        scale.value = withDelay(
            delay,
            withSpring(1, {
                damping: 8,
                stiffness: 100,
            })
        );

        opacity.value = withDelay(
            delay,
            withTiming(1, { duration: 400 })
        );

        translateX.value = withDelay(
            delay,
            withSpring(0, {
                damping: 10,
                stiffness: 80,
            })
        );

        translateY.value = withDelay(
            delay,
            withSpring(0, {
                damping: 10,
                stiffness: 80,
            })
        );

        rotate.value = withDelay(
            delay,
            withSequence(
                withTiming(5, { duration: 300 }),
                withTiming(-5, { duration: 300 }),
                withTiming(0, { duration: 300 })
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.Text style={[styles.foodEmoji, animatedStyle]}>
            {emoji}
        </Animated.Text>
    );
};

export default function SplashScreen() {
    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(-180);
    const logoOpacity = useSharedValue(0);

    const textOpacity = useSharedValue(0);
    const textTranslateY = useSharedValue(30);

    const bgScale = useSharedValue(0.8);

    useEffect(() => {
        bgScale.value = withTiming(1.2, {
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
        });

        logoScale.value = withDelay(
            200,
            withSpring(1, {
                damping: 10,
                stiffness: 100,
                mass: 0.8,
            })
        );

        logoRotate.value = withDelay(
            200,
            withSpring(0, {
                damping: 12,
                stiffness: 80,
            })
        );

        logoOpacity.value = withDelay(
            200,
            withTiming(1, { duration: 500 })
        );

        textOpacity.value = withDelay(
            800,
            withTiming(1, { duration: 600 })
        );

        textTranslateY.value = withDelay(
            800,
            withSpring(0, {
                damping: 15,
                stiffness: 100,
            })
        );

        const timer = setTimeout(() => {
            router.replace('/auth/login');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value },
            { rotate: `${logoRotate.value}deg` },
        ],
        opacity: logoOpacity.value,
    }));

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }));

    const bgAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: bgScale.value }],
    }));

    const foodIcons = [
        { emoji: '🍔', startX: -150, startY: -200, delay: 400 },
        { emoji: '🍟', startX: 150, startY: -180, delay: 500 },
        { emoji: '🥤', startX: -140, startY: 180, delay: 600 },
        { emoji: '☕', startX: 140, startY: 200, delay: 700 },
        { emoji: '🍕', startX: -120, startY: -50, delay: 800 },
        { emoji: '🌮', startX: 130, startY: 50, delay: 900 },
        { emoji: '🍩', startX: -100, startY: 100, delay: 1000 },
        { emoji: '🥗', startX: 110, startY: -120, delay: 1100 },
    ];

    return (
        <View style={styles.container}>
            {/* Background gradient effect */}
            <Animated.View style={[styles.bgCircle, bgAnimatedStyle]} />

            {/* Food icons bay vào */}
            {foodIcons.map((food, index) => (
                <FloatingFood
                    key={index}
                    emoji={food.emoji}
                    startX={food.startX}
                    startY={food.startY}
                    delay={food.delay}
                />
            ))}

            {/* Logo chính */}
            <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                <View style={styles.logoCircle}>
                    <View style={styles.storeIcon}>
                        <View style={styles.awning} />
                        <View style={styles.shopFront}>
                            <View style={styles.window} />
                            <View style={styles.door} />
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* Text animation */}
            <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
                <Animated.Text style={styles.title}>
                    Food & Drink
                </Animated.Text>
                <Animated.Text style={styles.subtitle}>
                    Sales
                </Animated.Text>
                <Animated.Text style={styles.slogan}>
                    Quản lý bán hàng thông minh
                </Animated.Text>
            </Animated.View>

            {/* Decorative elements - ĐÃ SỬA */}
            <Animated.Text style={[styles.heart1, textAnimatedStyle]}>
                ❤️
            </Animated.Text>
            <Animated.Text style={[styles.heart2, textAnimatedStyle]}>
                ❤️
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgCircle: {
        position: 'absolute',
        width: isWeb ? 300 : 400, // Web nhỏ hơn
        height: isWeb ? 300 : 400,
        borderRadius: isWeb ? 150 : 200,
        backgroundColor: '#FFE5D0',
        opacity: 0.5,
    },
    logoContainer: {
        marginBottom: isWeb ? 20 : 30, // Web margin nhỏ hơn
    },
    logoCircle: {
        width: isWeb ? 120 : 180, // Web logo nhỏ hơn
        height: isWeb ? 120 : 180,
        borderRadius: isWeb ? 30 : 45,
        backgroundColor: '#FF8C42',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    storeIcon: {
        alignItems: 'center',
        transform: [{ scale: isWeb ? 0.7 : 1 }], // Scale nhỏ hơn trên web
    },
    awning: {
        width: 90,
        height: 20,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#FFD700',
        marginBottom: -3,
    },
    shopFront: {
        width: 80,
        height: 70,
        backgroundColor: '#FFF',
        borderRadius: 10,
        flexDirection: 'row',
        padding: 8,
        gap: 6,
    },
    window: {
        flex: 1,
        backgroundColor: '#87CEEB',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#DDD',
    },
    door: {
        width: 24,
        backgroundColor: '#D2691E',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#DDD',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: isWeb ? 28 : 36, // Web text nhỏ hơn
        fontWeight: '800',
        color: '#2C3E50',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: isWeb ? 24 : 32,
        fontWeight: '700',
        color: '#FF8C42',
        marginTop: -5,
    },
    slogan: {
        fontSize: isWeb ? 14 : 16,
        color: '#7F8C8D',
        marginTop: 10,
        fontWeight: '500',
    },
    foodEmoji: {
        position: 'absolute',
        fontSize: isWeb ? 32 : 48, // Web emoji nhỏ hơn
    },
    heart1: {
        position: 'absolute',
        right: isWeb ? 100 : 60,
        top: '35%',
        fontSize: isWeb ? 18 : 24,
    },
    heart2: {
        position: 'absolute',
        left: isWeb ? 80 : 50,
        top: '40%',
        fontSize: isWeb ? 16 : 20,
    },
});