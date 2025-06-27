const qs = require('qs');
const crypto = require('crypto');

// Tạo URL thanh toán
exports.createVNPayUrl = (req, res) => {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const orderId = date.getTime();
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const { amount, orderDescription } = req.body;
    if (!amount || !orderDescription) {
        return res.status(400).json({ message: "Missing required fields" });
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
console.log("Return signData:", signData);
console.log("Return signed hash recalculated:", signed);

    res.json({ paymentUrl });
};


exports.handleReturn = (req, res) => {
    const vnp_Params = req.query;
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
            res.send("✅ Thanh toán thành công!");
        } else {
            res.send("❌ Thanh toán thất bại. Mã lỗi: " + vnp_Params['vnp_ResponseCode']);
        }
    } else {
        res.status(400).send('❌ Chữ ký không hợp lệ!');
    }
};

// Hàm sắp xếp object theo key
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}
