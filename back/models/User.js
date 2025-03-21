//Defines the database structure using a library like Mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Preventing overwriting the model if it's already registered
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    { timestamps: true }
);

// Password Hashing Middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    this.password = await bcrypt.hash(this.password, 10); // Hash password with 10 rounds of salting
    next();
});

// Method to Compare Passwords (used during login)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with the stored hashed password
};

// Export model, check if it already exists to prevent overwriting
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
