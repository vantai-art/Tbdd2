import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform, useColorScheme, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

// Type definitions
interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  backgroundColor: string;
  activeDotColor: string;
  showBadge?: boolean;
}

// Component icon với animation
function AnimatedTabIcon({
  name,
  color,
  focused,
  backgroundColor,
  activeDotColor,
  showBadge = false
}: AnimatedTabIconProps) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Animation scale và bounce
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(bounceAnim, {
            toValue: 0,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        // Hiệu ứng ánh sáng lấp lánh
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [focused, scaleAnim, glowAnim, bounceAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.iconContainer,
        focused && { backgroundColor },
        {
          transform: [
            { scale: scaleAnim },
            { translateY: bounceAnim }
          ],
        },
      ]}
    >
      {/* Hiệu ứng ánh sáng phía sau */}
      {focused && (
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: activeDotColor,
              opacity: glowOpacity,
            },
          ]}
        />
      )}

      <Ionicons
        name={name}
        size={28}
        color={color}
      />

      {/* Badge cho giỏ hàng */}
      {showBadge && (
        <View style={styles.cartBadge}>
          <Ionicons name="ellipse" size={20} color="#FF3B30" />
        </View>
      )}

      {/* Dot indicator */}
      {focused && (
        <Animated.View
          style={[
            styles.activeDot,
            {
              backgroundColor: activeDotColor,
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.6],
              }),
            }
          ]}
        />
      )}
    </Animated.View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopWidth: isDark ? 0 : 1,
          borderTopColor: '#E5E5E5',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          color: isDark ? '#FFFFFF' : '#000000',
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          borderRadius: isDark ? 25 : 15,
          marginHorizontal: isDark ? 5 : 2,
        },
      }}
    >
      {/* Ẩn index */}
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />

      {/* Tab 1: Trang chủ */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#FF6B6B",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "home" : "home-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#FFF0F0'}
              activeDotColor={isDark ? '#5EC8F2' : '#FF6B6B'}
            />
          ),
        }}
      />

      {/* Tab 2: Đơn hàng */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Đơn hàng",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#4ECDC4",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "receipt" : "receipt-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#E8F8F7'}
              activeDotColor={isDark ? '#5EC8F2' : '#4ECDC4'}
            />
          ),
        }}
      />

      {/* Tab 3: Giỏ hàng */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#95E1D3",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "cart" : "cart-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#F0FBF9'}
              activeDotColor={isDark ? '#5EC8F2' : '#95E1D3'}
              showBadge={true}
            />
          ),
        }}
      />

      {/* Tab 4: Ưu đãi */}
      <Tabs.Screen
        name="vouchers"
        options={{
          title: "Ưu đãi",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#FFD93D",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "gift" : "gift-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#FFFBEA'}
              activeDotColor={isDark ? '#5EC8F2' : '#FFD93D'}
            />
          ),
        }}
      />

      {/* Tab 5: Theo dõi */}
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Theo dõi",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#A8E6CF",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "location" : "location-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#F2FCF7'}
              activeDotColor={isDark ? '#5EC8F2' : '#A8E6CF'}
            />
          ),
        }}
      />

      {/* Tab 6: Tài khoản */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarActiveTintColor: isDark ? "#5EC8F2" : "#C7CEEA",
          tabBarInactiveTintColor: isDark ? "#8E8E93" : "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name={focused ? "person" : "person-outline"}
              color={color}
              focused={focused}
              backgroundColor={isDark ? '#2C5364' : '#F5F6FB'}
              activeDotColor={isDark ? '#5EC8F2' : '#C7CEEA'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    position: 'relative',
    overflow: 'visible',
  },
  glowEffect: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: -1,
  },
  activeDot: {
    position: 'absolute',
    top: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});