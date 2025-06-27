const express = require("express");
require("dotenv").config(); 

const app = express();
const cors = require("cors");

//Config 
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redisClient");

// Config đường dẫn routes
const user = require("./routes/userRouter");
const product = require("./routes/productRouter");
const order = require("./routes/orderRouter");
const payment = require("./routes/paymentRouter");
const quiz = require("./routes/quizRouter");
const userScore = require("./routes/userScoreRouter");

 // Kết nối MongoDB
connectDB();      

// Kết nối Redis
connectRedis();    

app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send({ message: "✅ Welcome to Practical Exam!" });
});

// Auth routes
app.use("/api/auth", (req, res, next) => {
  console.log("🧪 Request path:", req.path);
  console.log("🧪 Content-Type:", req.headers['content-type']);
  next(); // phải gọi next() để chuyển sang router kế tiếp
}, user);

app.use("/api/product",product);
app.use("/api/order",order);
app.use("/api/payment",payment);
app.use("/api/quiz",quiz);
app.use("/api/score",userScore);

// Listen
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});