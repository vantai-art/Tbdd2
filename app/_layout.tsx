// // app/_layout.tsx
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// import { AppProvider } from './context/AppContext';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <AppProvider>
//       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Stack screenOptions={{ headerShown: false }}>
//           {/* Index - sẽ tự động redirect */}
//           <Stack.Screen name="index" />

//           {/* Splash screen */}
//           <Stack.Screen name="splash/SplashScreen" />

//           {/* Auth screens */}
//           <Stack.Screen name="auth/login" />
//           <Stack.Screen name="auth/register" />

//           {/* Main tabs */}
//           <Stack.Screen name="(tabs)" />

//           {/* Product Detail - Modal style */}
//           <Stack.Screen
//             name="product/detail"
//             options={{
//               presentation: 'modal',
//               headerShown: false,
//               animation: 'slide_from_bottom'
//             }}
//           />

//           {/* Modal nếu cần */}
//           <Stack.Screen
//             name="modal"
//             options={{
//               presentation: 'modal',
//               title: 'Modal',
//               headerShown: true
//             }}
//           />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </AppProvider>
//   );
// }


// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AppProvider } from './context/AppContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Index - sẽ tự động redirect */}
          <Stack.Screen name="index" />

          {/* Splash screen */}
          <Stack.Screen name="splash/SplashScreen" />

          {/* ================== ADMIN ================== */}
          {/* Admin Auth */}
          <Stack.Screen name="admin/auth/login" />
          <Stack.Screen name="admin/auth/_layout" />

          {/* Admin Main Screens */}
          <Stack.Screen name="admin/dashboard" />
          <Stack.Screen name="admin/orders" />
          <Stack.Screen name="admin/products" />
          <Stack.Screen name="admin/revenue" />
          <Stack.Screen name="admin/settings" />
          <Stack.Screen name="admin/shippers" />
          <Stack.Screen name="admin/staff" />
          <Stack.Screen name="admin/users" />
          <Stack.Screen name="admin/_layout" />

          {/* ================== AUTH (User) ================== */}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/forgot-password" />

          {/* ================== SHIPPER ================== */}
          {/* Shipper Auth */}
          <Stack.Screen name="shipper/auth/login" />
          <Stack.Screen name="shipper/auth/_layout" />

          {/* Shipper Main Screens */}
          <Stack.Screen name="shipper/earnings" />
          <Stack.Screen name="shipper/map" />
          <Stack.Screen name="shipper/notifications" />
          <Stack.Screen name="shipper/order-detail" />
          <Stack.Screen name="shipper/orders" />
          <Stack.Screen name="shipper/profile" />
          <Stack.Screen name="shipper/_layout" />

          {/* ================== STAFF ================== */}
          {/* Staff Auth */}
          <Stack.Screen name="staff/auth/login" />
          <Stack.Screen name="staff/auth/_layout" />

          {/* Staff Main Screens */}
          <Stack.Screen name="staff/inventory" />
          <Stack.Screen name="staff/kitchen" />
          <Stack.Screen name="staff/orders" />
          <Stack.Screen name="staff/profile" />
          <Stack.Screen name="staff/_layout" />
          <Stack.Screen name="staff/index" />

          {/* ================== MAIN TABS (User) ================== */}
          <Stack.Screen name="(tabs)" />

          {/* ================== OTHER SCREENS ================== */}
          {/* Product Detail - Modal style */}
          <Stack.Screen
            name="product/detail"
            options={{
              presentation: 'modal',
              headerShown: false,
              animation: 'slide_from_bottom'
            }}
          />

          {/* Modal nếu cần */}
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
              headerShown: true
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}