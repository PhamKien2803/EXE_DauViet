import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const { cartItems, updateItemQuantity, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState(
    cartItems.map((item) => item._id)
  );
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItems(cartItems.map((item) => item._id));
  }, [cartItems]);

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 1) updateItemQuantity(id, newQty);
  };

  const total = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const totalCount = cartItems
    .filter((item) => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!agree) {
      toast.error("Vui lòng đồng ý với điều khoản và điều kiện thanh toán.");
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems: cartItems.filter((item) =>
          selectedItems.includes(item._id)
        ),
        total,
        totalCount,
      },
    });
  };

  return (
    <div className="bg-[#fafafa] min-h-screen py-8">
      <div className="flex flex-col max-w-6xl gap-8 mx-auto md:flex-row">
        {/* Left: Cart Items */}
        <div className="flex-1 p-6 bg-white rounded-lg shadow">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#e94f4a] mb-4">Giỏ hàng</h1>
          </div>
          {cartItems.length === 0 ? (
            <div className="mt-10 text-center text-gray-500">
              <p className="mb-2 text-3xl">🛍️</p>
              <p className="text-lg">Giỏ hàng của bạn đang trống.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-green-600">
                Bạn được miễn phí ship
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between gap-4 py-4 sm:flex-row"
                  >
                    <div className="flex items-start w-full gap-4 sm:w-2/3">
                      <img
                        src={
                          Array.isArray(item.images)
                            ? item.images[0]
                            : item.images
                        }
                        alt={item.name}
                        className="object-cover w-24 h-24 border border-orange-200 rounded"
                      />
                      <div className="flex flex-col justify-between">
                        <h2 className="mb-2 text-xl font-bold text-gray-800">
                          {item.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-base text-gray-500">
                            Số lượng
                          </span>
                          <button
                            className="w-7 h-7 border border-[#e94f4a] text-[#e94f4a] rounded-full text-lg flex items-center justify-center hover:bg-[#ffeaea]"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-7 h-7 border border-[#e94f4a] text-[#e94f4a] rounded-full text-lg flex items-center justify-center hover:bg-[#ffeaea]"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="w-10 mt-3 text-sm text-gray-500 underline hover:text-red-500"
                          onClick={() => removeItem(item._id)}
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between min-w-[120px]">
                      <span className="text-[#e94f4a] font-bold text-2xl">
                        {item.price.toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-lg text-gray-600">Tổng cộng:</span>
                <span className="text-xl font-bold">{totalCount} Sản phẩm</span>
              </div>
              <div className="mt-4">
                <button
                  className="text-[#e94f4a] font-semibold hover:underline"
                  onClick={() => navigate("/")}
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </>
          )}
        </div>
        {/* Right: Summary & Checkout */}
        <div className="w-full md:w-[350px] bg-white rounded-lg shadow p-6 h-fit">
          <div className="mb-8 space-y-4">
            <div className="flex justify-between text-xl text-gray-600">
              <span className="text-lg">Tiền hàng hoá</span>
              <span className="text-lg">{total.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span className="text-lg">Giảm giá</span>
              <span className="text-lg">0</span>
            </div>
            <div className="flex justify-between text-2xl font-bold">
              <span className="text-lg">Tổng cộng</span>
              <span className="text-[#e94f4a] text-lg">
                {total.toLocaleString()}₫
              </span>
            </div>
          </div>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-[#e94f4a] w-4 h-4 mr-2"
              id="agree-term"
            />
            <label htmlFor="agree-term" className="text-sm text-gray-700">
              Tôi đã đọc và đồng ý với{" "}
              <a href="#" className="text-[#e94f4a] underline">
                điều khoản
              </a>{" "}
              và{" "}
              <a href="#" className="text-[#e94f4a] underline">
                điều kiện thanh toán
              </a>
            </label>
          </div>
          <button
            className="w-full py-4 bg-[#e94f4a] text-white font-bold rounded-lg text-xl hover:bg-[#d13c36] transition disabled:opacity-50"
            disabled={!agree || cartItems.length === 0}
            onClick={handleCheckout}
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
