// app/config/api.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * ========================================
 * API BASE URL CONFIGURATION
 * ========================================
 * Tự động detect platform và môi trường
 */
const getBaseUrl = () => {
    // 1. Production: Lấy từ environment variable
    const envApiUrl = Constants.expoConfig?.extra?.apiUrl;
    if (envApiUrl) {
        return envApiUrl;
    }

    // 2. Production mode
    if (!__DEV__) {
        return 'https://your-app.onrender.com/api'; // ⭐ THAY ĐỔI URL PRODUCTION
    }

    // 3. Development mode - Tự động detect platform
    if (Platform.OS === 'web') {
        return 'http://localhost:8080/api';
    }

    if (Platform.OS === 'ios') {
        // iOS Simulator: localhost hoạt động
        // iOS Physical device: Dùng ngrok
        return 'http://localhost:8080/api';
        // Nếu test trên iPhone thật, uncomment dòng dưới:
        // return 'https://your-ngrok-url.ngrok.io/api';
    }

    if (Platform.OS === 'android') {
        // Android Emulator: 10.0.2.2 = localhost của máy host
        return 'http://10.0.2.2:8080/api';
        // Nếu test trên Android thật, uncomment dòng dưới:
        // return 'http://192.168.1.100:8080/api'; // Thay bằng IP máy bạn
    }

    // Fallback
    return 'http://localhost:8080/api';
};

/**
 * ========================================
 * API CONFIGURATION
 * ========================================
 */
export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT: 30000, // 30 seconds (tăng lên cho mobile)
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
};

// Log configuration khi app start
console.log('🚀 API Configuration:');
console.log('   Platform:', Platform.OS);
console.log('   Dev Mode:', __DEV__);
console.log('   Base URL:', API_CONFIG.BASE_URL);
console.log('   Timeout:', API_CONFIG.TIMEOUT + 'ms');

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */

/**
 * Tạo headers với authentication
 */
export const getAuthHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Tạo headers cho multipart/form-data (upload file)
 */
export const getMultipartHeaders = (token?: string) => {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        // Không set Content-Type, fetch sẽ tự set với boundary
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

/**
 * Build full URL từ endpoint
 */
export const getFullUrl = (endpoint: string): string => {
    // Nếu endpoint đã có domain (external API)
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint;
    }

    // Remove leading slash nếu có
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // Combine base URL và endpoint
    return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};

/**
 * Check xem có phải local development không
 */
export const isLocalDevelopment = (): boolean => {
    return __DEV__ && (
        API_CONFIG.BASE_URL.includes('localhost') ||
        API_CONFIG.BASE_URL.includes('10.0.2.2') ||
        API_CONFIG.BASE_URL.includes('192.168.') ||
        API_CONFIG.BASE_URL.includes('ngrok')
    );
};

/**
 * Check xem có phải HTTPS không
 */
export const isSecureConnection = (): boolean => {
    return API_CONFIG.BASE_URL.startsWith('https://');
};

/**
 * Format error message
 */
export const formatApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
};

/**
 * ========================================
 * API ENDPOINTS
 * ========================================
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_TOKEN: '/auth/verify-token',
    },

    // Products
    PRODUCTS: {
        LIST: '/products',
        DETAIL: (id: number) => `/products/${id}`,
        CREATE: '/products',
        UPDATE: (id: number) => `/products/${id}`,
        DELETE: (id: number) => `/products/${id}`,
        SEARCH: '/products/search',
    },

    // Categories
    CATEGORIES: {
        LIST: '/categories',
        DETAIL: (id: number) => `/categories/${id}`,
    },

    // Orders
    ORDERS: {
        LIST: '/orders',
        DETAIL: (id: number) => `/orders/${id}`,
        CREATE: '/orders',
        UPDATE: (id: number) => `/orders/${id}`,
        CANCEL: (id: number) => `/orders/${id}/cancel`,
    },

    // Users
    USERS: {
        LIST: '/users',
        DETAIL: (id: number) => `/users/${id}`,
        UPDATE: (id: number) => `/users/${id}`,
    },

    // Dashboard
    DASHBOARD: {
        STATS: '/dashboard/stats',
        REVENUE: '/dashboard/revenue',
    },

    // Payments
    PAYMENTS: {
        VNPAY_CREATE: '/payments/vnpay/create',
        VNPAY_CALLBACK: '/payments/vnpay/callback',
    },
};

/**
 * ========================================
 * EXPORTS
 * ========================================
 */
export default {
    API_CONFIG,
    API_ENDPOINTS,
    getAuthHeaders,
    getMultipartHeaders,
    getFullUrl,
    isLocalDevelopment,
    isSecureConnection,
    formatApiError,
};