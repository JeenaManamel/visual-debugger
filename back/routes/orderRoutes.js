const express = require('express');
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Place a New Order
router.post('/', protect, async (req, res) => {
    const { products, totalAmount } = req.body;

    try {
        const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error saving order:', error.message);
        res.status(500).json({ message: error.message });
    }
});
// Get User's Orders
router.get('/', protect, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user._id); // Debug log
        const orders = await Order.find({ user: req.user._id }).populate('products.product');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message); // Log errors
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
