const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error (runtime):", err.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully!");
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    process.exit(1); 
  }
};

module.exports = {
  connectRedis,
  redisClient,
};
