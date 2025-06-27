import React from "react";
import { NavLink } from "react-router-dom";

const menu = [
  { to: "/admin/dashboard", label: "Dashboard" },
//   { to: "/admin/products", label: "Quản lý sản phẩm" },
//   { to: "/admin/quizzes", label: "Quản lý quiz" },
  { to: "/admin/orders", label: "Quản lý đơn hàng" },
  { to: "/", label: "Đăng xuất" },
];

const SideBar = () => (
  <aside className="w-64 bg-orange-400 text-white min-h-screen">
    <div className="p-6 font-bold text-2xl tracking-wide">Admin Panel</div>
    <nav className="mt-8 flex flex-col gap-2">
      {menu.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `px-6 py-3 hover:bg-orange-500 rounded transition ${
              isActive ? "bg-orange-500 font-semibold" : ""
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default SideBar;