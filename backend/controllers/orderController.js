const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// CREATE ORDER (direct, no payment)
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

// CREATE STRIPE CHECKOUT SESSION
exports.createCheckoutSession = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  // 1. Create order in DB (unpaid)
  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  // 2. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses paise
      },
      quantity: item.qty,
    })),
    success_url: `${process.env.FRONTEND_URL}/order/${order._id}?payment_success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout`,
  });

  // 3. Save session ID on order
  order.stripeSessionId = session.id;
  await order.save();

  res.json({ orderId: order._id, url: session.url });
};

// VERIFY PAYMENT AND MARK ORDER AS PAID
exports.verifyAndMarkPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Only the order owner can verify payment
  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Already paid
  if (order.isPaid) {
    return res.json(order);
  }

  if (!order.stripeSessionId) {
    return res.status(400).json({ message: "No payment session found" });
  }

  // Verify with Stripe
  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

  if (session.payment_status === "paid") {
    order.isPaid = true;
    order.paidAt = Date.now();
    const updated = await order.save();
    return res.json(updated);
  }

  res.status(400).json({ message: "Payment not completed" });
};

// STRIPE WEBHOOK — server-to-server payment confirmation
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.payment_status === "paid") {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        await order.save();
        console.log(`Webhook: Order ${order._id} marked as paid`);
      }
    }
  }

  res.json({ received: true });
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
