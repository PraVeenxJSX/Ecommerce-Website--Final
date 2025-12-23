const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ⚠️ Use Gmail App Password here
      },
    });

    // verify transporter configuration
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"MERN Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId, 'to', to);
  } catch (err) {
    console.error('Error in sendEmail:', err);
    throw err;
  }
};

module.exports = sendEmail;