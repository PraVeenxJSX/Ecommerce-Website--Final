const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.error("EMAIL CONFIG MISSING: RESEND_API_KEY not set");
    throw new Error("Email service not configured");
  }

  // Free tier uses onboarding@resend.dev — after verifying a custom domain
  // in the Resend dashboard, change to e.g. "Vortex Shop <noreply@yourdomain.com>"
  const { data, error } = await resend.emails.send({
    from: `Vortex Shop <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  console.log("EMAIL SENT TO:", to, "id:", data.id);
};

module.exports = sendEmail;
