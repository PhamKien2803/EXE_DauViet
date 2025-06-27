import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { getUserInfo, isAuthenticated } from "../../utils/auth";
import { useUser } from "../../context/UserContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartQuantity, cartItems } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { logout } = useUser();

  const [showCartPreview, setShowCartPreview] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = getUserInfo();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (location.pathname !== "/" && value) {
      navigate("/");
    }
  };

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-20 py-4 bg-white shadow-md">
        <div
          className="text-[#FFA500] font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          Dấu Việt
        </div>
        <ul className="flex space-x-8 text-sm font-medium">
          <li className="cursor-pointer hover:text-orange-500" onClick={() => navigate("/")}>
            Trang chủ
          </li>
          <li className="cursor-pointer hover:text-orange-500">Về chúng tôi</li>
          <li className="cursor-pointer hover:text-orange-500">Liên hệ</li>
        </ul>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm"
              className="py-1 pl-3 pr-10 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              style={{ width: 270 }}
              value={searchQuery}
              onChange={handleSearch}
            />
            <CiSearch className="absolute text-xl text-[#FFA500] -translate-y-1/2 right-3 top-1/2" />
          </div>

          {/* Đơn hàng + Giỏ hàng */}
          <div className="relative flex items-center space-x-4">
            {/* Đơn hàng */}
            <FaClipboardList
              className="text-xl text-[#FFA500] cursor-pointer hover:text-orange-500 transition"
              onClick={() => navigate("/orders")}
              title="Đơn hàng của tôi"
            />

            {/* Giỏ hàng */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faCartShopping}
                className="text-xl cursor-pointer text-[#FFA500] hover:text-orange-500 transition"
                onClick={() => setShowCartPreview((prev) => !prev)}
              />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {cartQuantity}
                </span>
              )}

              {/* Cart preview dropdown */}
              {showCartPreview && (
                <div className="absolute right-0 z-50 p-4 mt-2 bg-white border rounded shadow-lg w-80">
                  <h3 className="mb-2 text-sm font-bold text-gray-700">
                    Sản phẩm trong giỏ hàng
                  </h3>
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500">Chưa có sản phẩm nào.</p>
                  ) : (
                    <ul className="overflow-y-auto max-h-60">
                      {cartItems.map((item) => (
                        <li key={item._id} className="flex justify-between py-1 text-sm border-b">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="w-full px-3 py-2 mt-3 text-sm font-semibold text-white bg-orange-400 rounded hover:bg-orange-500"
                    onClick={() => {
                      if (!loggedIn) {
                        toast.error("Vui lòng đăng nhập trước khi xem giỏ hàng.");
                        navigate("/login");
                      } else {
                        navigate("/cart");
                        setShowCartPreview(false);
                      }
                    }}
                  >
                    Thanh Toán
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tài khoản */}
          {loggedIn ? (
            <div className="flex items-center gap-3 ml-2">
              <p className="text-sm text-gray-700 font-medium">
                👋 Chào, <span className="text-orange-500 font-semibold">{user?.username}</span>
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-300 rounded hover:bg-red-100 transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              className="px-5 py-2 ml-2 text-sm font-semibold text-white bg-orange-400 rounded hover:bg-orange-500 transition"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </nav>

      {/* Border bottom line */}
      <div className="fixed top-[73px] left-0 right-0 z-50 mx-20 h-1 border-b-2 border-[#FFA500] bg-white"></div>

      {/* Padding to prevent overlap with navbar */}
      <div className="h-[74px]"></div>
    </div>
  );
}

export default Header;
