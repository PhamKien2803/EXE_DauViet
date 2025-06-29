import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BillOrder() {
  const [user, setUser] = useState(null);
  const [latestOrder, setLatestOrder] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Lấy thông tin user từ localStorage 1 lần
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
      console.error("Lỗi parse user:", err);
      navigate("/login");
    }
  }, [navigate, token]); // Chỉ chạy 1 lần khi component mount

  // Gọi API lấy đơn hàng mới nhất
  useEffect(() => {
    const fetchLatestOrder = async () => {
      if (!user?._id) return;

      try {
        const res = await fetch(`http://localhost:9999/api/order/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Không thể fetch đơn hàng");

        const data = await res.json();

        if (data.length > 0) {
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestOrder(sorted[0]);
        } else {
          alert("Không tìm thấy đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      }
    };

    fetchLatestOrder();
  }, [user, token]);

  if (!latestOrder) {
    return <div className="text-center mt-10 text-lg">Đang tải hóa đơn...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">✅ Cảm ơn bạn đã đặt hàng!</h2>
      <p className="text-center mb-4 text-gray-600">
        Mã đơn hàng: <strong>#{latestOrder._id.slice(-6)}</strong>
      </p>
            <p className="text-center mb-4 text-gray-600">
        Bạn có thể liên hệ qua Zalo: <strong>0987654321</strong> để theo dõi đơn hàng của mình.
      </p>

      <div className="border-t pt-4">
        <div className="mb-3">
          <strong>Người đặt:</strong> {user?.name || "Ẩn danh"}
        </div>
        <div className="mb-3">
          <strong>Địa chỉ giao hàng:</strong> {latestOrder.address}
        </div>
        <div className="mb-3">
          <strong>SĐT:</strong> {latestOrder.phone}
        </div>
        <div className="mb-3">
          <strong>Ghi chú:</strong> {latestOrder.note || "Không có"}
        </div>

        <hr className="my-4" />

        <h3 className="font-bold text-lg mb-2">Chi tiết đơn hàng</h3>
        <ul>
          {latestOrder.products.map((item, index) => (
            <li key={index} className="mb-2 flex justify-between">
              <span>{item.product.name} x {item.quantity}</span>
              <span>{(item.product.price * item.quantity).toLocaleString()} đ</span>
            </li>
          ))}
        </ul>

        <hr className="my-4" />

        <div className="text-right font-bold text-xl">
          Tổng cộng: {latestOrder.totalPrice.toLocaleString()} đ
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillOrder;
