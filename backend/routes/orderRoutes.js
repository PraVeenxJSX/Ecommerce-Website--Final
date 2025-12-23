const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  markOrderDelivered,
  getOrderById
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
// ADMIN: MARK DELIVERED
router.put("/:id/deliver", protect, admin, markOrderDelivered);
router.get("/:id", protect, getOrderById);



module.exports = router;
