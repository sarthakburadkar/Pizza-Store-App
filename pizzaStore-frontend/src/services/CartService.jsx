import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:8080";

// Add item to cart
export const addToCart = (userId, menuItemId, quantity) => {
    return axios.post(`${API_URL}/user/cart`, {
        userId: userId,
        menuItem: { id: menuItemId },
        quantity: quantity
    }, {
        headers: authHeader()
    });
};

// Get all cart items for a user
export const getCart = (userId) => {
    return axios.get(`${API_URL}/user/cart/${userId}`, {
        headers: authHeader()
    });
};

// Update quantity of a cart item
export const updateCartItem = (cartId, quantity) => {
    return axios.put(`${API_URL}/user/cart/${cartId}`, {
        quantity: quantity
    }, {
        headers: authHeader()
    });
};

// Remove a single item from cart
export const removeFromCart = (cartId) => {
    return axios.delete(`${API_URL}/user/cart/${cartId}`, {
        headers: authHeader()
    });
};

// Clear entire cart
export const clearCart = (userId) => {
    return axios.delete(`${API_URL}/user/cart/clear/${userId}`, {
        headers: authHeader()
    });
};