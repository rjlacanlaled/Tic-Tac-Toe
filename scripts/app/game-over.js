import animateOpacityTransition from "../animations/opacity-transition.js";
import { playAudioFromStart } from "../helpers/audio-utils.js";
import { hide, show } from "../helpers/ui-utils.js";
import { showChooseSide } from "./choose-side.js";
import { showIntro } from "./intro.js";

const displayTypes = {};
let displayElements;
let displayNames;

const container = document.querySelector(".game-over-container");
const gameOverDiv = document.querySelector(".game-over-div");
const gameOverText = document.querySelector(".game-over-text");
let result = document.querySelector(".result-text");
let totalScore = document.querySelector(".total-score");
const gameOverButtonContainer = document.querySelector(".game-over-buttons");
const playAgainButton = document.querySelector(".play-again-button");
const quitButton = document.querySelector(".quit-button");
const totalScoreLabel = document.querySelector(".total-score-label");

const gameOverAudio = new Audio("/assets/game-over.mp3");

export default function initGameOver() {


  displayNames = [
    "container",
    "gameOverDiv",
    "gameOverText",
    "result",
    "totalScore",
    "gameOverButtonContainer",
    "playAgainButton",
    "quitButton",
    "totalScoreLabel"
  ];

  displayElements = [
    container,
    gameOverDiv,
    gameOverText,
    result,
    totalScore,
    gameOverButtonContainer,
    playAgainButton,
    quitButton,
    totalScoreLabel
  ];

  displayElements.forEach((element, index) => {
    displayTypes[displayNames[index]] = element.style.display;
  });

  playAgainButton.addEventListener("click", playAgainButtonClickHandler);
  quitButton.addEventListener("click", quitButtonClickHandler);

  hideGameOver();


  function playAgainButtonClickHandler(event) {
      hideGameOver();
      showChooseSide();
  }

  function quitButtonClickHandler(event) {
      hideGameOver();
      showIntro();
  }
}

export function showGameOver() {
  playAudioFromStart(gameOverAudio, 0.8);
  show(displayElements, displayTypes, displayNames);
  animateOpacityTransition(gameOverText, 0, 1, 2, 0);
  animateOpacityTransition(result, 0, 1, 2, 2000);
  animateOpacityTransition(totalScore, 0, 1, 1, 4000);
  animateOpacityTransition(totalScoreLabel, 0, 1, 1, 4000);
  animateOpacityTransition(playAgainButton, 0, 1, 1, 5000);
  animateOpacityTransition(quitButton, 0, 1, 1, 6000);
}

export function hideGameOver() {
  gameOverAudio.muted = true;
  hide(displayElements);
}

export function updateGameOverData(resultText, totalScoreText) {
    result.textContent = resultText;
    totalScore.textContent = totalScoreText;
}
