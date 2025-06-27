const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Gọi API để tạo link thanh toán
router.post('/payment', paymentController.createVNPayUrl);

// Xử lý khi VNPay redirect về
router.get('/vnpay_return', paymentController.handleReturn);

module.exports = router;
