const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.log("error in connecting to redis:", err);
  }
}

async function checkinRedis(url) {
  const cacheData = await redisClient.get(url);
  return cacheData ? JSON.parse(cacheData) : null;
}

async function setInRedis(url, val) {
  await redisClient.set(url, JSON.stringify(val), { EX: 43200 }); //12hr expiration time
}

async function getTTL(url) {
  return await redisClient.ttl(url);
}

module.exports = {
  redisClient,
  connectToRedis,
  checkinRedis,
  setInRedis,
  getTTL,
};
