import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  backdropFilter: "blur(24px)",
  padding: 24,
};

const OrderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  // Verify payment if redirected from Stripe
  useEffect(() => {
    const verifyPayment = async () => {
      if (searchParams.get("payment_success") === "true") {
        try {
          const { data } = await api.put(`/orders/${id}/pay`);
          setOrder(data);
          setPaymentMessage("Payment successful!");
          clearCart();
        } catch {
          setPaymentMessage("Payment verification failed. Please contact support.");
        }
      }
    };
    verifyPayment();
  }, [id, searchParams]);

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", padding: "48px 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>Loading order...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 32,
        letterSpacing: -0.8, fontFamily: "'Playfair Display', Georgia, serif"
      }}>Order Details</h1>

      {/* Payment Status Message */}
      {paymentMessage && (
        <div style={{
          ...glassCard,
          marginBottom: 24,
          background: paymentMessage.includes("successful")
            ? "rgba(52,211,153,0.1)"
            : "rgba(239,68,68,0.1)",
          border: paymentMessage.includes("successful")
            ? "1px solid rgba(52,211,153,0.3)"
            : "1px solid rgba(239,68,68,0.3)",
          textAlign: "center",
        }}>
          <p style={{
            color: paymentMessage.includes("successful") ? "#34d399" : "#ef4444",
            fontWeight: 700,
            fontSize: 16,
            margin: 0,
          }}>
            {paymentMessage}
          </p>
        </div>
      )}

      {/* ORDER INFO */}
      <div style={{ ...glassCard, marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Order ID:</span>{" "}
            <span style={{ color: "#fff", fontWeight: 600 }}>{order._id}</span>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Placed On:</span>{" "}
            <span style={{ color: "#fff", fontWeight: 500 }}>{new Date(order.createdAt).toLocaleString()}</span>
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Payment:</span>{" "}
            <span style={{
              color: order.isPaid ? "#34d399" : "#f59e0b",
              fontWeight: 600,
            }}>
              {order.isPaid ? "Paid" : "Pending"}
            </span>
            {order.isPaid && order.paidAt && (
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: 8 }}>
                on {new Date(order.paidAt).toLocaleString()}
              </span>
            )}
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Delivery:</span>{" "}
            <span style={{
              color: order.isDelivered ? "#34d399" : "#f59e0b",
              fontWeight: 600,
            }}>
              {order.isDelivered ? "Delivered" : "Pending"}
            </span>
          </p>
        </div>
      </div>

      {/* SHIPPING */}
      <div style={{ ...glassCard, marginBottom: 24 }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 16,
          letterSpacing: -0.3, fontFamily: "'Playfair Display', Georgia, serif"
        }}>Shipping Address</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>{order.shippingAddress.address}</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.postalCode}
          </p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>{order.shippingAddress.country}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div style={{ ...glassCard, marginBottom: 24 }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 20,
          letterSpacing: -0.3, fontFamily: "'Playfair Display', Georgia, serif"
        }}>Order Items</h2>

        {order.orderItems.map((item, index) => (
          <div
            key={item.product}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 0",
              borderBottom: index < order.orderItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: 72,
                height: 72,
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />

            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, margin: 0, marginBottom: 4 }}>{item.name}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                Qty: {item.qty}
              </p>
            </div>

            <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 16 }}>
              ₹{item.qty * item.price}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div style={{
        ...glassCard,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 12,
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18, fontWeight: 600 }}>Total:</span>
        <span style={{ color: "#f59e0b", fontSize: 24, fontWeight: 800 }}>₹{order.totalPrice}</span>
      </div>
    </div>
  );
};

export default OrderDetails;
