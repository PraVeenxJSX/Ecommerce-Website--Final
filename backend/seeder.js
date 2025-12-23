const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const Product = require("./models/Product");
const uploadImage = require("./utils/uploadImages");
const CATEGORIES = require("./constants/categories");


// 🔹 IMPORT ALL DATA
const acData = require("./data/acData");
const computerData = require("./data/computersData");
const furnitureData = require("./data/furnitureData");
const menData = require("./data/menData");
const womenData = require("./data/womenData");
const speakerData = require("./data/speakerData");
const booksData = require("./data/booksData");
const mobileData = require("./data/mobileData");
const tvData = require("./data/tvData");
const fridgeData = require("./data/fridgeData");
const kitchenData = require("./data/kitchenData");

mongoose.connect(process.env.MONGO_URI);

// 🔹 CATEGORY CONFIG (IMPORTANT)
const categories = [
  { data: acData, folder: "Ac", category: CATEGORIES.ELECTRONICS },
  { data: computerData, folder: "Computers", category: CATEGORIES.ELECTRONICS },
  { data: mobileData, folder: "Mobiles", category: CATEGORIES.ELECTRONICS },
  { data: tvData, folder: "TV", category: CATEGORIES.ELECTRONICS },
  { data: speakerData, folder: "Speakers", category: CATEGORIES.ELECTRONICS },

  { data: fridgeData, folder: "Fridge", category: CATEGORIES.APPLIANCES },

  { data: furnitureData, folder: "Furniture", category: CATEGORIES.HOME },
  { data: kitchenData, folder: "Kitchen", category: CATEGORIES.KITCHEN },

  { data: menData, folder: "MenWear", category: CATEGORIES.CLOTHING },
  { data: womenData, folder: "Women", category: CATEGORIES.CLOTHING },

  { data: booksData, folder: "Books", category: CATEGORIES.BOOKS },
];


const seedProducts = async () => {
  try {
    console.log("🧹 Clearing products...");
    await Product.deleteMany();

    let allProducts = [];

    for (const cat of categories) {
      console.log(`📦 Seeding ${cat.folder}...`);

      for (const item of cat.data) {
        const localImagePath = path.join(
          __dirname,
          "data",
          "assets",
          cat.folder,
          item.imageFile // MUST exist
        );

        const cloudImage = await uploadImage(
          localImagePath,
          `products/${cat.folder}`
        );

        allProducts.push({
  name: item.name || item.product, // ✅ SUPPORT BOTH
  price: Number(item.price),
  description: item.description,
  category: cat.category,
  countInStock: item.countInStock || 10,
  image: cloudImage,
});

      }
    }

    await Product.insertMany(allProducts);

    console.log("🔥 ALL PRODUCTS SEEDED WITH CLOUDINARY IMAGES");
    process.exit();
  } catch (error) {
    console.error("❌ SEED ERROR:", error);
    process.exit(1);
  }
  

};

seedProducts();
