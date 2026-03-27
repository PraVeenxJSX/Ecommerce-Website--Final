const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Stripe webhook needs raw body for signature verification — must be before express.json()
const { stripeWebhook } = require("./controllers/orderController");
app.post("/api/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "https://ecommerce-website-final-frontend.onrender.com",
  "http://localhost:5173"
];


app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Lightweight health endpoint for warm-up pings
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));