const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");

// MongoDB connection string
const dbURI = "mongodb+srv://jomy4u97:w19jHzDxox4GcrQc@cluster0.hc2co.mongodb.net/mydatabase?retryWrites=true&w=majority";

// Base URL for serving images
const baseURL = "http://localhost:5000/images";

// Sample data for products with image URLs
const productsData = [
    {
        name: "iPhone 14",
        description: "Apple iPhone 14 with A16 Bionic chip",
        price: 999,
        image: `${baseURL}/iphone_14.jpg`,
    },
    {
        name: "Samsung Galaxy S23",
        description: "Samsung Galaxy S23 with Snapdragon 8 Gen 2",
        price: 849,
        image: `${baseURL}/samsung_galaxy_s23.jpg`,
    },
    {
        name: "Sony WH-1000XM5",
        description: "Noise-cancelling wireless headphones",
        price: 399,
        image: `${baseURL}/sony_wh_1000xm5.jpg`,
    },
    {
        name: "MacBook Pro 16-inch",
        description: "Apple MacBook Pro with M2 Max chip",
        price: 2499,
        image: `${baseURL}/macbook_pro_16.jpg`,
    },
    {
        name: "Dell XPS 13",
        description: "Dell XPS 13 laptop with Intel i7",
        price: 1199,
        image: `${baseURL}/dell_xps_13.jpg`,
    },
    {
        name: "iPad Air",
        description: "Apple iPad Air with M1 chip",
        price: 599,
        image: `${baseURL}/ipad_air.jpg`,
    },
    {
        name: "Google Pixel 7",
        description: "Google Pixel 7 smartphone",
        price: 699,
        image: `${baseURL}/google_pixel_7.jpg`,
    },
    {
        name: "Apple Watch Series 8",
        description: "Apple Watch Series 8 with health features",
        price: 399,
        image: `${baseURL}/apple_watch_8.jpg`,
    },
    {
        name: "Sony PlayStation 5",
        description: "Sony PlayStation 5 console",
        price: 499,
        image: `${baseURL}/sony_ps5.jpg`,
    },
    {
        name: "Xbox Series X",
        description: "Microsoft Xbox Series X console",
        price: 499,
        image: `${baseURL}/xbox_series_x.jpg`,
    },
];

// Sample data for users
const usersData = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        address: "1234 Elm St, Springfield, IL",
        phone: "555-1234",
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password456",
        address: "5678 Oak St, Springfield, IL",
        phone: "555-5678",
    },
];

// Sample data for orders
const ordersData = [
    {
        user: null, // Will populate with ObjectId after users are inserted
        products: [
            { product: null, quantity: 1, price: 999 }, // Will populate with product ObjectIds
            { product: null, quantity: 1, price: 399 },
        ],
        totalAmount: 1398,
        status: "Processing",
    },
    {
        user: null, // Will populate with ObjectId after users are inserted
        products: [
            { product: null, quantity: 1, price: 2499 },
            { product: null, quantity: 1, price: 399 },
        ],
        totalAmount: 2898,
        status: "Shipped",
    },
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

// Hash passwords
const hashPasswords = async (usersData) => {
    const bcrypt = require("bcrypt");
    for (let user of usersData) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
};

// Insert data into MongoDB
const insertData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log("Old data cleared!");

        // Hash passwords for users
        await hashPasswords(usersData);

        // Insert users and get their ObjectIds
        const users = await User.insertMany(usersData);
        console.log("Users inserted successfully!");

        // Insert products and get their ObjectIds
        const products = await Product.insertMany(productsData);
        console.log("Products inserted successfully!");

        // Populate orders with user and product ObjectIds
        ordersData[0].user = users[0]._id; // John Doe
        ordersData[1].user = users[1]._id; // Jane Smith

        ordersData[0].products[0].product = products[0]._id; // iPhone 14
        ordersData[0].products[1].product = products[2]._id; // Sony WH-1000XM5
        ordersData[1].products[0].product = products[3]._id; // MacBook Pro 16-inch
        ordersData[1].products[1].product = products[7]._id; // Apple Watch Series 8

        // Insert orders
        await Order.insertMany(ordersData);
        console.log("Orders inserted successfully!");
    } catch (error) {
        console.error("Error inserting data:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seed process
const run = async () => {
    await connectDB();
    await insertData();
};

run();
