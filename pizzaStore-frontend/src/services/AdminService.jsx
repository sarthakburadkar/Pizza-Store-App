import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:8080";

// CATEGORY APIs

// Get all categories
export const getCategories = () => {
    return axios.get(`${API_URL}/admin/category`, {
        headers: authHeader()
    });
};

// Add new category
export const addCategory = (category) => {
    return axios.post(`${API_URL}/admin/category`, category, {
        headers: authHeader()
    });
};

// Update category
export const updateCategory = (id, category) => {
    return axios.put(`${API_URL}/admin/category/${id}`, category, {
        headers: authHeader()
    });
};

// Delete category
export const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/admin/category/${id}`, {
        headers: authHeader()
    });
};

// MENU ITEM APIs

// Get all menu items
export const getAllMenuItems = () => {
    return axios.get(`${API_URL}/admin/menu`, {
        headers: authHeader()
    });
};

// Add new menu item
export const addMenuItem = (menuItem) => {
    return axios.post(`${API_URL}/admin/menu`, menuItem, {
        headers: authHeader()
    });
};

// Update menu item
export const updateMenuItem = (id, menuItem) => {
    return axios.put(`${API_URL}/admin/menu/${id}`, menuItem, {
        headers: authHeader()
    });
};

// Delete menu item
export const deleteMenuItem = (id) => {
    return axios.delete(`${API_URL}/admin/menu/${id}`, {
        headers: authHeader()
    });
};

// ORDER APIs

// Get all orders
export const getAllOrders = () => {
    return axios.get(`${API_URL}/admin/orders`, {
        headers: authHeader()
    });
};


// Update order status
export const updateOrderStatus = (orderId, status) => {
    return axios.put(`${API_URL}/admin/orders/${orderId}/status?status=${status}`, {}, {
        headers: authHeader()
    });
};

// Generate bill for an order
export const generateBill = (orderId) => {
    return axios.get(`${API_URL}/admin/orders/bill/${orderId}`, {
        headers: authHeader()
    });
};

// Get revenue insights
export const getRevenueInsights = () => {
    return axios.get(`${API_URL}/admin/revenue/total`, { headers: authHeader() });
};