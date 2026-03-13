import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const STEPS = { EMAIL: 0, OTP: 1, NEW_PASSWORD: 2 };

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 15,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      setMessage({ text: data.message, type: "success" });
      setStep(STEPS.OTP);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to send OTP", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (step === STEPS.OTP) {
      if (otp.length !== 6) {
        setMessage({ text: "Please enter the 6-digit OTP", type: "error" });
        return;
      }
      setStep(STEPS.NEW_PASSWORD);
      return;
    }

    // STEPS.NEW_PASSWORD
    if (newPassword.length < 8) {
      setMessage({ text: "Password must be at least 8 characters", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/users/reset-password", { email, otp, newPassword });
      setMessage({ text: data.message, type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Reset failed", type: "error" });
      if (err.response?.data?.message?.toLowerCase().includes("expired")) {
        setStep(STEPS.OTP);
        setOtp("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      setMessage({ text: "New OTP sent to your email", type: "success" });
      setOtp("");
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to resend", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ["Forgot Password", "Enter OTP", "New Password"];
  const stepDescs = [
    "Enter your email to receive a reset code",
    `OTP sent to ${email}`,
    "Create your new password",
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)",
        top: -100, right: -100, filter: "blur(60px)", pointerEvents: "none"
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
        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: step === i ? 32 : 8, height: 8, borderRadius: 100,
              background: step >= i
                ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                : "rgba(255,255,255,0.1)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        <h2 style={{
          fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center",
          marginBottom: 6, letterSpacing: -0.8,
          fontFamily: "'Playfair Display', Georgia, serif"
        }}>{stepTitles[step]}</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 36 }}>
          {stepDescs[step]}
        </p>

        {/* Step 1: Email */}
        {step === STEPS.EMAIL && (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Email</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {message.text && (
              <p style={{ fontSize: 13, color: message.type === "success" ? "#34d399" : "#f87171", margin: 0 }}>{message.text}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              style={{
                marginTop: 8, width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #f59e0b, #ef4444)",
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 24px rgba(245,158,11,0.3)", transition: "all 0.2s"
              }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </motion.button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === STEPS.OTP && (
          <form onSubmit={handleVerifyAndReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>OTP Code</label>
              <input
                required value={otp} maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                style={{ ...inputStyle, textAlign: "center", fontSize: 22, letterSpacing: 8 }}
                onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {message.text && (
              <p style={{ fontSize: 13, color: message.type === "success" ? "#34d399" : "#f87171", margin: 0 }}>{message.text}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                marginTop: 8, width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(245,158,11,0.3)", transition: "all 0.2s"
              }}
            >
              Continue
            </motion.button>

            <button
              type="button" onClick={handleResendOtp} disabled={loading}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, padding: "8px 0",
              }}
            >
              {loading ? "Resending..." : "Didn't receive it? Resend OTP"}
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === STEPS.NEW_PASSWORD && (
          <form onSubmit={handleVerifyAndReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 13
                }}>{showPw ? "Hide" : "Show"}</button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, letterSpacing: 0.8, textTransform: "uppercase" }}>Confirm Password</label>
              <input
                type={showPw ? "text" : "password"} required value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {message.text && (
              <p style={{ fontSize: 13, color: message.type === "success" ? "#34d399" : "#f87171", margin: 0 }}>{message.text}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              style={{
                marginTop: 8, width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "rgba(245,158,11,0.4)" : "linear-gradient(135deg, #f59e0b, #ef4444)",
                color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 24px rgba(245,158,11,0.3)", transition: "all 0.2s"
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>
        )}

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 14, marginTop: 28 }}>
          Remember your password?{" "}
          <a href="/login" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>Sign in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
