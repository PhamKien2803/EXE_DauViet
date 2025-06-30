import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

function MainContent() {
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const productRefs = useRef({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const formatPrice = (price) =>
    price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/
        const response = await fetch("https://azure-dau-viet-function-bucwa3f7b2fjbnbh.eastus-01.azurewebsites.net/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        if (response.status === 204) {
          setProducts([]);
          setLoading(false);
          return;
        }

        let data = null;
        try {
          data = await response.json();
        } catch (e) {
          console.warn("Không có JSON hợp lệ từ server:", e);
          setProducts([]);
          setLoading(false);
          return;
        }

        const productsData = Array.isArray(data)
          ? data
          : data?.products || [];
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
  const productsPerPage = 8;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (direction) => {
    if (direction === "prev" && startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else if (direction === "next" && endIndex < filteredProducts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  useEffect(() => {
    if (searchQuery && filteredProducts.length > 0) {
      scrollToProduct(filteredProducts[0]._id);
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
      <section className="w-[90%] mx-auto mt-10">
        <div className="flex items-center mb-10">
          <div className="w-2 h-6 mr-2 bg-red-400 rounded"></div>
          <span className="text-xl font-semibold text-red-400">Sản Phẩm</span>
        </div>
        <div className="mb-4 text-base text-gray-600">
          Hiển thị {filteredProducts.length} sản phẩm
        </div>

        <div className="relative">
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

          <div className="grid grid-cols-4 gap-6" style={{ margin: "0 48px" }}>
            {currentProducts.map((product) => (
              <div
                key={product._id}
                ref={(el) => (productRefs.current[product._id] = el)}
                className="flex flex-col p-3 transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <div
                  className="relative flex items-center justify-center h-48 mb-4 overflow-hidden rounded-lg"
                  onClick={() => handleDetailProduct(product._id)}
                >
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
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
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 py-3 mt-5 mb-3 text-sm font-medium text-white transition-colors duration-300 bg-orange-400 rounded-lg hover:bg-orange-500"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
              </div>
            ))}
          </div>

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
