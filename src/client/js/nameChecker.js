function checkForName(inputText) {
  let names = ["Picard", "Janeway", "Kirk", "Archer", "Georgiou"];

  if (names.includes(inputText)) {
    return "Welcome, Captain!";
  }
}

export { checkForName };
