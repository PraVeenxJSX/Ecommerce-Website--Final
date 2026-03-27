import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const glassCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 20,
  backdropFilter: "blur(24px)",
  padding: 24,
  transition: "all 0.3s ease",
};

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div style={{ minHeight: "100vh", padding: "48px 24px", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{
        fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 32,
        letterSpacing: -0.8, fontFamily: "'Playfair Display', Georgia, serif"
      }}>My Wishlist</h1>

      {loading ? (
        <div style={glassCard}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", margin: "24px 0" }}>
            Loading...
          </p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div style={glassCard}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", margin: "24px 0" }}>
            Your wishlist is empty
          </p>
          <div style={{ textAlign: "center" }}>
            <Link to="/" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {wishlistItems.map((item) => (
            <div
              key={item._id}
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
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                {/* Image */}
                <Link to={`/product/${item._id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 90, height: 90, objectFit: "cover", borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <Link to={`/product/${item._id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>
                      {item.name}
                    </h3>
                  </Link>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 4px" }}>
                    {item.category}
                  </p>
                  <p style={{ color: "#f59e0b", fontWeight: 800, fontSize: 18, margin: 0 }}>
                    ₹{item.price}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                  <button
                    onClick={() => { addToCart(item); }}
                    style={{
                      padding: "10px 20px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    style={{
                      width: 40, height: 40, borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
                      background: "rgba(239,68,68,0.1)", color: "#ef4444",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                    title="Remove from wishlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
