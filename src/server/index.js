const path = require("path");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mockAPIResponse = require("./mockAPI.js");
dotenv.config();

const meaningCloudAPIResponseMap = {
  100: "Incorrect API key is used.",
  101: "The license key you are using is expired.",
  102: "You have used all your credits.",
  103: "A very large search string is passed for analysis.",
  104: "Limit for maximum number of queries in a second is reached.",
  105: "Either your keys is not valid for this search or your trial period has expired.",
  200: "Please fix your API call.",
  201: "Please check 'model' or 'ud' query parameter.",
  202: "Server error, please retry.",
  203: "Server error, please retry.",
  204: "Server error, please retry.",
};

const app = express();
const MEANING_CLOUD_API_KEY = process.env.MEANING_CLOUD_API_KEY;
const BASE_URL = `https://api.meaningcloud.com/class-2.0?key=${MEANING_CLOUD_API_KEY}&model=IPTC_en&txt=`;

app.use(express.static("dist"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
console.log(__dirname);

app.get("/", function (req, res) {
  // res.sendFile('dist/index.html')
  res.sendFile(path.resolve("src/client/views/index.html"));
});

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
  console.log("Example app listening on port 8081!");
});

app.get("/test", function (req, res) {
  res.send(mockAPIResponse);
});

app.get("/getMeaningCloudData", (req, res) => {
  const { input } = req.query;
  const requestURL = `${BASE_URL}${input}`;
  axios(requestURL)
    .then((response) => {
      const {
        data: {
          category_list,
          status: { code, msg, remaining_credits },
        },
      } = response;
      let responseObject = {};
      console.log("status: ", code, msg, remaining_credits);
      if (code != 0) {
        const message = `${msg} ${meaningCloudAPIResponseMap[code]}`;
        responseObject = { error: message };
      } else {
        responseObject = {
          searchQuery: input,
          list: category_list,
          remainingCredits: remaining_credits,
        };
      }
      console.log("responseObject: ", responseObject);
      res.send(responseObject);
    })
    .catch((error) => {
      res.send({ error: error.message });
    });
});
