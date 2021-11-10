const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mockAPIResponse = require("./mockAPI.js");
dotenv.config();

const EXPRESS_SERVER_PORT = 8081;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME;
const WEATHERBIT_API_KEY = process.env.WEATHERBIT_API_KEY;
const geonamesApi = `http://api.geonames.org/searchJSON?username=${GEONAMES_USERNAME}&maxRows=10&q=`;
const pixabayApi = `https://pixabay.com/api?key=${PIXABAY_API_KEY}&image_type=photo&safesearch=true&q=`;
const weatherbitApiDayForecast = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERBIT_API_KEY}`;
const weatherbitApiHourForecast = `https://api.weatherbit.io/v2.0/forecast/hourly?key=${WEATHERBIT_API_KEY}`;

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

app.get("/test", function (req, res) {
  res.send(mockAPIResponse);
});

app.get("/getCoordinates", (req, res) => {
  const { loc, date } = req.query;
  console.log("loc, date: ", loc, date, new Date(+date));
  axios(`${geonamesApi}${loc}`).then((response) => {
    const {
      data: { geonames, totalResultsCount },
    } = response;
    if (totalResultsCount) {
      // geolocation found
      if (geonames && geonames.length) {
        // pick first element and return its `lat` and `lng`.
        const [{ lat, lng, countryName }] = geonames;
        axios(`${weatherbitApiDayForecast}&lat=${lat}&lon=${lng}`).then(
          (response) => {
            // console.log("weatherbit api response: ", response.data);
            axios(`${pixabayApi}${loc}`).then((response) => {
              // console.log("pixabay api response: ", response.data);
              res.send({
                lat,
                lng,
                country: countryName,
              });
            });
          }
        );
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
        error: "No geolocation found for the enter destination.",
      });
    }
    // console.log("response: ", response.data);
  });
  // res.send({
  //   loc,
  // });
});
