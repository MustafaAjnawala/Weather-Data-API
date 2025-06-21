# Weather API

## Project Overview

Node.js solution for the [Weather API](https://roadmap.sh/projects/weather-api-wrapper-service) challenge from [roadmap.sh](https://roadmap.sh/).

This project is a simple Express-based Weather API that fetches weather data from a third-party API (Visual Crossing
Weather API) based on a location and optional date range. The API supports caching using Redis to minimize API requests
and improve performance in terms of speed. It also includes rate limiting to prevent abuse.

## Features

- **Fetch Weather Data**: Retrieve weather data by location (city name, ZIP code, or coordinates) with an optional date
  range.
- **Caching**: Uses Redis to cache weather data for 12 hours, reducing external API calls and improving response times.
- **Rate Limiting**: Limits API requests to 100 per hour per client to prevent abuse.
- **Error Handling**: Handles cases such as invalid locations, third-party API failures, and internal server errors.

## Technologies Used

- **Node.js & Express**: JavaScript runtime and web framework for building the API server.
- **Axios**: Promise-based HTTP client for making requests to the Visual Crossing Weather API.
- **Redis**: In-memory data store used for caching weather data to improve performance.
- **express-rate-limit**: Middleware for rate limiting incoming API requests.
- **Visual Crossing Weather API**: External API used to fetch real-time and historical weather data.

## API Usage

### Base URL

The API is hosted locally at:  
`http://localhost:8080/weather`

### Request Format

#### Example Request

```bash
curl "http://localhost:5000/weather?location=Mumbai&date1=2024-10-10"
```

### Endpoints

- `location` (required): The location for which to retrieve weather data. Can be a city name, ZIP code, or coordinates.
- `date1` (optional): The start date for which to retrieve weather data in `yyyy-MM-dd` format. If omitted, it defaults
  to the current date.
- `date2` (optional): The end date for which to retrieve weather data in `yyyy-MM-dd` format.

### Response

The API returns weather data in JSON format.

#### Example Response:

```json
{
  "queryCost": 1,
  "latitude": 18.9402,
  "longitude": 72.8348,
  "resolvedAddress": "Mumbai, MH, India",
  "address": "mumbai",
  "timezone": "Asia/Kolkata",
  "tzoffset": 5.5,
  "description": "Similar temperatures continuing with a chance of rain multiple days.",
  "days": [
    {
      "datetime": "2025-06-21",
      "datetimeEpoch": 1750444200,
      "tempmax": 31.4,
      "tempmin": 28,
      "temp": 29.1,
      "feelslikemax": 40.5,
      "feelslikemin": 32.5,
      "feelslike": 35,
      "dew": 25.3,
      "humidity": 79.8,
      "precip": 19.9,
      "precipprob": 100,
      "precipcover": 91.67,
      "preciptype": [
        "rain"
      ],
      "snow": 0,
      "snowdepth": null,
      "windgust": 53.6,
      "windspeed": 33.8,
      "winddir": 237.8,
      "pressure": 1005,
      "cloudcover": 80.6,
      "visibility": 9.8,
      "solarradiation": 256.4,
      "solarenergy": 22.2,
      "uvindex": 8,
      "severerisk": 30,
      "sunrise": "06:02:26",
      "sunriseEpoch": 1750465946,
      "sunset": "19:18:40",
      "sunsetEpoch": 1750513720,
      "moonphase": 0.85,
      "conditions": "Rain, Partially cloudy",
      "description": "Partly cloudy throughout the day with storms possible.",
      "icon": "rain",
      "stations": [
        "VABB",
        "VAJJ"
      ],
```

## Installation

### Prerequisites

- **Node.js v22.14.0**
- **Redis**: Ensure that Redis is installed and running.
- **Visual Crossing Weather API Key**: Sign up and obtain an API key
  from [Visual Crossing](https://www.visualcrossing.com/).

### Steps

1. **Clone the Repository**:

   ```bash
   https://github.com/MustafaAjnawala/Weather-Data-API.git
   cd weather-data-api
   ```

2. **Set Up Node.js Virtual Environment**:

   ```bash
   npm init -y
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

4. **Set Environment Variables**:
   Create a `.env` file and add your Visual Crossing API key:

   ```bash
   PORT=8080
   API_KEY=Your_API_Key
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   BASE_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline
   ```

5. **Run Redis**:
   Make sure Redis is running locally. If Redis isn't installed, you can install it on windows from this URL: https://github.com/tporadowski/redis/releases
   And then make sure to run below command on your Command Line interface
   Start Redis:

   ```bash
   redis-server
   ```

6. **Run the Node App**:

   ```bash
   npm run dev
   ```

7. **Test the API**:
   Use `curl` or a browser to access the API:

   ```bash
   curl "http://localhost:8080/weather/nashik/2024-12-1"
   ```

## Rate Limiting

The API limits requests to **100 requests per hour per client**. If this limit is exceeded, the API will return a
`429 Too Many Requests` response.

## Caching

Redis is used to cache weather data for **12 hours**. If a request is made for the same location and date within this
timeframe, the cached data will be returned instead of making a new API call to the external service.

## Error Handling

The API includes error handling for the following scenarios:

- **Invalid Location**: Returns an error if the location cannot be found.
- **Service Unavailable**: Returns an error if the third-party API is down.
- **Rate Limit Exceeded**: Prevents abuse by limiting the number of API requests per hour.
