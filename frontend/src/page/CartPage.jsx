import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems, updateItemQuantity, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item._id));
  const [voucher, setVoucher] = useState("");
  console.log(setVoucher);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({ address: "", phone: "", note: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItems(cartItems.map(item => item._id));
  }, [cartItems]);

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartItems.length ? [] : cartItems.map(item => item._id)
    );
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 1) updateItemQuantity(id, newQty);
  };

  const total = cartItems
    .filter(item => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const user = JSON.parse(localStorage.getItem("user"));
  const selectedProducts = cartItems.filter(item => selectedItems.includes(item._id));

  const handleSubmitOrder = async () => {
    if (!formData.address.trim() || !formData.phone.trim()) {
      toast.error("Vui lòng nhập địa chỉ và số điện thoại.");
      return;
    }

    const orderData = {
      user: user?._id || null,
      products: selectedProducts.map(item => ({
        product: item._id,
        quantity: item.quantity
      })),
      vouchers: voucher,
      state: "Chưa thanh toán",
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      note: formData.note.trim()
    };

    try {
      const res = await fetch("http://localhost:9999/api/order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error("Tạo đơn hàng thất bại");
      await res.json();
      toast.success("🎉 Đặt hàng thành công!");

      // Trừ số lượng trong giỏ hàng sau khi đặt hàng
      selectedItems.forEach(itemId => {
        const item = cartItems.find(i => i._id === itemId);
        if (!item) return;

        const remainingQty = item.quantity - 1;
        if (remainingQty <= 0) {
          removeItem(itemId);
        } else {
          updateItemQuantity(itemId, remainingQty);
        }
      });

      setShowOrderForm(false);
      setFormData({ address: "", phone: "", note: "" });
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#fff8f0] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-orange-600">🛒 Giỏ hàng của bạn</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 px-3 py-1.5 border border-orange-300 text-orange-600 text-sm rounded hover:bg-orange-100 transition"
          >
            <span className="text-lg">←</span> Trang chủ
          </button>
          <button
            onClick={toggleSelectAll}
            className="px-3 py-1.5 border border-orange-300 text-orange-600 text-sm rounded hover:bg-orange-100 transition"
          >
            {selectedItems.length === cartItems.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-3xl mb-2">🛍️</p>
          <p className="text-lg">Giỏ hàng của bạn đang trống.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Danh sách sản phẩm */}
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-4">
              <div className="flex items-start gap-4 w-full sm:w-2/3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="accent-orange-500 mt-2 w-4 h-4"
                />
                <img
                  src={Array.isArray(item.images) ? item.images[0] : item.images}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded border border-orange-200"
                />
                <div className="flex flex-col justify-between">
                  <h2 className="text-base font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Giá:{" "}
                    <span className="text-orange-500 font-medium">
                      {item.price.toLocaleString()}₫
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end sm:justify-start">
                <button
                  className="px-2 py-1 text-sm bg-orange-200 text-orange-700 rounded hover:bg-orange-300"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="min-w-[24px] text-center">{item.quantity}</span>
                <button
                  className="px-2 py-1 text-sm bg-orange-200 text-orange-700 rounded hover:bg-orange-300"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  className="ml-3 text-sm text-red-500 hover:underline"
                  onClick={() => removeItem(item._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}

          {/* Tổng + nút thanh toán */}
          <div className="text-right mt-10 space-y-3 border-t pt-4">
            <p className="text-lg font-semibold text-gray-700">
              Tổng tiền:{" "}
              <span className="text-orange-500 font-bold">
                {total.toLocaleString()}₫
              </span>
            </p>
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              onClick={() => setShowOrderForm(true)}
              disabled={selectedItems.length === 0}
            >
              Tiến hành thanh toán
            </button>
          </div>

          {/* Form giao hàng */}
          {showOrderForm && (
            <div className="mt-8 p-6 border border-orange-200 rounded-lg bg-white shadow space-y-4">
              <h2 className="text-xl font-bold text-orange-600">📦 Thông tin giao hàng</h2>
              <input
                type="text"
                placeholder="🏠 Địa chỉ giao hàng"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-orange-200"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <input
                type="text"
                placeholder="📞 Số điện thoại"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-orange-200"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea
                placeholder="✏️ Ghi chú thêm (nếu có)"
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:ring-orange-200"
                rows="3"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
              <div className="text-right">
                <button
                  className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleSubmitOrder}
                >
                  Xác nhận đặt hàng
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CartPage;
