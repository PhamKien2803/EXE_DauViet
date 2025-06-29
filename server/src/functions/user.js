import { app } from '@azure/functions';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { redisClient } from '../config/redisClient.js';
import User from '../models/userModels.js';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'exe_201';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'exe_201';

async function verifyToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

app.http('loginAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/login',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { username, password } = body;

            if (!username || !password) {
                return { status: 400, jsonBody: { message: 'Please enter username and password' } };
            }

            const user = await User.findOne({ username, active: true });
            if (!user) {
                return { status: 404, jsonBody: { message: 'Account not registered!' } };
            }

            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return { status: 401, jsonBody: { message: 'Username or password is incorrect!' } };
            }

            const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: '1d' });
            const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });

            await redisClient.set(user._id.toString(), refreshToken, { EX: 7 * 24 * 60 * 60 });

            return {
                status: 200,
                jsonBody: {
                    message: 'Login successful',
                    accessToken,
                    refreshToken
                }
            };
        } catch (err) {
            context.log('Login error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    }
});

app.http('registerAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/register',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const { username, email, password, role } = body;

            if (!username || !email || !password) {
                return { status: 400, jsonBody: { message: 'Missing required fields' } };
            }

            const existingUser = await User.findOne({
                $or: [{ username }, { email }],
                active: true
            });

            if (existingUser) {
                return { status: 400, jsonBody: { message: 'Username or email already exists' } };
            }

            const newAccount = new User({ username, email, password, role });
            await newAccount.save();

            return {
                status: 201,
                jsonBody: { message: 'Account created successfully', account: newAccount }
            };
        } catch (err) {
            context.log('Register error:', err);
            return { status: 500, jsonBody: { message: 'Server error', error: err.message } };
        }
    }
});

app.http('logoutAccount', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'auth/logout',
    handler: async (request, context) => {
        try {
            const user = await verifyToken(request);
            if (!user) return { status: 401, jsonBody: { message: 'Unauthorized' } };

            await redisClient.del(user.id.toString());
            return { status: 200, jsonBody: { message: 'Logout successful' } };
        } catch (err) {
            context.log('Logout error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    }
});

app.http('getInformationAccount', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'auth/me',
    handler: async (request, context) => {
        try {
            const user = await verifyToken(request);
            if (!user) return { status: 401, jsonBody: { message: 'Unauthorized' } };

            const account = await User.findById(user.id);
            if (!account) {
                return { status: 404, jsonBody: { message: 'Account not found' } };
            }

            return {
                status: 200,
                jsonBody: account
            };
        } catch (err) {
            context.log('Get info error:', err);
            return { status: 500, jsonBody: { message: 'Server error' } };
        }
    }
});
