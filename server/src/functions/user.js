const { app } = require('@azure/functions');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModels.js');
const connectDB = require('../shared/mongoose');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'exe_201';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'exe_201';

async function verifyToken(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { status: 401, jsonBody: { message: 'Missing or invalid Authorization header' } };
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        return { user: decoded };
    } catch (err) {
        return { status: 401, jsonBody: { message: 'Invalid or expired token' } };
    }
}

app.http('loginAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/login',
    handler: async (req, context) => {
        try {
            await connectDB();
            const { username, password } = await req.json();

            if (!username || !password) {
                return { status: 400, jsonBody: { message: 'Please enter username and password' } };
            }

            const user = await User.findOne({ username, active: true });
            if (!user) {
                return { status: 404, jsonBody: { message: 'Account not registered!' } };
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return { status: 401, jsonBody: { message: 'Username or password is incorrect!' } };
            }

            const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: '1d' });
            const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

            return {
                status: 200,
                jsonBody: {
                    message: 'Login successful',
                    accessToken,
                    refreshToken,
                },
            };
        } catch (err) {
            context.log('Login error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    },
});

app.http('registerAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/register',
    handler: async (req, context) => {
        try {
            await connectDB();
            const { username, email, password, role } = await req.json();

            if (!username || !email || !password) {
                return { status: 400, jsonBody: { message: 'Missing required fields' } };
            }

            const exists = await User.findOne({
                $or: [{ username }, { email }],
                active: true,
            });

            if (exists) {
                return { status: 400, jsonBody: { message: 'Username or email already exists' } };
            }

            const newUser = new User({ username, email, password, role });
            await newUser.save();

            return {
                status: 201,
                jsonBody: {
                    message: 'Account created successfully',
                    account: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        role: newUser.role,
                    },
                },
            };
        } catch (err) {
            context.log('Register error:', err);
            return { status: 500, jsonBody: { message: 'Server error', error: err.message } };
        }
    },
});

app.http('logoutAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/logout',
    handler: async (req, context) => {
        try {
            await connectDB();
            const auth = await verifyToken(req);
            if (auth.status) return auth;
            return { status: 200, jsonBody: { message: 'Logout successful' } };
        } catch (err) {
            context.log('Logout error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    },
});

app.http('getInformationAccount', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'auth/me',
    handler: async (req, context) => {
        try {
            await connectDB();
            const auth = await verifyToken(req);
            if (auth.status) return auth;

            const userId = auth.user.id;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return { status: 404, jsonBody: { message: 'Account not found' } };
            }

            return {
                status: 200,
                jsonBody: user,
            };
        } catch (err) {
            context.log('Get info error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    },
});

