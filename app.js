const express = require("express");
const dotenv = require("dotenv");
const redis = require("redis");
const axios = require("axios");
const rateLimiter = require("express-rate-limit");

dotenv.config();
const port = process.env.PORT;

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const app = express();

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000, //1 hour window
  max: 100,
  message: "Too many requests from this IP, please try again after some time",
});

app.use(limiter);

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.log("error in connecting to redis:", err);
  }
}
connectToRedis();

const baseURL = process.env.BASE_URL;
const apiKey = process.env.API_KEY;

async function checkinRedis(url) {
  const cacheData = await redisClient.get(url);
  return cacheData ? JSON.parse(cacheData) : null;
}

async function fetchData(url) {
  try {
    const redisData = await checkinRedis(url);
    if (redisData) {
      console.log("\nCache Hit for key:", url);
      const ttl = await redisClient.ttl(url);
      console.log("Time(sec) left before expiration of data:", ttl);
      return redisData;
    } else {
      console.log("\nCache Miss\nSetting data in redis cache for key:", url);
      const response = await axios.get(url); //http get request to the 3rd party weather service
      await redisClient.set(url, JSON.stringify(response.data), { EX: 43200 }); //12hr expiration time

      return response.data;
    }
  } catch (err) {
    console.error("Error is:" + err);
  }
}

app.get(
  [
    "/weather/:location",
    "/weather/:location/:date1",
    "/weather/:location/:date1/:date2",
  ],
  async (req, res) => {
    try {
      const loc = req.params.location;
      const date1 = req.params.date1;
      const date2 = req.params.date2;
      let pingUrl = `${baseURL}/${loc}`;

      if (date1 && date2) {
        pingUrl += `/${date1}/${date2}`;
      } else if (date1) {
        pingUrl += `/${date1}`;
      }
      pingUrl += `?unitGroup=metric&key=${apiKey}&contentType=json`;
      //   console.log(pingUrl); //for debuggin purposes
      const data = await fetchData(pingUrl); //getting the city weather data

      //if city not entered properly
      if (!data) return res.json({ msg: "Please enter correct city" });
      //return the data
      return res.json(data);
    } catch (err) {
      console.log(err);
    }
  }
);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
