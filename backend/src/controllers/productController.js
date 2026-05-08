import { Product } from "../models/Product.js";
import { uploadToCloudinary } from "../middleware/upload.js";

// GET /api/products/homepage - Get all homepage data in a single request
export const getHomepageData = async (_req, res) => {
  try {
    const [categories, featured, recommended] = await Promise.all([
      Product.distinct("category"),
      Product.find({ featured: true }).limit(5).lean(),
      Product.find().sort("-orders").limit(10).lean(),
    ]);

    // Fetch products for top 6 categories in parallel
    const topCategories = categories.slice(0, 6);
    const categoryProducts = await Promise.all(
      topCategories.map((cat) =>
        Product.find({ category: cat }).limit(8).lean()
      )
    );

    const categorySections = topCategories.map((cat, i) => ({
      category: cat,
      products: categoryProducts[i],
    }));

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.json({
      success: true,
      categories,
      featured,
      recommended,
      categorySections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products - Get all products with pagination, search, and filters
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      minPrice,
      maxPrice,
      sort = "-createdAt",
      featured,
      brand,
    } = req.query;

    const conditions = [];

    // Text search across name, category, brand, description
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      conditions.push({
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { brand: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    // Filter by exact category
    if (category) {
      conditions.push({ category: { $regex: `^${category}$`, $options: "i" } });
    }

    // Filter by brand
    if (brand) {
      conditions.push({ brand: { $regex: brand, $options: "i" } });
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      conditions.push({ price: priceFilter });
    }

    // Filter by featured
    if (featured === "true") {
      conditions.push({ featured: true });
    }

    // Combine all conditions with $and
    const query = conditions.length > 0 ? { $and: conditions } : {};

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products/search - Dedicated search endpoint with suggestions
export const searchProducts = async (req, res) => {
  try {
    const { q = "", category, limit = 10 } = req.query;

    if (!q && !category) {
      return res.json({ success: true, products: [], suggestions: [] });
    }

    const conditions = [];

    if (q) {
      const searchRegex = { $regex: q, $options: "i" };
      conditions.push({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    if (category) {
      conditions.push({ category: { $regex: `^${category}$`, $options: "i" } });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};
    const limitNum = Math.max(1, Math.min(20, Number(limit)));

    const products = await Product.find(query)
      .sort("-orders")
      .limit(limitNum)
      .select("name price image category brand rating")
      .lean();

    // Generate search suggestions from matching product names
    const suggestions = q
      ? [...new Set(products.map((p) => p.name))].slice(0, 5)
      : [];

    res.json({
      success: true,
      products,
      suggestions,
      total: await Product.countDocuments(query),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products/featured - Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 20);
    const products = await Product.find({ featured: true }).limit(limit).lean();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products/categories - Get all unique categories
export const getCategories = async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products/:id - Get a single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/products - Create a product (admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice,
      category,
      image,
      description,
      stock,
      rating,
      orders,
      featured,
      brand,
      shipping,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required",
      });
    }

    // Upload image to Cloudinary if file is provided
    let imageUrl = image || "";
    if (req.file) {
      console.log("📷 Image file received:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: `${(req.file.size / 1024).toFixed(1)} KB`,
      });

      try {
        console.log("☁️  Uploading to Cloudinary...");
        const result = await uploadToCloudinary(req.file.buffer, "products");
        imageUrl = result.secure_url;
        console.log("✅ Cloudinary upload success:", {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        });
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload FAILED:", {
          message: uploadErr.message,
          http_code: uploadErr.http_code,
          name: uploadErr.name,
        });
        return res.status(500).json({
          success: false,
          message: `Image upload failed: ${uploadErr.message}`,
        });
      }
    } else {
      console.log("ℹ️  No image file attached, using URL:", imageUrl || "(none)");
    }

    const product = await Product.create({
      name,
      price,
      oldPrice,
      category,
      image: imageUrl,
      description,
      stock,
      rating,
      orders,
      featured: featured === "true" || featured === true,
      brand,
      shipping,
    });

    console.log("✅ Product created:", product.name, "| Image:", product.image || "(none)");

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ createProduct error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

