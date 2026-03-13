import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!email) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          top: -100, left: -100, filter: "blur(60px)", pointerEvents: "none"
        }} />
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: "40px 36px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, backdropFilter: "blur(32px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
            Email missing. Please{" "}
            <a href="/register" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>register again</a>.
          </p>
        </motion.div>
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      await api.post("/users/verify-otp", { email, otp });
      alert("Email verified successfully");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setMessage("");
    try {
      const { data } = await api.post("/users/resend-otp", { email });
      setMessage(data.message || "OTP resent!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const isSuccess = message.toLowerCase().includes("resent") || message.toLowerCase().includes("success");

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
        }}>Verify OTP</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 36 }}>
          OTP sent to <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{email}</span>
        </p>

        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* OTP Input */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Verification Code</label>
            <input
              type="text" required value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 18,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
                textAlign: "center", letterSpacing: 6
              }}
              onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Message */}
          {message && (
            <p style={{
              fontSize: 13,
              color: isSuccess ? "#34d399" : "#f87171",
              textAlign: "center", margin: 0
            }}>
              {message}
            </p>
          )}

          {/* Verify Button */}
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
            {loading ? "Verifying..." : "Verify ->"}
          </motion.button>
        </form>

        {/* Resend */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            style={{
              background: "none", border: "none", cursor: resending ? "not-allowed" : "pointer",
              color: resending ? "rgba(255,255,255,0.25)" : "#f59e0b",
              fontSize: 14, fontWeight: 600, transition: "color 0.2s"
            }}
          >
            {resending ? "Resending..." : "Didn't receive OTP? Resend"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
