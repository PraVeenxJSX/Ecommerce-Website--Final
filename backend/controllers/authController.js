const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const validator = require("validator");

const OTP_HTML = (otp) =>
  `<div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
    <h2 style="margin:0 0 8px">Your OTP Code</h2>
    <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#4f46e5;margin:16px 0">${otp}</p>
    <p style="color:#666;font-size:14px">This code is valid for 10 minutes. Do not share it with anyone.</p>
  </div>`;

/* REGISTER + SEND OTP */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      if (!userExists.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.otp = otp;
        userExists.otpExpires = Date.now() + 10 * 60 * 1000;
        await userExists.save();

        // Try to send email but don't block registration on failure
        try {
          await sendEmail({
            to: email,
            subject: "Verify your email - MERN Shop",
            html: OTP_HTML(otp),
          });
        } catch (emailErr) {
          console.error("Email send failed (resend for existing user):", emailErr.message);
        }

        return res.status(200).json({ message: "OTP resent to email" });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Password will be hashed by the User model's pre-save hook
    await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    // Try to send email but don't block registration on failure
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email - MERN Shop",
        html: OTP_HTML(otp),
      });
    } catch (emailErr) {
      console.error("Email send failed (new registration):", emailErr.message);
    }

    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Failed to register. Please try again." });
  }
};

/* RESEND OTP */
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isVerified) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Verify your email - MERN Shop",
      html: OTP_HTML(otp),
    });

    res.json({ message: "OTP resent to email" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

/* VERIFY OTP */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Verification failed. Please try again." });
  }
};

/* FORGOT PASSWORD — send OTP */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Reset your password - MERN Shop",
      html: `<div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
        <h2 style="margin:0 0 8px">Password Reset OTP</h2>
        <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#ef4444;margin:16px 0">${otp}</p>
        <p style="color:#666;font-size:14px">This code is valid for 10 minutes. If you didn't request this, ignore this email.</p>
      </div>`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

/* RESET PASSWORD — verify OTP + set new password */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetPasswordToken !== otp ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(401).json({ message: "Email not verified or user not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    }),
  });
};
