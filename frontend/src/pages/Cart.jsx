import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateCartQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d0d14" }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
        <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>Your cart is empty</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 28, fontSize: 15 }}>Looks like you haven't added anything yet.</p>
        <Link to="/" style={{
          padding: "12px 28px", borderRadius: 100, background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
          boxShadow: "0 8px 24px rgba(245,158,11,0.3)"
        }}>Start shopping →</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0d0d14", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}
        className="cart-grid">
        {/* LEFT */}
        <div>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 900, marginBottom: 28, letterSpacing: -1, fontFamily: "'Playfair Display', Georgia, serif" }}>
            Shopping Cart
            <span style={{ marginLeft: 12, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: 0 }}>({totalItems} items)</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <AnimatePresence>
              {cartItems.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 20, padding: "20px 24px", display: "flex", gap: 20, alignItems: "center",
                    backdropFilter: "blur(20px)"
                  }}
                >
                  <Link to={`/product/${item._id}`} style={{ flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{
                      width: 90, height: 90, objectFit: "cover", borderRadius: 14,
                      transition: "transform 0.3s", display: "block"
                    }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    />
                  </Link>

                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item._id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: "0 0 4px", lineHeight: 1.3 }}>{item.name}</h3>
                    </Link>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 14px" }}>₹{item.price} each</p>

                    {/* Qty */}
                    <div style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(255,255,255,0.07)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", width: "fit-content" }}>
                      <button
                        onClick={() => updateCartQty(item._id, item.qty - 1)}
                        disabled={item.qty === 1}
                        style={{
                          width: 34, height: 34, borderRadius: "100%", border: "none",
                          background: "none", color: item.qty === 1 ? "rgba(255,255,255,0.2)" : "#fff",
                          cursor: item.qty === 1 ? "not-allowed" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >−</button>
                      <span style={{ color: "#fff", fontWeight: 700, minWidth: 28, textAlign: "center", fontSize: 15 }}>{item.qty}</span>
                      <button
                        onClick={() => updateCartQty(item._id, item.qty + 1)}
                        disabled={item.qty === item.countInStock}
                        style={{
                          width: 34, height: 34, borderRadius: "100%", border: "none",
                          background: "none", color: item.qty === item.countInStock ? "rgba(255,255,255,0.2)" : "#fff",
                          cursor: item.qty === item.countInStock ? "not-allowed" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                      >+</button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                    <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18 }}>₹{(item.price * item.qty).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171", padding: "5px 14px", borderRadius: 100, cursor: "pointer", fontSize: 13, fontWeight: 600,
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => { e.target.style.background = "rgba(239,68,68,0.2)"; e.target.style.borderColor = "rgba(239,68,68,0.4)"; }}
                      onMouseLeave={e => { e.target.style.background = "rgba(239,68,68,0.1)"; e.target.style.borderColor = "rgba(239,68,68,0.2)"; }}
                    >Remove</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "28px 24px", backdropFilter: "blur(24px)",
            position: "sticky", top: 24
          }}
        >
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 24, letterSpacing: -0.4 }}>Order Summary</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Subtotal ({totalItems} items)</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Shipping</span>
              <span style={{ color: "#34d399", fontWeight: 600, fontSize: 13 }}>FREE</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>Total</span>
              <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 20 }}>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 28px rgba(245,158,11,0.35)", letterSpacing: 0.2
            }}
          >Proceed to Checkout →</motion.button>

          <Link to="/" style={{ display: "block", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 16, textDecoration: "none" }}>
            ← Continue shopping
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;