const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  console.log("📧 EMAIL CONFIG CHECK:");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);
console.log("PASS EXISTS:", !!process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MERN Shop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
