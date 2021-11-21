const axios = require("axios");

const init = () => {
  submitButtonListener();
  inputDateInitializer();
  const numericInputsOnly = document.querySelectorAll(".date-input input");
  numericInputsOnly.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.which < 48 || e.which > 57) {
        e.preventDefault();
      }
    });
  });
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
        const loc = cityName.value.trim();
        const dateValue = date.valueAsNumber;
        const getCoordinatesUrl = `http://localhost:8081/getCoordinates?loc=${loc}&date=${dateValue}`;
        fetch(getCoordinatesUrl)
          .then((response) => response.json())
          .then((data) => {
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
  date.addEventListener("change", (e) => {
    console.log(
      "ochange called: ",
      e.target.value,
      e.target.valueAsNumber,
      isNaN(Date.parse(e.target.value))
    );
  });
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

const updateUI = (data) => {
  let responseList = !data.list.length
    ? "<p class='no-results'>No results found.</p>"
    : "<table><thead>" +
      `<tr class='item header'>
  <th><span>Code</span></th>
  <th><span>Relevance</span></th>
  <th><span>Absolute Relevance</span></th>
  <th><span>Label</span></th>
    </tr></thead><tbody>` +
      data.list
        .map((item) => {
          return `<tr class='item'>
    <td><span>${item.code}</span></td>
    <td><span>${item.relevance}</span></td>
    <td><span>${item.abs_relevance}</span></td>
    <td><span>${item.label}</span></td>
  </tr>`;
        })
        .join("") +
      "</tbody></table>";
  return `<p class='input-query'><strong>Query string:</strong> ${data.searchQuery}</p><div class='items'>${responseList}</div>`;
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

export { handleSubmit, onKeydown, init };
