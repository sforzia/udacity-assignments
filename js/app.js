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
let prevScrollpos = window.pageYOffset;
const liFragment = new DocumentFragment();
const mainHeading = document.querySelector("header h1");
const sections = document.querySelectorAll("main section");
const ul = document.querySelector("body header ul#navbar__list");
const navHeader = document.querySelector("header.page__header");

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
  console.log("here onScrollHandler");
  let currentScrollPos = window.pageYOffset;
  const moveToTopButton = document.querySelector("#moveToTopBtn");
  const hiddenSpanTop = document
    .querySelector("#hiddenSpan")
    .getBoundingClientRect().top;

  // console.log();
  if (prevScrollpos - currentScrollPos >= 0) {
    navHeader.style.top = "0";
  } else {
    const { height } = navHeader.getBoundingClientRect();
    navHeader.style.top = `-${height}px`;
  }
  prevScrollpos = currentScrollPos;
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
  var rect = element.getBoundingClientRect(),
    vHeight = window.innerHeight || document.documentElement.clientHeight,
    efp = function (x, y) {
      return document.elementFromPoint(x, y);
    };

  if (rect.bottom < 0 || rect.top > vHeight) return false;

  return (
    element.contains(efp(rect.left, rect.top)) ||
    element.contains(efp(rect.right, rect.top)) ||
    element.contains(efp(rect.right, rect.bottom)) ||
    element.contains(efp(rect.left, rect.bottom))
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
