import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  // Lấy user an toàn từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      navigate("/login");
    }
  }, [navigate, token]);

  // Gọi API lấy đơn hàng
  useEffect(() => {
    if (!user || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:9999/api/order/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Không thể tải đơn hàng");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  // Trạng thái loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8f0] text-orange-500 font-semibold text-lg">
        Đang tải đơn hàng...
      </div>
    );
  }

  // Trạng thái lỗi
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff8f0] text-red-500 font-medium">
        {error}
      </div>
    );
  }

  // Không có đơn hàng
  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f0] text-gray-600 px-6">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold mb-2 text-orange-600 uppercase">Chưa có đơn hàng nào</h2>
        <p className="mb-6 text-center text-gray-500 text-sm max-w-md">
          Bạn chưa đặt đơn hàng nào. Hãy quay về trang chủ để lựa chọn và đặt những sản phẩm yêu thích nhé!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          ← Về trang chủ
        </button>
      </div>
    );
  }

  // Hiển thị danh sách đơn hàng
  return (
    <div className="min-h-screen bg-[#fff8f0] py-10 px-4">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-orange-500 hover:underline hover:text-orange-600 transition"
          >
            ← Quay về Trang chủ
          </button>
          <h2 className="text-2xl font-bold text-orange-600">🧾 Đơn hàng của bạn</h2>
        </div>

        {orders.map((order) => (
          <div
            key={order._id}
            className="mb-6 p-5 border border-orange-200 rounded-xl shadow bg-white space-y-3 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-600">
              <span className="block">
                <span className="font-semibold text-gray-800">Mã đơn:</span> {order._id}
              </span>
              <span className="block">
                <span className="font-semibold text-gray-800">Trạng thái:</span>{" "}
                <span className="text-orange-600 font-medium">{order.state}</span>
              </span>
              <span className="block">
                <span className="font-semibold text-gray-800">Ngày đặt:</span>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 text-sm"
                >
                  <span className="text-gray-700">
                    {item.product?.name || "Sản phẩm đã xoá"}{" "}
                    <span className="text-gray-500">× {item.quantity}</span>
                  </span>
                  <span className="text-orange-500 font-semibold">
                    {item.product?.price?.toLocaleString()}₫
                  </span>
                </div>
              ))}
            </div>

            <div className="text-right text-sm text-gray-600">
              Tổng tiền:{" "}
              <span className="text-lg font-bold text-orange-600">
                {order.totalPrice?.toLocaleString()}₫
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderListPage;
