import animateDropObject, { FALL_END_EVENT } from "../animations/fall.js";
import {
  board,
  marker,
  player,
  isWinner,
  switchPlayer,
  gameOver,
  markBoard,
  BOARD_CHANGE_EVENT,
  resetGame,
  redoMove,
  playerMoveHistory,
  currentHistoryIndex,
} from "./tic-tac-toe.js";

export const boardContainer = document.querySelector(".board");
export const eventTarget = new EventTarget();

const imageMarkers = {
  x: "assets/russia-face.png",
  o: "assets/ukraine-face.png",
};

const parachuteImg = {
  x: "assets/russia-parachute.png",
  o: "assets/ukraine-parachute.png",
};

const restartButton = document.querySelector(".restart-button");
const redoButton = document.querySelector(".redo-button");
const container = document.querySelector(".container");

export default function TicTacToe() {
  boardContainer.addEventListener("click", boardClickHandler);
  eventTarget.addEventListener(BOARD_CHANGE_EVENT, boardChangeHandler);
  restartButton.addEventListener("click", restartButtonClickHandler);
  redoButton.addEventListener("click", redoButtonClickHandler);

  // MAIN

  createTiles();

  // END MAIN

  // EVENT HANDLERS
  function boardClickHandler(event) {
    if (gameOver) return;
    if (event.target instanceof HTMLImageElement) return;
    if (event.target.classList.contains("mark")) return;
    if (event.target.getAttribute("mark")) return;

    const parachute = createParachute();
    animateDropObject(parachute, -100, event.target);
    event.target.setAttribute("animating", "yes");

    const [row, col] = event.target.getAttribute("gridpos").split(",");

    markBoard(player, [row, col]);
    switchPlayer();
  }

  function boardChangeHandler(event) {
    updateBoard();
  }

  function restartButtonClickHandler(event) {
    resetGame();
    updateBoardHighlight('o', [-1, -1]);  
  }

  function redoButtonClickHandler(event) {
    if (!gameOver) return;
    redoMove();
    updateBoard();
    const [player, [row, col]] =
      playerMoveHistory[playerMoveHistory.length - 1];
    updateBoardHighlight(player, [row, col]);
  }
  // END EVENT HANDLERS
}

// UI HELPERS
function createTile(row, col) {
  const tile = document.createElement("div");
  tile.setAttribute("gridpos", `${row},${col}`);
  tile.classList.add("tile");
  tile.addEventListener(FALL_END_EVENT, delayTileUpdate);
  return tile;
}

function createTiles() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = createTile(row, col);
      boardContainer.appendChild(tile);
    }
  }
}
function createParachute() {
  const img = document.createElement("img");
  img.src = parachuteImg[marker[player]];
  img.addEventListener(FALL_END_EVENT, removeParachute);
  container.appendChild(img);
  return img;
}

function createFace(player, [row, col]) {
  const img = document.createElement("img");
  img.src = imageMarkers[player];
  img.setAttribute("imgGridPos", `${row},${col}`);
  return img;
}

function removeParachute(event) {
  event.target.remove();
}

function getTile([row, col]) {
  return document.querySelector(`[gridpos='${row},${col}']`);
}

function getImage([row, col]) {
  return document.querySelector(`[imgGridPos='${row},${col}']`);
}

function delayTileUpdate(event) {
  const playerMark = event.target.getAttribute("mark");
  const imgUrl = imageMarkers[playerMark];
  const img = document.createElement("img");
  const [row, col] = event.target.getAttribute("gridpos").split(",");
  img.src = imgUrl;
  img.setAttribute("imgGridPos", `${row},${col}`);
  // event.target.style.backgroundImage = `url(${imgUrl})`;
  event.target.setAttribute("animating", "no");
  event.target.appendChild(img);
  const [player, position] = playerMoveHistory[playerMoveHistory.length - 1];

  const latestTile = getTile(position);
  if (latestTile.getAttribute("animating") === "yes") return;
  updateBoardHighlight(marker[player], position);
}

function updateBoard() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = getTile([row, col]);
      tile.setAttribute("mark", board[row][col] ? board[row][col] : "");
      const isAnimating = tile.getAttribute("animating") === "yes";

      if (board[row][col]) {
        const imgUrl = imageMarkers[board[row][col]];
        const [player, [playerRow, playerCol]] =
          playerMoveHistory[playerMoveHistory.length - 1];

        if (
          (playerRow === row && playerCol === col && !gameOver) ||
          isAnimating
        )
          continue;

        // tile.style.backgroundImage = `url(${imgUrl})`;
        const img = createFace(board[row][col], [row, col]);
        tile.appendChild(img);
      } else {
        const img = getImage([row, col]);
        if(img) img.remove();
      }
    }
  }
}

export function markWinningTiles(tiles) {
  for (const tile of tiles) {
    const position = tile.split(",");
    const tileDiv = getTile(position);
    tileDiv.style.backgroundColor = "red";
  }
}

export function updateBoardHighlight(player, positions) {
  const win = isWinner(player, positions);

  if (win) {
    markWinningTiles(win);
  } else {
    resetColor();
  }
}

export function resetColor() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = getTile([row, col]);
      tile.style.backgroundColor = "white";
    }
  }
}
