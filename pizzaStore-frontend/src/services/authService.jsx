import axios from "axios";

const API_URL = "http://localhost:8080";

export const registerApi = async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
};

export const loginApi = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data; // just return data, let AuthContext handle storage
};



export const authHeader = () => {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};