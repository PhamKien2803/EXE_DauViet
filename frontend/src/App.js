import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/homepage/Home";
import Login from "./page/Login";
import DetailProduct from "./components/viewDetail/DetailProduct";
import ProductHistory from "./components/productHistory/ProductHistory";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import CartPage from "./page/CartPage";
import { Toaster } from "react-hot-toast";
import OrderListPage from "./page/OrderListPage";
import { UserProvider } from "./context/UserContext";
import Quiz from "./components/quiz/Quiz";

// Import admin components
import AdminLayout from "./components/admin/AdminLayout";
import DashBoard from "./components/admin/DashBoard";
import Products from "./components/admin/Product";
import Quizzes from "./components/admin/Quizzes";
import Orders from "./components/admin/Order";

function App() {
  return (
    <SearchProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/detail/:id" element={<DetailProduct />} />
              <Route path="/history" element={<ProductHistory />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/quiz" element={<Quiz />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </SearchProvider>
  );
}

export default App;
