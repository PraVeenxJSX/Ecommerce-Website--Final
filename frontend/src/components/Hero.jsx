import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── Floating particle field ── */
const Particles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.1,
      color: ["#f59e0b", "#818cf8", "#34d399", "#ef4444", "#fff"][Math.floor(Math.random() * 5)]
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      // draw connecting lines
      ctx.globalAlpha = 1;
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(245,158,11,${(1 - d / 90) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
};

/* ── 3D Cube carousel ── */
const FACES = [
  "https://images.unsplash.com/photo-1555617117-08b45f0a1e73?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1615591341898-a30d7f8f4801?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541534741688-6078b04b3c0f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
];

const Cube3D = () => {
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-8);
  const [dragging, setDragging] = useState(false);
  const [last, setLast] = useState({ x: 0, y: 0 });
  const [autoSpin, setAutoSpin] = useState(true);
  const tickRef = useRef(null);

  useEffect(() => {
    if (!autoSpin) return;
    tickRef.current = setInterval(() => {
      setRotY(r => r + 0.4);
    }, 16);
    return () => clearInterval(tickRef.current);
  }, [autoSpin]);

  const onMouseDown = (e) => {
    setDragging(true); setAutoSpin(false);
    setLast({ x: e.clientX, y: e.clientY });
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setRotY(r => r + (e.clientX - last.x) * 0.6);
    setRotX(r => Math.max(-35, Math.min(35, r - (e.clientY - last.y) * 0.4)));
    setLast({ x: e.clientX, y: e.clientY });
  };
  const onMouseUp = () => { setDragging(false); setTimeout(() => setAutoSpin(true), 2000); };

  const onTouch = (e) => {
    setDragging(true); setAutoSpin(false);
    setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const onTouchMove = (e) => {
    if (!dragging) return;
    setRotY(r => r + (e.touches[0].clientX - last.x) * 0.6);
    setLast({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const S = 260; // cube size px
  const half = S / 2;

  const faces = [
    { transform: `rotateY(0deg) translateZ(${half}px)`, img: FACES[0] },
    { transform: `rotateY(90deg) translateZ(${half}px)`, img: FACES[1] },
    { transform: `rotateY(180deg) translateZ(${half}px)`, img: FACES[2] },
    { transform: `rotateY(-90deg) translateZ(${half}px)`, img: FACES[3] },
    { transform: `rotateX(90deg) translateZ(${half}px)`, img: null, top: true },
    { transform: `rotateX(-90deg) translateZ(${half}px)`, img: null, bottom: true },
  ];

  return (
    <div
      onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      onTouchStart={onTouch} onTouchMove={onTouchMove} onTouchEnd={() => { setDragging(false); setTimeout(() => setAutoSpin(true), 2000); }}
      style={{ cursor: dragging ? "grabbing" : "grab", width: S, height: S, perspective: 900, perspectiveOrigin: "50% 50%", userSelect: "none", position: "relative" }}
    >
      {/* Glow beneath */}
      <div style={{
        position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
        width: S * 0.85, height: 40, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(245,158,11,0.35) 0%, transparent 70%)",
        filter: "blur(12px)", zIndex: 0
      }} />

      <div style={{
        width: S, height: S, position: "relative",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: dragging ? "none" : "transform 0.05s linear"
      }}>
        {faces.map((f, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            width: S, height: S,
            transform: f.transform,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            borderRadius: 20,
            overflow: "hidden",
            border: "1.5px solid rgba(255,255,255,0.12)",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)",
          }}>
            {f.img ? (
              <>
                <img src={f.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* Glossy sheen overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)",
                  borderRadius: 20,
                }} />
                {/* Edge highlight */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "30%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
                }} />
              </>
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: f.top
                  ? "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(99,102,241,0.15))"
                  : "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(10,10,20,0.7))",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Drag hint */}
      <div style={{
        position: "absolute", bottom: -52, left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500,
        letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap",
        fontFamily: "'DM Sans', sans-serif",
        animation: "fadeHint 3s ease 1.5s forwards", opacity: 1
      }}>⟳ Drag to spin</div>
    </div>
  );
};

/* ── Animated stat counter ── */
const StatCounter = ({ value, label, color }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = value / 60;
        const id = setInterval(() => {
          start = Math.min(start + step, value);
          setCount(Math.floor(start));
          if (start >= value) clearInterval(id);
        }, 20);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
    </div>
  );
};

