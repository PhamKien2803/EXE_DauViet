import { useNavigate, useParams } from "react-router-dom";
import Header from "../homepage/Header";
import Footer from "../homepage/Footer";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

function DetailProduct() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy id từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Cập nhật API endpoint để lấy chi tiết sản phẩm
        const response = await fetch(`http://localhost:9999/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Xử lý trường hợp API trả về dữ liệu trong thuộc tính 'data'
        setProduct(data.data || data);
      } catch (error) {
        // Xử lý lỗi, ví dụ: điều hướng đến trang 404
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div>Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div>Product not found.</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl px-4 py-8 pt-12 mx-auto">
        {/* Main content */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Images */}
          <div className="flex flex-col w-full gap-4 md:w-1/2">
            <img
              src={
                Array.isArray(product.images)
                  ? product.images[0]
                  : product.images
              }
              alt={product.name}
              className="object-cover w-full rounded-lg h-96"
            />
          </div>
          {/* Product Info */}
          <div className="flex flex-col w-full md:w-1/2">
            <h2 className="mb-2 text-2xl font-semibold text-left">
              {product.name}
            </h2>
            <div className="flex items-center mb-2">
              <span className="text-lg text-yellow-400">★★★★★</span>
              <span className="ml-2 text-sm text-gray-500">
                ({product.rating || 4.9})
              </span>
            </div>
            <div className="flex items-center mb-2">
              <span>Size: </span>
              <span className="ml-2">{product.size || "N/A"}</span>
            </div>
            <div className="mb-4 text-2xl font-bold">
              {product.price.toLocaleString()} VND
            </div>
            <p className="mb-4">{product.description}</p>

            <div className="flex flex-col gap-3 pt-4 mt-auto sm:flex-row sm:items-center">
              <button
                className="px-6 py-2 text-white bg-orange-500 rounded"
                onClick={() => navigate("/history")}
              >
                View History
              </button>

              <div className="flex items-center border rounded w-fit">
                <button
                  className="px-3 py-1 text-lg font-semibold"
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                >
                  −
                </button>
                <span className="px-4 py-1 text-sm">{quantity}</span>
                <button
                  className="px-3 py-1 text-lg font-semibold"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              {/* Nút thêm vào giỏ hàng */}
              <button
                className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                // onClick={() => addToCart({ ...product, quantity })}
                onClick={() => addToCart(product, quantity)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-8 mt-10 text-gray-500 border-b">
          <button className="py-2 border-b-2 border-transparent hover:border-black">
            The Details
          </button>
          <button className="py-2 border-b-2 border-transparent hover:border-black">
            Ratings & Reviews <span className="text-black">(32)</span>
          </button>
          <button className="py-2 text-black border-b-2 border-black">
            Discussion <span className="text-black">(5)</span>
          </button>
        </div>
        {/* Discussion */}
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold">Discussion</h3>
          {/* Comment List */}
          <div className="space-y-6">
            {/* Comment Item */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-semibold">Kathryn Murphy</div>
                  <div className="text-sm text-gray-600">
                    The fit is perfect, and the quality is top-notch.
                  </div>
                  <div className="mt-1 text-xs text-gray-400">1 week ago</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 cursor-pointer ml-14">
                Show replies
              </div>
            </div>
            {/* More comments... */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DetailProduct;
