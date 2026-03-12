import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";

/* Category icons map */
const CAT_META = {
  Mobiles:      { icon: "📱", color: "#f59e0b", glow: "rgba(245,158,11,0.2)" },
  Laptops:      { icon: "💻", color: "#818cf8", glow: "rgba(129,140,248,0.2)" },
  Fashion:      { icon: "👗", color: "#f472b6", glow: "rgba(244,114,182,0.2)" },
  Appliances:   { icon: "🏠", color: "#34d399", glow: "rgba(52,211,153,0.2)" },
  Audio:        { icon: "🎧", color: "#fb923c", glow: "rgba(251,146,60,0.2)"  },
  Wearables:    { icon: "⌚", color: "#06b6d4", glow: "rgba(6,182,212,0.2)"   },
  Cameras:      { icon: "📷", color: "#ef4444", glow: "rgba(239,68,68,0.2)"   },
  Gaming:       { icon: "🎮", color: "#a855f7", glow: "rgba(168,85,247,0.2)"  },
  Furniture:    { icon: "🛋️", color: "#84cc16", glow: "rgba(132,204,22,0.2)"  },
  Books:        { icon: "📚", color: "#fbbf24", glow: "rgba(251,191,36,0.2)"  },
  Sports:       { icon: "⚽", color: "#22d3ee", glow: "rgba(34,211,238,0.2)"  },
  Groceries:    { icon: "🛒", color: "#4ade80", glow: "rgba(74,222,128,0.2)"  },
};

const fallback = { icon: "🏷️", color: "#f59e0b", glow: "rgba(245,158,11,0.2)" };

const CatCard = ({ cat, index }) => {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const meta = CAT_META[cat] || fallback;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    setTilt({ x, y });
  };

  return (
    <Link
      to={`/category/${cat}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={onMove}
      style={{
        textDecoration: "none",
        display: "block",
        animation: `catReveal 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s both`,
      }}
    >
      <div style={{
        position: "relative",
        padding: "28px 20px",
        borderRadius: 20,
        background: hov
          ? `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04))`
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${hov ? meta.color + "55" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(16px)",
        textAlign: "center",
        cursor: "pointer",
        transform: hov
          ? `perspective(600px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-6px)`
          : "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)",
        transition: hov
          ? "border-color 0.2s, background 0.2s, box-shadow 0.2s"
          : "all 0.45s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hov
          ? `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${meta.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
          : "0 4px 20px rgba(0,0,0,0.2)",
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}>
        {/* Glow circle behind icon */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: hov ? 140 : 80, height: hov ? 140 : 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)`,
          transition: "all 0.4s ease",
          pointerEvents: "none",
          filter: "blur(12px)",
        }} />

        {/* Shimmer sweep on hover */}
        {hov && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
            animation: "shimmerSweep 0.6s ease",
          }} />
        )}

        {/* Icon */}
        <div style={{
          fontSize: 36, marginBottom: 12, display: "block",
          transform: hov ? "translateZ(20px) scale(1.15)" : "translateZ(0) scale(1)",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          filter: hov ? `drop-shadow(0 4px 12px ${meta.color}88)` : "none",
        }}>
          {meta.icon}
        </div>

        {/* Name */}
        <div style={{
          color: hov ? "#fff" : "rgba(255,255,255,0.65)",
          fontWeight: 700, fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: 0.3,
          transform: hov ? "translateZ(12px)" : "translateZ(0)",
          transition: "all 0.3s ease",
        }}>{cat}</div>

        {/* Color accent line */}
        <div style={{
          marginTop: 10, height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
          opacity: hov ? 0.9 : 0.25,
          transition: "opacity 0.3s",
          transform: hov ? "translateZ(8px)" : "translateZ(0)",
        }} />
      </div>
    </Link>
  );
};

const Categories = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
      @keyframes catReveal {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes shimmerSweep {
        from { transform: translateX(-100%); }
        to   { transform: translateX(100%); }
      }
    `}</style>
    <div style={{
      background: "#0d0d14", padding: "32px 24px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: 16,
    }}>
      {CATEGORIES.map((cat, i) => (
        <CatCard key={cat} cat={cat} index={i} />
      ))}
    </div>
  </>
);

export default Categories;