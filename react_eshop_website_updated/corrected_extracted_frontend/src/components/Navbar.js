import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, cart = [], onLogout }) {
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); // Clear user data
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar bg-green-600 shadow-md text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <Link
                    to="/"
                    className="text-2xl font-bold whitespace-nowrap hover:text-gray-200 transition"
                >
                    MyShop
                </Link>
                <div className="nav-links flex items-center space-x-8">
                    <Link
                        to="/cart"
                        className="relative text-lg font-semibold hover:text-gray-200 transition"
                    >
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/orders"
                                className="text-lg font-semibold hover:text-gray-200 transition"
                            >
                                Orders
                            </Link>
                            <span className="font-medium whitespace-nowrap">
                                Hello, <span className="font-bold">{user.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-white text-green-600 px-4 py-1 rounded-md hover:bg-green-700 hover:text-white transition duration-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
