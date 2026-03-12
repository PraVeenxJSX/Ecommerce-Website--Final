import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Link } from "react-router-dom";
import CategoryBar from "../components/CategoryBar";
import { CATEGORIES } from "../constants/categories";
import HomeBanner from "../components/HomeBanner";
import Deals from "../components/Deals";
import Hero from "../components/Hero";

const ProductCard = ({ p, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4, delay: (index % 6) * 0.07 }}
  >
    <Link to={`/product/${p._id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18, overflow: "hidden", transition: "all 0.28s", position: "relative"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ overflow: "hidden", position: "relative" }}>
          <img
            src={p.image} alt={p.name}
            style={{ width: "100%", height: 160, objectFit: "cover", display: "block", transition: "transform 0.4s" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.07)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          />
          {p.countInStock === 0 && (
            <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(239,68,68,0.9)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>Out of stock</span>
          )}
        </div>
        <div style={{ padding: "12px 14px 16px" }}>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 16 }}>₹{p.price}</span>
            <span style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>★ {p.rating?.toFixed(1) || "4.5"}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const promises = CATEGORIES.map(cat =>
          api.get(`/products?category=${encodeURIComponent(cat)}&limit=6`)
        );
        const responses = await Promise.all(promises);
        const all = responses.flatMap(res => res.data?.products || res.data || []);
        setProducts(all);
      } catch (err) {
        console.error("Error fetching homepage products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ background: "#0d0d14", minHeight: "100vh" }}>
      <CategoryBar />
      <HomeBanner />
      <Hero />
      <Deals />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 64 }}>

        {/* Featured Showcase */}
        {products.length > 0 && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
              <div>
                <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px" }}>Handpicked</p>
                <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: -0.8, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>Featured Products</h2>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="featured-grid">
              {products.slice(0, 4).map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.09 }}>
                  <Link to={`/product/${p._id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 22, overflow: "hidden", transition: "all 0.28s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "18px" }}>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", margin: "0 0 6px" }}>{p.category}</p>
                        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: "0 0 12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#f59e0b", fontWeight: 900, fontSize: 20 }}>₹{p.price}</span>
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>★ {p.rating?.toFixed(1) || "4.5"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Category sections */}
        {CATEGORIES.map(category => {
          const catProducts = products.filter(p => p.category === category).slice(0, 6);
          if (catProducts.length === 0) return null;

          return (
            <section key={category}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
                <div>
                  <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>{category}</h2>
                </div>
                <Link to={`/category/${category}`} style={{
                  color: "#f59e0b", textDecoration: "none", fontSize: 14, fontWeight: 700,
                  padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(245,158,11,0.3)",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.target.style.background = "rgba(245,158,11,0.1)"; }}
                  onMouseLeave={e => { e.target.style.background = "none"; }}
                >View all →</Link>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }} className="cat-grid">
                {catProducts.map((p, i) => <ProductCard key={p._id} p={p} index={i} />)}
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1200px) { .featured-grid { grid-template-columns: repeat(2, 1fr) !important; } .cat-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 768px) { .featured-grid { grid-template-columns: 1fr !important; } .cat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
};

export default Home;