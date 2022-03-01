import {
  board,
  marker,
  player,
  isWinner,
  switchPlayer,
  gameOver,
  markBoard,
  BOARD_CHANGE_EVENT,
} from "./tic-tac-toe.js";

export default function TicTacToe() {
  const boardContainer = document.querySelector(".board");
  boardContainer.addEventListener("click", boardClickHandler);
  boardContainer.addEventListener(BOARD_CHANGE_EVENT, boardChangeHandler);

  // MAIN

  createTiles();

  // END MAIN

  // EVENT HANDLERS
  function boardClickHandler(event) {
    if (gameOver) return;
    if (event.target.textContent) return;
    const [row, col] = event.target.getAttribute("gridpos").split(",");

    markBoard(player, [row, col], boardContainer);
    const win = isWinner(marker[player], [row, col]);
    if (win) markWinningTiles(win);

    switchPlayer();
  }

  function boardChangeHandler(event) {
    updateBoard();
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

  function markWinningTiles(tiles) {
    for (const tile of tiles) {
      const position = tile.split(",");
      const tileDiv = getTile(position);
      tileDiv.style.backgroundColor = "red";
    }
  }

  function updateBoard() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const tile = getTile([row, col]);
        tile.textContent = board[row][col] ? board[row][col] : '';
      }
    }
  }

  function getTile([row, col]) {
    return document.querySelector(`[gridpos='${row},${col}']`);
  }
  // END UI HELPERS
}
