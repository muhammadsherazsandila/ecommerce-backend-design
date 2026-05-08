import "dotenv/config";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/ecommerce";

// ─── Category mapping: normalize API categories → our store categories ────
const categoryMap = {
  // DummyJSON categories
  beauty: "Beauty",
  fragrances: "Fragrances",
  furniture: "Furniture",
  groceries: "Groceries",
  "home-decoration": "Home Decoration",
  "kitchen-accessories": "Kitchen Accessories",
  laptops: "Laptops",
  "mens-shirts": "Men's Clothing",
  "mens-shoes": "Men's Shoes",
  "mens-watches": "Men's Watches",
  "mobile-accessories": "Mobile Accessories",
  motorcycle: "Motorcycles",
  "skin-care": "Skin Care",
  smartphones: "Smartphones",
  "sports-accessories": "Sports",
  sunglasses: "Sunglasses",
  tablets: "Tablets",
  tops: "Women's Clothing",
  vehicle: "Vehicles",
  "womens-bags": "Women's Bags",
  "womens-dresses": "Women's Clothing",
  "womens-jewellery": "Women's Jewellery",
  "womens-shoes": "Women's Shoes",
  "womens-watches": "Women's Watches",
  // FakeStoreAPI categories
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing",
  jewelery: "Women's Jewellery",
  electronics: "Electronics",
};

// ─── Curated product selection: 60 products across diverse categories ──────
// Picked from DummyJSON + FakeStoreAPI to get a good mix
const selectedDummyJsonIds = [
  // Beauty (3)
  1, 3, 4,
  // Fragrances (3)
  6, 7, 9,
  // Furniture (3)
  11, 14, 15,
  // Kitchen Accessories (4)
  51, 52, 56, 66,
  // Laptops (3)
  78, 79, 82,
  // Men's Shirts (3)
  83, 85, 87,
  // Men's Shoes (3)
  88, 90, 91,
  // Men's Watches (3)
  93, 94, 95,
  // Mobile Accessories (3)
  99, 100, 101,
  // Smartphones (4)
  123, 125, 131, 133,
  // Sports (3)
  137, 140, 147,
  // Sunglasses (2)
  154, 156,
  // Tablets (2)
  159, 160,
  // Women's Bags (3)
  173, 174, 175,
  // Women's Dresses (3)
  177, 179, 180,
  // Women's Jewellery (2)
  182, 184,
  // Women's Shoes (2)
  186, 189,
  // Women's Watches (2)
  192, 194,
  // Skin Care (2)
  119, 120,
  // Home Decoration (2)
  43, 45,
];

// ─── Helper: Upload image URL to Cloudinary ────────────────────────────────
async function uploadToCloudinary(imageUrl, productName) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "ecommerce-products",
      public_id: productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, ""),
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: "limit", quality: "auto" },
      ],
    });
    return result.secure_url;
  } catch (err) {
    console.warn(
      `  ⚠ Cloudinary upload failed for "${productName}": ${err.message}`
    );
    return imageUrl; // fallback to original URL
  }
}

// ─── Helper: Fetch JSON from URL ──────────────────────────────────────────
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

// ─── Helper: Generate realistic oldPrice, orders, featured, shipping ──────
function enrichProduct(product) {
  const hasDiscount = Math.random() > 0.3;
  const oldPrice = hasDiscount
    ? +(product.price * (1 + Math.random() * 0.4 + 0.1)).toFixed(2)
    : null;
  const orders = Math.floor(Math.random() * 3000) + 10;
  const featured = Math.random() > 0.75;
  const shipping =
    product.price > 50 ? "Free Shipping" : "Standard Shipping";

  return { oldPrice, orders, featured, shipping };
}

