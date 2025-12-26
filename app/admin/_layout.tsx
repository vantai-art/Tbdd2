// app/admin/_layout.tsx
import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Auth routes (login, etc) */}
            <Stack.Screen name="auth" />

            {/* Admin pages */}
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="products" />
            <Stack.Screen name="revenue" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="shippers" />
            <Stack.Screen name="staff" />
            <Stack.Screen name="users" />
        </Stack>
    );
}