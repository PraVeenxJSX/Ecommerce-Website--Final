const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i", // case-insensitive
      };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean(); // Faster read

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};


// SEARCH PRODUCTS
exports.searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";

    if (!q || q.trim() === "") {
      return res.json([]);
    }

    // Use text search for performance if query is present
    // Note: requires text index on Product model
    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(50)
      .lean();

    res.json(products);
  } catch (error) {
    console.error("SEARCH PRODUCTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};




// CREATE PRODUCT (Admin later)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, countInStock } = req.body;

    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        message: "Invalid price value",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const product = new Product({
      name,
      price: numericPrice,
      description,
      category,
      countInStock: Number(countInStock) || 0,
      image: req.file.path,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("FULL MONGOOSE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description =
      req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.countInStock =
      req.body.countInStock || product.countInStock;

    // ✅ Only update image if new one is uploaded
    if (req.file) {
      product.image = req.file.path;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};



