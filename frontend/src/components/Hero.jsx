import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section style={{ padding: "0 24px 72px" }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        borderRadius: 32,
        overflow: "hidden",
        position: "relative",
      }} className="glass-card-strong">
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 18% 20%, rgba(34, 211, 238,0.16), transparent 30%), radial-gradient(circle at 82% 30%, rgba(129,140,248,0.14), transparent 28%), linear-gradient(135deg, rgba(8,10,16,0.96), rgba(12,14,24,0.82))",
        }} />
        <div style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 28,
          alignItems: "center",
          padding: "56px 44px",
        }} className="hero-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <span className="section-eyebrow">Premium storefront</span>
            <h1 className="section-title" style={{ fontSize: "clamp(48px, 6vw, 88px)" }}>
              Luxury shopping
              <span style={{ display: "block", color: "#67e8f9" }}>with a cinematic feel</span>
            </h1>
            <p className="section-subtitle" style={{ maxWidth: 560 }}>
              Explore a polished storefront with elegant motion, richer product storytelling, and a cleaner path from browsing to checkout.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
              <Link to="/search?q=featured" className="modern-button">Explore collection</Link>
              <Link to="/myorders" className="modern-button modern-button-secondary">Track order</Link>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {["Free shipping", "Secure checkout", "30-day returns"].map((item) => (
                <span key={item} style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 13,
                }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            {[
              ["Featured drop", "Premium audio, fashion, and home essentials.", "#22d3ee"],
              ["Live support", "Ask the chatbot for products and shopping help.", "#818cf8"],
              ["Fast checkout", "Clear summary panels and Stripe flow.", "#34d399"],
            ].map(([title, desc, color]) => (
              <div key={title} style={{
                padding: 20,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(18px)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ color, fontWeight: 800, fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase" }}>{title}</div>
                    <div style={{ marginTop: 8, color: "#fff", fontSize: 18, fontWeight: 700 }}>{desc}</div>
                  </div>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${color}33, rgba(255,255,255,0.06))`,
                    border: `1px solid ${color}44`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
