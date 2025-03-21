//Contains the logic for handling incoming requests.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check JWT_SECRET environment variable
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not set in environment variables' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Exclude sensitive fields from response
        const { password: _, ...userWithoutPassword } = user._doc;

        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error(err); // Logs the error for debugging
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { loginUser };
