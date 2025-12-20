// app/admin/auth/_layout.tsx
import { Stack } from 'expo-router';

export default function AdminAuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
        </Stack>
    );
}