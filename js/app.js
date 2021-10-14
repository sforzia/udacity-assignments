/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const liFragment = new DocumentFragment();
const mainHeading = document.querySelector("header h1");
const sections = document.querySelectorAll("main section");
const ul = document.querySelector("body header ul#navbar__list");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

const createAndAppendNavItems = () => {
  for (let section of sections) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${section.id}`;
    a.className = "menu__link";
    li.dataset.navId = section.id;
    a.innerText = section.dataset.nav;
    li.appendChild(a);
    liFragment.appendChild(li);
  }
  ul.appendChild(liFragment);
};

function onAnchorTagClick(e) {
  e.preventDefault();
  document.querySelector(this.getAttribute("href")).scrollIntoView({
    behavior: "smooth",
  });
}

const addClickListenersOnAnchorTags = () => {
  const anchorTags = ul.querySelectorAll("a[href]");
  anchorTags.forEach((anchorTag) => {
    anchorTag.addEventListener("click", onAnchorTagClick);
  });
};

const onScrollHandler = (event) => {
  const moveToTopButton = document.querySelector("#moveToTopBtn");
  const hiddenSpanTop = document
    .querySelector("#hiddenSpan")
    .getBoundingClientRect().top;
  if (hiddenSpanTop < -150) {
    moveToTopButton.classList.add("show");
  } else {
    moveToTopButton.classList.remove("show");
  }
  for (let section of sections) {
    const check = isInViewport(section);
    if (check) {
      setActiveState(section.id);
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  }
};

const setActiveState = (navId) => {
  const lis = ul.querySelectorAll("li");
  for (let li of lis) {
    if (li.dataset && li.dataset.navId == navId) {
      li.childNodes[0].classList.add("active");
    } else {
      li.childNodes[0].classList.remove("active");
    }
  }
};

const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  const { bottom, top } = rect;
  return (
    top >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight)
  );
};
/**
 * End Helper Functions
 * Begin Main Functions
 *
 */
// build the nav

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active

createAndAppendNavItems();

document.addEventListener("scroll", onScrollHandler);
addClickListenersOnAnchorTags();
document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    onScrollHandler(event);
  }, 500);
});
document.querySelector("#moveToTopBtn").addEventListener("click", (e) => {
  document.querySelector("#hiddenSpan").scrollIntoView({
    behavior: "smooth",
  });
});
