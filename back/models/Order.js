const mongoose = require('mongoose');
const User = require('./User');  // Correct way to import the User model
const Product = require('./Product');  // If you're also using Product in your Order model

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference User model
        products: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, default: 'Processing' }
    },
    { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
