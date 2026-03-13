import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  backdropFilter: "blur(24px)",
  padding: 24,
  transition: "all 0.3s ease",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 32,
        letterSpacing: -0.8, fontFamily: "'Playfair Display', Georgia, serif"
      }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={glassCard}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", margin: "24px 0" }}>
            No orders found
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div
                style={glassCard}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                    Order ID: {order._id}
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>Total:</span>{" "}
                  <span style={{ color: "#f59e0b", fontWeight: 700 }}>₹{order.totalPrice}</span>
                </p>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0 }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Payment:</span>{" "}
                    <span style={{
                      color: order.isPaid ? "#34d399" : "#f59e0b",
                      fontWeight: 600,
                    }}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
