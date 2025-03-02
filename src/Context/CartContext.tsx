import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CartItem = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

type CartType = {
    cart: CartItem[];
    addProduct: (product: CartItem) => void;
    removeProduct: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

export const cartContext = createContext<CartType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const nav = useNavigate()

    const isAuthenticated = () => {
        return localStorage.getItem("token") ? true : false
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addProduct = (product: CartItem) => {
        isAuthenticated() ?
            setCart((prev) => {
                const existingProduct = prev.find((item) => item.productId === product.productId);

                if (existingProduct) {
                    return prev.map((item) => item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item)
                } else {
                    return [...prev, { ...product, quantity: 1 }]
                }
            })
            :
            nav('/login')
    }

    const removeProduct = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.productId !== productId))
    }

    const updateQuantity = (productId: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId ? { ...item, quantity: quantity } : item
            )
        );
    };

    return (
        <cartContext.Provider value={{ cart, addProduct, removeProduct, updateQuantity }}>
            {children}
        </cartContext.Provider>
    )
}

