const express = require("express");
const dotenv = require("dotenv");
const rateLimiter = require("express-rate-limit");

dotenv.config();
const port = process.env.PORT || 8080;

const { connectToRedis } = require("./cache");

const fetchData = require("./weather");
const app = express();

const limiter = rateLimiter({
  windowMs: 60 * 60 * 1000, //1 hour window
  max: 100,
  message: "Too many requests from this IP, please try again after some time",
});

app.use(limiter);

connectToRedis();

const baseURL = process.env.BASE_URL;
const apiKey = process.env.API_KEY;

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
      //getting the city weather data
      const data = await fetchData(pingUrl);

      //if endpoints not correctly entered
      if (!data)
        return res.json({ msg: "Please enter url parameters correctly" });

      return res.json(data);
    } catch (err) {
      console.log(err);
    }
  }
);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
