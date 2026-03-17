// src/services/AdminOrderService.js
import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:8080";

// Get all orders
export const getAllOrders = () => {
    return axios.get(`${API_URL}/admin/orders`, { headers: authHeader() });
};

// Get orders by status
export const getOrdersByStatus = (status) => {
    return axios.get(`${API_URL}/admin/orders/status/${status}`, { headers: authHeader() });
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
    return axios.put(`${API_URL}/admin/orders/${orderId}/status?status=${status}`, {}, { headers: authHeader() });
};

// Generate bill
export const generateBill = (orderId) => {
    return axios.get(`${API_URL}/admin/orders/bill/${orderId}`, { headers: authHeader() });
};