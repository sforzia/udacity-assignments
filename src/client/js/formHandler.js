const axios = require("axios");

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

// const checkServerResponse = async () => {
//   return await fetch(`http://localhost:8081/test`)
//     .then((response) => response.json())
//     .then((data) => data);
// };

async function getFirstAlbumTitle() {
  const response = await axios("http://localhost:8081/test");
  return response.data;
}

export { handleSubmit, onKeydown, getFirstAlbumTitle };
