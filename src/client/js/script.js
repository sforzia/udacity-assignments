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
  handleAddTripButton();
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

const handleAddTripButton = (e) => {
  const addTripButton = document.querySelector("#addtripbutton");
  const closeAddTripOverlayBtn = document.querySelector(
    "#closeAddTripOverlayBtn"
  );
  if (addTripButton) {
    addTripButton.addEventListener("click", toggleAddTrip);
  }
  if (closeAddTripOverlayBtn) {
    closeAddTripOverlayBtn.addEventListener("click", toggleAddTrip);
  }
};

const toggleAddTrip = () => {
  const addTripOverlay = document.querySelector("#addTripOverlay");
  if (addTripOverlay) {
    const visibility = addTripOverlay.style.visibility;
    addTripOverlay.style.visibility =
      visibility == "visible" ? "hidden" : "visible";
    if (addTripOverlay.style.visibility == "visible") {
      const loc = addTripOverlay.querySelector("#location");
      if (loc) {
        loc.focus();
      }
    } else {
      const addTripButton = document.querySelector("#addtripbutton");
      if (addTripButton) {
        addTripButton.focus();
      }
    }
  }
};

const submitButtonListener = () => {
  const formSubmitButton = document.querySelector("#formsubmitbtn");
  const addTripOverlay = document.querySelector("#addTripOverlay");
  if (formSubmitButton) {
    formSubmitButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const date = document.querySelector("#journey-date");
      const cityName = document.querySelector("#location");
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
            if (addTripOverlay) {
              addTripOverlay.style.visibility = "hidden";
            }
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

const createTripLayoutFragment = (trip) => {
  const fragment = document.createDocumentFragment();
  const weatherTitle = document.createElement("p");
  const tripContainer = document.createElement("div");
  const removeButton = document.createElement("button");
  const weatherContainer = document.createElement("div");
  const tripDetailsContainer = document.createElement("div");
  const tripLocationContainer = document.createElement("div");
  tripLocationContainer.className = "trip-location";
  tripDetailsContainer.className = "trip-details";
  weatherContainer.className = "weather-container";
  weatherTitle.className = "weather-title";
  weatherTitle.innerHTML = "Typical weather for the location is: ";
  weatherContainer.appendChild(weatherTitle);
  weatherContainer.appendChild(createWeatherLayout(trip.weather));
  removeButton.addEventListener("click", removeTripListener);
  removeButton.dataset.id = trip.id;
  removeButton.innerHTML = "<span>X</span>";
  removeButton.className = "btn-close-item";
  tripContainer.className = "trip";
  tripContainer.id = trip.id;
  const tripDestination = document.createElement("p");
  const tripDate = document.createElement("p");
  const destinationSpan = `<span class='highlight'>My trip to:</span> <span class='destination'>${trip.destination}, ${trip.country}</span>`;
  const dateSpan = `<span class='date'>${new Date(
    +trip.tripDate
  ).toLocaleDateString("en-US", dateFormatter)}</span>`;
  tripDate.innerHTML = `<span class='highlight'>Departing:</span> ${dateSpan}`;
  tripDestination.innerHTML = `${destinationSpan}`;
  let destinationImage = null;
  if (trip.pixibay && trip.pixibay.img) {
    destinationImage = document.createElement("img");
    destinationImage.className = "destination-image";
    destinationImage.src = trip.pixibay.img;
    destinationImage.alt = `${trip.country} ${trip.destination} ${trip.pixibay.tags}`;
  }
  tripDetailsContainer.appendChild(tripDestination);
  tripDetailsContainer.appendChild(tripDate);
  tripDetailsContainer.appendChild(weatherContainer);
  if (destinationImage) {
    tripLocationContainer.appendChild(destinationImage);
  }
  tripContainer.appendChild(removeButton);
  tripContainer.appendChild(tripLocationContainer);
  tripContainer.appendChild(tripDetailsContainer);
  fragment.appendChild(tripContainer);
  return fragment;
};

const createWeatherLayout = (weather) => {
  const div = document.createElement("div");
  div.className = "weather-wrapper";
  if (weather) {
    if ("min_temp" in weather) {
      for (let key in weather) {
        const p = document.createElement("p");
        p.className = key;
        if (key == "min_temp") {
          p.innerHTML = `Low: ${weather[key]}`;
        } else if (key == "max_temp") {
          p.innerHTML = `High: ${weather[key]}`;
        } else if (key == "description") {
          p.innerHTML = `<em>${weather[key]}</em>`;
        }
        div.appendChild(p);
      }
    } else {
      for (let key in weather) {
        const p = document.createElement("p");
        p.className = key;
        if (key == "temp") {
          p.innerHTML = `Temperature: ${weather[key]}`;
        } else if (key == "description") {
          p.innerHTML = `<em>${weather[key]}</em>`;
        }
        div.appendChild(p);
      }
    }
    // div.appendChild(inner);
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

export { onKeydown, init };
