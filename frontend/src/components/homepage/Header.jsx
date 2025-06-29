import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { CiSearch } from "react-icons/ci";
// import { FaUserCircle } from "react-icons/fa";
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
  const { cartQuantity, cartItems, updateItemQuantity, removeItem } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const { logout } = useUser();

  const [showCartPreview, setShowCartPreview] = useState(false);
  // const [showUserMenu, setShowUserMenu] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

  const handleIncrease = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      // Nếu giảm về 0 thì xóa luôn sản phẩm khỏi giỏ
      removeItem(id);
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
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
          <li
            className="cursor-pointer hover:text-orange-500"
            onClick={() => navigate("/")}
          >
            Trang chủ
          </li>
          <li className="cursor-pointer hover:text-orange-500">Về chúng tôi</li>
          <li className="cursor-pointer hover:text-orange-500">Liên hệ</li>
        </ul>
        <div className="flex items-center space-x-10">
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
                className="text-xl  cursor-pointer text-[#FFA500] hover:text-orange-500 transition"
                onClick={() => setShowCartPreview((prev) => !prev)}
              />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {cartQuantity}
                </span>
              )}

              {/* Cart preview dropdown */}
              {showCartPreview && (
                <div className="absolute right-0 z-50 p-4 mt-2 bg-white border rounded shadow-lg w-96">
                  <h3 className="mb-2 text-base font-bold text-gray-700">
                    Giỏ hàng ({cartQuantity})
                  </h3>
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Chưa có sản phẩm nào.
                    </p>
                  ) : (
                    <div>
                      <ul className="overflow-y-auto divide-y max-h-60">
                        {cartItems.map((item) => (
                          <li
                            key={item._id}
                            className="flex items-center gap-3 py-3"
                          >
                            <img
                              src={
                                Array.isArray(item.images)
                                  ? item.images[0]
                                  : item.images
                              }
                              alt={item.name}
                              className="object-cover w-16 h-16 border rounded"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {item.name}
                              </div>
                              <div className="flex items-center mt-1">
                                <button
                                  className="text-lg font-bold text-orange-500 border rounded-full w-7 h-7"
                                  onClick={() => handleDecrease(item._id)}
                                >
                                  -
                                </button>
                                <span className="w-6 mx-2 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="text-lg font-bold text-orange-500 border rounded-full w-7 h-7"
                                  onClick={() => handleIncrease(item._id)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-red-500">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                ₫
                              </div>
                              <button
                                className="mt-2 text-gray-400 hover:text-red-500"
                                onClick={() => handleRemove(item._id)}
                                title="Xóa"
                              >
                                <svg width="18" height="18" fill="currentColor">
                                  <path d="M6 7h1v7H6V7zm5 0h-1v7h1V7zm-7 9V6h12v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-12V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h5v2H3V4h5zm2-1a1 1 0 0 0-1 1v1h4V4a1 1 0 0 0-1-1H8z" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {/* Tổng cộng */}
                      <div className="flex items-center justify-between px-3 py-2 mt-3 mb-2 bg-gray-100 rounded">
                        <span className="font-medium text-gray-600">
                          Tổng cộng
                        </span>
                        <span className="text-lg font-bold text-red-500">
                          {cartItems
                            .reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                            .toLocaleString()}{" "}
                          ₫
                        </span>
                      </div>
                      {/* Checkbox điều khoản */}
                      <div className="flex pt-3 pb-3 mb-2">
                        <input
                          id="agree"
                          type="checkbox"
                          className="h-4 mr-2 w-7"
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                        />
                        <label htmlFor="agree" className="text-sm">
                          Tôi đã đọc và đồng ý với{" "}
                          <a href="#" className="text-blue-500 underline">
                            điều khoản
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-blue-500 underline">
                            điều kiện thanh toán
                          </a>
                        </label>
                      </div>
                      {/* Nút */}
                      <div className="flex gap-2">
                        <button
                          className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-semibold text-orange-500 border border-orange-400 rounded hover:bg-orange-50"
                          onClick={() => {
                            navigate("/cart");
                            setShowCartPreview(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faCartShopping} />
                          Xem giỏ hàng
                        </button>
                        <button
                          className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-orange-400 rounded hover:bg-orange-500 disabled:opacity-50"
                          disabled={!agreed}
                          onClick={() => {
                            if (!loggedIn) {
                              toast.error(
                                "Vui lòng đăng nhập trước khi thanh toán."
                              );
                              navigate("/login");
                            } else {
                              navigate("/checkout", {
                                state: {
                                  selectedItems: cartItems,
                                  total: cartItems.reduce(
                                    (sum, item) =>
                                      sum + item.price * item.quantity,
                                    0
                                  ),
                                  totalCount: cartQuantity,
                                },
                              });
                              setShowCartPreview(false);
                            }
                          }}
                        >
                          Thanh toán ngay
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tài khoản */}
          {loggedIn ? (
            <div className="flex items-center gap-3 ml-2">
              <p className="text-sm font-medium text-gray-700">
                👋 Chào,{" "}
                <span className="font-semibold text-orange-500">
                  {user?.username}
                </span>
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-500 transition border border-red-300 rounded hover:bg-red-100"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              className="px-5 py-2 ml-2 text-sm font-semibold text-white transition bg-orange-400 rounded hover:bg-orange-500"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </nav>

      {/* Border bottom line */}
      {!showCartPreview && (
        <div className="fixed top-[73px] left-0 right-0 z-40 mx-20 h-1 border-b-2 border-[#FFA500] bg-white"></div>
      )}

      {/* Padding to prevent overlap with navbar */}
      <div className="h-[74px]"></div>
    </div>
  );
}

export default Header;
