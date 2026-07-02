import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const banners = [
  {
    title: "Big Electronics",
    accent: "Up to 50% off",
    subtitle: "Sharp deals on mobiles, laptops, and accessories.",
    link: "/category/Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
    color: "#22d3ee",
  },
  {
    title: "Fashion Edit",
    accent: "Fresh arrivals",
    subtitle: "Elevated style pieces with premium finishes.",
    link: "/category/Fashion",
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1600&q=80",
    color: "#a855f7",
  },
  {
    title: "Home Upgrade",
    accent: "Designer essentials",
    subtitle: "Turn your space into something beautifully curated.",
    link: "/category/Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
    color: "#34d399",
  },
];

const HomeBanner = () => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((value) => (value + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[index];

  return (
    <section style={{ padding: "24px 24px 0" }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        borderRadius: 28,
        overflow: "hidden",
        position: "relative",
      }} className="glass-card">
        <div style={{ position: "relative", minHeight: "clamp(360px, 44vw, 560px)" }}>
          <img
            src={banner.image}
            alt={banner.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(100deg, rgba(3,5,12,0.94) 0%, rgba(3,5,12,0.72) 42%, rgba(3,5,12,0.24) 100%)",
          }} />

          <div style={{
            position: "relative",
            zIndex: 1,
            minHeight: "inherit",
            display: "flex",
            alignItems: "center",
            padding: "42px",
          }}>
            <div style={{ maxWidth: 640 }}>
              <span className="section-eyebrow" style={{ marginBottom: 18 }}>{banner.accent}</span>
              <h2 className="section-title" style={{ fontSize: "clamp(40px, 5vw, 78px)" }}>
                {banner.title}
                <span style={{ display: "block", color: banner.color }}>— elevated</span>
              </h2>
              <p className="section-subtitle" style={{ maxWidth: 460, marginTop: 18 }}>
                {banner.subtitle}
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <Link to={banner.link} className="modern-button">Shop now</Link>
                <button type="button" className="modern-button modern-button-secondary" onClick={next}>
                  Next highlight
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