/* ── Main Hero ── */
const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const onMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;700&display=swap');

        @keyframes fadeHint { 0%,70% { opacity: 1; } 100% { opacity: 0; } }

        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes floatBadge {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-cta-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; border-radius: 100px; border: none;
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #f59e0b 100%);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
          box-shadow: 0 12px 36px rgba(245,158,11,0.45), 0 0 0 0 rgba(245,158,11,0.3);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
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
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.3px;
          transition: all 0.25s; text-decoration: none; backdrop-filter: blur(12px);
        }
        .hero-cta-secondary:hover {
          background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24; font-size: 12px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; letter-spacing: 1px; text-transform: uppercase;
          animation: heroReveal 0.8s ease 0.1s both;
        }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; backdrop-filter: blur(8px);
        }
      `}</style>

      <section
        ref={heroRef}
        onMouseMove={onMouseMove}
        style={{
          position: "relative", minHeight: "88vh",
          background: "#070710",
          display: "flex", alignItems: "center", overflow: "hidden",
        }}
      >
        {/* Deep space background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(245,158,11,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 70% at 85% 20%, rgba(239,68,68,0.07) 0%, transparent 55%)",
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.035,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Particles */}
        <Particles />

        {/* Parallax glow blob following mouse */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 65%)",
          left: `calc(55% + ${mousePos.x * 80}px)`,
          top: `calc(40% + ${mousePos.y * 60}px)`,
          transform: "translate(-50%, -50%)",
          filter: "blur(60px)", transition: "left 0.4s ease, top 0.4s ease",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Content */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "60px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}
          className="hero-inner">
          {/* LEFT — Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Badge */}
            <div style={{ animation: "heroReveal 0.8s ease 0.1s both", opacity: 0 }}>
              <span className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block", boxShadow: "0 0 8px rgba(245,158,11,0.8)" }} />
                New arrivals — Summer 2025
              </span>
            </div>

            {/* Headline */}
            <div style={{ animation: "heroReveal 0.8s ease 0.25s both", opacity: 0 }}>
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
                }}>The Ordinary.</span>
              </h1>
            </div>

            {/* Sub */}
            <div style={{ animation: "heroReveal 0.8s ease 0.4s both", opacity: 0 }}>
              <p style={{
                margin: 0, fontSize: 18, lineHeight: 1.7, color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif", maxWidth: 440,
              }}>
                Curated products with immersive 3D previews, instant delivery, and a shopping experience that feels like the future.
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "heroReveal 0.8s ease 0.55s both", opacity: 0 }}>
              <Link to="/search?q=featured" className="hero-cta-primary">
                Explore Collection
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/myorders" className="hero-cta-secondary">
                Track orders
              </Link>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", animation: "heroReveal 0.8s ease 0.65s both", opacity: 0 }}>
              {["Free shipping", "30-day returns", "Secure checkout"].map(t => (
                <span key={t} className="hero-tag">
                  <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="rgba(52,211,153,0.4)"/><path d="M3 5l1.5 1.5L7 3.5" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div style={{
              display: "flex", gap: 32, paddingTop: 20, marginTop: 4,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              animation: "heroReveal 0.8s ease 0.75s both", opacity: 0
            }}>
              <StatCounter value={12400} label="Happy customers" color="#f59e0b" />
              <StatCounter value={3800} label="Products" color="#818cf8" />
              <StatCounter value={98} label="% Satisfaction" color="#34d399" />
            </div>
          </div>

          {/* RIGHT — 3D Cube */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60, animation: "heroReveal 1s ease 0.3s both", opacity: 0, position: "relative" }}>
            {/* Pulse rings behind cube */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 300, height: 300, borderRadius: "50%",
                border: "1px solid rgba(245,158,11,0.15)",
                animation: `pulseRing 3s ease ${i * 1}s infinite`,
                pointerEvents: "none",
              }} />
            ))}

            {/* Floating product badge */}
            <div style={{
              position: "absolute", top: -10, right: 20,
              padding: "10px 16px", borderRadius: 14,
              background: "rgba(14,14,24,0.9)", border: "1px solid rgba(245,158,11,0.3)",
              backdropFilter: "blur(16px)", animation: "floatBadge 3s ease-in-out infinite",
              boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
              zIndex: 5,
            }}>
              <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans'", letterSpacing: 0.5 }}>🔥 TRENDING</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans'", marginTop: 2 }}>Summer Picks</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "'DM Sans'" }}>12 new arrivals</div>
            </div>

            {/* Rating badge */}
            <div style={{
              position: "absolute", bottom: 30, left: 10,
              padding: "10px 16px", borderRadius: 14,
              background: "rgba(14,14,24,0.9)", border: "1px solid rgba(52,211,153,0.3)",
              backdropFilter: "blur(16px)", animation: "floatBadge 3.5s ease-in-out 0.5s infinite",
              boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
              zIndex: 5,
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>{s}</span>)}
              </div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans'" }}>4.9 / 5.0</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'DM Sans'" }}>2.4k reviews</div>
            </div>

            <Cube3D />
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
          background: "linear-gradient(transparent, #0d0d14)",
          pointerEvents: "none", zIndex: 3,
        }} />

        <style>{`
          @media (max-width: 900px) {
            .hero-inner { grid-template-columns: 1fr !important; text-align: center; padding: 40px 24px !important; }
            .hero-inner > div:last-child { display: none !important; }
          }
        `}</style>
      </section>
    </>
  );
};

export default Hero;