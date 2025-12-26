import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const TokenStorage = {
    // Lưu token
    async saveToken(token: string): Promise<void> {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    },

    // Lấy token
    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    },

    // Xóa token (logout)
    async removeToken(): Promise<void> {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    },

    // Lưu user info
    async saveUser(user: any): Promise<void> {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Lấy user info
    async getUser(): Promise<any | null> {
        const data = await AsyncStorage.getItem(USER_KEY);
        return data ? JSON.parse(data) : null;
    },
};