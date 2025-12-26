import { API_CONFIG, getAuthHeaders } from '../config/api';
import { TokenStorage } from '../utils/tokenStorage';

// ==================== AUTH ====================
export const AuthAPI = {
    // ===== LOGIN =====
    async login(username: string, password: string) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();

        await TokenStorage.saveToken(data.token);
        await TokenStorage.saveUser({
            id: data.id,
            username: data.username,
            role: data.role,
        });

        return data;
    },

    // ===== SIGNUP =====
    async signup(
        username: string,
        password: string,
        fullName: string,
        email: string,
        phone: string
    ) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                fullName,
                email,
                phone,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }

        return await response.json();
    },

    // ===== FORGOT PASSWORD =====
    async forgotPassword(email: string) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error('Forgot password failed');
        return await res.json();
    },

    // ===== RESET PASSWORD =====
    async resetPassword(token: string, newPassword: string) {
        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword }),
        });

        if (!res.ok) throw new Error('Reset password failed');
        return await res.json();
    },

    // ===== CHANGE PASSWORD (LOGIN REQUIRED) =====
    async changePassword(oldPassword: string, newPassword: string) {
        const token = await TokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ oldPassword, newPassword }),
        });

        if (!res.ok) throw new Error('Change password failed');
        return await res.json();
    },

    // ===== GET CURRENT USER =====
    async getMe() {
        const token = await TokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const res = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
            headers: getAuthHeaders(token),
        });

        if (!res.ok) throw new Error('Fetch me failed');
        return await res.json();
    },

    // ===== LOGOUT =====
    async logout() {
        await TokenStorage.removeToken();
    },
};


// ==================== PRODUCTS ====================
export const ProductAPI = {
    // Lấy tất cả products
    async getAll() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    },

    // Lấy 1 product
    async getById(id: number) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        return await response.json();
    },
};

// ==================== CATEGORIES ====================
export const CategoryAPI = {
    async getAll() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    },
};

// ==================== ORDERS ====================
export const OrderAPI = {
    // Tạo đơn hàng
    async create(orderData: {
        promotionId?: number;
        notes?: string;
        totalAmount: number;
        items: {
            productId: number;
            quantity: number;
            price: number;
        }[];
    }) {
        const token = await TokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create order');
        }

        return await response.json();
    },

    // Lấy đơn hàng của user
    async getMyOrders() {
        const token = await TokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
            headers: getAuthHeaders(token),
        });

        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    },

    // Lấy items của 1 order
    async getOrderItems(orderId: number) {
        const token = await TokenStorage.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(
            `${API_CONFIG.BASE_URL}/order-items/order/${orderId}`,
            { headers: getAuthHeaders(token) }
        );

        if (!response.ok) throw new Error('Failed to fetch order items');
        return await response.json();
    },
};

// ==================== PROMOTIONS ====================
export const PromotionAPI = {
    async getAll() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/promotions`);
        if (!response.ok) throw new Error('Failed to fetch promotions');
        return await response.json();
    },
};