// utils/sendEmail.js
const sendEmail = async ({ email, subject, html }) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'SecureLearn',
        email: process.env.EMAIL_USER,
      },
      to: [{ email }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Brevo API error:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  console.log('✅ OTP email sent via Brevo API');
};

module.exports = sendEmail;