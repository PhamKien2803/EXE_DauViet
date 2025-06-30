const { app } = require('@azure/functions');
const Product = require('../shared/models/productModel');
const connectDB = require('../shared/mongoose');
const verifyToken = require('../shared/middlewares/verifyToken');


app.http('getProducts', {
    route: 'product',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        try {
            const products = await Product.find({ active: true });
            if (!products || products.length === 0) {
                return {
                    status: 404,
                    jsonBody: { message: 'Không có sản phẩm nào' }
                };
            }
            return {
                status: 200,
                jsonBody: {
                    code: 200,
                    products,
                    message: "Get All Products Successfully"
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

app.http('getProductById', {
    route: 'product/{id}',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return {
                    status: 404,
                    jsonBody: { message: 'Product not found' }
                };
            }
            return {
                status: 200,
                jsonBody: {
                    code: 200,
                    product,
                    message: "Get Product Successfully"
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

app.http('createProduct', {
    route: 'product',
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const auth = await verifyToken(req, context);
        if (!auth.success) return auth.response;

        try {
            const body = await req.json();
            const newProduct = new Product(body);
            const saved = await newProduct.save();
            return {
                status: 201,
                jsonBody: {
                    message: 'Product created successfully',
                    data: saved
                }
            };
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }));
                return {
                    status: 400,
                    jsonBody: {
                        message: 'Validation error',
                        errors: validationErrors
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

app.http('softDeleteProduct', {
    route: 'product/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const auth = await verifyToken(req, context);
        if (!auth.success) return auth.response;

        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return {
                    status: 404,
                    jsonBody: { message: 'Product not found' }
                };
            }
            product.active = false;
            await product.save();
            return {
                status: 200,
                jsonBody: { message: 'Product soft deleted' }
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: err.message }
            };
        }
    }
});

app.http('updateProduct', {
    route: 'product/product-update/{id}',
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (req, context) => {
        await connectDB();
        const auth = await verifyToken(req, context);
        if (!auth.success) return auth.response;

        try {
            const body = await req.json();
            const updated = await Product.findByIdAndUpdate(req.params.id, body, {
                new: true,
                runValidators: true
            });

            if (!updated) {
                return {
                    status: 404,
                    jsonBody: { message: 'Product not found' }
                };
            }

            return {
                status: 200,
                jsonBody: {
                    message: 'Product updated successfully',
                    data: updated
                }
            };
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = Object.values(err.errors).map(e => ({
                    field: e.path,
                    message: e.message
                }));
                return {
                    status: 400,
                    jsonBody: {
                        message: 'Validation error',
                        errors: validationErrors
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
