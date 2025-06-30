const redis = require('redis');

let cachedRedis = null;

const redisClient = redis.createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6380', 10),
    tls: true, // Bật TLS cho Azure Redis SSL port (6380)
  },
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error (runtime):', err.message);
});

const connectRedis = async () => {
  // redisClient.isOpen là property boolean chứ không phải method
  if (cachedRedis && redisClient.isOpen) {
    console.log('=> Using existing Redis connection');
    return cachedRedis;
  }

  try {
    await redisClient.connect();
    cachedRedis = redisClient;
    console.log('✅ Established new Redis connection');
    return cachedRedis;
  } catch (error) {
    console.error('❌ Redis connection error:', error.message);
    cachedRedis = null;
    throw error;
  }
};

module.exports = {
  connectRedis,
  redisClient,
};
