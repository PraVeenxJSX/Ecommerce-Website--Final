import React from "react";

export const BrandMark = ({ size = 44 }) => {
  const accentSize = Math.max(10, Math.round(size * 0.18));
  const strokeWidth = Math.max(2, Math.round(size * 0.055));

  return (
    <div style={{
      width: size,
      height: size,
      position: "relative",
      flexShrink: 0,
      filter: "drop-shadow(0 10px 24px rgba(34, 211, 238, 0.22))",
    }}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="brandRing" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <circle cx="32" cy="32" r="26" fill="rgba(255,255,255,0.03)" stroke="url(#brandRing)" strokeWidth="2" />
        <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="2 4" />

        <path
          d="M18 22L32 44L46 22"
          fill="none"
          stroke="url(#brandGlow)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M24 20L32 34L40 20"
          fill="none"
          stroke="url(#brandRing)"
          strokeWidth={Math.max(1.6, strokeWidth * 0.72)}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        <path
          d="M31.5 14.5l4 4-4 4-4-4z"
          fill="url(#brandGlow)"
          opacity="0.96"
        />
      </svg>

      <div style={{
        position: "absolute",
        right: -2,
        top: -2,
        width: accentSize,
        height: accentSize,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 55%, transparent 72%)",
        opacity: 0.85,
      }} />
    </div>
  );
};

export const BrandWordmark = ({ size = 26 }) => (
  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, userSelect: "none" }}>
    <div style={{
      fontFamily: "'Bodoni Moda', Georgia, serif",
      fontSize: size,
      letterSpacing: 2.2,
      fontWeight: 700,
      background: "linear-gradient(135deg, #ffffff 0%, #c4f1ff 42%, #a78bfa 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>
      VORTEX
    </div>
    <div style={{
      fontSize: Math.max(8, Math.round(size * 0.42)),
      letterSpacing: 3.2,
      color: "rgba(103, 232, 249, 0.65)",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 700,
      textTransform: "uppercase",
      marginTop: 3,
    }}>
      Commerce
    </div>
  </div>
);

export const BrandLogo = ({ markSize = 44, wordmarkSize = 26, showWordmark = true }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <BrandMark size={markSize} />
    {showWordmark && <BrandWordmark size={wordmarkSize} />}
  </div>
);

export default BrandLogo;
