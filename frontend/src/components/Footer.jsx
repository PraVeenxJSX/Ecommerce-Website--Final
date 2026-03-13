import React, { useState } from "react";
import { Link } from "react-router-dom";

/* ── Static Logo ── */
const FooterLogo = ({ size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: 10, flexShrink: 0,
    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.45, fontWeight: 900, color: "#fff",
    boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
  }}>V</div>
);

/* ── Newsletter form ── */
const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setEmail("");
  };

  return sent ? (
    <div style={{
      padding: "14px 20px", borderRadius: 14,
      background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
      color: "#34d399", fontSize: 14, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif", textAlign: "center",
      animation: "fadeSlide 0.4s ease"
    }}>✓ You're subscribed!</div>
  ) : (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${focused ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 12, padding: "0 14px",
        transition: "border-color 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(245,158,11,0.07)" : "none"
      }}>
        <input
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="your@email.com"
          style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", width: "100%", padding: "11px 0" }}
        />
      </div>
      <button type="submit" style={{
        padding: "11px 18px", borderRadius: 12, border: "none",
        background: "linear-gradient(135deg, #f59e0b, #ef4444)",
        color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif", flexShrink: 0,
        boxShadow: "0 6px 16px rgba(245,158,11,0.3)", transition: "transform 0.2s, box-shadow 0.2s"
      }}
        onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 8px 22px rgba(245,158,11,0.45)"; }}
        onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 6px 16px rgba(245,158,11,0.3)"; }}
      >Join</button>
    </form>
  );
};

/* ── Social icon button ── */
const SocialBtn = ({ children, href = "#", color }) => {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? color : "rgba(255,255,255,0.06)",
        border: `1px solid ${hov ? "transparent" : "rgba(255,255,255,0.1)"}`,
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hov ? "translateY(-4px) scale(1.1)" : "none",
        boxShadow: hov ? `0 8px 20px ${color}66` : "none",
        textDecoration: "none", color: "#fff", flexShrink: 0
      }}
    >{children}</a>
  );
};

/* ── Footer link ── */
const FootLink = ({ children, to = "/" }) => {
  const [hov, setHov] = useState(false);
  return (
    <li>
      <Link to={to}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          color: hov ? "#f59e0b" : "rgba(255,255,255,0.45)",
          textDecoration: "none", fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
          display: "inline-flex", alignItems: "center",
          transition: "color 0.2s, gap 0.2s",
          gap: hov ? "10px" : "6px"
        }}
      >
        <span style={{ color: hov ? "#f59e0b" : "rgba(255,255,255,0.15)", fontSize: 10, transition: "color 0.2s" }}>›</span>
        {children}
      </Link>
    </li>
  );
};

