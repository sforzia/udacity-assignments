const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mockAPIResponse = require("./mockAPI.js");
dotenv.config();

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
  console.log(req);
});
