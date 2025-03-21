import React, { useEffect, useState } from 'react';

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from localStorage
                if (!token) throw new Error('User not authenticated');

                // Send GET request to fetch orders
                const response = await fetch('/api/orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Send token for authentication
                    },
                });

                if (!response.ok) {
                    // Handle non-200 responses
                    throw new Error(`Failed to fetch orders: ${response.status}`);
                }

                const data = await response.json();
                setOrders(data); // Update state with fetched orders
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Loading state
    if (isLoading) {
        return <p className="text-center text-gray-500">Loading orders...</p>;
    }

    // Error state
    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    // No orders state
    if (orders.length === 0) {
        return <p className="text-center text-gray-500">You have no orders yet.</p>;
    }

    // Render orders
    return (
        <div className="orders-page container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-4">Your Orders</h1>
            <ul className="space-y-4">
                {orders.map((order) => (
                    <li key={order._id} className="border p-4 rounded shadow">
                        <h2 className="font-bold">Order #{order._id}</h2>
                        <p>Total: ${order.totalAmount.toFixed(2)}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <ul className="list-disc pl-6">
                            {order.products.map((productItem) => (
                                <li key={productItem.product._id}>
                                    {productItem.product.name} - $
                                    {productItem.product.price} x {productItem.quantity}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrdersPage;
