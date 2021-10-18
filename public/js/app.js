const apiKey = "&appid=49c01260f342b49b8f1cc47b3a9e56fa";
const baseURL =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=";

const getData = async (url = "") => {
  return await fetch(url);
};

const postData = async (url = "", data = {}) => {
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const zipInput = document.querySelector("#zip");
const overlay = document.querySelector(".overlay");
const feelings = document.querySelector("#feelings");
const entryHolder = document.querySelector("#entryHolder");
const generateButton = document.querySelector("#generate");
const messageNode = document.querySelector(".overlay #message");
const closeOverlayBtn = document.querySelector("#close-overlay");
const zipInfoHighlighter = document.querySelector("#zip-info-highlighter");

generateButton.addEventListener("click", (event) => {
  const zipCode = zipInput.value;
  const url = `${baseURL}${zipCode}${apiKey}`;
  getData(url)
    .then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          const {
            dt,
            main: { temp },
          } = data;
          const _date = new Date(dt * 1000);
          const date = `${_date.toDateString()} ${_date.toLocaleTimeString()}`;
          const _data = {
            date: date,
            temp: temp,
            feel: feelings.value,
            zipCode: zipInput.value.split(",").join(""),
          };
          postData("/weatherInfo", _data).then((response) => {
            if (response.ok) {
              updateUI();
            }
          });
        } else {
          let para = "";
          switch (data.cod) {
            case "400":
              para =
                "Please enter a zip code to search for weather information.";
              break;
            case "404":
              para =
                "Unable to find any associated city for the given zip code. Please check.";
              break;
          }
          messageNode.innerText = para;
          overlay.style.visibility = "visible";
          closeOverlayBtn.focus();
        }
      });
    })
    .catch((error) => {
      console.log("error occurred: ", error);
    });
});

const updateUI = async () => {
  const request = await getData("/weatherInfo");
  try {
    const allData = await request.json();
    const data = allData[zipInput.value.split(",").join("")];
    document.getElementById("date").innerHTML = data.date;
    document.getElementById("temp").innerHTML = `${data.temp} degrees`;
    document.getElementById("content").innerHTML = data.feel;
    entryHolder.style.visibility = "visible";
  } catch (ex) {}
};

closeOverlayBtn.addEventListener("click", (e) => {
  messageNode.innerText = "";
  overlay.style.visibility = "hidden";
  zipInput.focus();
});
