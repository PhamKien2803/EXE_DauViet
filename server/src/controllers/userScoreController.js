const { Model } = require("mongoose");
const UserScore = require("../models/userScoresModel");
const Quiz = require("../models/quizModel");

exports.calculateScore = async (req, res) => {
    try {
        const { user, quiz } = req.body;
        const score = [];
        for (const item of quiz) {
            const { question, answers } = item;
            const query = {
                status: true,
                question: question
            }
            const foundCheckQuiz = await Quiz.findOne(query);
            if (!foundCheckQuiz) {
                return res.status(400).json({ message: "Bad request" });
            }
            const { options, correctAnswer } = foundCheckQuiz;
            const checkAnswer = options[correctAnswer - 1];
            if (checkAnswer === answers) {
                score.push(1);
            }
        }
        const userScore = score.reduce((sum, current) => sum + current, 0);
        console.log("🚀 ~ exports.calculateScore= ~ userScore:", userScore);
        const newObject = new UserScore({
            user: user,
            score: userScore
        });
        const savedData = await newObject.save();
        return res.status(201).json({ message: `Điểm của bạn là ${userScore}` });
    } catch (error) {
        console.error("Calculate Score error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}