import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes pulseRing {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }

        .hero-cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 100px; border: none;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
          color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
          box-shadow: 0 12px 36px rgba(245,158,11,0.4);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
        }
        .hero-cta-primary:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 20px 48px rgba(245,158,11,0.55);
        }
        .hero-cta-primary:active { transform: scale(0.97); }

        .hero-cta-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px; border-radius: 100px;
          background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.18);
          color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
          transition: all 0.25s ease; text-decoration: none;
          backdrop-filter: blur(12px);
        }
        .hero-cta-secondary:hover {
          background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; padding: 40px 24px !important; }
          .hero-grid > div:last-child { display: none !important; }
          .hero-stats { justify-content: center !important; }
          .hero-ctas { justify-content: center !important; }
          .hero-tags { justify-content: center !important; }
        }
      `}</style>

      <section style={{
        position: "relative",
        minHeight: "88vh",
        background: "#070710",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        {/* Radial gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,158,11,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 70% at 85% 20%, rgba(239,68,68,0.06) 0%, transparent 55%)",
        }} />

        {/* Subtle static grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.035,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Two-column grid layout */}
        <div className="hero-grid" style={{
          maxWidth: 1360, margin: "0 auto", padding: "60px 40px", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
          position: "relative", zIndex: 2,
        }}>
          {/* LEFT COLUMN -- Text content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Badge pill */}
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 100,
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                color: "#fbbf24", fontSize: 12, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#f59e0b",
                  display: "inline-block", boxShadow: "0 0 8px rgba(245,158,11,0.7)",
                }} />
                New arrivals — Summer 2025
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              margin: 0, lineHeight: 1.05, letterSpacing: -2,
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700,
            }}>
              <span style={{ display: "block", fontSize: "clamp(48px, 6vw, 84px)", color: "#fff" }}>
                Shop Beyond
              </span>
              <span style={{
                display: "block", fontSize: "clamp(52px, 6.5vw, 92px)",
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 45%, #818cf8 90%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                The Ordinary.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: 0, fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.5)",
              fontFamily: "'DM Sans', sans-serif", maxWidth: 440,
            }}>
              Curated products with stunning previews, fast delivery, and a
              shopping experience designed for the modern world.
            </p>

            {/* CTA buttons */}
            <div className="hero-ctas" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/search?q=featured" className="hero-cta-primary">
                Explore Collection
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/myorders" className="hero-cta-secondary">
                Track orders
              </Link>
            </div>

            {/* Tag pills */}
            <div className="hero-tags" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Free shipping", "30-day returns", "Secure checkout"].map((tag) => (
                <span key={tag} className="hero-tag">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" fill="rgba(52,211,153,0.35)" />
                    <path d="M3.5 6l2 2L8.5 4.5" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="hero-stats" style={{
              display: "flex", gap: 32, paddingTop: 20, marginTop: 4,
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b", fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>
                  12,400+
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginTop: 2 }}>
                  Happy customers
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#818cf8", fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>
                  3,800+
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginTop: 2 }}>
                  Products
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#34d399", fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>
                  98%
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginTop: 2 }}>
                  Satisfaction
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN -- Decorative */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            {/* Pulse rings */}
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 260, height: 260, borderRadius: "50%",
                border: "1px solid rgba(245,158,11,0.12)",
                animation: `pulseRing 3.5s ease ${i * 1.1}s infinite`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Trending badge card */}
            <div style={{
              position: "absolute", top: 20, right: 30,
              padding: "12px 18px", borderRadius: 14,
              background: "rgba(12,12,22,0.92)", border: "1px solid rgba(245,158,11,0.25)",
              backdropFilter: "blur(16px)",
              animation: "float 3s ease-in-out infinite",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              zIndex: 3,
            }}>
              <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>
                TRENDING
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginTop: 3 }}>
                Summer Picks
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>
                12 new arrivals
              </div>
            </div>

            {/* Rating badge card */}
            <div style={{
              position: "absolute", bottom: 40, left: 20,
              padding: "12px 18px", borderRadius: 14,
              background: "rgba(12,12,22,0.92)", border: "1px solid rgba(52,211,153,0.25)",
              backdropFilter: "blur(16px)",
              animation: "float 3.5s ease-in-out 0.6s infinite",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              zIndex: 3,
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 3 }}>
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>{star}</span>
                ))}
              </div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
                4.9 / 5.0
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>
                2.4k reviews
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(transparent, #0d0d14)",
          pointerEvents: "none", zIndex: 3,
        }} />
      </section>
    </>
  );
};

export default Hero;