// ─── Main seed function ───────────────────────────────────────────────────
async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas\n");

    // ── Step 1: Clear existing data ──
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`🗑  Deleting ${existingCount} existing products...`);
      await Product.deleteMany({});
    }
    await User.deleteMany({});
    console.log("🧹 Cleared existing data.\n");

    // ── Step 2: Fetch products from DummyJSON ──
    console.log("🌐 Fetching products from DummyJSON API...");
    const [page1, page2] = await Promise.all([
      fetchJSON(
        "https://dummyjson.com/products?limit=100&select=title,description,price,category,thumbnail,brand,rating,stock"
      ),
      fetchJSON(
        "https://dummyjson.com/products?limit=100&skip=100&select=title,description,price,category,thumbnail,brand,rating,stock"
      ),
    ]);
    const allDummyProducts = [...page1.products, ...page2.products];
    console.log(`  Fetched ${allDummyProducts.length} products from DummyJSON`);

    // ── Step 3: Fetch products from FakeStoreAPI ──
    console.log("🌐 Fetching products from FakeStoreAPI...");
    const fakeStoreProducts = await fetchJSON(
      "https://fakestoreapi.com/products"
    );
    console.log(
      `  Fetched ${fakeStoreProducts.length} products from FakeStoreAPI\n`
    );

    // ── Step 4: Filter selected DummyJSON products ──
    const selectedDummy = allDummyProducts.filter((p) =>
      selectedDummyJsonIds.includes(p.id)
    );

    // ── Step 5: Build products array & upload images to Cloudinary ──
    const allProducts = [];

    // Process DummyJSON products
    console.log(
      `📸 Uploading ${selectedDummy.length} DummyJSON product images to Cloudinary...\n`
    );
    for (let i = 0; i < selectedDummy.length; i++) {
      const p = selectedDummy[i];
      const category = categoryMap[p.category] || p.category;
      const enriched = enrichProduct(p);

      console.log(
        `  [${i + 1}/${selectedDummy.length}] ${p.title} (${category})`
      );

      const cloudinaryUrl = await uploadToCloudinary(p.thumbnail, p.title);

      allProducts.push({
        name: p.title,
        price: p.price,
        oldPrice: enriched.oldPrice,
        category,
        image: cloudinaryUrl,
        description: p.description,
        stock: p.stock,
        rating: Math.min(p.rating, 5),
        orders: enriched.orders,
        featured: enriched.featured,
        brand: p.brand || "",
        shipping: enriched.shipping,
      });
    }

    // Process FakeStoreAPI products (all 20)
    console.log(
      `\n📸 Uploading ${fakeStoreProducts.length} FakeStoreAPI product images to Cloudinary...\n`
    );
    for (let i = 0; i < fakeStoreProducts.length; i++) {
      const p = fakeStoreProducts[i];
      const category = categoryMap[p.category] || p.category;
      const enriched = enrichProduct({ price: p.price });

      console.log(
        `  [${i + 1}/${fakeStoreProducts.length}] ${p.title.slice(0, 50)}... (${category})`
      );

      const cloudinaryUrl = await uploadToCloudinary(p.image, p.title);

      allProducts.push({
        name: p.title,
        price: p.price,
        oldPrice: enriched.oldPrice,
        category,
        image: cloudinaryUrl,
        description: p.description,
        stock: Math.floor(Math.random() * 200) + 10,
        rating: p.rating?.rate
          ? Math.min(+(p.rating.rate).toFixed(1), 5)
          : +(Math.random() * 2 + 3).toFixed(1),
        orders: Math.floor(Math.random() * 2000) + 50,
        featured: enriched.featured,
        brand: "",
        shipping: enriched.shipping,
      });
    }

    // ── Step 6: Insert all products into MongoDB ──
    console.log(`\n💾 Inserting ${allProducts.length} products into MongoDB...`);
    const inserted = await Product.insertMany(allProducts);
    console.log(`✅ Inserted ${inserted.length} products!\n`);

    // ── Step 7: Print category summary ──
    const categorySummary = {};
    for (const p of allProducts) {
      categorySummary[p.category] = (categorySummary[p.category] || 0) + 1;
    }
    console.log("📊 Category breakdown:");
    for (const [cat, count] of Object.entries(categorySummary).sort()) {
      console.log(`   ${cat}: ${count} products`);
    }

    // ── Step 8: Create admin & test user ──
    console.log("\n👤 Creating users...");
    const admin = await User.create({
      name: "Admin",
      email: "admin@ecommerce.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`  Admin: ${admin.email}`);

    const user = await User.create({
      name: "Test User",
      email: "user@ecommerce.com",
      password: "user123",
      role: "user",
    });
    console.log(`  User:  ${user.email}`);

    // ── Done ──
    console.log("\n" + "═".repeat(55));
    console.log("  🎉 DATABASE SEEDED SUCCESSFULLY!");
    console.log("═".repeat(55));
    console.log(`  📦 ${inserted.length} products across ${Object.keys(categorySummary).length} categories`);
    console.log(`  🖼  Images uploaded to Cloudinary (ecommerce-products/)`);
    console.log(`  🔑 Admin: admin@ecommerce.com / admin123`);
    console.log(`  🔑 User:  user@ecommerce.com / user123`);
    console.log("═".repeat(55) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();
