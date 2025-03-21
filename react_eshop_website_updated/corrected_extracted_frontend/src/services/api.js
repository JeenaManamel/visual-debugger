import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:5000/api';

// Utility to add the Authorization header for requests
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication token is missing. Please log in.');
    }
    return {
        Authorization: `Bearer ${token}`,
    };
};

// Fetch all products
export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
        throw error;
    }
};

// Login a user
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { email, password });
        return response.data; // Ensure this matches the backend's response format
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        throw error;
    }
};
export const verifyToken = async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Return the user data
};

// Fetch all orders for the authenticated user
export const getOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/orders`, {
            headers: getAuthHeaders(),
        });
        return response.data; // Return orders data
    } catch (error) {
        console.error('Error fetching orders:', error.response?.data || error.message);
        throw error;
    }
};

// Place a new order
export const placeOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/orders`, orderData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Return the placed order data
    } catch (error) {
        console.error('Error placing order:', error.response?.data || error.message);
        throw error;
    }
};
