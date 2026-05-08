import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/ecommerce";

const sampleProducts = [
  {
    name: "Apple MacBook Pro 16-inch M3 Max",
    price: 2499,
    oldPrice: 2799,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    description:
      "The most powerful MacBook Pro ever, featuring the M3 Max chip with up to 16-core CPU, 40-core GPU, and 48GB unified memory. Perfect for professionals who demand peak performance.",
    stock: 25,
    rating: 4.8,
    orders: 342,
    featured: true,
    brand: "Apple",
    shipping: "Free Shipping",
  },
  {
    name: "Samsung Galaxy S24 Ultra 256GB",
    price: 1199,
    oldPrice: 1399,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    description:
      "Samsung's flagship smartphone with a stunning 6.8-inch Dynamic AMOLED display, S Pen, 200MP camera, and Galaxy AI features built-in.",
    stock: 150,
    rating: 4.7,
    orders: 1205,
    featured: true,
    brand: "Samsung",
    shipping: "Free Shipping",
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 348,
    oldPrice: 399,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    description:
      "Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours battery life.",
    stock: 200,
    rating: 4.6,
    orders: 890,
    featured: true,
    brand: "Sony",
    shipping: "Free Shipping",
  },
  {
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    price: 2499,
    oldPrice: 2899,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    description:
      "Full-frame mirrorless camera with 24.2MP sensor, 40fps continuous shooting, 6K RAW video, and advanced subject detection AF. Perfect for both photo and video.",
    stock: 35,
    rating: 4.9,
    orders: 156,
    featured: true,
    brand: "Canon",
    shipping: "Free Shipping",
  },
  {
    name: "Apple Watch Ultra 2 GPS + Cellular",
    price: 799,
    oldPrice: 899,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500",
    description:
      "The most rugged and capable Apple Watch with precision dual-frequency GPS, 36-hour battery life, 100m water resistance, and a brighter display.",
    stock: 80,
    rating: 4.7,
    orders: 567,
    featured: true,
    brand: "Apple",
    shipping: "Free Shipping",
  },
  {
    name: "Dell XPS 15 OLED Laptop",
    price: 1899,
    oldPrice: 2199,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500",
    description:
      "Premium 15.6-inch OLED display laptop with Intel Core i9, 32GB RAM, 1TB SSD. Ultra-slim design with InfinityEdge display for immersive viewing.",
    stock: 45,
    rating: 4.5,
    orders: 234,
    featured: false,
    brand: "Dell",
    shipping: "Free Shipping",
  },
  {
    name: "GoPro HERO12 Black Action Camera",
    price: 399,
    oldPrice: 449,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
    description:
      "Capture stunning 5.3K60 video and 27MP photos with HyperSmooth 6.0 stabilization. Waterproof to 33ft, with Max Lens Mod 2.0 compatibility.",
    stock: 120,
    rating: 4.4,
    orders: 678,
    featured: false,
    brand: "GoPro",
    shipping: "Free Shipping",
  },
  {
    name: "iPad Pro 12.9-inch M2 WiFi 256GB",
    price: 1099,
    oldPrice: 1299,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
    description:
      "Supercharged by M2, with a brilliant Liquid Retina XDR display, pro cameras, LiDAR Scanner, Thunderbolt, and Apple Pencil hover experience.",
    stock: 60,
    rating: 4.8,
    orders: 445,
    featured: true,
    brand: "Apple",
    shipping: "Free Shipping",
  },
  {
    name: "Bose QuietComfort Earbuds II",
    price: 279,
    oldPrice: 329,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500",
    description:
      "The world's best noise cancelling earbuds. Personalized noise cancelling and sound with CustomTune technology. 6 hours of battery life.",
    stock: 175,
    rating: 4.5,
    orders: 923,
    featured: false,
    brand: "Bose",
    shipping: "Free Shipping",
  },
  {
    name: "Samsung 65-inch OLED 4K Smart TV",
    price: 1799,
    oldPrice: 2199,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
    description:
      "Quantum HDR OLED with Neural Quantum Processor 4K. Dolby Atmos, Object Tracking Sound, and Smart Hub with gaming features.",
    stock: 30,
    rating: 4.6,
    orders: 189,
    featured: true,
    brand: "Samsung",
    shipping: "Free Shipping",
  },
  {
    name: "Logitech MX Master 3S Wireless Mouse",
    price: 99,
    oldPrice: 129,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    description:
      "Advanced wireless mouse with 8K DPI tracking, MagSpeed scroll wheel, and quiet clicks. Ergonomic design for all-day comfort.",
    stock: 300,
    rating: 4.7,
    orders: 1456,
    featured: false,
    brand: "Logitech",
    shipping: "Standard Shipping",
  },
  {
    name: "Nintendo Switch OLED Model",
    price: 349,
    oldPrice: 399,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500",
    description:
      "Vivid 7-inch OLED screen with enhanced audio, wide adjustable stand, wired LAN port, and 64GB internal storage for gaming on the go.",
    stock: 90,
    rating: 4.6,
    orders: 2103,
    featured: true,
    brand: "Nintendo",
    shipping: "Free Shipping",
  },
  {
    name: "DJI Mavic 3 Pro Drone",
    price: 2199,
    oldPrice: 2499,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
    description:
      "Tri-camera system with Hasselblad main camera, 4/3 CMOS sensor, 46-min max flight time, and omnidirectional obstacle sensing.",
    stock: 20,
    rating: 4.8,
    orders: 87,
    featured: false,
    brand: "DJI",
    shipping: "Free Shipping",
  },
  {
    name: "Dyson V15 Detect Vacuum Cleaner",
    price: 749,
    oldPrice: 849,
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500",
    description:
      "Intelligent cordless vacuum with laser dust detection, piezo sensor, and LCD screen showing real-time particle counts. Up to 60 min runtime.",
    stock: 65,
    rating: 4.5,
    orders: 534,
    featured: false,
    brand: "Dyson",
    shipping: "Free Shipping",
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    price: 159,
    oldPrice: 199,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1541140532154-b024d1b55240?w=500",
    description:
      "Full-size mechanical gaming keyboard with Cherry MX switches, per-key RGB lighting, aluminum frame, and programmable macros.",
    stock: 250,
    rating: 4.4,
    orders: 876,
    featured: false,
    brand: "Corsair",
    shipping: "Standard Shipping",
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 1199,
    oldPrice: 1399,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1561154464-82e9aab32f4c?w=500",
    description:
      "14.6-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, IP68 water resistance, and DeX mode for desktop experience.",
    stock: 40,
    rating: 4.6,
    orders: 321,
    featured: false,
    brand: "Samsung",
    shipping: "Free Shipping",
  },
  {
    name: "Fitbit Charge 6 Fitness Tracker",
    price: 159,
    oldPrice: 179,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
    description:
      "Advanced health and fitness tracker with built-in GPS, heart rate monitoring, stress management, and 7-day battery life. Google integration.",
    stock: 200,
    rating: 4.3,
    orders: 1567,
    featured: false,
    brand: "Fitbit",
    shipping: "Standard Shipping",
  },
  {
    name: "LG UltraGear 27-inch Gaming Monitor",
    price: 449,
    oldPrice: 549,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    description:
      "QHD IPS display with 165Hz refresh rate, 1ms response time, NVIDIA G-SYNC, and HDR10 support for immersive gaming.",
    stock: 75,
    rating: 4.5,
    orders: 645,
    featured: false,
    brand: "LG",
    shipping: "Free Shipping",
  },
  {
    name: "JBL Flip 6 Portable Bluetooth Speaker",
    price: 129,
    oldPrice: 149,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    description:
      "Portable waterproof speaker with bold JBL Original Pro Sound. IP67 dustproof and waterproof with 12 hours of playtime.",
    stock: 180,
    rating: 4.4,
    orders: 2345,
    featured: false,
    brand: "JBL",
    shipping: "Standard Shipping",
  },
  {
    name: "Google Pixel 8 Pro 128GB",
    price: 999,
    oldPrice: 1099,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    description:
      "Google's most advanced phone with Tensor G3 chip, 50MP triple camera, 6.7-inch LTPO OLED display, and 7 years of OS updates.",
    stock: 110,
    rating: 4.6,
    orders: 876,
    featured: true,
    brand: "Google",
    shipping: "Free Shipping",
  },
  {
    name: "Sony PlayStation 5 Console",
    price: 499,
    oldPrice: 549,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
    description:
      "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and stunning 4K gaming at up to 120fps.",
    stock: 55,
    rating: 4.8,
    orders: 3421,
    featured: true,
    brand: "Sony",
    shipping: "Free Shipping",
  },
  {
    name: "Xiaomi Robot Vacuum X10+",
    price: 599,
    oldPrice: 699,
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500",
    description:
      "Smart robot vacuum with LDS navigation, auto-empty station, 4000Pa suction, and mopping capability. Works with Alexa and Google Home.",
    stock: 45,
    rating: 4.3,
    orders: 234,
    featured: false,
    brand: "Xiaomi",
    shipping: "Free Shipping",
  },
  {
    name: "Anker PowerCore 26800mAh Power Bank",
    price: 65,
    oldPrice: 79,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    description:
      "High-capacity portable charger with dual USB ports, PowerIQ technology, and MultiProtect safety system. Charges iPhone 14 over 6 times.",
    stock: 400,
    rating: 4.5,
    orders: 5678,
    featured: false,
    brand: "Anker",
    shipping: "Standard Shipping",
  },
  {
    name: "ASUS ROG Strix Gaming Laptop",
    price: 1799,
    oldPrice: 2099,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    description:
      "15.6-inch 300Hz display, Intel Core i9, RTX 4070, 32GB RAM, 1TB SSD. Built for competitive gaming with advanced cooling system.",
    stock: 30,
    rating: 4.6,
    orders: 345,
    featured: false,
    brand: "ASUS",
    shipping: "Free Shipping",
  },
  {
    name: "Nikon Z8 Mirrorless Camera Body",
    price: 3999,
    oldPrice: 4499,
    category: "Cameras",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
    description:
      "45.7MP full-frame mirrorless with 8K30 video, 120fps burst shooting, dual card slots, and 5-axis in-body stabilization for professionals.",
    stock: 15,
    rating: 4.9,
    orders: 67,
    featured: false,
    brand: "Nikon",
    shipping: "Free Shipping",
  },
  {
    name: "Smart Home Hub with Alexa",
    price: 249,
    oldPrice: 299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500",
    description:
      "Central smart home controller with 10-inch touchscreen, Zigbee hub, premium speakers, and voice assistant. Controls 100+ compatible devices.",
    stock: 95,
    rating: 4.3,
    orders: 789,
    featured: false,
    brand: "Amazon",
    shipping: "Free Shipping",
  },
  {
    name: "OnePlus 12 5G 256GB",
    price: 799,
    oldPrice: 899,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    description:
      "Snapdragon 8 Gen 3 flagship with 6.82-inch 2K ProXDR display, 50MP Hasselblad camera, 100W SUPERVOOC charging, and 5400mAh battery.",
    stock: 130,
    rating: 4.5,
    orders: 567,
    featured: false,
    brand: "OnePlus",
    shipping: "Free Shipping",
  },
  {
    name: "Philips Hue Starter Kit",
    price: 199,
    oldPrice: 249,
    category: "Home Appliances",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500",
    description:
      "Smart lighting starter kit with 4 color bulbs and Bridge. 16 million colors, voice control, and automation routines for your home.",
    stock: 150,
    rating: 4.4,
    orders: 1234,
    featured: false,
    brand: "Philips",
    shipping: "Standard Shipping",
  },
  {
    name: "Xbox Series X 1TB Console",
    price: 499,
    oldPrice: 549,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500",
    description:
      "The fastest, most powerful Xbox ever with 12 teraflops of processing power, true 4K gaming, 120fps support, and 1TB custom SSD.",
    stock: 60,
    rating: 4.7,
    orders: 2345,
    featured: false,
    brand: "Microsoft",
    shipping: "Free Shipping",
  },
  {
    name: "Garmin Venu 3 GPS Smartwatch",
    price: 449,
    oldPrice: 499,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    description:
      "Advanced health and fitness GPS smartwatch with AMOLED display, sleep coach, body battery energy, and up to 14 days battery life.",
    stock: 70,
    rating: 4.5,
    orders: 432,
    featured: false,
    brand: "Garmin",
    shipping: "Free Shipping",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data.");

    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products.`);

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@ecommerce.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`Admin user created: ${admin.email}`);

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "user@ecommerce.com",
      password: "user123",
      role: "user",
    });
    console.log(`Test user created: ${user.email}`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📋 Login credentials:");
    console.log("  Admin: admin@ecommerce.com / admin123");
    console.log("  User:  user@ecommerce.com / user123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
