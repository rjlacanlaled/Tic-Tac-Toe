import animateOpacityTransition from "../animations/opacity-transition.js";
import { playAudioFromStart } from "../helpers/audio-utils.js";
import { hide, show } from "../helpers/ui-utils.js";
import { showGame } from "./main-controller.js";
import { chosenPlayer, resetGame, setChosenPlayer } from "./tic-tac-toe.js";

const displayTypes = {};
let displayElements;
let displayNames;

const welcomeScreenContainer = document.querySelector(
  ".welcome-screen-container"
);
const welcomeMessage = document.querySelector(".welcome-screen-container > h1");
const welcomeSubMessage = document.querySelector(
  ".welcome-screen-container > h2"
);
const allegianceContainer = document.querySelector(".allegiance-container");
const jediSide = document.querySelector(".jedi-side");
const jediFace = document.querySelector(".jedi-face");
const jediButton = document.querySelector(".jedi-side > button");
const sithSide = document.querySelector(".sith-side");
const sithFace = document.querySelector(".sith-face");
const sithButton = document.querySelector(".sith-side > button");
const chooseSideAudio = new Audio("/assets/choose-side.mp3");
const gameOverAudio = new Audio("/assets/game-over.mp3");

export default function initChooseSide() {
  jediButton.addEventListener("click", jediButtonClickHandler);
  sithButton.addEventListener("click", sithButtonClickHandler);

  displayNames = [
    "welcomeScreenContainer",
    "welcomeMessage",
    "welcomeSubMessage",
    "allegianceContainer",
    "jediSide",
    "jediFace",
    "jediButton",
    "sithSide",
    "sithFace",
    "sithButton",
  ];

  displayElements = [
    welcomeScreenContainer,
    welcomeMessage,
    welcomeSubMessage,
    allegianceContainer,
    jediSide,
    jediFace,
    jediButton,
    sithSide,
    sithFace,
    sithButton,
  ];

  displayElements.forEach((element, index) => {
    displayTypes[displayNames[index]] = element.style.display;
  });

  hideChooseSide();

  function jediButtonClickHandler(event) {
    hideChooseSide();
    setChosenPlayer(0);
    resetGame();
    showGame();
  }

  function sithButtonClickHandler(event) {
    hideChooseSide();
    setChosenPlayer(1);
    resetGame();
    showGame();
  }
}

export function showChooseSide() {
  playAudioFromStart(chooseSideAudio);
  show(displayElements, displayTypes, displayNames);
  animateOpacityTransition(welcomeMessage, 0, 1, 2, 0);
  animateOpacityTransition(jediSide, 0, 1, 2, 2000);
  animateOpacityTransition(sithSide, 0, 1, 2, 4000);
  animateOpacityTransition(welcomeSubMessage, 0, 1, 2, 6000);
}

export function hideChooseSide() {
  chooseSideAudio.muted = true;
  hide(displayElements);
}
