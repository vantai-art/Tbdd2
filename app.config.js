// app.config.js
export default {
    expo: {
        name: "Food & Drink",
        slug: "food-drink-app",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.ngovantai.example901"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.ngovantai.example901"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        // ⭐ API Configuration
        extra: {
            // Đọc từ environment variable hoặc dùng default
            apiUrl: process.env.API_URL || undefined,

            // Các config khác
            environment: process.env.NODE_ENV || "development",
        },
        plugins: [
            "expo-router"
        ]
    }
};