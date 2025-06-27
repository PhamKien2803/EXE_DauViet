import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { CiSearch } from "react-icons/ci";

function Slider() {
  return (
    <div className="min-h-screen font-sans ">
      
      {/* Slider */}
      <div className="pt-5 relative w-[90%] mx-auto mt-6 rounded overflow-hidden shadow-lg">
        <img
          src="https://fos.ussh.vnu.edu.vn/uploads/fos/student/2023_07/hoang-thanh-thang-long-1.webp"
          alt="Hoàng Thành Thăng Long"
          className="object-cover w-full h-[500px]"
        />
        <button className="absolute p-2 text-xl -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/70">
          &#8592;
        </button>
        <button className="absolute p-2 text-xl -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/70">
          &#8594;
        </button>
        <div className="absolute text-white left-10 bottom-10">
          <h2 className="text-2xl font-bold drop-shadow">
            Hoàng Thành Thăng Long
          </h2>
          <p className="drop-shadow">Mô tả sản phẩm</p>
        </div>
      </div>

      
    </div>
  );
}

export default Slider;
