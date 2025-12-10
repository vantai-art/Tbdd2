import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Index - sẽ tự động redirect */}
        <Stack.Screen name="index" />

        {/* Splash screen */}
        <Stack.Screen name="splash/SplashScreen" />

        {/* Auth screens */}
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />

        {/* Main tabs */}
        <Stack.Screen name="(tabs)" />

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
  );
}