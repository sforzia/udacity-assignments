const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
dotenv.config();

const EXPRESS_SERVER_PORT = 8081;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;

const weatherbitApiCurrent = `https://api.weatherbit.io/v2.0/current?key=${WEATHERBIT_API_KEY}`;
const geonamesApi = `http://api.geonames.org/searchJSON?username=${GEONAMES_USERNAME}&maxRows=10&q=`;
const pixabayApi = `https://pixabay.com/api?key=${PIXABAY_API_KEY}&image_type=photo&safesearch=true&q=`;
const weatherbitApiForecast = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERBIT_API_KEY}`;

const app = express();
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(path.resolve("src/client/views/index.html"));
});

app.listen(EXPRESS_SERVER_PORT, function () {
  console.log(`Travel app is listening on port ${EXPRESS_SERVER_PORT}!`);
});

app.get("/getCoordinates", (req, res) => {
  const { loc, date } = req.query;
  const travelDate = new Date(+date);
  const currentDate = new Date();
  const _travelDate = travelDate.getDate();
  const _currentDate = currentDate.getDate();
  const check = Math.abs(_travelDate - _currentDate);
  const travellingWithinCurrentWeek = check < 7;
  const weatherbitApi = travellingWithinCurrentWeek
    ? weatherbitApiCurrent
    : weatherbitApiForecast;
  axios(`${geonamesApi}${loc}`).then((geonamesResponse) => {
    const {
      data: { geonames, totalResultsCount },
    } = geonamesResponse;
    if (totalResultsCount) {
      // geolocation found
      if (geonames && geonames.length) {
        // pick first element and return its `lat` and `lng`.
        const [{ lat, lng, countryName }] = geonames;
        axios(`${weatherbitApi}&lat=${lat}&lon=${lng}`).then((weather) => {
          axios(`${pixabayApi}${loc}`).then((pixibay) => {
            let pixibayResponse = null;
            if (
              pixibay &&
              pixibay.data &&
              pixibay.data.hits &&
              Array.isArray(pixibay.data.hits) &&
              pixibay.data.hits.length
            ) {
              pixibayResponse = pixibay.data.hits[0];
            }
            res.send({
              lat,
              lng,
              country: countryName,
              pixibay: pixibayResponse,
              weather: weather.data.data,
              forecast: !travellingWithinCurrentWeek,
            });
          });
        });
      } else {
        // inform user that geolocations array is empty.
        res.send({
          error:
            "Unable to geolocate the entered location, please re-enter your destination.",
        });
      }
    } else {
      // no geolocation found
      res.send({
        error: "No geolocation data found for the entered destination.",
      });
    }
  });
});
