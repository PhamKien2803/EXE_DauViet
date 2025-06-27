const mongoose = require("mongoose");

const userScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true},
  score: {type: Number, required: true},
}, { timestamp: true });

module.exports = mongoose.model("UserScores", userScoreSchema);
