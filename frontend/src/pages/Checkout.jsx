import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  backdropFilter: "blur(24px)",
  padding: 28,
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  fontSize: 15,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 8,
  letterSpacing: 0.8,
  textTransform: "uppercase",
};

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

 const placeOrderHandler = async () => {
  try {
    const { data } = await api.post("/orders", {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      totalPrice,
    });

    alert("Order placed successfully 🎉");
    navigate("/myorders");
  } catch (error) {
    alert("Order failed");
  }
};


  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
        {/* Responsive two-column via CSS media inline fallback — use wrapper */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32 }}>

          {/* LEFT - SHIPPING */}
          <div style={glassCard}>
            <h2 style={{
              fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 24,
              letterSpacing: -0.5, fontFamily: "'Playfair Display', Georgia, serif"
            }}>Shipping Address</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>Address</label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  style={inputStyle}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <div>
                <label style={labelStyle}>City</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  style={inputStyle}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <div>
                <label style={labelStyle}>Postal Code</label>
                <input
                  type="text"
                  placeholder="400001"
                  style={inputStyle}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <div>
                <label style={labelStyle}>Country</label>
                <input
                  type="text"
                  placeholder="India"
                  style={inputStyle}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div style={{ ...glassCard, alignSelf: "start" }}>
            <h2 style={{
              fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 20,
              letterSpacing: -0.5, fontFamily: "'Playfair Display', Georgia, serif"
            }}>Order Summary</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(255,255,255,0.6)" }}
                >
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>₹{item.qty * item.price}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              <span>Total Items</span>
              <span style={{ color: "#fff" }}>{totalItems}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontWeight: 700, fontSize: 18, color: "#fff" }}>
              <span>Total Price</span>
              <span style={{ color: "#f59e0b" }}>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={placeOrderHandler}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                letterSpacing: 0.3,
                boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
