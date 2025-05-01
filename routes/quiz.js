const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// ✅ CREATE QUIZ
router.post('/', async (req, res) => {
  const { title, course, questions } = req.body;

  if (!title || !course || !Array.isArray(questions) || questions.length < 10) {
    return res.status(400).json({ msg: 'Title, course and at least 10 questions required.' });
  }

  try {
    const quiz = new Quiz({ title, course, questions });
    await quiz.save();
    res.status(201).json({ msg: 'Quiz created successfully', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ TOGGLE QUIZ LIVE/OFFLINE
router.put('/toggle', async (req, res) => {
  const { quizId, isLive } = req.body;

  try {
    const updated = await Quiz.findByIdAndUpdate(quizId, { isLive }, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Quiz not found' });

    res.json({ msg: 'Quiz status updated', quiz: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE QUIZ
router.put('/:id', async (req, res) => {
  const { title, course, questions } = req.body;

  try {
    const updated = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, course, questions },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: 'Quiz not found' });

    res.json({ msg: 'Quiz updated successfully', quiz: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET QUIZ BY COURSE (for students)
router.get('/course/:course', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ course: req.params.course });

    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    // isLive sent separately
    res.status(200).json({ isLive: quiz.isLive, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
