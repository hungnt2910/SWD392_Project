import { useContext } from "react";
import { cartContext } from "../Context/CartContext";

export const useCart = () => {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};