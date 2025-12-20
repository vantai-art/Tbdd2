import { Stack } from 'expo-router';

export default function StaffRootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="home" />
        </Stack>
    );
}