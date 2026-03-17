import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:8080";

// Place order
export const placeOrder = (userId, deliveryAddress, deliveryMode) => {
    return axios.post(`${API_URL}/user/orders/place/${userId}`, {
        deliveryAddress: deliveryAddress,
        deliveryMode: deliveryMode
    }, {
        headers: authHeader()
    });
};

// Get all orders for a user
export const getOrders = (userId) => {
    return axios.get(`${API_URL}/user/orders/${userId}`, {
        headers: authHeader()
    });
};

// Get single order detail
export const getOrderDetail = (orderId) => {
    return axios.get(`${API_URL}/user/orders/detail/${orderId}`, {
        headers: authHeader()
    });
};

// Cancel order
export const cancelOrder = (orderId) => {
    return axios.put(`${API_URL}/user/orders/cancel/${orderId}`, {}, {
        headers: authHeader()
    });


};
export const generateBill = (orderId) => {
    return axios.get(`${API_URL}/user/orders/bill/${orderId}`, { headers: authHeader() });
};