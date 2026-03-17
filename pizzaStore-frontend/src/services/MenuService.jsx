import axios from "axios";
import { authHeader } from "./authService";

const API_URL = "http://localhost:8080";

// Get all categories
export const getCategories = () => {
    return axios.get(`${API_URL}/user/categories`, {
        headers: authHeader()
    });
};

// Get all menu items
export const getAllMenuItems = () => {
    return axios.get(`${API_URL}/user/menu`, {
        headers: authHeader()
    });
};

// Get menu items by category
export const getMenuItemsByCategory = (categoryId) => {
    return axios.get(`${API_URL}/user/menu/category/${categoryId}`, {
        headers: authHeader()
    });
};