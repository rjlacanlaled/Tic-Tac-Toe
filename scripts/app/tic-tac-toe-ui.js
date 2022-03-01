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
} from "./tic-tac-toe.js";

export const boardContainer = document.querySelector(".board");
export const eventTarget = new EventTarget();

export default function TicTacToe() {
  const restartButton = document.querySelector(".restart-button");
  boardContainer.addEventListener("click", boardClickHandler);
  eventTarget.addEventListener(BOARD_CHANGE_EVENT, boardChangeHandler);
  restartButton.addEventListener("click", restartButtonClickHandler);

  // MAIN

  createTiles();

  // END MAIN

  // EVENT HANDLERS
  function boardClickHandler(event) {
    if (gameOver) return;
    if (event.target.textContent) return;
    const [row, col] = event.target.getAttribute("gridpos").split(",");

    markBoard(player, [row, col]);
    updateBoardHighlight(player, [row, col]);
    switchPlayer();
  }

  function boardChangeHandler(event) {
    updateBoard();
  }

  function restartButtonClickHandler(event) {
    resetGame();
    console.log(board);
  }
  // END EVENT HANDLERS

  // UI HELPERS
  function createTile(row, col) {
    const tile = document.createElement("div");
    tile.setAttribute("gridpos", `${row},${col}`);
    tile.classList.add("tile");
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
}

// END UI HELPERS
export function markWinningTiles(tiles) {
  for (const tile of tiles) {
    const position = tile.split(",");
    const tileDiv = getTile(position);
    tileDiv.style.backgroundColor = "red";
  }
}

export function updateBoardHighlight(player, positions) {
  const win = isWinner(marker[player], positions);
  console.log(win);
  if (win) {
      markWinningTiles(win)
  } else {
      resetColor();
  };
}

export function resetColor() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = getTile([row, col]);
      tile.style.backgroundColor = "black";
    }
  }
}

function updateBoard() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = getTile([row, col]);
      tile.textContent = board[row][col] ? board[row][col] : "";
    }
  }
}

function getTile([row, col]) {
  return document.querySelector(`[gridpos='${row},${col}']`);
}
