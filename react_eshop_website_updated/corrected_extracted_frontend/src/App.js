import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';

function App() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Initialize user state from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        // Store user data in localStorage and update state
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        // Clear user data from localStorage and update state
        localStorage.removeItem('user');
        setUser(null);
    };

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handlePlaceOrder = () => {
        // Simulate order placement
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        alert('Order placed successfully!');
        setCart([]); // Clear the cart after order is placed
    };

    return (
        <Router>
            <Navbar user={user} cart={cart} onLogout={handleLogout} />
            <Routes>
                <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
                <Route path="/products" element={<ProductListPage onAddToCart={handleAddToCart} />} />
                <Route
                    path="/cart"
                    element={<CartPage cart={cart} onPlaceOrder={handlePlaceOrder} />}
                />
                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/orders"
                    element={
                        user ? <OrdersPage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
