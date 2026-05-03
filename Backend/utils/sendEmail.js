const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, html }) => {
  const { error } = await resend.emails.send({
    from: 'SecureLearn <onboarding@resend.dev>',
    to: email,
    subject,
    html,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  console.log('✅ Email sent via Resend');
};

module.exports = sendEmail;