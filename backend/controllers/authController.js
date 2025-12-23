const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const validator = require("validator");

/* REGISTER + SEND OTP */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // TEMP DEBUG: log incoming register attempts (remove in production)
    console.log('Register attempt:', { name, email, passwordLength: password ? password.length : 0 });

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but is not verified, resend OTP instead of blocking
      if (!userExists.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.otp = otp;
        userExists.otpExpires = Date.now() + 10 * 60 * 1000;
        await userExists.save();

        // TEMP DEBUG: log OTP so we can verify delivery in server logs (remove in production)
        console.log(`OTP resent for ${email}: ${otp}`);

        // respond early so UI isn't blocked by email delivery
        res.status(200).json({ message: 'OTP resent to email' });

        // send email asynchronously (log errors)
        sendEmail({
          to: email,
          subject: 'Verify your email',
          html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
        }).catch((err) => console.error('Error sending OTP email (resend):', err));

        return;
      }

      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    // TEMP DEBUG: log OTP so we can verify delivery in server logs (remove in production)
    console.log(`OTP created for ${email}: ${otp}`);

    // respond early so UI isn't blocked by email delivery
    res.status(201).json({ message: 'OTP sent to email' });

    // send email asynchronously (log errors)
    sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<h2>Your OTP: ${otp}</h2><p>Valid for 10 minutes</p>`,
    }).catch((err) => console.error('Error sending OTP email:', err));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* VERIFY OTP */
exports.verifyOtp = async (req, res) => {
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
};

/* LOGIN */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(401).json({ message: "Email not verified" });
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
