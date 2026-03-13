const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("EMAIL CONFIG MISSING: EMAIL_USER or EMAIL_PASS not set");
    throw new Error("Email service not configured");
  }

  const info = await transporter.sendMail({
    from: `"Vortex Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("EMAIL SENT TO:", to, "messageId:", info.messageId);
};

module.exports = sendEmail;
