function handleSubmit(event) {
  event.preventDefault();
  event.stopPropagation();
  // check what text was put into the form field
  let formText = document.getElementById("name").value;
  const url = `${BASE_URL}${formText}`;
  console.log("url: ", url);
  Client.checkForName(formText);

  fetch("http://localhost:8081/getMeaningCloudData")
    .then((res) => res.json())
    .then(function (res) {
      document.getElementById("results").innerHTML = res.message;
    });
}

export { handleSubmit };
