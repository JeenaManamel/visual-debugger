import React, { useState } from 'react';

function CartPage({ cart, onClearCart, onPlaceOrder }) {
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        address: '',
        deliveryOption: '',
        paymentMethod: '',
    });

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (
            !userInfo.firstName ||
            !userInfo.lastName ||
            !userInfo.email ||
            !userInfo.address ||
            !userInfo.deliveryOption ||
            !userInfo.paymentMethod
        ) {
            alert('Please fill in all the required information.');
            return;
        }

        try {
            await onPlaceOrder({ ...userInfo, totalAmount });
            setSuccessMessage('Your order has been placed successfully!');
            setTimeout(() => setSuccessMessage(''), 5000);
            onClearCart();
            setShowForm(false);
        } catch (err) {
            console.error('Error placing order:', err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    return (
        <div className="cart-container bg-gray-100 min-h-screen py-10 px-4">
            <h1 className="text-4xl font-bold text-center text-green-600 mb-8">Your Cart</h1>

            {successMessage && (
                <div className="max-w-lg mx-auto bg-green-100 border border-green-500 text-green-700 p-4 rounded-lg shadow-md text-center mb-8">
                    <p className="text-lg font-semibold">{successMessage}</p>
                </div>
            )}

            {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Your cart is empty. Start shopping now!</p>
            ) : (
                <>
                    {/* Cart items */}
                    <div className="cart-items max-w-5xl mx-auto grid grid-cols-1 gap-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center bg-white p-6 rounded-lg shadow-md"
                            >
                                <img
                                    src={item.image || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="ml-6 flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        ${item.price} x {item.quantity}
                                    </p>
                                    <p className="text-green-600 font-bold">
                                        Total: ${item.price * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart summary */}
                    <div className="cart-summary max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Total Amount: <span className="text-green-600">${totalAmount.toFixed(2)}</span>
                        </h2>

                        {!showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 ease-in-out shadow-md"
                            >
                                Proceed to Checkout
                            </button>
                        ) : (
                            <div className="form-container bg-white p-8 rounded-lg shadow-md mt-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Enter Your Information</h2>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={userInfo.firstName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={userInfo.lastName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={userInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="company"
                                        placeholder="Company (if applicable)"
                                        value={userInfo.company}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={userInfo.address}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                {/* Delivery Options Dropdown */}
                                <div className="dropdown-group mt-4">
                                    <label htmlFor="deliveryOption" className="block text-gray-700 font-medium mb-2">
                                        Delivery Option:
                                    </label>
                                    <select
                                        name="deliveryOption"
                                        id="deliveryOption"
                                        value={userInfo.deliveryOption}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg bg-white"
                                        required
                                    >
                                        <option value="">Select Delivery Option</option>
                                        <option value="Standard">Standard Delivery (3-5 days)</option>
                                        <option value="Express">Express Delivery (1-2 days)</option>
                                        <option value="Pickup">Store Pickup</option>
                                    </select>
                                </div>

                                {/* Payment Method Dropdown */}
                                <div className="dropdown-group mt-4">
                                    <label htmlFor="paymentMethod" className="block text-gray-700 font-medium mb-2">
                                        Payment Method:
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        id="paymentMethod"
                                        value={userInfo.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg bg-white"
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="CreditCard">Credit Card</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="CashOnDelivery">Cash on Delivery</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200 ease-in-out shadow-md"
                                >
                                    Place Order
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
