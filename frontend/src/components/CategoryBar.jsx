import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";

const CAT_ICONS = {
  Mobiles: "📱", Laptops: "💻", Fashion: "👗", Appliances: "🏠",
  Audio: "🎧", Wearables: "⌚", Cameras: "📷", Gaming: "🎮",
  Furniture: "🛋️", Books: "📚", Sports: "⚽", Groceries: "🛒",
};

const CategoryBar = () => {
  const location = useLocation();
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const activeRef = useRef(null);

  const updateArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  // Slide indicator under active tab
  const updateIndicator = () => {
    if (activeRef.current && scrollRef.current) {
      const el = activeRef.current;
      const container = scrollRef.current;
      const elRect  = el.getBoundingClientRect();
      const conRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left:  el.offsetLeft,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateArrows();
    setTimeout(updateIndicator, 50);
  }, [location.pathname]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  // Scroll active item into view on route change
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');

        .catbar-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap; text-decoration: none;
          color: rgba(255,255,255,0.45);
          transition: color 0.2s, background 0.2s, transform 0.2s;
          position: relative; flex-shrink: 0;
        }
        .catbar-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
          transform: translateY(-1px);
        }
        .catbar-link.active {
          color: #fff;
          font-weight: 700;
        }
        .catbar-link .cat-icon {
          font-size: 14px;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .catbar-link:hover .cat-icon,
        .catbar-link.active .cat-icon { transform: scale(1.2); }

        .catbar-arrow {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6);
        }
        .catbar-arrow:hover:not(:disabled) {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.25);
          color: #fff; transform: scale(1.08);
        }
        .catbar-arrow:disabled { opacity: 0.2; cursor: not-allowed; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{
        position: "sticky", top: 66, zIndex: 40,
        background: "rgba(10,10,18,0.92)",
        backdropFilter: "blur(28px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        {/* Thin accent top line */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.3) 40%, rgba(99,102,241,0.3) 60%, transparent)" }} />

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 12px", display: "flex", alignItems: "center", gap: 6, height: 52 }}>
          {/* Left arrow */}
          <button className="catbar-arrow" disabled={!canLeft} onClick={() => scroll("left")} aria-label="Scroll left">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Scrollable category strip */}
          <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
            <div
              ref={scrollRef}
              className="no-scrollbar"
              style={{ display: "flex", alignItems: "center", gap: 2, overflowX: "auto", padding: "8px 0", touchAction: "pan-x" }}
            >
              {/* Sliding active indicator */}
              <div style={{
                position: "absolute", bottom: 4, height: 2, borderRadius: 2,
                background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                boxShadow: "0 0 8px rgba(245,158,11,0.6)",
                transition: "left 0.35s cubic-bezier(0.22,1,0.36,1), width 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.2s",
                pointerEvents: "none", zIndex: 2,
                ...indicatorStyle,
              }} />

              {CATEGORIES.map((cat) => {
                const isActive = location.pathname === `/category/${cat}`;
                return (
                  <Link
                    key={cat}
                    to={`/category/${cat}`}
                    ref={isActive ? activeRef : null}
                    className={`catbar-link${isActive ? " active" : ""}`}
                  >
                    <span className="cat-icon">{CAT_ICONS[cat] || "🏷️"}</span>
                    {cat}
                  </Link>
                );
              })}
            </div>

            {/* Fade-out edges when scrollable */}
            {canLeft  && <div style={{ position: "absolute", left:  0, top: 0, bottom: 0, width: 32, background: "linear-gradient(90deg, rgba(10,10,18,0.95), transparent)", pointerEvents: "none", zIndex: 1 }} />}
            {canRight && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 32, background: "linear-gradient(-90deg, rgba(10,10,18,0.95), transparent)", pointerEvents: "none", zIndex: 1 }} />}
          </div>

          {/* Right arrow */}
          <button className="catbar-arrow" disabled={!canRight} onClick={() => scroll("right")} aria-label="Scroll right">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default CategoryBar;