import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
    tag: "Limited Time",
    title: "Big Electronics",
    titleAccent: "Sale",
    subtitle: "Up to 50% off on Mobiles & Laptops",
    cta: "Shop Electronics",
    link: "/category/Electronics",
    accentColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.22)",
    badge: "50% OFF",
    floatingIcon: "⚡",
    particles: ["📱", "💻", "🎧"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
    tag: "New Season",
    title: "Fashion",
    titleAccent: "Fest",
    subtitle: "Trending styles for Men & Women",
    cta: "Explore Fashion",
    link: "/category/Fashion",
    accentColor: "#a855f7",
    glowColor: "rgba(168,85,247,0.2)",
    badge: "NEW IN",
    floatingIcon: "✨",
    particles: ["👗", "👠", "👜"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80",
    tag: "Editor's Pick",
    title: "Home",
    titleAccent: "Essentials",
    subtitle: "Upgrade your living space today",
    cta: "Shop Home",
    link: "/category/Home",
    accentColor: "#34d399",
    glowColor: "rgba(52,211,153,0.18)",
    badge: "TRENDING",
    floatingIcon: "🏡",
    particles: ["🛋️", "🪴", "🕯️"],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1600&q=80",
    tag: "Get Fit",
    title: "Sports &",
    titleAccent: "Fitness",
    subtitle: "Gear up and crush your goals",
    cta: "Shop Sports",
    link: "/category/Sports",
    accentColor: "#f43f5e",
    glowColor: "rgba(244,63,94,0.2)",
    badge: "NEW GEAR",
    floatingIcon: "🏋️",
    particles: ["🏃", "🎯", "💪"],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80",
    tag: "Capture Life",
    title: "Camera &",
    titleAccent: "Optics",
    subtitle: "Professional gear for every shot",
    cta: "Shop Cameras",
    link: "/category/Cameras",
    accentColor: "#38bdf8",
    glowColor: "rgba(56,189,248,0.18)",
    badge: "PRO PICKS",
    floatingIcon: "📸",
    particles: ["🔭", "🎞️", "🌅"],
  },
];

const KB_TRANSFORMS = [
  { from: "scale(1.14) translateX(-3%)", to: "scale(1) translateX(0%)" },
  { from: "scale(1.1) translateY(-2.5%)", to: "scale(1.05) translateY(2%)" },
  { from: "scale(1.08) translateX(3%)", to: "scale(1) translateX(-1.5%)" },
  { from: "scale(1.12) translateY(2%)", to: "scale(1.04) translateY(-1%)" },
  { from: "scale(1.1) translateX(-2%) translateY(1%)", to: "scale(1) translateX(1%) translateY(-1%)" },
];

