const axios = require("axios");
const { checkinRedis, setInRedis, getTTL } = require("./cache");

async function fetchData(url) {
  try {
    const redisData = await checkinRedis(url);
    if (redisData) {
      console.log("\nCache Hit for key:", url);
      const ttl = await getTTL(url);
      console.log("Time(sec) left before expiration of data:", ttl);
      return redisData;
    } else {
      console.log("\nCache Miss\nSetting data in redis cache for key:", url);
      const response = await axios.get(url); //http get request to the 3rd party weather service
      await setInRedis(url, response.data);
      return response.data;
    }
  } catch (err) {
    console.error("Error is:" + err);
  }
}

module.exports = fetchData;
