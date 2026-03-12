import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

/* ── Category meta ── */
const CAT_META = {
  Mobiles:    { icon: "📱", color: "#f59e0b", glow: "rgba(245,158,11,0.12)"   },
  Laptops:    { icon: "💻", color: "#818cf8", glow: "rgba(129,140,248,0.12)"  },
  Fashion:    { icon: "👗", color: "#f472b6", glow: "rgba(244,114,182,0.12)"  },
  Appliances: { icon: "🏠", color: "#34d399", glow: "rgba(52,211,153,0.12)"   },
  Audio:      { icon: "🎧", color: "#fb923c", glow: "rgba(251,146,60,0.12)"   },
  Wearables:  { icon: "⌚", color: "#06b6d4", glow: "rgba(6,182,212,0.12)"    },
  Cameras:    { icon: "📷", color: "#ef4444", glow: "rgba(239,68,68,0.12)"    },
  Gaming:     { icon: "🎮", color: "#a855f7", glow: "rgba(168,85,247,0.12)"   },
  Furniture:  { icon: "🛋️", color: "#84cc16", glow: "rgba(132,204,22,0.12)"   },
  Books:      { icon: "📚", color: "#fbbf24", glow: "rgba(251,191,36,0.12)"   },
  Sports:     { icon: "⚽", color: "#22d3ee", glow: "rgba(34,211,238,0.12)"   },
  Groceries:  { icon: "🛒", color: "#4ade80", glow: "rgba(74,222,128,0.12)"   },
};
const fallbackMeta = { icon: "🏷️", color: "#f59e0b", glow: "rgba(245,158,11,0.12)" };

/* ── Skeleton card ── */
const SkeletonCard = ({ i }) => (
  <div style={{
    borderRadius: 20, overflow: "hidden",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    animation: `pulse 1.5s ease-in-out ${i * 0.08}s infinite`,
  }}>
    <div style={{ height: 196, background: "rgba(255,255,255,0.05)" }} />
    <div style={{ padding: "16px" }}>
      <div style={{ height: 14, borderRadius: 6, background: "rgba(255,255,255,0.07)", width: "75%", marginBottom: 10 }} />
      <div style={{ height: 11, borderRadius: 6, background: "rgba(255,255,255,0.04)", width: "50%", marginBottom: 12 }} />
      <div style={{ height: 18, borderRadius: 6, background: "rgba(255,255,255,0.07)", width: "40%" }} />
    </div>
  </div>
);

/* ── Product card ── */
const ProductCard = ({ p, index, accentColor }) => {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const onMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x:  ((e.clientX - r.left)  / r.width  - 0.5) * 14,
      y: -((e.clientY - r.top)   / r.height - 0.5) * 10,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${p._id}`} style={{ textDecoration: "none", display: "block" }}>
        <div
          ref={cardRef}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
          onMouseMove={onMove}
          style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            background: hov ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${hov ? accentColor + "44" : "rgba(255,255,255,0.08)"}`,
            transform: hov
              ? `perspective(700px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-6px)`
              : "perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0px)",
            transition: hov
              ? "border-color 0.2s, background 0.2s, box-shadow 0.2s"
              : "all 0.45s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: hov
              ? `0 24px 56px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}22`
              : "0 4px 16px rgba(0,0,0,0.2)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", overflow: "hidden", height: 196 }}>
            <img
              src={p.image} alt={p.name}
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transform: hov ? "scale(1.07)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
              }}
            />
            {/* Overlay sheen */}
            <div style={{
              position: "absolute", inset: 0,
              background: hov
                ? "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, transparent 60%, rgba(0,0,0,0.35) 100%)"
                : "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)",
              transition: "background 0.4s",
            }} />
            {/* Out of stock badge */}
            {p.countInStock === 0 && (
              <span style={{
                position: "absolute", top: 10, left: 10,
                background: "rgba(239,68,68,0.9)", color: "#fff",
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5,
              }}>Out of stock</span>
            )}
            {/* Rating badge */}
            {p.rating && (
              <span style={{
                position: "absolute", top: 10, right: 10,
                background: "rgba(10,10,20,0.8)", backdropFilter: "blur(8px)",
                color: "#fbbf24", fontSize: 11, fontWeight: 700,
                padding: "3px 8px", borderRadius: 100,
                fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 3,
              }}>★ {p.rating.toFixed(1)}</span>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "14px 16px 18px", transformStyle: "preserve-3d" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>
              {p.category}
            </div>
            <h3 style={{
              color: hov ? "#fff" : "rgba(255,255,255,0.85)",
              fontWeight: 700, fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              margin: "0 0 10px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transform: hov ? "translateZ(8px)" : "translateZ(0)",
              transition: "transform 0.3s ease, color 0.2s",
            }}>{p.name}</h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                color: accentColor, fontWeight: 900, fontSize: 20,
                fontFamily: "'DM Sans', sans-serif",
                transform: hov ? "translateZ(10px)" : "translateZ(0)",
                transition: "transform 0.3s ease",
              }}>₹{p.price}</span>

              {/* Add to cart hint */}
              <span style={{
                opacity: hov ? 1 : 0,
                transform: hov ? "translateX(0) translateZ(6px)" : "translateX(8px) translateZ(0)",
                transition: "all 0.3s ease",
                fontSize: 12, fontWeight: 700, color: accentColor,
                fontFamily: "'DM Sans', sans-serif",
              }}>View →</span>
            </div>

            {/* Accent bottom bar */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              opacity: hov ? 0.8 : 0,
              transition: "opacity 0.3s",
            }} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ── Sorting/filter bar ── */
