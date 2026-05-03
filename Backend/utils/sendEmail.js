const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP Failed:", err.message);
  else console.log("✅ SMTP Ready");
});

const sendEmail = async ({ email, subject, html }) => {
  await transporter.sendMail({
    from: `"SecureLearn" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;