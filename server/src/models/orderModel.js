const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 } 
    }],
    vouchers: { type: String }, 
    state: {
        type: String,
        enum: ["Chưa thanh toán", "Đã thanh toán", "Hủy đơn hàng"],
        default: "Chưa thanh toán"
    },
    totalPrice: { type: Number },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String }
}, { timestamps: true }); 

orderSchema.pre("save", async function (next) {
    try {
        const order = this;
        const Product = mongoose.model("Product");
        let total = 0;
        for (const item of order.products) {
            const productData = await Product.findById(item.product);
            if (!productData) {
                return next(new Error(`Product with ID ${item.product} not found`));
            }
            total += productData.price * (item.quantity || 1);
        }
        order.totalPrice = total;
        next(); 
    } catch (err) {
        next(err); 
    }
});

module.exports = mongoose.model("Order", orderSchema);