const SortBar = ({ count, sort, onSort }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
      {count} product{count !== 1 ? "s" : ""} found
    </span>
    <div style={{ display: "flex", gap: 8 }}>
      {[["newest", "Newest"], ["price-asc", "Price ↑"], ["price-desc", "Price ↓"]].map(([val, label]) => (
        <button key={val} onClick={() => onSort(val)} style={{
          padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
          background: sort === val ? "linear-gradient(135deg, #f59e0b, #ef4444)" : "rgba(255,255,255,0.06)",
          color: sort === val ? "#fff" : "rgba(255,255,255,0.45)",
          transition: "all 0.2s",
          boxShadow: sort === val ? "0 4px 14px rgba(245,158,11,0.3)" : "none",
        }}>{label}</button>
      ))}
    </div>
  </div>
);

/* ── Main component ── */
const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sort, setSort]           = useState("newest");
  const meta = CAT_META[category] || fallbackMeta;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setProducts([]);
        const { data } = await api.get(`/products?category=${category}`);
        setProducts(data.products || data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [category]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&family=Cormorant+Garamond:wght@700&display=swap');
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        @keyframes headerReveal { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
      `}</style>

      <div style={{ background: "#0d0d14", minHeight: "100vh", position: "relative" }}>
        {/* Ambient glow behind header */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 300,
          background: `radial-gradient(ellipse 70% 100% at 30% 0%, ${meta.glow} 0%, transparent 65%)`,
          pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 24px 64px", position: "relative", zIndex: 1 }}>

          {/* ── Category header ── */}
          <div style={{ marginBottom: 40, animation: "headerReveal 0.6s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              {/* Big emoji icon */}
              <div style={{
                width: 64, height: 64, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                background: `linear-gradient(135deg, ${meta.glow}, rgba(255,255,255,0.04))`,
                border: `1px solid ${meta.color}33`,
                fontSize: 32, boxShadow: `0 8px 24px ${meta.color}22`,
              }}>{meta.icon}</div>

              <div>
                <div style={{ color: meta.color, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 4 }}>
                  Category
                </div>
                <h1 style={{
                  margin: 0, lineHeight: 1, letterSpacing: -1.5,
                  fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700,
                  fontSize: "clamp(36px, 5vw, 60px)", color: "#fff",
                }}>{category}</h1>
              </div>
            </div>

            {/* Accent separator */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${meta.color}55, rgba(255,255,255,0.06) 40%, transparent)`, marginTop: 16 }} />
          </div>

          {/* ── Sort bar (only when loaded) ── */}
          {!loading && products.length > 0 && (
            <SortBar count={products.length} sort={sort} onSort={setSort} />
          )}

          {/* ── Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} i={i} />)
              : sorted.length > 0
                ? sorted.map((p, i) => (
                    <ProductCard key={p._id} p={p} index={i} accentColor={meta.color} />
                  ))
                : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", paddingTop: 80 }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                    <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 700, fontFamily: "'DM Sans'", marginBottom: 10 }}>No products found</h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans'", marginBottom: 24 }}>
                      Nothing in <strong style={{ color: meta.color }}>{category}</strong> yet. Check back soon!
                    </p>
                    <Link to="/" style={{ padding: "12px 24px", borderRadius: 100, background: `linear-gradient(135deg, ${meta.color}, #ef4444)`, color: "#fff", textDecoration: "none", fontWeight: 700, fontFamily: "'DM Sans'" }}>
                      Back to home →
                    </Link>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;