const axios = require("axios");

const dateFormatter = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const init = () => {
  submitButtonListener();
  inputDateInitializer();
  handleOverlayCloseButton();
  renderTripsOnInit();
};

const renderTripsOnInit = () => {
  const trips = localStorage.getItem("trips");
  if (trips) {
    const parsedTrips = JSON.parse(trips);
    if (parsedTrips && Array.isArray(parsedTrips)) {
      const fragment = document.createDocumentFragment();
      console.log(JSON.parse(trips));
      for (let trip of parsedTrips) {
        fragment.appendChild(createTripLayoutFragment(trip));
      }
      const tripsElem = document.querySelector("#trips-container");
      tripsElem.appendChild(fragment);
    }
  }
};

const handleOverlayCloseButton = () => {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    const overlayCloseButton = overlay.querySelector("#close-overlay");
    overlayCloseButton.addEventListener("click", (e) => {
      overlay.style.visibility = "hidden";
      document.querySelector("input:not(:disabled)").focus();
    });
  }
};

const submitButtonListener = () => {
  const formSubmitButton = document.querySelector("#formsubmitbtn");
  if (formSubmitButton) {
    formSubmitButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const date = document.querySelector("#journey-date");
      const cityName = document.querySelector("#zip");
      let flag = false;
      if (isNaN(new Date(date.value))) {
        flag = true;
      } else if (!cityName.value || !cityName.value.trim()) {
        flag = true;
      }
      if (flag) {
        // inform user about missing/incorrect input/parameters.
      } else {
        // make the api call, freeze the button and input elements.
        date.disabled = true;
        cityName.disabled = true;
        formSubmitButton.disabled = true;
        const loc = cityName.value.trim();
        const dateValue = date.valueAsNumber;
        const getCoordinatesUrl = `http://localhost:8081/getCoordinates?loc=${loc}&date=${dateValue}`;
        fetch(getCoordinatesUrl)
          .then((response) => response.json())
          .then((data) => {
            date.disabled = false;
            cityName.disabled = false;
            formSubmitButton.disabled = false;
            if (data.error) {
              const overlay = document.querySelector(".overlay");
              if (overlay) {
                overlay.querySelector("#message").innerHTML = data.error;
                overlay.style.visibility = "visible";
                overlay.querySelector("#close-overlay").focus();
              }
            } else {
              let trips = localStorage.getItem("trips");
              if (trips && JSON.parse(trips)) {
                trips = JSON.parse(trips);
              } else {
                trips = [];
              }
              trips.unshift({
                ...data,
                id: `trip${new Date().getTime()}`,
              });
              const tripsElem = document.querySelector("#trips-container");
              tripsElem.prepend(createTripLayoutFragment(data));
              localStorage.setItem("trips", JSON.stringify(trips));
            }
            console.log("Response from server: ", data);
          });
      }
    });
  }
};

const inputDateInitializer = () => {
  const date = document.querySelector("#journey-date");
  const today = new Date().toLocaleDateString().split("/");
  date.min = `${today[2]}-${matchDigits(today[0])}-${matchDigits(today[1])}`;
  date.value = `${today[2]}-${matchDigits(today[0])}-${matchDigits(today[1])}`;
  date.max = `${+today[2] + 2}-${matchDigits(today[0])}-${matchDigits(
    today[1]
  )}`;
};

const matchDigits = (number) => (number.length == 1 ? "0" + number : number);

function handleSubmit(event) {
  event.preventDefault();
  event.stopPropagation();
  const results = document.getElementById("results");
  let formText = document.getElementById("name").value;
  if (!formText || !formText.trim()) {
    results.classList.add("error");
    results.innerHTML = "<p><strong>Error:</strong> Input cannot be empty</p>";
    return;
  }
  results.classList.remove("error");
  results.innerHTML = "<div class='box'><div class='loader'></div></div>";
  fetch(`http://localhost:8081/getMeaningCloudData?input=${formText}`)
    .then((res) => res.json())
    .then(function (res) {
      if (res.error) {
        results.classList.add("error");
        document.getElementById(
          "results"
        ).innerHTML = `<p><strong>Error:</strong> ${res.error}</p>`;
      } else {
        const resultsInnerHTML = updateUI(res);
        document.getElementById("results").innerHTML = resultsInnerHTML;
      }
    });
}

const createTripLayoutFragment = (trip) => {
  const fragment = document.createDocumentFragment();
  const weatherTitle = document.createElement("p");
  const tripContainer = document.createElement("div");
  const removeButton = document.createElement("button");
  const weatherContainer = document.createElement("div");
  weatherContainer.className = "weather-container";
  weatherTitle.className = "weather-title";
  weatherTitle.innerHTML =
    trip.weather.length == 1 ? "Current Weather" : "Weather Forecast";
  weatherContainer.appendChild(weatherTitle);
  weatherContainer.appendChild(createWeatherLayout(trip.weather));
  removeButton.addEventListener("click", removeTripListener);
  removeButton.dataset.id = trip.id;
  removeButton.innerHTML = "<span>X</span>";
  removeButton.className = "btn-remove-trip";
  tripContainer.className = "trip";
  tripContainer.id = trip.id;
  const tripDestination = document.createElement("p");
  const destinationSpan = `<span class='destination'>${trip.destination}</span>`;
  const dateSpan = `<span class='date'>${new Date(
    +trip.tripDate
  ).toLocaleDateString("en-US", dateFormatter)}</span>`;
  tripDestination.innerHTML = `${destinationSpan} - ${dateSpan}`;
  tripContainer.appendChild(removeButton);
  tripContainer.appendChild(tripDestination);
  tripContainer.appendChild(weatherContainer);
  fragment.appendChild(tripContainer);
  return fragment;
};

const createWeatherLayout = (weather) => {
  const div = document.createElement("div");
  div.className = "weather-wrapper";
  if (weather) {
    if (weather.length) {
      if (weather.length == 1) {
      } else if (weather.length == 7) {
      }
      for (let item of weather) {
        const inner = document.createElement("div");
        inner.className = "weather";
        for (let key in item) {
          console.log("Key: ", key, item, item[key]);
          const p = document.createElement("p");
          p.className = key;
          if (key == "vis") {
            p.innerHTML = `Visibility: ${item[key]}`;
          } else if (key == "temp") {
            p.innerHTML = `Temperature: ${item[key]}`;
          } else if (key == "weather") {
            p.innerHTML = `Sky: ${item[key].description}`;
          }
          inner.appendChild(p);
        }
        div.appendChild(inner);
      }
    }
  }
  return div;
};

function onKeydown(event) {
  const results = document.getElementById("results");
  if (results) {
    results.innerHTML = "<p class='no-results'>No search results.</p>";
    if (results.classList.contains("error")) {
      results.classList.remove("error");
    }
  }
}

const removeTrip = (id) => {
  const trips = localStorage.getItem("trips");
  if (id && trips && JSON.parse(trips)) {
    const parsedTrips = JSON.parse(trips);
    const remainingTrips = parsedTrips.filter((trip) => trip.id != id);
    const tripToBeRemove = document.querySelector(`#${id}`);
    if (tripToBeRemove) {
      tripToBeRemove.remove();
    }
    localStorage.setItem("trips", JSON.stringify(remainingTrips));
  }
};

const removeTripListener = (e) => {
  removeTrip(e.target.dataset.id);
};

export { handleSubmit, onKeydown, init };
