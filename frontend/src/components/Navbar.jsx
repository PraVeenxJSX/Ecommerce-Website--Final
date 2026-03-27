import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { CATEGORIES } from "../constants/categories";

/* ═══════════════════════════════════════════════════════
   CATEGORY META — icons + accent colours
═══════════════════════════════════════════════════════ */
const CAT_META = {
  Mobiles:    { icon: "📱", color: "#f59e0b" },
  Laptops:    { icon: "💻", color: "#818cf8" },
  Fashion:    { icon: "👗", color: "#f472b6" },
  Appliances: { icon: "🏠", color: "#34d399" },
  Audio:      { icon: "🎧", color: "#fb923c" },
  Wearables:  { icon: "⌚", color: "#06b6d4" },
  Cameras:    { icon: "📷", color: "#ef4444" },
  Gaming:     { icon: "🎮", color: "#a855f7" },
  Furniture:  { icon: "🛋️", color: "#84cc16" },
  Books:      { icon: "📚", color: "#fbbf24" },
  Sports:     { icon: "⚽", color: "#22d3ee" },
  Groceries:  { icon: "🛒", color: "#4ade80" },
};
const catMeta = (cat) => CAT_META[cat] || { icon: "🏷️", color: "#f59e0b" };

/* ═══════════════════════════════════════════════════════
   STATIC LOGO
═══════════════════════════════════════════════════════ */
const Logo = ({ size = 44 }) => (
  <div style={{
    width: size, height: size, borderRadius: 14, flexShrink: 0,
    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.45, fontWeight: 900, color: "#fff",
    boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
    cursor: "pointer",
  }}>V</div>
);

/* ═══════════════════════════════════════════════════════
   WORDMARK
═══════════════════════════════════════════════════════ */
const VortexWordmark = ({ size = 26 }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "baseline", gap: 0.5, userSelect: "none" }}>
      {"VORTEX".split("").map((l, i) => (
        <span key={i} style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: size, fontWeight: 900, letterSpacing: 3, lineHeight: 1, display: "inline-block",
          background: hov
            ? `linear-gradient(135deg, #f59e0b ${i*16}%, #ef4444 ${i*16+50}%, #818cf8 ${i*16+100}%)`
            : "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.82) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          transform: hov ? `translateY(${Math.sin(i * 0.8) * -3}px)` : "none",
          transition: `transform 0.3s ease ${i * 0.04}s, background 0.3s`,
          filter: hov ? "drop-shadow(0 2px 8px rgba(245,158,11,0.5))" : "none",
        }}>{l}</span>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ROTATING ANNOUNCEMENT BAR
═══════════════════════════════════════════════════════ */
const MSGS = [
  "🔥  Summer Sale — Up to 60% off on Electronics",
  "🚀  Free shipping on all orders above ₹499",
  "✨  New arrivals every week — Shop the Fashion Fest",
  "🎁  Gift cards available — perfect for every occasion",
];
const AnnouncementBar = ({ onDismiss }) => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(v => (v + 1) % MSGS.length); setFade(true); }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "relative", height: 36,
      background: "linear-gradient(90deg, #120800, #0d0b1c, #08101e, #0d0b1c, #120800)",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderBottom: "1px solid rgba(245,158,11,0.13)", overflow: "hidden" }}>
      {/* shimmer sweep */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.05) 50%, transparent 100%)",
        animation: "ann-sweep 4s linear infinite" }} />
      <p style={{ margin: 0, fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
        letterSpacing: 0.35, color: "rgba(255,255,255,0.72)",
        opacity: fade ? 1 : 0, transition: "opacity 0.3s" }}>{MSGS[idx]}</p>
      <button onClick={onDismiss} aria-label="Dismiss"
        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", color: "rgba(255,255,255,0.35)",
          cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0,
          transition: "color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.75)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>×</button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MEGA MENU — full category grid + promo panel
