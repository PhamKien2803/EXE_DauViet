const { app } = require('@azure/functions');
const qs = require('qs');
const crypto = require('crypto');
const connectDB = require('../shared/mongoose');

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}

app.http('createVNPayUrl', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'vnpay/create',
    handler: async (request, context) => {
        await connectDB();
        const tmnCode = process.env.VNP_TMNCODE;
        const secretKey = process.env.VNP_HASHSECRET;
        const vnpUrl = process.env.VNP_URL;
        const returnUrl = process.env.VNP_RETURNURL;

        const date = new Date();
        const createDate = date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
        const orderId = date.getTime();
        const ipAddr = request.headers.get('x-forwarded-for') || '127.0.0.1';

        const { amount, orderDescription } = await request.json();

        if (!amount || !orderDescription) {
            return {
                status: 400,
                jsonBody: { message: 'Missing required fields' }
            };
        }

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId.toString(),
            vnp_OrderInfo: orderDescription,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        vnp_Params.vnp_SecureHash = signed;
        const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

        context.log("Return signData:", signData);
        context.log("Return signed hash recalculated:", signed);

        return {
            status: 200,
            jsonBody: { paymentUrl }
        };
    }
});


app.http('handleVNPayReturn', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'vnpay/return',
    handler: async (request, context) => {
        await connectDB();
        const queryParams = request.query;
        const vnp_Params = { ...queryParams };
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const secretKey = process.env.VNP_HASHSECRET;
        const sortedParams = sortObject(vnp_Params);
        const signData = qs.stringify(sortedParams, { encode: false });

        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                return {
                    status: 200,
                    body: '✅ Thanh toán thành công!'
                };
            } else {
                return {
                    status: 200,
                    body: '❌ Thanh toán thất bại. Mã lỗi: ' + vnp_Params['vnp_ResponseCode']
                };
            }
        } else {
            return {
                status: 400,
                body: '❌ Chữ ký không hợp lệ!'
            };
        }
    }
});
