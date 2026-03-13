import React, { useState, useEffect, useCallback } from "react";
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
  },
];

const HomeBanner = () => {
  const [index, setIndex] = useState(0);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  // Auto-advance with a single setInterval
  useEffect(() => {
    const id = setInterval(goNext, 5500);
    return () => clearInterval(id);
  }, [goNext]);

  const banner = banners[index];

  return (
    <div
      style={{
        position: "relative",
        height: "clamp(360px, 48vw, 580px)",
        width: "100%",
        overflow: "hidden",
        background: "#060610",
        userSelect: "none",
      }}
    >
      {/* Slide images with crossfade */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.7s ease-in-out",
            zIndex: i === index ? 1 : 0,
          }}
        >
          <img
            src={b.image}
            alt={b.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        </div>
      ))}

      {/* Text content — crossfades with the slide */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "0 clamp(24px, 6vw, 80px)",
            maxWidth: 680,
            pointerEvents: "auto",
          }}
        >
          {/* Tag */}
          <div
            key={`tag-${index}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              marginBottom: 20,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: banner.accentColor,
                boxShadow: `0 0 8px ${banner.accentColor}`,
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {banner.tag}
            </span>
          </div>

          {/* Headline */}
          <h2
            key={`h-${index}`}
            style={{
              margin: "0 0 12px",
              lineHeight: 1.05,
              letterSpacing: -1.5,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(38px, 5.5vw, 76px)",
                color: "#fff",
                opacity: 0.92,
              }}
            >
              {banner.title}
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(42px, 6.2vw, 86px)",
                background: `linear-gradient(135deg, ${banner.accentColor} 0%, #fff 80%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {banner.titleAccent}
            </span>
          </h2>

          {/* Subtitle */}
          <p
            key={`p-${index}`}
            style={{
              margin: "0 0 28px",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            {banner.subtitle}
          </p>

          {/* CTA */}
          <Link
            to={banner.link}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 28px",
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              color: "#fff",
              textDecoration: "none",
              background: `linear-gradient(135deg, ${banner.accentColor} 0%, ${banner.accentColor}cc 100%)`,
              boxShadow: `0 10px 32px ${banner.accentColor}44`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
              e.currentTarget.style.boxShadow = `0 14px 40px ${banner.accentColor}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 10px 32px ${banner.accentColor}44`;
            }}
          >
            {banner.cta}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.18)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M11 4L6 9l5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
          transition: "background 0.25s ease, border-color 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.18)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M7 4l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              height: 4,
              borderRadius: 2,
              border: "none",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
              minWidth: i === index ? 44 : 20,
              background:
                i === index
                  ? banner.accentColor
                  : "rgba(255,255,255,0.25)",
              boxShadow:
                i === index ? `0 0 8px ${banner.accentColor}88` : "none",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* Bottom gradient fade */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(transparent, #0d0d14)",
          pointerEvents: "none",
          zIndex: 6,
        }}
      />
    </div>
  );
};

export default HomeBanner;
