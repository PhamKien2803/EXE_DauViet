import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSearch } from "../../context/SearchContext";
import { ShoppingCart } from 'lucide-react';
import { useCart } from "../../context/CartContext";

function MainContent() {
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const productRefs = useRef({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  // Hàm format giá tiền
  const formatPrice = (price) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();

        // Check if data is an array or has a data property
        const productsData = Array.isArray(data) ? data : data.data || [];

        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDetailProduct = (productId) => {
    navigate(`/detail/${productId}`);
  };

  const scrollToProduct = (productId) => {
    const element = productRefs.current[productId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.price.toString().toLowerCase().includes(searchLower)
    );
  });

  const [startIndex, setStartIndex] = useState(0);
  const productsPerPage = 8; // 2 hàng, 4 cột
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (direction) => {
    if (direction === "prev" && startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else if (direction === "next" && endIndex < filteredProducts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  // Effect to scroll to first matching product when search changes
  React.useEffect(() => {
    if (searchQuery && filteredProducts.length > 0) {
      scrollToProduct(filteredProducts[0].id);
    }
  }, [searchQuery, filteredProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Flash Sales */}
      <section className="w-[90%] mx-auto mt-10">
        <div className="flex items-center mb-10">
          <div className="w-2 h-6 mr-2 bg-red-400 rounded"></div>
          <span className="text-xl font-semibold text-red-400">Sản Phẩm</span>
        </div>
        {/* Hiển thị tổng số sản phẩm */}
        <div className="mb-4 text-base text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
        </div>
        {/* Flash Sale Products */}
        <div className="relative">
          {/* Prev Button */}
          {startIndex > 0 && (
            <button
              onClick={() => handlePageChange("prev")}
              className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow top-1/2 hover:bg-orange-400 hover:text-white group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-4 gap-6" style={{ margin: "0 48px" }}>
            {currentProducts.map((product) => (
              <div
                key={product.id}
                ref={(el) => (productRefs.current[product._id] = el)}
                className="flex flex-col p-3 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <div
                  className="relative flex items-center justify-center h-48 mb-4 overflow-hidden rounded-lg"
                  onClick={() => handleDetailProduct(product._id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="mb-2 text-sm font-normal line-clamp-2">
                  {product.name}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-orange-500">
                    {formatPrice(product.price)} VND
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.oldPrice)} VND
                    </span>
                  )}
                </div>
                <button
                  // onClick={() => handleDetailProduct(product._id)}
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 py-3 mt-5 mb-3 text-sm font-medium text-white transition-colors duration-300 bg-orange-400 rounded-lg hover:bg-orange-500"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
              </div>
            ))}
          </div>

          {/* Next Button */}
          {endIndex < filteredProducts.length && (
            <button
              onClick={() => handlePageChange("next")}
              className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow top-1/2 hover:bg-orange-400 hover:text-white group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default MainContent;
