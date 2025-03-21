const mongoose = require("mongoose");
const Product = require("./models/Product");
const path = require("path");

// MongoDB connection string
const dbURI = "mongodb+srv://jomy4u97:w19jHzDxox4GcrQc@cluster0.hc2co.mongodb.net/mydatabase?retryWrites=true&w=majority";

// Absolute path to your product images folder
const imagesFolderPath = "C:/Users/jomyj/ecom project/back/product_images_for_db";

// Sample data for products with absolute image paths
const productsData = [
    {
        name: "iPhone 14",
        description: "Apple iPhone 14 with A16 Bionic chip",
        price: 999,
        image: path.join(imagesFolderPath, "iphone_14.jpg"), // Absolute path
    },
    {
        name: "Samsung Galaxy S23",
        description: "Samsung Galaxy S23 with Snapdragon 8 Gen 2",
        price: 849,
        image: path.join(imagesFolderPath, "samsung_galaxy_s23.jpg"), // Absolute path
    },
    {
        name: "Sony WH-1000XM5",
        description: "Noise-cancelling wireless headphones",
        price: 399,
        image: path.join(imagesFolderPath, "sony_wh_1000xm5.jpg"), // Absolute path
    },
    {
        name: "MacBook Pro 16-inch",
        description: "Apple MacBook Pro with M2 Max chip",
        price: 2499,
        image: path.join(imagesFolderPath, "macbook_pro_16.jpg"), // Absolute path
    },
    {
        name: "Dell XPS 13",
        description: "Dell XPS 13 laptop with Intel i7",
        price: 1199,
        image: path.join(imagesFolderPath, "dell_xps_13.jpg"), // Absolute path
    },
    {
        name: "iPad Air",
        description: "Apple iPad Air with M1 chip",
        price: 599,
        image: path.join(imagesFolderPath, "ipad_air.jpg"), // Absolute path
    },
    {
        name: "Google Pixel 7",
        description: "Google Pixel 7 smartphone",
        price: 699,
        image: path.join(imagesFolderPath, "google_pixel_7.jpg"), // Absolute path
    },
    {
        name: "Apple Watch Series 8",
        description: "Apple Watch Series 8 with health features",
        price: 399,
        image: path.join(imagesFolderPath, "apple_watch_8.jpg"), // Absolute path
    },
    {
        name: "Sony PlayStation 5",
        description: "Sony PlayStation 5 console",
        price: 499,
        image: path.join(imagesFolderPath, "sony_ps5.jpg"), // Absolute path
    },
    {
        name: "Xbox Series X",
        description: "Microsoft Xbox Series X console",
        price: 499,
        image: path.join(imagesFolderPath, "xbox_series_x.jpg"), // Absolute path
    },
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

// Insert data into MongoDB
const insertData = async () => {
    try {
        // Clear existing product data
        await Product.deleteMany({});
        console.log("Old product data cleared!");

        // Insert new product data
        await Product.insertMany(productsData);
        console.log("Product data inserted successfully!");
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
