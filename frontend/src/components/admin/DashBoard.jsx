
import { GiPagoda, GiCastle, GiImperialCrown } from "react-icons/gi";

const stats = [
  {
    label: "Sản Phẩm",
    value: 18,
    color: "bg-gradient-to-tr from-yellow-700 to-yellow-400",
    icon: <GiPagoda size={48} className="text-yellow-200 drop-shadow" />,
    bg: "bg-yellow-100/10",
  },
  {
    label: "Đơn Hàng",
    value: 12,
    color: "bg-gradient-to-tr from-red-800 to-red-400",
    icon: <GiCastle size={48} className="text-red-200 drop-shadow" />,
    bg: "bg-red-100/10",
  },
  {
    label: "Doanh Thu",
    value: 22,
    color: "bg-gradient-to-tr from-green-800 to-green-400",
    icon: <GiImperialCrown size={48} className="text-green-200 drop-shadow" />,
    bg: "bg-green-100/10",
  },
];

const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-800">
      Danh Lam Thắng Cảnh Việt Nam - Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center ${stat.color} ${stat.bg} hover:scale-105 transition-transform duration-200`}
        >
          <div className="mb-3">{stat.icon}</div>
          <div className="text-xl font-bold tracking-wide uppercase text-white drop-shadow text-center">{stat.label}</div>
          <div className="text-5xl font-extrabold my-3 text-white drop-shadow-lg">{stat.value}</div>
        </div>
      ))}
    </div>
    <div className="text-center text-base text-gray-500 font-medium">
      Tôn vinh di sản Việt qua từng mô hình danh thắng đặc sắc.
    </div>
  </div>
);

export default Dashboard;