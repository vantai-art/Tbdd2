import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          borderRadius: 15,
          marginHorizontal: 2,
        },
      }}
    >
      {/* Ẩn index */}
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />

      {/* Tab 1: Trang chủ - Màu đỏ cam */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarActiveTintColor: "#FF6B6B",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#FFF0F0' }
            ]}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={color}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: '#FF6B6B' }]} />}
            </View>
          ),
        }}
      />

      {/* Tab 2: Đơn hàng - Màu xanh ngọc */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Đơn hàng",
          tabBarActiveTintColor: "#4ECDC4",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#E8F8F7' }
            ]}>
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                size={28}
                color={color}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: '#4ECDC4' }]} />}
            </View>
          ),
        }}
      />

      {/* Tab 3: Giỏ hàng - Màu xanh mint */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Giỏ hàng",
          tabBarActiveTintColor: "#95E1D3",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#F0FBF9' }
            ]}>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={28}
                color={color}
              />
              {/* Badge số lượng sản phẩm */}
              <View style={styles.cartBadge}>
                <Ionicons name="ellipse" size={20} color="#FF3B30" />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: '#95E1D3' }]} />}
            </View>
          ),
        }}
      />

      {/* Tab 4: Ưu đãi - Màu vàng */}
      <Tabs.Screen
        name="vouchers"
        options={{
          title: "Ưu đãi",
          tabBarActiveTintColor: "#FFD93D",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#FFFBEA' }
            ]}>
              <Ionicons
                name={focused ? "gift" : "gift-outline"}
                size={28}
                color={color}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: '#FFD93D' }]} />}
            </View>
          ),
        }}
      />

      {/* Tab 5: Theo dõi - Màu xanh lá */}
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Theo dõi",
          tabBarActiveTintColor: "#A8E6CF",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#F2FCF7' }
            ]}>
              <Ionicons
                name={focused ? "location" : "location-outline"}
                size={28}
                color={color}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: '#A8E6CF' }]} />}
            </View>
          ),
        }}
      />

      {/* Tab 6: Tài khoản - Màu tím nhạt */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarActiveTintColor: "#C7CEEA",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarIcon: ({ color, focused }) => (
            <View style={[
              styles.iconContainer,
              focused && { backgroundColor: '#F5F6FB' }
            ]}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={28}
                color={color}
              />
              {focused && <View style={[styles.activeDot, { backgroundColor: '#C7CEEA' }]} />}
            </View>
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