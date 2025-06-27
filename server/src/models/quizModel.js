const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: {type: Number, required: true},
  answers: {type: String, required: true},
  imageURL: {type: String},
  active: {type: Boolean, default: true},
}, { timestamp: true });

module.exports = mongoose.model("Quiz", quizSchema);
