import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/users/login", { email, password });
      login(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await api.post("/users/google", {
        credential: credentialResponse.credential,
      });
      login(data);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
        top: -100, left: -100, filter: "blur(60px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        bottom: -80, right: -80, filter: "blur(60px)", pointerEvents: "none"
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        pointerEvents: "none"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 420, padding: "48px 40px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
        }}
      >
        {/* Logo mark */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -1,
            boxShadow: "0 8px 24px rgba(245,158,11,0.35)"
          }}>S</div>
        </div>

        <h2 style={{
          fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center",
          marginBottom: 6, letterSpacing: -0.8,
          fontFamily: "'Playfair Display', Georgia, serif"
        }}>Welcome back</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 36 }}>
          Sign in to your account
        </p>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 15,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw ? "text" : "password"} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 48px 12px 16px", borderRadius: 12, fontSize: 15,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 13
              }}>{showPw ? "Hide" : "Show"}</button>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            style={{
              marginTop: 8, width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: loading ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: 0.3, boxShadow: loading ? "none" : "0 8px 24px rgba(245,158,11,0.3)", transition: "all 0.2s"
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </motion.button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          margin: "24px 0 20px",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}>
            or continue with
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Google Sign-In */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google sign-in was unsuccessful. Please try again.")}
            theme="filled_black"
            size="large"
            shape="rectangular"
            text="signin_with"
            width="340"
          />
        </div>

        <div style={{ textAlign: "right", marginTop: 12 }}>
          <a href="/forgot-password" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
            Forgot password?
          </a>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14, marginTop: 28 }}>
          No account?{" "}
          <a href="/register" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>Create one</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;