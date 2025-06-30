const { app } = require('@azure/functions');
const controller = require('../shared/controller/coreController');
const UserScore = require('../shared/models/userScoresModel');
const Quiz = require('../shared/models/quizModel');
const connectDB = require('../shared/mongoose');


const toAzureRes = (context) => ({
    status: (code) => ({
        json: (data) => {
            context.res = {
                status: code,
                headers: { 'Content-Type': 'application/json' },
                body: data,
            };
        },
    }),
});

app.http('getUserScoreList', {
    route: 'user-score',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const handler = controller.findGenericActive(UserScore, 'UserScore');
        await handler(req, toAzureRes(context));
    },
});

app.http('getUserScoreById', {
    route: 'user-score/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        req.params = { id: req.params.id };
        const handler = controller.findIdGeneric(UserScore, 'UserScore');
        await handler(req, toAzureRes(context));
    },
});

app.http('createUserScore', {
    route: 'user-score',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        req.body = await req.json();
        const handler = controller.createGeneric(UserScore, 'UserScore');
        await handler(req, toAzureRes(context));
    },
});

app.http('updateUserScore', {
    route: 'user-score/quiz/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        req.body = await req.json();
        req.params = { id: req.params.id };
        const handler = controller.updateGeneric(UserScore, 'UserScore');
        await handler(req, toAzureRes(context));
    },
});

app.http('softDeleteUserScore', {
    route: 'user-score/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        req.params = { id: req.params.id };
        const handler = controller.deletedSoftGeneric(UserScore);
        await handler(req, toAzureRes(context));
    },
});

app.http('calculateScore', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'quiz/calculate-score',
    handler: async (request, context) => {
        try {
            await connectDB();
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
