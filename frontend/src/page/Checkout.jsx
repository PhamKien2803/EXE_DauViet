import React, { useState } from "react";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "sub-vn";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], total = 0, totalCount = 0 } = location.state || {};
  const { user } = useUser();
  const { clearCart } = useCart();
  const provinces = getProvinces();
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    note: "",
  });

  const [voucher] = useState([]);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    setProvinceCode(code);
    setDistricts(getDistrictsByProvinceCode(code));
    setDistrictCode("");
    setWards([]);
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    setDistrictCode(code);
    setWards(getWardsByDistrictCode(code));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async () => {
    if (!formData.phone || !formData.address) {
      toast.error("Vui lòng nhập đầy đủ thông tin liên hệ và địa chỉ.");
      return;
    }

    toast((t) => (
      <span>
        Bạn có chắc chắn muốn đặt hàng?
        <div className="mt-2 flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              submitOrder();
            }}

            className="px-3 py-1 bg-[#e94f4a] text-white rounded text-sm"
          >
            Đồng ý
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border text-sm rounded"
          >
            Hủy
          </button>
        </div>
      </span>
    ), { duration: 8000 });
  };

  const submitOrder = async () => {
    const orderData = {
      user: user?._id || null,
      products: selectedItems.map(item => ({
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

      const data = await res.json();
      if (res.ok) {
        toast.success("Đặt hàng thành công!");
        clearCart(); // ← THÊM DÒNG NÀY
        navigate("/billOrder");
      } else {
        toast.error("Lỗi khi đặt hàng: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi gửi đơn hàng:", err);
      toast.error("Lỗi mạng hoặc server không phản hồi.");
    }
  };

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="flex max-w-6xl gap-8 mx-auto">
        {/* Left: Form */}
        <div className="w-2/4 p-8 bg-white rounded-lg shadow-md flex-2">
          <h2 className="mb-4 text-2xl font-bold">Liên hệ</h2>
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 mb-2 border border-gray-300 rounded-md"
          />

          <h2 className="pt-4 mb-4 text-2xl font-bold">Giao hàng</h2>
          <div className="mb-3 text-sm text-gray-500">
            Địa chỉ này cũng sẽ được dùng làm địa chỉ thanh toán cho đơn hàng này.
          </div>

          {/* Tỉnh/Thành phố */}
          <select
            className="w-full p-3 mb-3 border border-gray-300 rounded-md"
            value={provinceCode}
            onChange={handleProvinceChange}
          >
            <option value="">Chọn tỉnh / thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Quận/Huyện + Phường/Xã */}
          <div className="flex gap-3 mb-3">
            <select
              className="flex-1 p-3 border border-gray-300 rounded-md"
              value={districtCode}
              onChange={handleDistrictChange}
              disabled={!provinceCode}
            >
              <option value="">Chọn quận / huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              className="flex-1 p-3 border border-gray-300 rounded-md"
              disabled={!districtCode}
            >
              <option value="">Chọn phường / xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <select className="w-full p-3 mb-3 border border-gray-300 rounded-md" disabled>
            <option>Việt Nam</option>
          </select>

          {/* Địa chỉ chi tiết */}
          <input
            type="text"
            name="address"
            placeholder="Số nhà, tên đường"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-red-400 rounded-md"
          />

          {/* Ghi chú */}
          <input
            type="text"
            name="note"
            placeholder="Ghi chú (tùy chọn)"
            value={formData.note}
            onChange={handleInputChange}
            className="w-full p-3 mb-3 border border-gray-300 rounded-md"
          />

          {/* Nút đặt hàng */}
          <button
            onClick={handleOrder}
            className="mt-5 w-full py-4 bg-[#e94f4a] text-white font-bold rounded-lg text-xl hover:bg-[#d13c36] transition"
          >
            Đặt Hàng
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="flex-1 p-6 bg-gray-100 rounded-lg">
          <div className="mb-4">
            {selectedItems.map((item) => (
              <div key={item._id} className="flex gap-3 mb-3">
                <div className="flex items-center justify-center bg-white border border-gray-200 rounded-lg w-10 h-10">
                  <span className="font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.price.toLocaleString()} đ
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 mb-2 text-sm text-gray-500">
            Tổng phụ · {totalCount} mặt hàng{" "}
            <span className="float-right text-gray-900">
              {total.toLocaleString()} đ
            </span>
          </div>
          <div className="mb-2 text-sm text-gray-500">
            Phí vận chuyển{" "}
            <span className="float-right text-gray-900">MIỄN PHÍ</span>
          </div>
          <div className="pl-0 mt-4 mb-2 text-lg font-bold text-left">
            Tổng tiền đơn hàng{" "}
            <span className="float-right text-gray-900">
              {total.toLocaleString()} đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
