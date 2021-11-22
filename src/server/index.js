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
  // reading location and date from query params.
  const { loc, date } = req.query;
  const travelDate = new Date(+date);
  // creating a currentDate to store the current date of the server and compare it with the user entered date.
  const currentDate = new Date();
  const _travelDate = travelDate.getDate();
  const _currentDate = currentDate.getDate();
  const check = Math.abs(_travelDate - _currentDate);
  const travellingWithinCurrentWeek = check < 7;
  // deciding which API to call depending upon thr trip date.
  const weatherbitApi = travellingWithinCurrentWeek
    ? weatherbitApiCurrent
    : weatherbitApiForecast;
  // fetching the latitute and longitude for the entered location.
  axios(`${geonamesApi}${loc}`)
    .then((geonamesResponse) => {
      const {
        data: { geonames, totalResultsCount },
      } = geonamesResponse;
      if (totalResultsCount) {
        // geolocation found
        if (geonames && geonames.length) {
          // pick first element and destructuring its `lat` and `lng` and `countryName`.
          const [{ lat, lng, countryName }] = geonames;
          axios(`${weatherbitApi}&lat=${lat}&lon=${lng}`).then((weather) => {
            axios(`${pixabayApi}${loc}`).then((pixibayResponse) => {
              let pixibay = null;
              let weather = null;
              if (
                pixibayResponse &&
                pixibayResponse.data &&
                pixibayResponse.data.hits &&
                Array.isArray(pixibayResponse.data.hits) &&
                pixibayResponse.data.hits.length
              ) {
                const {
                  id,
                  tags,
                  webformatURL,
                  webformatWidth,
                  webformatHeight,
                } = pixibayResponse.data.hits[0];
                pixibay = {
                  id,
                  tags,
                  img: webformatURL,
                  imgWidth: webformatWidth,
                  imgHeight: webformatHeight,
                };
              }
              if (travellingWithinCurrentWeek) {
              }
              res.send({
                lat,
                lng,
                pixibay,
                tripDate: date,
                destination: loc,
                country: countryName,
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
    })
    .catch((error) => {
      res.send({
        error: "Server error, please try again.",
      });
    });
});