/* ── Main Footer ── */
const Footer = () => {
  const letters = "VORTEX".split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes footerReveal {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes float3d {
          0%, 100% { transform: translateY(0px) rotateZ(-1deg); }
          50% { transform: translateY(-6px) rotateZ(1deg); }
        }

        .footer-col {
          animation: footerReveal 0.7s ease both;
        }
        .footer-col:nth-child(1) { animation-delay: 0.05s; }
        .footer-col:nth-child(2) { animation-delay: 0.12s; }
        .footer-col:nth-child(3) { animation-delay: 0.19s; }
        .footer-col:nth-child(4) { animation-delay: 0.26s; }

        .footer-col-heading {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,0.9); margin-bottom: 18px;
          position: relative; padding-left: 0;
        }
        .footer-col-heading::after {
          content: '';
          display: block;
          width: 24px; height: 2px;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          border-radius: 2px;
          margin-top: 8px;
        }

        .footer-bottom-link {
          color: rgba(255,255,255,0.35); font-size: 13px;
          font-family: 'DM Sans', sans-serif; text-decoration: none;
          transition: color 0.2s; cursor: pointer;
        }
        .footer-bottom-link:hover { color: #f59e0b; }
      `}</style>

      <footer style={{ background: "#070710", position: "relative", overflow: "hidden", marginTop: 80 }}>

        {/* Ambient glows */}
        <div style={{ position: "absolute", width: 600, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)", top: -100, left: -100, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)", bottom: 0, right: -80, filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Top separator with glow */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4) 30%, rgba(99,102,241,0.4) 60%, transparent)", marginBottom: 0 }} />

        {/* Main content */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "64px 40px 48px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 48 }} className="footer-main-grid">

            {/* COL 1 — Brand */}
            <div className="footer-col">
              {/* Logo lockup */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <FooterLogo size={40} />
                <div>
                  <div style={{ display: "flex", gap: 1 }}>
                    {letters.map((l, i) => (
                      <span key={i} style={{
                        fontFamily: "'Bebas Neue', Impact, sans-serif",
                        fontSize: 22, letterSpacing: 2.5, lineHeight: 1,
                        background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                      }}>{l}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(245,158,11,0.55)", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, textTransform: "uppercase", marginTop: 1 }}>Commerce</div>
                </div>
              </div>

              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", marginBottom: 24, maxWidth: 280 }}>
                A premium shopping experience with curated electronics, fashion, home essentials and more. Fast delivery · Easy returns · Secure payments.
              </p>

              {/* Trust badges */}
              <div
                style={{
                  padding: "16px 20px", borderRadius: 16,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  maxWidth: 300,
                }}
              >
                {[["🚀", "Free shipping", "On orders above ₹499"],["🔒", "Secure payments", "256-bit SSL encrypted"],["↩️", "Easy returns", "30-day no questions asked"]].map(([icon, title, sub]) => (
                  <div key={title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 18, display: "inline-block" }}>{icon}</span>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{title}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 2 — Shop */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Shop</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Mobiles", "/category/Mobiles"], ["Laptops", "/category/Laptops"], ["Home Appliances", "/category/Appliances"], ["Fashion", "/category/Fashion"], ["Audio", "/category/Audio"], ["Wearables", "/category/Wearables"]].map(([name, path]) => (
                  <FootLink key={name} to={path}>{name}</FootLink>
                ))}
              </ul>
            </div>

            {/* COL 3 — Support */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Support</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {[["Help Center", "/"], ["Shipping & Returns", "/"], ["Payment Options", "/"], ["Track Order", "/myorders"], ["Contact Us", "/"], ["FAQs", "/"]].map(([name, path]) => (
                  <FootLink key={name} to={path}>{name}</FootLink>
                ))}
              </ul>

              {/* Contact card */}
              <div style={{ marginTop: 24, padding: "14px 16px", borderRadius: 14, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)" }}>
                <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans'", marginBottom: 4 }}>📞 24/7 Support</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "'DM Sans'" }}>support@vortex.shop</div>
              </div>
            </div>

            {/* COL 4 — Newsletter + socials */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Stay in the loop</h4>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>
                Get early access to deals, new arrivals, and exclusive drops — directly in your inbox.
              </p>

              <NewsletterForm />

              {/* Socials */}
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans'", marginBottom: 14 }}>Follow us</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {/* Twitter/X */}
                  <SocialBtn color="#000" href="#">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L2 2.25h6.756l4.26 5.632 5.228-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </SocialBtn>
                  {/* Instagram */}
                  <SocialBtn color="linear-gradient(135deg,#f59e0b,#ef4444,#a855f7)" href="#">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4.5"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                    </svg>
                  </SocialBtn>
                  {/* GitHub */}
                  <SocialBtn color="#333" href="#">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.88 0 1.36-.01 2.45-.01 2.79 0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z"/>
                    </svg>
                  </SocialBtn>
                  {/* YouTube */}
                  <SocialBtn color="#ef4444" href="#">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2-.9C16.5 5 12 5 12 5s-4.5 0-7 .1c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c .8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.5 0 7-.1c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.2 3-5.2 3z"/>
                    </svg>
                  </SocialBtn>
                </div>
              </div>

              {/* Payment icons */}
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans'", marginBottom: 12 }}>We accept</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Visa", "MC", "UPI", "GPay", "PayTM"].map(p => (
                    <div key={p} style={{
                      padding: "5px 12px", borderRadius: 8,
                      background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700,
                      fontFamily: "'DM Sans'", letterSpacing: 0.5,
                      transition: "all 0.2s", cursor: "default"
                    }}
                      onMouseEnter={e => { e.target.style.background = "rgba(245,158,11,0.1)"; e.target.style.borderColor = "rgba(245,158,11,0.3)"; e.target.style.color = "#fbbf24"; }}
                      onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.55)"; }}
                    >{p}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 40px" }} />

        {/* Bottom bar */}
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FooterLogo size={22} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
              © {new Date().getFullYear()} <span style={{ color: "rgba(245,158,11,0.6)", fontWeight: 700 }}>VORTEX</span> Commerce. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {["Terms", "Privacy", "Security", "Sitemap"].map(l => (
              <span key={l} className="footer-bottom-link">{l}</span>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) { .footer-main-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 600px) { .footer-main-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </footer>
    </>
  );
};

export default Footer;