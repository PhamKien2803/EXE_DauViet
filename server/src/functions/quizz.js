const { app } = require('@azure/functions');
const connectDB = require('../shared/mongoose');
const Quiz = require('../shared/models/quizModel');

app.http('getAllActiveQuizzes', {
    route: 'quiz',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        try {
            const data = await Quiz.find({ active: true });
            return {
                status: 200,
                jsonBody: {
                    message: 'List of Quiz',
                    data
                }
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});

app.http('getQuizById', {
    route: 'quiz/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const { id } = req.params;

        try {
            const data = await Quiz.findById(id);
            if (!data) {
                return {
                    status: 404,
                    jsonBody: { message: 'Quiz not found' }
                };
            }
            return {
                status: 200,
                jsonBody: data
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});

app.http('createQuiz', {
    route: 'quiz',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        try {
            const body = await req.json();
            const newQuiz = new Quiz(body);
            const savedQuiz = await newQuiz.save();

            return {
                status: 201,
                jsonBody: {
                    message: 'Quiz created successfully',
                    data: savedQuiz
                }
            };
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }));
                return {
                    status: 400,
                    jsonBody: {
                        message: 'Validation error',
                        errors
                    }
                };
            }
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});


app.http('updateQuiz', {
    route: 'quiz/quiz/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const { id } = req.params;
        const body = await req.json();

        try {
            const updated = await Quiz.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            });
            if (!updated) {
                return {
                    status: 404,
                    jsonBody: { message: 'Quiz not found' }
                };
            }

            return {
                status: 200,
                jsonBody: {
                    message: 'Quiz updated successfully',
                    data: updated
                }
            };
        } catch (err) {
            if (err.name === 'ValidationError') {
                const errors = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }));
                return {
                    status: 400,
                    jsonBody: {
                        message: 'Validation error',
                        errors
                    }
                };
            }
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});


app.http('softDeleteQuiz', {
    route: 'quiz/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const { id } = req.params;

        try {
            const quiz = await Quiz.findById(id);
            if (!quiz) {
                return {
                    status: 404,
                    jsonBody: { message: 'Quiz not found' }
                };
            }
            quiz.active = false;
            await quiz.save();

            return {
                status: 200,
                jsonBody: { message: 'Document is deleted (soft)' }
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});
