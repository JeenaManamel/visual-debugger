import React, { useState } from 'react';

function CheckoutPage({ cart, onClearCart }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const handleOrder = () => {
        setOrderConfirmed(true);
        onClearCart();
    };

    if (orderConfirmed) {
        return <h1>Thank you for your order!</h1>;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <form>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    ></textarea>
                </div>
            </form>
            <h2>Total: ${total.toFixed(2)}</h2>
            <button onClick={handleOrder}>Confirm Order</button>
        </div>
    );
}

export default CheckoutPage;
