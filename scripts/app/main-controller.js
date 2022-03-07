import { FALL_END_EVENT } from "../animations/fall.js";
import { faceImgs, parachuteImgs } from "../helpers/ui-images.js";
import {
  addHistoryGrid,
  delayTileUpdate,
  hide,
  markTile,
  resetImage,
  resetTile,
  resetTiles,
  revertTileState,
  show,
  showFace,
  showParachute,
  updateWinTiles,
  useTimeMachine,
} from "../helpers/ui-utils.js";
import { createFace, createTiles, getTile } from "../helpers/ui-elements.js";
import {
  checkWinner,
  currentPlayer,
  gameOver,
  markBoard,
  marker,
  resetGame,
  switchPlayer,
  canLaunch,
  playerMoveHistory,
  endGame,
  timeTravel,
  boardHistory,
  board,
  updateHistoryState,
  names,
  scores,
  gameStarted,
  startGame,
} from "./tic-tac-toe.js";
import { TimeTravel } from "../enums/time-travel.js";
import { MoveType } from "../enums/move-type.js";
import { showGameOver, updateGameOverData } from "./game-over.js";
import { playAudioFromStart } from "../helpers/audio-utils.js";
import animateOpacityTransition from "../animations/opacity-transition.js";

export const boardContainer = document.querySelector(".board");
export const eventTarget = new EventTarget();
export const container = document.querySelector(".container");
const displayTypes = {};
let displayElements;
let displayNames;

const restartButton = document.querySelector(".restart-button");
const redoButton = document.querySelector(".redo-button");
const undoButton = document.querySelector(".undo-button");
const drawButton = document.querySelector(".draw-button");
const nuclearButton = document.querySelector(".death-star-button");
const timeMachine = document.querySelector(".time-machine");
const historyGridContainer = document.querySelector(".history-grid-container");
const scoreText = document.querySelector(".score-text");
const gameText = document.querySelector(".game-text");
const historyContainer = document.querySelector(".history");
const main = document.querySelector(".main");
const gameImages = document.querySelector(".game-images");
const header = document.getElementsByTagName("header")[0];

const gameAudio = new Audio("/assets/game-sound.mp3");
const addMoveAudio = new Audio("/assets/scifi-positive.wav");
const deathStarChargedAudio = new Audio("/assets/death-star-charged.wav");
const notAllowedAudio = new Audio("/assets/not-allowed.mp3");
const missileLaunchAudio = new Audio("/assets/missile-launch.mp3");

export default function initTicTacToeApp() {
  displayNames = [
    "restartBtn",
    "redoButton",
    "undoButton",
    "drawButton",
    "nuclearButton",
    "timeMachine",
    "historyGridContainer",
    "scoreText",
    "gameText",
    "historyContainer",
    "main",
    "gameImages",
    "header",
  ];

  displayElements = [
    restartButton,
    redoButton,
    undoButton,
    drawButton,
    nuclearButton,
    timeMachine,
    historyGridContainer,
    scoreText,
    gameText,
    historyContainer,
    main,
    gameImages,
    header,
  ];

  displayElements.forEach((element, index) => {
    displayTypes[displayNames[index]] = element.style.display;
  });

  boardContainer.addEventListener("click", boardClickHandler);
  restartButton.addEventListener("click", restartButtonClickHandler);
  redoButton.addEventListener("click", redoButtonClickHandler);
  undoButton.addEventListener("click", undoButtonClickHandler);
  drawButton.addEventListener("click", drawButtonClickHandler);
  nuclearButton.addEventListener("click", nuclearButtonClickHandler);

  // MAIN

  createTiles(boardContainer, [
    { name: FALL_END_EVENT, callback: delayTileUpdate },
  ]);
  updateButtonStates();
  updateScoreText(marker[currentPlayer], marker[currentPlayer === 0 ? 1 : 0]);
  updateGameText(getGameText());

  hideGame();

  // END MAIN

  // EVENT HANDLERS
  function boardClickHandler(event) {
    if (
      gameOver ||
      canLaunch ||
      event.target instanceof HTMLImageElement ||
      event.target.classList.contains("board") ||
      event.target.getAttribute("mark")
    )
      return playAudioFromStart(notAllowedAudio);

    if (!gameStarted) startGame();

    const position = event.target.getAttribute("gridpos").split(",");
    playAudioFromStart(addMoveAudio);
    markBoard(position);
    updateHistoryState(position);
    markTile(marker[currentPlayer], event.target);
    showParachute(
      marker[currentPlayer],
      parachuteImgs[marker[currentPlayer]],
      container,
      parachuteLandedHandler,
      event.target
    );
    checkWinner();
    const prevAttacker = names[marker[currentPlayer]];
    const prevMoveText = getPreviousAttackText(
      prevAttacker,
      position,
      MoveType.NEW
    );
    addHistoryGrid(
      board,
      playerMoveHistory.present,
      historyGridContainer,
      prevMoveText
    );
    switchPlayer();
    const nextAttacker = names[marker[currentPlayer]];
    updateGameText(
      getGameText(prevAttacker, position, nextAttacker, MoveType.NEW)
    );
    updateButtonStates();
  }

  function restartButtonClickHandler(event) {
    resetDisplay();
  }

  function drawButtonClickHandler(event) {
    if (gameOver) return;
    endGame();
    resetDisplay();
    updateGameOverData(
      `It's a draw!`,
      `Jedi: ${scores["o"]} | Sith: ${scores["x"]}`
    );
    hideGame();
    showGameOver();
  }

  function nuclearButtonClickHandler(event) {
    if (!canLaunch) return;
    scores[marker[playerMoveHistory.present[0]]]++;

    endGame();
    playAudioFromStart(missileLaunchAudio);

    setTimeout(() => {
      hideGame();
      updateGameOverData(
        `${names[marker[playerMoveHistory.present[0]]]} Wins!`,
        `Jedi: ${scores["o"]} | Sith: ${scores["x"]}`
      );
      showGameOver();
      resetDisplay();
    }, 1500);
  }

  function redoButtonClickHandler(event) {
    if (gameOver) return;
    if (playerMoveHistory.future.length < 1) return;

    const prevAttacker = names[marker[currentPlayer]];
    timeTravel(TimeTravel.Forward, 1);
    const nextAttacker = names[marker[currentPlayer]];
    const [player, position] = playerMoveHistory.present;
    const moveText = getPreviousAttackText(
      prevAttacker,
      position,
      MoveType.REDO
    );
    const tile = getTile(position);
    markTile(marker[playerMoveHistory.present[0]], tile);
    tile.appendChild(createFace(faceImgs[marker[player]], position));
    updateGameText(
      getGameText(nextAttacker, position, prevAttacker, MoveType.REDO)
    );

    addHistoryGrid(
      board,
      playerMoveHistory.present,
      historyGridContainer,
      moveText
    );
    updateWinTiles(canLaunch);
    updateButtonStates();

    if (canLaunch) {
      deathStarChargedAudio.currentTime = 0;
      deathStarChargedAudio.play();
    }
  }

  function undoButtonClickHandler(event) {
    if (gameOver) return;
    if (boardHistory.past.length < 1) return;

    const [player, position] = playerMoveHistory.present;
    const prevAttacker = names[marker[currentPlayer]];
    timeTravel(TimeTravel.Backward, 1);
    const nextAttacker = names[marker[currentPlayer]];
    const moveText = getPreviousAttackText(
      nextAttacker,
      position,
      MoveType.UNDO
    );
    resetTile(position);
    resetImage(position);
    updateGameText(
      getGameText(prevAttacker, position, nextAttacker, MoveType.UNDO)
    );

    addHistoryGrid(
      board,
      playerMoveHistory.future[playerMoveHistory.future.length - 1],
      historyGridContainer,
      moveText
    );

    // animate
    useTimeMachine(marker[player], position, timeMachine, imageShrunkHandler);
    revertTileState();
    updateButtonStates();
  }

  function parachuteLandedHandler(event) {
    event.target.remove();
    const [row, col] = event.target.getAttribute("parachuteGridPos").split(",");
    const tile = getTile([row, col]);
    if (!tile.getAttribute("mark")) return;

    const [playerRow, playerCol] = playerMoveHistory.present[1];
    if (canLaunch && row == playerRow && col == playerCol) {
      updateWinTiles(canLaunch);
      deathStarChargedAudio.currentTime = 0;
      deathStarChargedAudio.play();
      return;
    }
    showFace(tile);
  }

  function imageShrunkHandler(event) {
    event.target.remove();
  }
}

