const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  login,
} = require("../controllers/authController");

// Register (send OTP)
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// Forgot password (send reset OTP)
router.post("/forgot-password", forgotPassword);

// Reset password (verify OTP + new password)
router.post("/reset-password", resetPassword);

// Login (blocked until verified)
router.post("/login", login);

module.exports = router;
