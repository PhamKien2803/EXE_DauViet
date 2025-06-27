import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 p-8 bg-gray-50">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;