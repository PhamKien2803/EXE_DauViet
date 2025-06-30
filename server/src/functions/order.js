const { app } = require('@azure/functions');
const connectDB = require('../shared/mongoose');
const Order = require('../shared/models/orderModel');
const verifyToken = require('../shared/middlewares/verifyToken');

app.http('getOrder', {
    route: 'order',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        try {
            const orders = await Order.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
            return {
                status: 200,
                jsonBody: orders,
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: 'Lỗi server', error: err.message },
            };
        }
    },
});

app.http('getOrderById', {
    route: 'order/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        const { id } = req.params;

        try {
            const order = await Order.findById(id);
            if (!order) {
                return {
                    status: 404,
                    jsonBody: { message: 'Không tìm thấy đơn hàng' },
                };
            }
            return {
                status: 200,
                jsonBody: order,
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: 'Lỗi server', error: err.message },
            };
        }
    },
});

app.http('getOrderByUser', {
    route: 'order/user/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        console.log('Fetching orders for verifyToken(req):', verifyToken(req));

        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        const { id } = req.params;

        try {
            const orders = await Order.find({ user: id }).populate('products.product');
            return {
                status: 200,
                jsonBody: orders,
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: 'Lỗi server', error: err.message },
            };
        }
    },
});

app.http('createOrder', {
    route: 'order',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        const body = await req.json();

        try {
            const newOrder = new Order(body);
            await newOrder.save();
            return {
                status: 201,
                jsonBody: newOrder,
            };
        } catch (err) {
            return {
                status: 400,
                jsonBody: { message: 'Tạo đơn hàng thất bại', error: err.message },
            };
        }
    },
});

app.http('updateOrder', {
    route: 'order/order-update/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        const { id } = req.params;
        const updates = await req.json();

        try {
            const updated = await Order.findByIdAndUpdate(id, updates, { new: true });
            if (!updated) {
                return {
                    status: 404,
                    jsonBody: { message: 'Không tìm thấy đơn hàng để cập nhật' },
                };
            }
            return {
                status: 200,
                jsonBody: updated,
            };
        } catch (err) {
            return {
                status: 400,
                jsonBody: { message: 'Cập nhật đơn hàng thất bại', error: err.message },
            };
        }
    },
});

app.http('softDeleteOrder', {
    route: 'order/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req) => {
        await connectDB();
        const authResult = await verifyToken(req);
        if (authResult) return authResult;

        const { id } = req.params;

        try {
            const deleted = await Order.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
            if (!deleted) {
                return {
                    status: 404,
                    jsonBody: { message: 'Không tìm thấy đơn hàng để xoá mềm' },
                };
            }
            return {
                status: 200,
                jsonBody: deleted,
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: 'Lỗi khi xoá mềm', error: err.message },
            };
        }
    },
});
