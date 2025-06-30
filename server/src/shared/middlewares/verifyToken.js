const jwt = require("jsonwebtoken");
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "exe_201";

const verifyToken = async (req) => {
  const authHeader = req.headers?.get('authorization');
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      status: 401,
      jsonBody: { message: "Không tìm thấy tài khoản" },
    };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    return null;
  } catch (err) {
    return {
      status: 403,
      jsonBody: { message: "Đăng nhập để thử lại" },
    };
  }
};

module.exports = verifyToken;

