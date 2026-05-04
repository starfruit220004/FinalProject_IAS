// utils/sendEmail.js
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 to avoid IPv6 issues on Render
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    family: 4,
  });

  const info = await transporter.sendMail({
    from: `"SecureLearn" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });

  console.log('✅ OTP email sent:', info.messageId);
};

module.exports = sendEmail;