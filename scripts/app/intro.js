import animateOpacityTransition from "../animations/opacity-transition.js";
import { hide, show } from "../helpers/ui-utils.js";
import { showChooseSide } from "./choose-side.js";

const displayTypes = {};
let displayElements;
let displayNames;

const introText = document.querySelector(".intro-text");
const container = document.querySelector(".introduction-container");
const tic = document.querySelector(".tic");
const tac = document.querySelector(".tac");
const toe = document.querySelector(".toe");
const logo = document.querySelector(".logo");
const subLogo = document.querySelector(".sub-logo");
const episodeNumber = document.querySelector(".episode-number");
const episodeName = document.querySelector(".episode-name");
const playGameButtonContainer = document.querySelector(
  ".play-game-button-container"
);
const playGameButton = document.querySelector(
  ".play-game-button-container > button"
);
const enter = document.querySelector(".enter");

const introMusic = new Audio("/assets/intro-song.mp3");

export default function initIntro() {
  introMusic.volume = 0.3;

  displayNames = [
    "intro",
    "tic",
    "tac",
    "toe",
    "logo",
    "subLogo",
    "episodeNumber",
    "episodeName",
    "buttonContainer",
    "playButton",
    "introText",
  ];
  displayElements = [
    container,
    tic,
    tac,
    toe,
    logo,
    subLogo,
    episodeNumber,
    episodeName,
    playGameButtonContainer,
    playGameButton,
    introText,
  ];

  displayElements.forEach((element, index) => {
    displayTypes[displayNames[index]] = element.style.display;
  });

  playGameButton.addEventListener("click", playButtonClickHandler);
  enter.addEventListener("click", enterButtonHandler);

  hideIntro();
  logo.style.display = displayTypes['logo'];
  container.style.display = displayTypes["intro"];
  playGameButtonContainer.style.display = displayTypes['buttonContainer'];
  playGameButton.style.display = displayTypes['playButton'];
  tic.style.display = displayTypes['tic'];
  tac.style.display = displayTypes['tac'];
  toe.style.display = displayTypes['toe'];
  tic.style.opacity = "0";
  tac.style.opacity = "0";
  toe.style.opacity = "0";
  playGameButton.style.opacity = "0";

  function enterButtonHandler(event) {
    enter.style.display = "none";
    setTimeout(showIntro, 3000);
    introText.style.display = "flex";
    animateOpacityTransition(introText, 1, 0, 2, 1000);
    setTimeout(() => {
      introText.display = "none";
    }, 2000);
  }

  function playButtonClickHandler(event) {
    hideIntro();
    showChooseSide();
  }
}

export function showIntro() {
  introMusic.currentTime = 0;
  introMusic.muted = false;
  introMusic.play();
  show(displayElements, displayTypes, displayNames);
  tic.style.display = displayTypes["tic"];
  tic.style.display = displayTypes["tac"];
  tic.style.display = displayTypes["toe"];
  subLogo.style.display = "none";

  setTimeout(() => {
    subLogo.style.animation = "crawl 150s linear";
    subLogo.style.display = displayTypes["subLogo"];
  }, 4000);
  animateOpacityTransition(tic, 0, 1, 1, 0);
  animateOpacityTransition(tac, 0, 1, 1, 1000);
  animateOpacityTransition(toe, 0, 1, 1, 2000);
  animateOpacityTransition(playGameButton, 0, 1, 1, 3000);
  introText.style.display = "none";
}

export function hideIntro() {
  introMusic.muted = true;
  hide(displayElements);
}
