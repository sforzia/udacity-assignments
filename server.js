const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const PORT = 8081;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("./public"));

const listening = (error) => {
  if (!error) {
    console.log(
      `Server initialized, listening at port ${PORT}\nopen http://localhost:${PORT}`
    );
  }
};

app.listen(PORT, listening);
