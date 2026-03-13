import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api, { searchProducts, warmUpBackend } from "../services/api";

const SearchResults = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        await warmUpBackend();
        const { data } = await searchProducts(q);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (q && q.trim() !== "") fetch();
    else {
      setProducts([]);
      setLoading(false);
    }
  }, [q]);

  if (loading)
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.1)",
            borderTopColor: "#f59e0b",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: 500 }}>Searching...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
        top: -200, right: -100, filter: "blur(60px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        bottom: -150, left: -100, filter: "blur(60px)", pointerEvents: "none"
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1, padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{
          fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8,
          letterSpacing: -0.8, fontFamily: "'Playfair Display', Georgia, serif"
        }}>
          Search results for "{q}"
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 36 }}>
          {products.length} {products.length === 1 ? "product" : "products"} found
        </p>

        {products.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, backdropFilter: "blur(32px)"
          }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }}>No products found.</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, marginTop: 8 }}>
              Try a different search term.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 24
          }}>
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                style={{
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,158,11,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: "100%", height: 200, objectFit: "cover",
                      display: "block"
                    }}
                  />
                  {p.countInStock === 0 && (
                    <span style={{
                      position: "absolute", top: 12, left: 12,
                      background: "rgba(239,68,68,0.9)", color: "#fff",
                      fontSize: 11, fontWeight: 700, padding: "4px 10px",
                      borderRadius: 8, letterSpacing: 0.5, textTransform: "uppercase",
                      backdropFilter: "blur(8px)"
                    }}>Out</span>
                  )}
                </div>
                <div style={{ padding: "16px 18px 20px" }}>
                  <h3 style={{
                    color: "#fff", fontWeight: 600, fontSize: 15,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    marginBottom: 4
                  }}>{p.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 10 }}>
                    {p.category}
                  </p>
                  <p style={{
                    color: "#f59e0b", fontWeight: 700, fontSize: 18,
                    margin: 0
                  }}>
                    {"\u20B9"}{p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
