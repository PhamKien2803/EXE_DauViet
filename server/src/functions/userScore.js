import { app } from '@azure/functions';
import Quiz from '../models/quizModel.js';
import UserScore from '../models/userScoresModel.js';

app.http('calculateScore', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'quiz/submit',
    handler: async (request, context) => {
        try {
            const { user, quiz } = await request.json();
            const scoreArray = [];

            for (const item of quiz) {
                const { question, answers } = item;
                const foundQuiz = await Quiz.findOne({
                    status: true,
                    question: question
                });

                if (!foundQuiz) {
                    return {
                        status: 400,
                        jsonBody: { message: 'Bad request: invalid question' }
                    };
                }

                const { options, correctAnswer } = foundQuiz;
                const correctOption = options[correctAnswer - 1];

                if (correctOption === answers) {
                    scoreArray.push(1);
                }
            }

            const totalScore = scoreArray.reduce((sum, point) => sum + point, 0);

            const newScoreEntry = new UserScore({
                user,
                score: totalScore
            });

            await newScoreEntry.save();

            return {
                status: 201,
                jsonBody: {
                    message: `Điểm của bạn là ${totalScore}`
                }
            };
        } catch (error) {
            context.log('calculateScore error:', error);
            return {
                status: 500,
                jsonBody: { message: 'Server error', error: error.message }
            };
        }
    }
});
