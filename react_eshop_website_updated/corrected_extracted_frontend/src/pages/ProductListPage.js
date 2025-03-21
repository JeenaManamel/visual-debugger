import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

function ProductListPage({ onAddToCart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts(); // Fetch products from the database
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }
        fetchProducts();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="card border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-gray-700 mb-2">${product.price}</p>
                        <button
                            onClick={() => onAddToCart(product)}
                            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductListPage;
