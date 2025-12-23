const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyOtp,
  login,
} = require("../controllers/authController");

// Register (send OTP)
router.post("/register", registerUser);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login (blocked until verified)
router.post("/login", login);

module.exports = router;
