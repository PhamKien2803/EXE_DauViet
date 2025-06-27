
const orders = [
  {
    id: "ORDER-001",
    name: "Chùa Một Cột",
    customer: "Nguyễn Văn A",
    status: "Đã giao",
    start: "19/06/2025 08:03",
    end: "19/06/2025 09:15",
  },
  {
    id: "ORDER-002",
    name: "Hoàng Thành Thăng Long",
    customer: "Trần Thị B",
    status: "Đã giao",
    start: "18/06/2025 13:53",
    end: "18/06/2025 15:00",
  },
  {
    id: "ORDER-003",
    name: "Cố Đô Huế",
    customer: "Lê Văn C",
    status: "Đã giao",
    start: "17/06/2025 11:19",
    end: "17/06/2025 12:30",
  },
  // ...thêm dữ liệu nếu muốn
];

const columns = [
  { label: "STT", key: "index", width: "w-12" },
  { label: "Mã đơn hàng", key: "id", width: "w-40" },
  { label: "Tên mô hình", key: "name", width: "w-56" },
  { label: "Khách hàng", key: "customer", width: "w-40" },
  { label: "TG Đặt hàng", key: "start", width: "w-40" },
  { label: "TG Giao hàng", key: "end", width: "w-40" },
];


const Orders = () => (
  <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-white rounded-xl shadow-xl p-8">
    <h2 className="text-2xl font-extrabold mb-6 text-orange-700 flex items-center gap-2">
      <span>ĐƠN HÀNG MÔ HÌNH LỊCH SỬ</span>
    </h2>
    <div className="overflow-x-auto rounded-lg border border-orange-200 shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-orange-100 text-orange-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-2 font-bold uppercase tracking-wide ${col.width} border-b border-orange-200`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr
              key={order.id}
              className={
                idx % 2 === 0
                  ? "bg-white hover:bg-orange-50 transition"
                  : "bg-orange-50 hover:bg-orange-100 transition"
              }
            >
              <td className="py-2 px-2 text-center font-semibold">{idx + 1}</td>
              <td className="py-2 px-2 text-blue-700 font-semibold underline cursor-pointer">{order.id}</td>
              <td className="py-2 px-2 font-medium">{order.name}</td>
              <td className="py-2 px-2">{order.customer}</td>
              <td className="py-2 px-2">{order.start}</td>
              <td className="py-2 px-2">{order.end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 text-sm text-gray-500 text-center italic">
      * Mỗi đơn hàng là một câu chuyện lịch sử Việt Nam được gửi đến khách hàng.
    </div>
  </div>
);

export default Orders;