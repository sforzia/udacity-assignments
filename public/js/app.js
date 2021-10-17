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

const dateElement = document.querySelector("#date");
const tempElement = document.querySelector("#temp");
const contentElement = document.querySelector("#content");
const feelingsResponse = document.querySelector("#feelings-response");

generateButton.addEventListener("click", (event) => {
  const zipCode = zipInput.value;
  const url = `${baseURL}${zipCode}${apiKey}`;
  getData(url)
    .then((response) => {
      response.json().then((data) => {
        if (response.ok) {
          const zipCode = zipInput.value.split(",").join("");
          const {
            dt,
            name,
            sys: { country },
            main: { temp, feels_like },
          } = data;
          const _data = {
            date: dt,
            name: name,
            zipCode: zipCode,
            country: country,
            temperature: temp,
            feelsLike: feels_like,
            feelings: feelings.value,
          };
          postData("/weatherInfo", _data).then((response) => {
            response.json().then((data) => {
              const dataForUI = data[zipCode];
              const _date = new Date(dataForUI.date);
              const date =
                _date.toDateString() + " " + _date.toLocaleTimeString();
              dateElement.innerHTML = `${date}<br/><span class='country-info'>${dataForUI.name}, ${dataForUI.country}</span>`;
              entryHolder.style.visibility = "visible";
              tempElement.innerHTML = `${dataForUI.temperature} &deg;F`;
              contentElement.innerHTML = `feels like ${dataForUI.feelsLike} &deg;F`;
              feelingsResponse.innerText = dataForUI.feelings;
            });
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
        }
      });
    })
    .catch((error) => {
      console.log("error occurred: ", error);
    });
});

closeOverlayBtn.addEventListener("click", (e) => {
  messageNode.innerText = "";
  overlay.style.visibility = "hidden";
  zipInput.focus();
});
