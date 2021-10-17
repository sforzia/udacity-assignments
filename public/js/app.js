const apiKey = "&appid=49c01260f342b49b8f1cc47b3a9e56fa";
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

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
const generateButton = document.querySelector("#generate");

zipInput.addEventListener("keypress", (e) => {});

generateButton.addEventListener("click", (event) => {
  const zipCode = zipInput.value;
  const url = `${baseURL}${zipCode}${apiKey}`;
  console.log(url);
  getData(url)
    .then((response) => {
      const data = response.json();
      console.log("data: ", data);
    })
    .catch((error) => {
      console.log("error occurred: ", error);
    });
});
