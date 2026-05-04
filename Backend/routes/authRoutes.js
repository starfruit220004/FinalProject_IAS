const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { prisma } = require('../db');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be 3–50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one symbol'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, email, password } = req.body;

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' } },
          { email: { equals: email, mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({ message: 'Username or email already exists.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash
      }
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' } },
          { email: { equals: username, mode: 'insensitive' } }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/change-password
const authMiddleware = require('../middleware/auth');
router.post('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must include at least one uppercase letter, one lowercase letter, one number, and one symbol'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password.' });

    const saltRounds = 10;
    const new_password_hash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: new_password_hash }
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', [
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: 'If that email exists, a reset code was sent.' });
    }

    // Generate 6-digit OTP
    const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHashed = await bcrypt.hash(otpPlain, 10);
    const otpExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        otp: otpHashed,
        otpExpiry,
      },
    });

    try {
      await sendEmail({
        email,
        subject: 'Reset Your Password — SecureLearn',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Reset your password</h2>
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>Use the code below to reset your password. It expires in <strong>15 minutes</strong>.</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="display: inline-block; padding: 16px 32px; background: linear-gradient(to right, #06b6d4, #2563eb); color: #fff; font-size: 32px; font-weight: 900; border-radius: 12px; letter-spacing: 8px;">
                ${otpPlain}
              </span>
            </div>
            <p style="color:#64748b;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error('Email error:', mailErr.message);
      return res.status(500).json({ message: `Failed to send email: ${mailErr.message}` });
    }

    res.json({ message: 'If that email exists, a reset code was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', [
  body('email').trim().isEmail().withMessage('Please enter a valid email'),
  body('otp').trim().notEmpty().withMessage('OTP code is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must include uppercase, lowercase, number, and symbol'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, otp, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      await prisma.user.update({
        where: { email },
        data: { otp: null, otpExpiry: null },
      });
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }

    const isValidOtp = await bcrypt.compare(otp.trim(), user.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Incorrect reset code.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        otp: null,
        otpExpiry: null,
      },
    });

    console.log(`✅ Password reset for user: ${user.username}`);
    res.json({ message: 'Password reset successfully.' });

  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;