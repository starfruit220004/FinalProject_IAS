const express = require('express');
const { prisma } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ─── BLOGS ───────────────────────────────────────────────
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs.' });
  }
});

router.get('/blogs/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid blog ID.' });

  try {
    const blog = await prisma.blog.findUnique({
      where: { id }
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog.' });
  }
});

// ─── FLASHCARDS ──────────────────────────────────────────
router.get('/flashcards', async (req, res) => {
  try {
    const flashcards = await prisma.flashcard.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flashcards.' });
  }
});

// ─── QUIZZES ─────────────────────────────────────────────
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        question: true,
        option_a: true,
        option_b: true,
        option_c: true,
        option_d: true,
        category: true
      },
      orderBy: { id: 'asc' }
    });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
});

router.post('/quizzes/check', async (req, res) => {
  const { id, answer } = req.body;
  if (!id || !answer) return res.status(400).json({ message: 'Missing id or answer.' });

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      select: {
        correct_answer: true,
        explanation: true
      }
    });

    if (!quiz) return res.status(404).json({ message: 'Question not found.' });

    const isCorrect = answer.toUpperCase() === quiz.correct_answer.toUpperCase();

    res.json({ isCorrect, correctAnswer: quiz.correct_answer, explanation: quiz.explanation });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check answer.' });
  }
});

module.exports = router;
