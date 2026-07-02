import React from "react";
import { Link } from "react-router-dom";

const deals = [
  {
    title: "Mobiles",
    offer: "Up to 40% Off",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    to: "/category/Mobiles",
  },
  {
    title: "Laptops",
    offer: "Exchange Offers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    to: "/category/Laptops",
  },
  {
    title: "Home Appliances",
    offer: "Starting ₹999",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    to: "/category/Appliances",
  },
  {
    title: "Fashion",
    offer: "Min 50% Off",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80",
    to: "/category/Fashion",
  },
];

const Deals = () => {
  return (
    <section style={{ padding: "0 24px 40px" }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 18,
      }}>
        {deals.map((deal, index) => (
          <Link
            key={deal.title}
            to={deal.to}
            className="glass-card"
            style={{
              gridColumn: index < 2 ? "span 6" : "span 4",
              textDecoration: "none",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              minHeight: 220,
            }}
          >
            <img
              src={deal.image}
              alt={deal.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(2,4,10,0.15), rgba(2,4,10,0.88))",
            }} />
            <div style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              padding: 22,
            }}>
              <span className="section-eyebrow" style={{ width: "fit-content" }}>{deal.offer}</span>
              <h3 style={{ margin: "14px 0 0", fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "Bodoni Moda, serif" }}>
                {deal.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Deals;
