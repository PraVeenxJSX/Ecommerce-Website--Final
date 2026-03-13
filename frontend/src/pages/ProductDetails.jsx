import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { warmUpBackend } from "../services/api";
import { useCart } from "../context/CartContext";
import Skeleton from "../components/Skeleton";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setProduct(null);
    const fetchProduct = async () => {
      await warmUpBackend();
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      const relatedRes = await api.get(`/products?category=${data.category}`);
      const items = relatedRes.data?.products || relatedRes.data || [];
      setRelated(items.filter(p => p._id !== data._id).slice(0, 4));
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div style={{ background: "#0d0d14", minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <Skeleton className="w-full h-[480px] rounded-3xl" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4 rounded-xl" />
            <Skeleton className="h-10 w-1/3 rounded-xl" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-14 w-44 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const inStock = product.countInStock > 0;
  const rating = product.rating ? product.rating.toFixed(1) : "4.5";
  const stars = Math.round(parseFloat(rating));

  return (
    <div style={{ background: "#0d0d14", minHeight: "100vh" }}>
      {/* Ambient blob */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)", top: 0, right: 0, filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 36, fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
          <Link to="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{product.name}</span>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start", marginBottom: 80 }} className="pd-grid">
          {/* Image */}
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: 460, objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
              {!inStock && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#f87171", fontWeight: 800, fontSize: 20, padding: "8px 20px", border: "2px solid rgba(248,113,113,0.5)", borderRadius: 100 }}>Out of Stock</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Category */}
            <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)", width: "fit-content" }}>
              {product.category}
            </span>

            {/* Name */}
            <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 900, lineHeight: 1.15, margin: 0, letterSpacing: -1, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < stars ? "#f59e0b" : "rgba(255,255,255,0.15)", fontSize: 16 }}>★</span>
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{rating} rating</span>
            </div>

            {/* Price */}
            <div style={{ fontSize: 40, fontWeight: 900, background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1 }}>
              ₹{product.price}
            </div>

            {/* Description */}
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontSize: 15, margin: 0 }}>
              {product.description}
            </p>

            {/* Stock */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: inStock ? "#34d399" : "#f87171", boxShadow: inStock ? "0 0 8px rgba(52,211,153,0.6)" : "none", display: "inline-block" }} />
              <span style={{ color: inStock ? "#34d399" : "#f87171", fontWeight: 600, fontSize: 14 }}>{inStock ? `In Stock (${product.countInStock} left)` : "Out of Stock"}</span>
            </div>

            {/* Qty selector */}
            {inStock && (
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>Quantity</span>
                <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: "none", border: "none", color: qty === 1 ? "rgba(255,255,255,0.2)" : "#fff", cursor: qty === 1 ? "not-allowed" : "pointer", fontSize: 18 }}>−</button>
                  <span style={{ color: "#fff", fontWeight: 700, minWidth: 32, textAlign: "center", fontSize: 16 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} style={{ width: 40, height: 40, background: "none", border: "none", color: qty === product.countInStock ? "rgba(255,255,255,0.2)" : "#fff", cursor: qty === product.countInStock ? "not-allowed" : "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>
            )}

            {/* CTA */}
            <AnimatePresence mode="wait">
              <motion.button
                key={added ? "added" : "cart"}
                initial={{ scale: 0.97 }} animate={{ scale: 1 }} exit={{ scale: 0.97 }}
                whileHover={inStock ? { scale: 1.02 } : {}} whileTap={inStock ? { scale: 0.97 } : {}}
                onClick={handleAddToCart}
                disabled={!inStock}
                style={{
                  padding: "16px 36px", borderRadius: 14, border: "none",
                  background: !inStock ? "rgba(255,255,255,0.1)" : added ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #f59e0b, #ef4444)",
                  color: !inStock ? "rgba(255,255,255,0.3)" : "#fff",
                  fontWeight: 800, fontSize: 16, cursor: !inStock ? "not-allowed" : "pointer",
                  boxShadow: inStock ? (added ? "0 8px 24px rgba(16,185,129,0.3)" : "0 8px 28px rgba(245,158,11,0.35)") : "none",
                  transition: "background 0.3s, box-shadow 0.3s", letterSpacing: 0.2
                }}
              >
                {!inStock ? "Unavailable" : added ? "✓ Added to cart!" : `Add to Cart — ₹${(product.price * qty).toFixed(2)}`}
              </motion.button>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: -0.5, fontFamily: "'Playfair Display', Georgia, serif", margin: 0 }}>You may also like</h2>
              <Link to={`/category/${product.category}`} style={{ color: "#f59e0b", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>View all →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="related-grid">
              {related.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link to={`/product/${p._id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 18, overflow: "hidden", transition: "all 0.25s"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                      <div style={{ padding: "16px" }}>
                        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</h3>
                        <p style={{ color: "#f59e0b", fontWeight: 800, fontSize: 16, margin: 0 }}>₹{p.price}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr !important; } .related-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
};

export default ProductDetails;