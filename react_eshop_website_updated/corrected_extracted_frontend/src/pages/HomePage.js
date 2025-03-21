import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import '../styles/style.css';

function HomePage({ onAddToCart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <header className="bg-green-500 py-6 text-center text-white">
                <h1 className="text-5xl font-bold">Welcome to MyShop</h1>
                <p className="mt-2">Your one-stop shop for everything!</p>
            </header>

            {/* Product Grid */}
            <main className="container">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
                <div className="grid">
                    {products.map((product) => (
                        <div className="card" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                            <p className="text-gray-600">{product.description}</p>
                            <button
                                className="button mt-2"
                                onClick={() => onAddToCart(product)} // Call the passed function
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HomePage;
