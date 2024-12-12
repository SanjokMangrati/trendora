'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart as addToCartAPI, removeFromCart as removeFromCartAPI } from '../api/cart';
import { Cart, DEFAULT_CART_DATA } from '@/lib/types/cart.types';
import { useToast } from '@/hooks/use-toast';
import { useSessionContext } from './session.context';

type CartContextType = {
    cart: Cart;
    refetch: () => Promise<void>;
    addToCart: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>(DEFAULT_CART_DATA);
    const { toast } = useToast();
    const { sessionId } = useSessionContext();

    const fetchCartData = async () => {
        try {
            const cartData = await fetchCart();
            setCart(cartData);
        } catch (error: any) {
            console.log("Failed to fetch Cart:", error.message || error);
            toast({
                variant: "destructive",
                title: "Failed to fetch Cart",
                description: error.message || "An unexpected error occurred while fetching the cart.",
            });
        }
    };

    // Add item to cart or increase quantity
    const addToCart = async (productId: number, quantity: number = 1) => {
        try {
            await addToCartAPI(productId, quantity);
            await fetchCartData();
        } catch (error: any) {
            console.log("Failed to add product to cart:", error.message || error);
            toast({
                variant: "destructive",
                title: "Failed to add product to cart",
                description: error.message || "An unexpected error occurred while adding the product.",
            });
        }
    };

    // Remove item from cart or decrease quantity
    const removeFromCart = async (productId: number, quantity: number = 1) => {
        try {
            await removeFromCartAPI(productId, quantity);
            await fetchCartData();
        } catch (error: any) {
            console.log("Failed to remove product from cart:", error.message || error);
            toast({
                variant: "destructive",
                title: "Failed to remove product from cart",
                description: error.message || "An unexpected error occurred while removing the product.",
            });
        }
    };


    useEffect(() => {
        if (sessionId) fetchCartData()
    }, []);

    return (
        <CartContext.Provider value={{ cart, refetch: fetchCartData, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};