export function updateScoreText() {
  scoreText.textContent = `Jedi: ${scores["o"]} | Sith: ${scores["x"]}`;
}

export function updateButtonStates() {
  redoButton.disabled = playerMoveHistory.future.length < 1;
  undoButton.disabled = playerMoveHistory.past.length < 1;
  nuclearButton.disabled = !canLaunch;
  console.log("gameStarted?", gameStarted);
  restartButton.disabled = !gameStarted;
}

export function resetDisplay() {
  resetGame();
  resetTiles();
  historyGridContainer.innerHTML = "";
  updateButtonStates();
  updateScoreText();
  updateGameText(getGameText());
}

export function showGame() {
  playAudioFromStart(gameAudio, 0.3);
  show(displayElements, displayTypes, displayNames);
  updateGameOverData(getGameText());
  resetDisplay();
  animateOpacityTransition(historyContainer, 0, 1, 2, 1000);
  animateOpacityTransition(gameImages, 0, 1, 2, 1000);
  animateOpacityTransition(header, 0, 1, 2, 0);
  animateOpacityTransition(boardContainer, 0, 1, 2, 2000);
  animateOpacityTransition(redoButton, 0, 1, 2, 2000);
  animateOpacityTransition(undoButton, 0, 1, 2, 2000);
}

export function hideGame() {
  gameAudio.muted = true;
  hide(displayElements);
}

export function updateGameText(text) {
  gameText.textContent = text;
}

export function getGameText(prevAttacker, position, nextAttacker, moveType) {
  let prevMove, nextMove;
  if (!prevAttacker)
    return `${
      names[marker[currentPlayer]]
    }, you are first to make a move. What's it gonna be?`;

  prevMove = getPreviousAttackText(
    moveType === MoveType.NEW ? prevAttacker : nextAttacker,
    position,
    moveType
  );

  if (!canLaunch) {
    nextMove = `What's your next move, ${
      moveType === MoveType.UNDO ? nextAttacker : prevAttacker
    }?`;
  } else {
    nextMove = `Death Star is now ready to launch! Press the launch button to attack the ${nextAttacker}s!`;
  }

  return prevMove + nextMove;
}

export function getPreviousAttackText(player, position, moveType) {
  switch (moveType) {
    case MoveType.NEW:
      return `${player} entered planet ${position[0]}${position[1]}. `;
    case MoveType.UNDO:
      return `${player} fled planet ${position[0]}${position[1]}. `;
    case MoveType.REDO:
      return `${player} returned to planet ${position[0]}${position[1]}. `;
  }
}
