const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
        validate: v => v.length === 4
      },
      correctOption: {
        type: Number,
        required: true,
        min: 0,
        max: 3
      }
    }
  ],
  isLive: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
