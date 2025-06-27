import Header from "../homepage/Header";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ProductHistory() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const historicalPeriods = [
    {
      id: 0,
      name: "Hiện đại (1945-nay)",
      years: "1945 - nay",
      description: "Thời kỳ bảo tồn và phát huy giá trị",
      content:
        "Sau Cách mạng Tháng Tám, Hoàng thành được bảo tồn và nghiên cứu. Năm 2010, UNESCO công nhận Hoàng thành Thăng Long là Di sản Văn hóa Thế giới. Hiện nay, đây là điểm du lịch văn hóa quan trọng của Hà Nội.",
      images: [
        "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg",
        "https://static.vinwonders.com/production/hoang-thanh-thang-long-5.jpg",
      ],
    },
    {
      id: 1,
      name: "Thời Nguyễn (1802-1945)",
      years: "1802 - 1945",
      description: "Thời kỳ suy tàn và chuyển đổi",
      content:
        "Vua Gia Long dời đô vào Huế, Hoàng thành Thăng Long mất dần vai trò chính trị. Tuy nhiên, đây vẫn là trung tâm hành chính quan trọng của Bắc Kỳ. Thời kỳ Pháp thuộc, nhiều công trình bị phá hủy hoặc thay đổi mục đích sử dụng.",
      images: [
        "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Hoang_Thanh_Thang_Long_Archaeological_Site_4.jpg/1200px-Hoang_Thanh_Thang_Long_Archaeological_Site_4.jpg",
        "https://static.vinwonders.com/production/hoang-thanh-thang-long-4.jpg",
      ],
    },
    {
      id: 2,
      name: "Thời Lê (1428-1789)",
      years: "1428 - 1789",
      description: "Thời kỳ phục hưng và phát triển rực rỡ",
      content:
        "Sau khi đánh đuổi quân Minh, vua Lê Thái Tổ khôi phục và mở rộng Hoàng thành. Thời kỳ này chứng kiến sự phát triển vượt bậc về kiến trúc, văn hóa và chính trị. Hoàng thành trở thành trung tâm quyền lực quan trọng nhất của Đại Việt.",
      images: [
        "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Hoang_Thanh_Thang_Long_Archaeological_Site_3.jpg/1200px-Hoang_Thanh_Thang_Long_Archaeological_Site_3.jpg",
        "https://static.vinwonders.com/production/hoang-thanh-thang-long-3.jpg",
      ],
    },
    {
      id: 3,
      name: "Thời Trần (1225-1400)",
      years: "1225 - 1400",
      description: "Thời kỳ củng cố và mở rộng Hoàng thành",
      content:
        "Nhà Trần tiếp tục phát triển Hoàng thành, xây dựng thêm nhiều cung điện và công trình kiến trúc. Thời kỳ này chứng kiến sự phát triển mạnh mẽ của văn hóa và giáo dục trong kinh thành.",
      images: [
        "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Hoang_Thanh_Thang_Long_Archaeological_Site_2.jpg/1200px-Hoang_Thanh_Thang_Long_Archaeological_Site_2.jpg",
        "https://static.vinwonders.com/production/hoang-thanh-thang-long-2.jpg",
      ],
    },
    {
      id: 4,
      name: "Thời Lý (1010-1225)",
      years: "1010 - 1225",
      description: "Thời kỳ xây dựng và phát triển ban đầu của Hoàng thành",
      content:
        "Vua Lý Thái Tổ dời đô từ Hoa Lư về Thăng Long năm 1010. Hoàng thành được xây dựng với quy mô lớn, bao gồm các cung điện, thành lũy, và hệ thống phòng thủ. Đây là thời kỳ định hình cơ bản của kinh thành.",
      images: [
        "https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hoang_Thanh_Thang_Long_Archaeological_Site.jpg/1200px-Hoang_Thanh_Thang_Long_Archaeological_Site.jpg",
        "https://static.vinwonders.com/production/hoang-thanh-thang-long-1.jpg",
      ],
    },
  ];

  const currentPeriod = historicalPeriods[selectedPeriod];
  const maxToShow = 3;

  const getGridCols = (length) => {
    if (length === 1) return "grid-cols-1";
    if (length === 2) return "grid-cols-2";
    return "grid-cols-3";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Profile Header - Facebook Style */}
      <div className="relative bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-64 bg-gradient-to-r from-orange-400 to-orange-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start max-w-6xl gap-6 mx-auto">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src="https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg"
                  className="object-cover w-32 h-32 border-4 border-white rounded-full shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="relative flex-1 text-white top-4">
                <h1 className="text-3xl font-bold">Hoàng Thành Thăng Long</h1>
                <p className="mb-1 text-lg opacity-90">
                  Di sản Văn hóa Thế giới UNESCO
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl px-6 mx-auto">
          <div className="flex space-x-8 border-b border-gray-200">
            <button className="px-4 py-3 font-medium text-blue-600 border-b-2 border-blue-600">
              Timeline
            </button>
            <button className="px-4 py-3 font-medium text-gray-600 hover:text-blue-600">
              Video
            </button>
            <button
              className="px-4 py-3 font-medium text-gray-600 hover:text-blue-600"
              onClick={() => navigate("/quiz")}
            >
              Trò chơi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl px-6 py-8 mx-auto">
        <div className="flex gap-8">
          {/* Left Sidebar - About Info */}
          <div className="w-1/3">
            <div className="sticky top-6 space-y-6">
              <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
                <h3 className="pb-3 mb-6 text-lg font-bold text-gray-800 border-b border-gray-100">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 transition-colors duration-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gradient-to-br from-orange-400 to-orange-500">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-sm text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="my-0 text-xs font-medium tracking-wide text-gray-500 uppercase ">
                        Vị trí
                      </p>
                      <p className="my-0 text-sm font-semibold text-gray-800">
                        Quận Ba Đình, Hà Nội
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 transition-colors duration-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gradient-to-br from-blue-400 to-blue-500">
                      <span className="text-sm text-white">📏</span>
                    </div>
                    <div className="flex-1">
                      <p className="my-0 text-xs font-medium tracking-wide text-gray-500 uppercase ">
                        Diện tích
                      </p>
                      <p className="my-0 text-sm font-semibold text-gray-800">
                        18,395 ha
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 transition-colors duration-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full shadow-sm bg-gradient-to-br">
                      <span className="text-sm text-white">🏛️</span>
                    </div>
                    <div className="flex-1">
                      <p className="my-0 text-xs font-medium tracking-wide text-gray-500 uppercase ">
                        UNESCO
                      </p>
                      <p className="my-0 text-sm font-semibold text-gray-800">
                        Công nhận năm 2010
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 transition-colors duration-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm bg-gradient-to-br from-green-400 to-green-500">
                      <span className="text-sm text-white">📅</span>
                    </div>
                    <div className="flex-1">
                      <p className="my-0 text-xs font-medium tracking-wide text-gray-500 uppercase ">
                        Thành lập
                      </p>
                      <p className="my-0 text-sm font-semibold text-gray-800">
                        Năm 1010
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  Giá trị nổi bật
                </h3>
                <div className="space-y-3">
                  {[
                    "Trung tâm chính trị quốc gia trong 1000 năm",
                    "Kiến trúc độc đáo thời phong kiến",
                    "Di sản văn hóa thế giới UNESCO",
                    "Điểm du lịch văn hóa quan trọng",
                  ].map((text, i) => (
                    <div className="flex items-start gap-3" key={i}>
                      <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full"></div>
                      <p className="my-0 text-sm text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Timeline */}
          <div className="flex-1">
            {/* Timeline Header */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Timeline Lịch Sử
              </h2>
              <p className="text-gray-600">
                Khám phá lịch sử Hoàng thành Thăng Long qua các thời kỳ
              </p>
            </div>

            {/* Timeline Posts */}
            <div className="space-y-6">
              {historicalPeriods.map((period, index) => (
                <div
                  key={period.id}
                  className="overflow-hidden bg-white rounded-lg shadow-sm "
                >
                  {/* Post Header */}
                  <div className="px-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://hoangthanhthanglong.vn/wp-content/uploads/2023/05/hoangthanh.jpg"
                        className="object-cover border-4 border-white rounded-full shadow-lg w-14 h-14"
                      />
                      <div className="flex-1">
                        <h4 className="mt-4 font-bold text-gray-800">
                          {period.name}
                        </h4>
                        <p className="mt-0 text-sm text-gray-500">
                          {period.years}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {index === 0
                          ? "Mới nhất"
                          : `${index + 1} thời kỳ trước`}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4">
                    <p className="mb-4 leading-relaxed text-gray-700">
                      {period.content}
                    </p>

                    {/* Images Grid */}
                    <div
                      className={`grid gap-2 mb-4 ${getGridCols(
                        period.images.length
                      )}`}
                    >
                      {period.images.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="relative overflow-hidden rounded-lg"
                        >
                          <img
                            src={img}
                            alt={`${period.name} - ảnh ${imgIndex + 1}`}
                            className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Post Actions */}
                    {/* <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                          <span>👍</span>
                          <span>Thích</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                          <span>💬</span>
                          <span>Bình luận</span>
                        </button>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                          <span>📤</span>
                          <span>Chia sẻ</span>
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <span>⋯</span>
                      </button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductHistory;
