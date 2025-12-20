// context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// ============= TYPES =============
export type Product = {
    id: number;
    name: string;
    desc: string;
    category: string;
    price: number;
    image: string;
    rating: number;
    soldCount: number;
    reviews: number;
    discount?: number;
    isNew?: boolean;
};

export type Addon = {
    id: number;
    name: string;
    price: number;
};

export type CartItem = {
    cartId: string;
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    note: string;
    addons: Addon[];
    totalPrice: number;
};

type AppContextType = {
    // Cart state
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'cartId'>) => void;
    updateQuantity: (cartId: string, delta: number) => void;
    removeFromCart: (cartId: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;

    // Product state
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
};

// ============= CONTEXT =============
const AppContext = createContext<AppContextType | undefined>(undefined);

// ============= PROVIDER =============
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (item: Omit<CartItem, 'cartId'>) => {
        const cartId = `${item.id}-${Date.now()}`;
        const newItem: CartItem = {
            ...item,
            cartId,
        };

        setCart(prevCart => [...prevCart, newItem]);
    };

    // Cập nhật số lượng
    const updateQuantity = (cartId: string, delta: number) => {
        setCart(prevCart =>
            prevCart
                .map(item => {
                    if (item.cartId === cartId) {
                        const newQuantity = Math.max(0, item.quantity + delta);
                        const basePrice = item.price;
                        const addonPrice = item.addons.reduce((sum, a) => sum + a.price, 0);
                        return {
                            ...item,
                            quantity: newQuantity,
                            totalPrice: (basePrice + addonPrice) * newQuantity
                        };
                    }
                    return item;
                })
                .filter(item => item.quantity > 0)
        );
    };

    // Xóa sản phẩm
    const removeFromCart = (cartId: string) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };

    // Xóa tất cả
    const clearCart = () => {
        setCart([]);
    };

    // Tính tổng tiền
    const getCartTotal = () => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    // Đếm số lượng món
    const getCartCount = () => {
        return cart.length;
    };

    return (
        <AppContext.Provider
            value={{
                cart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getCartTotal,
                getCartCount,
                selectedProduct,
                setSelectedProduct,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// ============= HOOK =============
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

// ============= KHI CÓ API - CHỈ CẦN SỬA BÊN TRONG CÁC FUNCTION =============
/*
// VÍ DỤ: Thêm vào giỏ hàng với API
const addToCart = async (item: Omit<CartItem, 'cartId'>) => {
  try {
    const response = await fetch('https://your-api.com/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // nếu cần auth
      },
      body: JSON.stringify(item)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setCart(prevCart => [...prevCart, data]);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// VÍ DỤ: Lấy giỏ hàng từ server
const fetchCart = async () => {
  try {
    const response = await fetch('https://your-api.com/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCart(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
  }
};

// Gọi fetchCart() khi app khởi động hoặc user login
useEffect(() => {
  fetchCart();
}, []);
*/