═══════════════════════════════════════════════════════ */
const MegaMenu = ({ open, onLinkClick }) => (
  <div style={{
    position: "absolute", top: "calc(100% + 12px)", left: "50%",
    width: "min(860px, 95vw)",
    background: "rgba(8, 8, 20, 0.99)", backdropFilter: "blur(36px)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 22,
    boxShadow: "0 36px 96px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,158,11,0.07)",
    padding: "26px 28px 30px",
    opacity: open ? 1 : 0,
    transform: open ? "translateX(-50%) translateY(0) scale(1)" : "translateX(-50%) translateY(-10px) scale(0.98)",
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.22s ease, transform 0.22s ease",
    zIndex: 500,
  }}>
    {/* top accent */}
    <div style={{ height: 2, marginBottom: 22,
      background: "linear-gradient(90deg, transparent, #f59e0b 28%, #ef4444 54%, #818cf8 78%, transparent)",
      borderRadius: 2 }} />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 28 }}>
      {/* Left — category grid */}
      <div>
        <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
          textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans'" }}>Browse All Categories</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {CATEGORIES.slice(0, 12).map(cat => {
            const m = catMeta(cat);
            return (
              <Link key={cat} to={`/category/${cat}`} onClick={onLinkClick}
                style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 12, background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.17s", cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${m.color}16`; e.currentTarget.style.borderColor = `${m.color}44`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "none"; }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{m.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans'" }}>{cat}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right — promo + quick links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ margin: "0 0 0", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
          textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans'" }}>Featured</p>

        {/* Promo card */}
        <div style={{ borderRadius: 16, padding: "18px 16px",
          background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.07))",
          border: "1px solid rgba(245,158,11,0.22)" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>🔥</div>
          <div style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
            textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 4 }}>Flash Sale</div>
          <div style={{ color: "#fff", fontSize: 17, fontWeight: 800, lineHeight: 1.25,
            fontFamily: "'DM Sans'", marginBottom: 12 }}>Up to 60% off — today only</div>
          <Link to="/search?q=sale" onClick={onLinkClick} style={{
            display: "inline-block", padding: "8px 16px", borderRadius: 100,
            background: "linear-gradient(135deg,#f59e0b,#ef4444)",
            color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans'",
            textDecoration: "none", boxShadow: "0 4px 14px rgba(245,158,11,0.38)" }}>Shop now →</Link>
        </div>

        {/* Quick links */}
        <div>
          {[["📦", "My Orders", "/myorders"], ["❤️", "Wishlist", "/wishlist"], ["🎁", "Gift Cards", "/gifts"]].map(([ic, lb, to]) => (
            <Link key={lb} to={to} onClick={onLinkClick}
              style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 2px",
                textDecoration: "none", color: "rgba(255,255,255,0.45)", fontSize: 13,
                fontFamily: "'DM Sans'", fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
              <span>{ic}</span>{lb}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   FULL-SCREEN SEARCH OVERLAY
═══════════════════════════════════════════════════════ */
const TRENDING = ["iPhone 15 Pro", "Samsung S24", "Nike Air Max", "boAt Airdopes", "MacBook Air M3", "PS5 Controller", "OnePlus Watch 2", "Levi's Jeans"];

const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 60); setQ(""); }
  }, [open]);
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const go = (term) => {
    const t = (term || q).trim();
    if (!t) return;
    navigate(`/search?q=${encodeURIComponent(t)}`);
    onClose();
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600,
      background: "rgba(4,4,14,0.95)", backdropFilter: "blur(24px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: "12vh", animation: "so-fade 0.18s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{ width: "min(680px, 90vw)", animation: "so-up 0.24s cubic-bezier(0.22,1,0.36,1)" }}>
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 0,
          background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(245,158,11,0.45)",
          borderRadius: 20, padding: "0 14px",
          boxShadow: "0 0 0 5px rgba(245,158,11,0.07), 0 32px 72px rgba(0,0,0,0.6)",
          marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, opacity: 0.55 }}>
            <circle cx="9" cy="9" r="6.5" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M14 14L18 18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") go(); }}
            placeholder="Search products, brands, categories…"
            style={{ flex: 1, background: "none", border: "none", outline: "none",
              fontSize: 20, color: "#fff", fontFamily: "'DM Sans', sans-serif",
              padding: "20px 14px", caretColor: "#f59e0b" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {q && (
              <button onClick={() => go()} style={{ padding: "8px 20px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans'",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(245,158,11,0.4)" }}>Search</button>
            )}
            <button onClick={onClose} style={{ padding: "5px 9px", borderRadius: 8,
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.11)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans'", letterSpacing: 0.5 }}>ESC</button>
          </div>
        </div>

        {/* Suggestions panel */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, padding: "22px 24px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
            textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans'" }}>🔥 Trending Searches</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {TRENDING.map(t => (
              <button key={t} onClick={() => go(t)} style={{
                padding: "7px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.62)",
                fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, cursor: "pointer", transition: "all 0.17s" }}
                onMouseEnter={e => { e.target.style.background = "rgba(245,158,11,0.13)"; e.target.style.borderColor = "rgba(245,158,11,0.32)"; e.target.style.color = "#fbbf24"; }}
                onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.62)"; }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 18 }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
              textTransform: "uppercase", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans'" }}>Browse Categories</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.slice(0, 8).map(cat => {
                const m = catMeta(cat);
                return (
                  <Link key={cat} to={`/category/${cat}`} onClick={onClose}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px",
                      borderRadius: 10, background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.52)", fontSize: 13, fontFamily: "'DM Sans'",
                      fontWeight: 500, textDecoration: "none", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = `${m.color}14`; e.currentTarget.style.borderColor = `${m.color}38`; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.52)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    <span style={{ fontSize: 15 }}>{m.icon}</span>{cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MOBILE SLIDE-IN DRAWER
═══════════════════════════════════════════════════════ */
const MobileDrawer = ({ open, onClose, user, logout, cartCount }) => {
  const location = useLocation();
  // Close on navigation
  useEffect(() => { if (open) onClose(); }, [location.pathname]);

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 700,
        background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transition: "opacity 0.32s" }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 710,
        width: "min(320px, 86vw)",
        background: "rgba(7,7,18,0.99)", backdropFilter: "blur(36px)",
        borderRight: "1px solid rgba(255,255,255,0.09)",
        boxShadow: open ? "16px 0 80px rgba(0,0,0,0.8)" : "none",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.36s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* top accent */}
        <div style={{ height: 2, flexShrink: 0,
          background: "linear-gradient(90deg, #f59e0b, #ef4444 50%, #818cf8)" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 18px 14px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={36} />
            <div>
              <VortexWordmark size={20} />
              <div style={{ fontSize: 8, letterSpacing: 3, color: "rgba(245,158,11,0.5)", fontFamily: "'DM Sans'", textTransform: "uppercase", marginTop: -1 }}>Commerce</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.11)",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
            ×
          </button>
        </div>

        {/* User / auth card */}
        <div style={{ margin: "0 16px 16px", padding: "14px 16px", borderRadius: 14, flexShrink: 0,
          background: user ? "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.06))" : "rgba(255,255,255,0.04)",
          border: `1px solid ${user ? "rgba(245,158,11,0.24)" : "rgba(255,255,255,0.08)"}` }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: "#fff" }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, fontFamily: "'DM Sans'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'DM Sans'", textAlign: "center", marginBottom: 2 }}>Sign in to your account</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login" onClick={onClose} style={{ flex: 1, textAlign: "center", padding: "11px", borderRadius: 11,
                  background: "linear-gradient(135deg,#f59e0b,#ef4444)", color: "#fff",
                  fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans'", textDecoration: "none" }}>Sign in</Link>
                <Link to="/register" onClick={onClose} style={{ flex: 1, textAlign: "center", padding: "11px", borderRadius: 11,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans'", textDecoration: "none" }}>Register</Link>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 14px",
          scrollbarWidth: "none", msOverflowStyle: "none" }}>

          <p style={{ margin: "4px 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
            color: "rgba(255,255,255,0.22)", fontFamily: "'DM Sans'", textTransform: "uppercase" }}>Navigation</p>

          {[
            ["🏠", "Home", "/", null],
            ["🛒", "Cart", "/cart", cartCount],
            ["📦", "My Orders", "/myorders", null],
            ["❤️", "Wishlist", "/wishlist", null],
            ...(user?.isAdmin ? [["⚡", "Admin Panel", "/admin", null]] : []),
          ].map(([icon, label, to, badge]) => (
            <Link key={to + label} to={to} onClick={onClose}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px",
                borderRadius: 12, marginBottom: 3, textDecoration: "none",
                color: "rgba(255,255,255,0.62)", fontSize: 15, fontFamily: "'DM Sans'", fontWeight: 500,
                transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.62)"; }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{icon}</span>
              <span style={{ flex: 1 }}>{label}</span>
              {badge > 0 && (
                <span style={{ padding: "2px 8px", borderRadius: 100,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff", fontSize: 11, fontWeight: 800 }}>{badge}</span>
              )}
            </Link>
          ))}

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0 14px" }} />

          <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: 2.5,
            color: "rgba(255,255,255,0.22)", fontFamily: "'DM Sans'", textTransform: "uppercase" }}>Categories</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {CATEGORIES.slice(0, 10).map(cat => {
              const m = catMeta(cat);
              return (
                <Link key={cat} to={`/category/${cat}`} onClick={onClose}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                    borderRadius: 11, background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.58)", fontSize: 13, fontFamily: "'DM Sans'",
                    fontWeight: 500, textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${m.color}12`; e.currentTarget.style.borderColor = `${m.color}30`; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.58)"; }}>
                  <span style={{ fontSize: 16 }}>{m.icon}</span>{cat}
                </Link>
              );
            })}
          </div>
          <div style={{ height: 24 }} />
        </div>

        {/* Sign-out footer */}
        {user && (
          <div style={{ padding: "14px 16px", flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => { logout(); onClose(); }}
              style={{ width: "100%", padding: "12px", borderRadius: 12,
                background: "rgba(239,68,68,0.09)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans'",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.36)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.09)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   ACCOUNT DROPDOWN
═══════════════════════════════════════════════════════ */
const AccountDropdown = ({ user, logout, onClose }) => (
  <div style={{ position: "absolute", right: 0, top: "calc(100% + 12px)", width: 240,
    background: "rgba(8,8,22,0.99)", backdropFilter: "blur(32px)",
    border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, overflow: "hidden",
    boxShadow: "0 30px 72px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04)",
    animation: "dd-open 0.2s cubic-bezier(0.22,1,0.36,1)", zIndex: 500 }}>
    {/* accent line */}
    <div style={{ height: 2, background: "linear-gradient(90deg, #f59e0b, #ef4444 55%, #818cf8)" }} />

    {user ? (
      <>
        {/* user header */}
        <div style={{ padding: "14px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg,#f59e0b,#ef4444)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, fontWeight: 800, color: "#fff",
              boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'DM Sans'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 12px 6px" }} />

        {[["📦", "My Orders", "/myorders", false], ["❤️", "Wishlist", "/wishlist", false],
          ["⚙️", "Settings", "/settings", false], ...(user.isAdmin ? [["⚡", "Admin Dashboard", "/admin", true]] : [])
        ].map(([ic, lb, to, highlight]) => (
          <Link key={lb} to={to} onClick={onClose}
            className="dd-item-vx"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
              fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans'",
              color: highlight ? "#fbbf24" : "rgba(255,255,255,0.7)", textDecoration: "none",
              transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = highlight ? "#f59e0b" : "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = highlight ? "#fbbf24" : "rgba(255,255,255,0.7)"; }}>
            <span style={{ fontSize: 16 }}>{ic}</span>{lb}
          </Link>
        ))}

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "6px 12px" }} />
        <button onClick={() => { logout(); onClose(); }}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
            width: "100%", border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans'", color: "#f87171",
            marginBottom: 4, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </>
    ) : (
      <div style={{ padding: "14px" }}>
        <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.42)", fontSize: 13,
          fontFamily: "'DM Sans'", textAlign: "center" }}>Sign in to your account</p>
        <Link to="/login" onClick={onClose} style={{ display: "block", textAlign: "center",
          padding: "12px", borderRadius: 12, marginBottom: 8,
          background: "linear-gradient(135deg,#f59e0b,#ef4444)",
          color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans'",
          textDecoration: "none", boxShadow: "0 4px 16px rgba(245,158,11,0.36)" }}>Sign in</Link>
        <Link to="/register" onClick={onClose} style={{ display: "block", textAlign: "center",
          padding: "11px", borderRadius: 12,
          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans'",
          textDecoration: "none" }}>Create account</Link>
      </div>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN NAVBAR
═══════════════════════════════════════════════════════ */
const Navbar = () => {
  const { user, logout }  = useAuth();
  const { cartItems }     = useCart();
  const { wishlistItems } = useWishlist();
  const navigate          = useNavigate();
  const location          = useLocation();

  const [annVisible,   setAnnVisible]   = useState(true);
  const [scrolled,     setScrolled]     = useState(false);
  const [megaOpen,     setMegaOpen]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [accountOpen,  setAccountOpen]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [query,        setQuery]        = useState("");
  const [searchFocus,  setSearchFocus]  = useState(false);

  const acctRef  = useRef(null);
  const megaRef  = useRef(null);
  const cartCount = cartItems?.reduce((a, i) => a + i.qty, 0) || 0;

  /* scroll depth */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close dropdowns on route change */
  useEffect(() => {
    setAccountOpen(false); setMegaOpen(false);
  }, [location.pathname]);

  /* click-outside account */
  useEffect(() => {
    const fn = e => { if (acctRef.current && !acctRef.current.contains(e.target)) setAccountOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* ⌘K shortcut */
  useEffect(() => {
    const fn = e => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const t = query.trim();
    if (!t) return;
    navigate(`/search?q=${encodeURIComponent(t)}`);
    setQuery("");
  };

  return (
    <>
      {/* ──────────────────── Global styles ──────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes ann-sweep  { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes dd-open    { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:none scale(1)} }
        @keyframes cart-pop   { 0%{transform:scale(0.5)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
        @keyframes so-fade    { from{opacity:0} to{opacity:1} }
        @keyframes so-up      { from{opacity:0;transform:translateY(-18px) scale(0.97)} to{opacity:1;transform:none} }

        /* ---- inline search bar ---- */
        .vx-search-bar {
          display: flex; align-items: center; flex: 1; max-width: 460px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px; padding: 0 6px 0 16px;
          transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
          cursor: text;
        }
        .vx-search-bar.focused {
          background: rgba(255,255,255,0.09);
          border-color: rgba(245,158,11,0.42);
          box-shadow: 0 0 0 4px rgba(245,158,11,0.08);
        }
        .vx-search-bar input {
          flex: 1; background: none; border: none; outline: none;
          font-size: 14px; color: #fff; font-family: 'DM Sans', sans-serif;
          padding: 11px 0;
        }
        .vx-search-bar input::placeholder { color: rgba(255,255,255,0.3); }

        /* ---- cart button ---- */
        .vx-cart {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 20px; border-radius: 100px;
          background: rgba(245,158,11,0.11); border: 1px solid rgba(245,158,11,0.24);
          color: #fbbf24; font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all 0.25s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap; flex-shrink: 0;
        }
        .vx-cart:hover {
          background: rgba(245,158,11,0.22); border-color: rgba(245,158,11,0.52);
          transform: translateY(-1px); box-shadow: 0 6px 22px rgba(245,158,11,0.22);
        }

        /* ---- account button ---- */
        .vx-acct {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 100px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.11);
          color: rgba(255,255,255,0.78); font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; flex-shrink: 0;
        }
        .vx-acct:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.24); color: #fff; }

        /* ---- icon button ---- */
        .vx-icon-btn {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.55); display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
        }
        .vx-icon-btn:hover { background: rgba(255,255,255,0.11); border-color: rgba(255,255,255,0.2); color: #fff; }

        /* ---- categories pill ---- */
        .vx-cats-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 100px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap; flex-shrink: 0;
        }
        .vx-cats-btn:hover, .vx-cats-btn.open {
          background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff;
        }

        /* ---- nav link (desktop) ---- */
        .vx-nav-link {
          position: relative; color: rgba(255,255,255,0.58);
          text-decoration: none; font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; padding: 4px 0; transition: color 0.2s; white-space: nowrap;
        }
        .vx-nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1.5px; border-radius: 2px;
          background: linear-gradient(90deg, #f59e0b, #ef4444); transition: width 0.3s ease;
        }
        .vx-nav-link:hover { color: #fff; }
        .vx-nav-link:hover::after { width: 100%; }

        /* ---- responsive helpers ---- */
        @media (max-width: 900px) { .vx-hide-md { display: none !important; } }
        @media (min-width: 901px) { .vx-show-md { display: none !important; } }
        @media (max-width: 600px) { .vx-hide-sm { display: none !important; } }
      `}</style>

      {/* ──────────────────── Announcement bar ──────────────────── */}
      {annVisible && <AnnouncementBar onDismiss={() => setAnnVisible(false)} />}

      {/* ──────────────────── Main nav ──────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(7,7,18,0.97)" : "rgba(7,7,18,0.80)",
        backdropFilter: "blur(30px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: scrolled ? "0 8px 44px rgba(0,0,0,0.58)" : "none",
        transition: "background 0.32s, box-shadow 0.32s",
      }}>
        {/* top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, #f59e0b 26%, #ef4444 52%, #818cf8 78%, transparent)",
          opacity: 0.88 }} />

        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 22px",
          height: 66, display: "flex", alignItems: "center", gap: 16 }}>

          {/* ── Mobile hamburger ── */}
          <button className="vx-icon-btn vx-show-md" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", flexShrink: 0 }}>
            <Logo size={44} />
            <div className="vx-hide-sm">
              <VortexWordmark size={25} />
              <span style={{ fontSize: 9.5, letterSpacing: 3.5, color: "rgba(245,158,11,0.55)",
                fontFamily: "'DM Sans'", fontWeight: 700, textTransform: "uppercase", display: "block", marginTop: -2 }}>Commerce</span>
            </div>
          </Link>

          {/* ── Categories trigger (desktop) ── */}
          <div className="vx-hide-md" ref={megaRef} style={{ position: "relative" }}
            onMouseLeave={() => setMegaOpen(false)}>
            <button className={`vx-cats-btn${megaOpen ? " open" : ""}`}
              onMouseEnter={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(v => !v)}>
              {/* grid icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1"   y="1"   width="5" height="5" rx="1.5" fill="currentColor" opacity="0.75" />
                <rect x="8"   y="1"   width="5" height="5" rx="1.5" fill="currentColor" />
                <rect x="1"   y="8"   width="5" height="5" rx="1.5" fill="currentColor" />
                <rect x="8"   y="8"   width="5" height="5" rx="1.5" fill="currentColor" opacity="0.75" />
              </svg>
              Categories
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                style={{ transform: megaOpen ? "rotate(180deg)" : "none", transition: "transform 0.22s", opacity: 0.5 }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <MegaMenu open={megaOpen} onLinkClick={() => setMegaOpen(false)} />
          </div>

          {/* ── Desktop nav links ── */}
          <div className="vx-hide-md" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link to="/"         className="vx-nav-link">Home</Link>
            <Link to="/myorders" className="vx-nav-link">Orders</Link>
          </div>

          {/* ── Inline search bar (desktop) ── */}
          <form onSubmit={handleSearch} className="vx-hide-md"
            style={{ flex: 1, maxWidth: 460 }} role="search">
            <div className={`vx-search-bar${searchFocus ? " focused" : ""}`}
              onClick={() => setSearchOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
                style={{ marginRight: 8, flexShrink: 0, opacity: searchFocus ? 0.8 : 0.38 }}>
                <circle cx="9" cy="9" r="6.5" stroke={searchFocus ? "#f59e0b" : "rgba(255,255,255,0.6)"} strokeWidth="1.5" />
                <path d="M14 14L18 18" stroke={searchFocus ? "#f59e0b" : "rgba(255,255,255,0.6)"} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans'" }}>
                Search products, brands…
              </span>
              <span style={{ padding: "3px 9px", borderRadius: 7, fontSize: 11, letterSpacing: 0.5,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans'", fontWeight: 700,
                flexShrink: 0, marginLeft: 8 }}>⌘K</span>
            </div>
          </form>

          {/* spacer */}
          <div style={{ flex: 1 }} />

          {/* ── Right actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

            {/* Mobile search icon */}
            <button className="vx-icon-btn vx-show-md" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Wishlist icon (desktop) */}
            <Link to="/wishlist" className="vx-icon-btn vx-hide-md" title="Wishlist" aria-label="Wishlist" style={{ position: "relative" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill={wishlistItems.length > 0 ? "#ef4444" : "none"}>
                <path d="M12 21C12 21 3 14 3 8.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 12.5-9 12.5z"
                  stroke={wishlistItems.length > 0 ? "#ef4444" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {wishlistItems.length > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 100, padding: "0 4px",
                  background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="vx-cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="vx-hide-sm">Cart</span>
              {cartCount > 0 && (
                <span key={cartCount} style={{ minWidth: 20, height: 20, borderRadius: 100, padding: "0 5px",
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff", fontSize: 11, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
                  animation: "cart-pop 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  flexShrink: 0 }}>{cartCount}</span>
              )}
            </Link>

            {/* Account */}
            <div ref={acctRef} style={{ position: "relative" }}>
              <button className="vx-acct" onClick={() => setAccountOpen(v => !v)} aria-haspopup="true" aria-expanded={accountOpen}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: user ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "rgba(255,255,255,0.14)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "#fff",
                  boxShadow: user ? "0 2px 10px rgba(245,158,11,0.4)" : "none" }}>
                  {user ? user.name?.[0]?.toUpperCase() : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="vx-hide-sm" style={{ maxWidth: 82, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user ? user.name?.split(" ")[0] : "Account"}
                </span>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="vx-hide-sm"
                  style={{ transform: accountOpen ? "rotate(180deg)" : "none", transition: "transform 0.22s", opacity: 0.44 }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {accountOpen && (
                <AccountDropdown user={user} logout={logout} onClose={() => setAccountOpen(false)} />
              )}
            </div>

          </div>{/* end right */}
        </div>{/* end inner */}
      </nav>

      {/* ──────────────────── Overlays ──────────────────── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}
        user={user} logout={logout} cartCount={cartCount} />
    </>
  );
};

export default Navbar;