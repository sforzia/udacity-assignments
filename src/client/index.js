import { checkForName } from "./js/nameChecker";
import { handleSubmit, onKeydown, init } from "./js/formHandler";

// import "./styles/form.scss";
// import "./styles/base.scss";
// import "./styles/header.css";
// import "./styles/resets.css";
// import "./styles/footer.scss";
// import "./styles/loader.scss";
import "./styles/styles.scss";

window.addEventListener("load", () => {
  init();
});

export { checkForName, handleSubmit, onKeydown };
