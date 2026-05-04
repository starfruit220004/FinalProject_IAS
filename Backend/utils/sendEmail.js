const nodemailer = require('nodemailer');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
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