const HomeBanner = () => {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef(null);
  const DURATION = 5500;

  const goTo = (next, direction = 1) => {
    if (animating || next === index) return;
    setPrev(index);
    setDir(direction);
    setAnimating(true);
    setIndex(next);
    setProgress(0);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 800);
  };

  useEffect(() => {
    if (hovered) return;
    let start = null;
    let raf;
    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      setProgress(Math.min(elapsed / DURATION, 1));
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        const next = (index + 1) % banners.length;
        goTo(next, 1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, hovered]);

  const onMouseMove = (e) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setMousePos({ x, y });
    setTilt({ x: y * 8, y: x * -8 });
  };

  const banner = banners[index];
  const prevBanner = prev !== null ? banners[prev] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,700;1,600&display=swap');

        @keyframes kbZoom {
          from { transform: var(--kb-from); }
          to   { transform: var(--kb-to); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(7%) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-7%) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
          to   { opacity: 0; transform: translateX(-5%) scale(0.97); filter: blur(3px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
          to   { opacity: 0; transform: translateX(5%) scale(0.97); filter: blur(3px); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(32px) rotateX(20deg); }
          to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
        @keyframes tagPop {
          from { opacity: 0; transform: translateY(14px) scale(0.85) rotateX(30deg); }
          to   { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0px) rotateY(0deg) rotateZ(3deg); }
          33%      { transform: translateY(-8px) rotateY(5deg) rotateZ(3deg); }
          66%      { transform: translateY(-4px) rotateY(-5deg) rotateZ(3deg); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        @keyframes orbit3D {
          0%   { transform: rotateZ(0deg) translateX(60px) rotateZ(0deg) rotateY(0deg); }
          100% { transform: rotateZ(360deg) translateX(60px) rotateZ(-360deg) rotateY(360deg); }
        }
        @keyframes floatParticle1 {
          0%,100% { transform: translate(0,0) rotate(0deg) scale(1); opacity:0.7; }
          25%  { transform: translate(15px,-20px) rotate(10deg) scale(1.1); opacity:1; }
          50%  { transform: translate(5px,-35px) rotate(-5deg) scale(0.9); opacity:0.8; }
          75%  { transform: translate(-10px,-15px) rotate(15deg) scale(1.05); opacity:0.9; }
        }
        @keyframes floatParticle2 {
          0%,100% { transform: translate(0,0) rotate(0deg) scale(1); opacity:0.6; }
          33%  { transform: translate(-20px,-25px) rotate(-12deg) scale(1.15); opacity:0.9; }
          66%  { transform: translate(10px,-40px) rotate(8deg) scale(0.85); opacity:0.7; }
        }
        @keyframes floatParticle3 {
          0%,100% { transform: translate(0,0) rotate(0deg) scale(1); opacity:0.65; }
          40%  { transform: translate(25px,-18px) rotate(20deg) scale(1.1); opacity:0.95; }
          80%  { transform: translate(-5px,-30px) rotate(-10deg) scale(0.9); opacity:0.75; }
        }
        @keyframes depthCard {
          from { opacity: 0; transform: perspective(800px) rotateY(-25deg) translateX(60px) scale(0.85); }
          to   { opacity: 1; transform: perspective(800px) rotateY(0deg) translateX(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ringExpand {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity:1; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity:0; }
        }
        @keyframes counterReveal {
          from { opacity:0; transform: translateY(20px) rotateX(45deg); }
          to   { opacity:1; transform: translateY(0) rotateX(0deg); }
        }

        .banner-slide-enter-fwd  { animation: slideInRight  0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .banner-slide-enter-bwd  { animation: slideInLeft   0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .banner-slide-exit-left  { animation: slideOutLeft  0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .banner-slide-exit-right { animation: slideOutRight 0.7s cubic-bezier(0.22,1,0.36,1) both; }

        .banner-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 30px; border-radius: 100px; border: none; cursor: pointer;
          font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          color: #fff; text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
          position: relative; overflow: hidden;
          transform-style: preserve-3d;
        }
        .banner-cta::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .banner-cta:hover { transform: translateY(-4px) scale(1.05) rotateX(-3deg); }
        .banner-cta:hover::after { opacity: 1; }
        .banner-cta:active { transform: scale(0.96) rotateX(2deg); }

        .thumb-dot {
          height: 4px; border-radius: 2px; background: rgba(255,255,255,0.25);
          cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); flex-shrink: 0;
          min-width: 20px;
        }
        .thumb-dot.active { min-width: 44px; }
        .thumb-dot:hover:not(.active) { background: rgba(255,255,255,0.5); transform: scaleY(1.5); }

        .nav-arrow {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); color: #fff;
          transform-style: preserve-3d;
        }
        .nav-arrow:hover {
          background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.5);
          transform: scale(1.15) rotateY(10deg);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 4px 0 16px rgba(255,255,255,0.1);
        }
        .nav-arrow:nth-child(1):hover { transform: scale(1.15) rotateY(-10deg); }

        .particle-float-1 { animation: floatParticle1 4s ease-in-out infinite; }
        .particle-float-2 { animation: floatParticle2 5s ease-in-out infinite 0.8s; }
        .particle-float-3 { animation: floatParticle3 4.5s ease-in-out infinite 1.5s; }

        .depth-card-enter { animation: depthCard 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #fff 35%, rgba(255,255,255,0.4) 50%, #fff 65%, #fff 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { setMousePos({ x: 0, y: 0 }); setTilt({ x: 0, y: 0 }); setHovered(false); }}
        onMouseEnter={() => setHovered(true)}
        style={{
          position: "relative", height: "clamp(360px, 48vw, 580px)",
          width: "100%", overflow: "hidden", background: "#060610",
          userSelect: "none",
          perspective: "1200px",
        }}
      >
        {/* ── Previous slide (exiting) ── */}
        {prevBanner && (
          <div
            className={dir > 0 ? "banner-slide-exit-left" : "banner-slide-exit-right"}
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <img
              src={prevBanner.image} alt={prevBanner.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.12) 100%)" }} />
          </div>
        )}

        {/* ── Current slide (entering) ── */}
        <div
          key={index}
          className={animating ? (dir > 0 ? "banner-slide-enter-fwd" : "banner-slide-enter-bwd") : ""}
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            transform: `rotateX(${tilt.x * 0.3}deg) rotateY(${tilt.y * 0.3}deg)`,
            transition: "transform 0.5s ease",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ken Burns image */}
          <img
            key={`img-${index}`}
            src={banner.image} alt={banner.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              "--kb-from": KB_TRANSFORMS[index % KB_TRANSFORMS.length].from,
              "--kb-to":   KB_TRANSFORMS[index % KB_TRANSFORMS.length].to,
              animation: `kbZoom ${DURATION}ms ease-out both`,
              transformOrigin: "center center",
            }}
          />

          {/* Layered overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.48) 48%, rgba(0,0,0,0.1) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 65% 90% at 3% 50%, ${banner.glowColor} 0%, transparent 65%)`, animation: "glowPulse 3s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 40% 60% at 100% 100%, ${banner.glowColor} 0%, transparent 60%)`, opacity: 0.5 }} />

          {/* Scanline effect */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.025, pointerEvents: "none", zIndex: 3 }}>
            <div style={{
              position: "absolute", left: 0, right: 0, height: "25%",
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              animation: "scanline 5s linear infinite",
            }} />
          </div>

          {/* Noise grain */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none", zIndex: 3,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }} />

          {/* 3D Grid overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, opacity: 0.04,
            backgroundImage: `linear-gradient(${banner.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${banner.accentColor} 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            transform: `perspective(800px) rotateX(60deg) translateY(30%)`,
            maskImage: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }} />

          {/* Floating 3D particles */}
          <div style={{ position: "absolute", right: "clamp(180px, 22%, 320px)", bottom: "clamp(80px, 15%, 140px)", zIndex: 4, pointerEvents: "none" }}>
            {banner.particles.map((emoji, i) => (
              <div
                key={`p-${index}-${i}`}
                className={`particle-float-${i + 1}`}
                style={{
                  position: "absolute",
                  left: [0, 60, -40][i], top: [0, -50, -90][i],
                  fontSize: [28, 22, 20][i],
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))",
                  transformStyle: "preserve-3d",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* ── Parallax content wrapper ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 4,
            display: "flex", alignItems: "center",
            transform: `translate(${mousePos.x * -14}px, ${mousePos.y * -9}px)`,
            transition: "transform 0.45s ease",
            transformStyle: "preserve-3d",
          }}>
            <div style={{ padding: "0 clamp(24px, 6vw, 80px)", maxWidth: 700 }}>

              {/* Tag */}
              <div
                key={`tag-${index}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 16px", borderRadius: 100, marginBottom: 22,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(16px)",
                  animation: "tagPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
                  boxShadow: `0 4px 24px ${banner.accentColor}22`,
                  transformStyle: "preserve-3d",
                  transform: `translateZ(30px)`,
                }}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: banner.accentColor,
                  boxShadow: `0 0 10px ${banner.accentColor}, 0 0 20px ${banner.accentColor}66`,
                  animation: "glowPulse 1.5s ease-in-out infinite",
                  display: "inline-block",
                }} />
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                  {banner.tag}
                </span>
              </div>

              {/* Headline with 3D depth */}
              <h2
                key={`h-${index}`}
                style={{
                  margin: "0 0 12px", lineHeight: 1.0, letterSpacing: -2,
                  fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700,
                  animation: "revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.18s both",
                  transformStyle: "preserve-3d",
                  transform: `translateZ(20px)`,
                  textShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <span style={{ display: "block", fontSize: "clamp(40px, 6vw, 82px)", color: "#fff", opacity: 0.92 }}>
                  {banner.title}
                </span>
                <span style={{
                  display: "block", fontSize: "clamp(44px, 6.8vw, 92px)",
                  background: `linear-gradient(135deg, ${banner.accentColor} 0%, #fff 75%)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  filter: `drop-shadow(0 0 30px ${banner.accentColor}88)`,
                }}>
                  {banner.titleAccent}
                </span>
              </h2>

              {/* Subtitle */}
              <p
                key={`p-${index}`}
                style={{
                  margin: "0 0 30px", fontSize: "clamp(14px, 1.9vw, 18px)",
                  color: "rgba(255,255,255,0.58)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65,
                  animation: "revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.28s both",
                  maxWidth: 500,
                  transform: `translateZ(10px)`,
                }}
              >
                {banner.subtitle}
              </p>

              {/* CTA row */}
              <div
                key={`cta-${index}`}
                style={{
                  display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
                  animation: "revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.38s both",
                  transform: `translateZ(40px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <Link
                  to={banner.link}
                  className="banner-cta"
                  style={{
                    background: `linear-gradient(135deg, ${banner.accentColor} 0%, ${banner.accentColor}cc 100%)`,
                    boxShadow: `0 14px 40px ${banner.accentColor}55, 0 2px 0 rgba(255,255,255,0.15) inset, 0 -2px 0 rgba(0,0,0,0.2) inset`,
                  }}
                >
                  {banner.cta}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link
                  to="/"
                  className="banner-cta"
                  style={{
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1) inset",
                  }}
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>

          {/* ── 3D Floating Badge ── */}
          <div style={{
            position: "absolute", top: "clamp(20px, 5%, 48px)", right: "clamp(20px, 8%, 80px)",
            zIndex: 5,
            transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 14}px)`,
            transition: "transform 0.5s ease",
            animation: "badgeFloat 4s ease-in-out infinite",
            transformStyle: "preserve-3d",
          }}>
            {/* Depth ring pulse */}
            <div style={{
              position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%",
              borderRadius: 20, border: `1px solid ${banner.accentColor}44`,
              animation: "ringExpand 2.5s ease-out infinite",
              pointerEvents: "none",
            }} />

            <div
              key={`badge-${index}`}
              className="depth-card-enter"
              style={{
                padding: "16px 22px", borderRadius: 20,
                background: "rgba(8,8,20,0.88)", backdropFilter: "blur(24px)",
                border: `1px solid ${banner.accentColor}44`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${banner.accentColor}18, 0 4px 0 ${banner.accentColor}33`,
                textAlign: "center",
                transform: `perspective(600px) rotateY(-8deg) rotateX(5deg)`,
                transition: "transform 0.4s ease",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>{banner.floatingIcon}</div>
              <div style={{
                fontSize: "clamp(22px, 3.2vw, 30px)", fontWeight: 900,
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                background: `linear-gradient(135deg, ${banner.accentColor} 0%, #fff 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: 1.5,
                filter: `drop-shadow(0 2px 8px ${banner.accentColor}88)`,
              }}>{banner.badge}</div>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3,
              }}>
                This week only
              </div>
            </div>
          </div>

          {/* ── Side stats card (3D depth) ── */}
          <div style={{
            position: "absolute", bottom: "clamp(70px, 12%, 100px)", right: "clamp(20px, 8%, 80px)",
            zIndex: 5,
            transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 10}px) perspective(600px) rotateY(-6deg)`,
            transition: "transform 0.5s ease",
            animation: "revealUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.6s both",
          }}>
            <div style={{
              padding: "12px 18px", borderRadius: 14,
              background: "rgba(8,8,20,0.75)", backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
              display: "flex", gap: 20,
            }}>
              {[["10K+", "Products"], ["4.8★", "Rating"], ["Fast", "Delivery"]].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: 16, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif",
                    color: banner.accentColor, letterSpacing: 1,
                    textShadow: `0 0 12px ${banner.accentColor}88`,
                  }}>{val}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Slide counter (3D perspective) ── */}
          <div style={{
            position: "absolute", bottom: 72, left: "clamp(24px, 6vw, 80px)", zIndex: 5,
            display: "flex", alignItems: "flex-end", gap: 4,
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            transform: `translateZ(15px) perspective(400px) rotateX(${-tilt.x * 0.5}deg)`,
            animation: "counterReveal 0.5s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}>
            <span key={`count-${index}`} style={{ fontSize: 52, lineHeight: 1, color: "#fff", opacity: 0.85, textShadow: `0 0 30px ${banner.accentColor}55` }}>
              0{index + 1}
            </span>
            <span style={{ fontSize: 18, lineHeight: 1, color: "rgba(255,255,255,0.22)", marginBottom: 8 }}> / 0{banners.length}</span>
          </div>
        </div>

        {/* ── Navigation arrows ── */}
        <button
          onClick={() => goTo((index - 1 + banners.length) % banners.length, -1)}
          className="nav-arrow"
          style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => goTo((index + 1) % banners.length, 1)}
          className="nav-arrow"
          style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* ── Dot nav with progress ── */}
        <div style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", alignItems: "center", gap: 8,
        }}>
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              className={`thumb-dot${i === index ? " active" : ""}`}
              style={i === index ? {
                background: `linear-gradient(90deg, ${banner.accentColor} ${progress * 100}%, rgba(255,255,255,0.2) ${progress * 100}%)`,
                boxShadow: `0 0 10px ${banner.accentColor}88`,
              } : {}}
            />
          ))}
        </div>

        {/* ── Bottom gradient fade ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(transparent, #0d0d14)",
          pointerEvents: "none", zIndex: 6,
        }} />

        {/* ── Vignette top ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(rgba(6,6,16,0.4), transparent)",
          pointerEvents: "none", zIndex: 6,
        }} />
      </div>
    </>
  );
};

export default HomeBanner;