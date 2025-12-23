const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// GET LOGGED IN USER ORDERS
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// ADMIN: GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
};

// ADMIN: MARK ORDER AS DELIVERED
exports.markOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.json(updatedOrder);
};


// GET ORDER BY ID (User or Admin)
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name image");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // User can only see their own order
  if (
    !req.user.isAdmin &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json(order);
};
