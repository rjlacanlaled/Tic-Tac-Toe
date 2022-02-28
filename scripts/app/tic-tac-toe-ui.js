import { board, marker, player, isWinner, switchPlayer, gameOver } from "./tic-tac-toe.js";


export default function TicTacToe() {
  const boardContainer = document.querySelector(".board");
  boardContainer.addEventListener("click", boardClickHandler);

  // MAIN

  createTiles();

  // END MAIN

  // EVENT HANDLERS
  function boardClickHandler(event) {
    if (gameOver) return;
    if (event.target.textContent) return;
    const row = parseInt(event.target.getAttribute("row"));
    const col = parseInt(event.target.getAttribute("col"));
    event.target.innerHTML = `<p>${marker[player]}<p>`;

    board[row][col] = marker[player];
    const win = isWinner(marker[player], [row, col]);
    if (win) markWinningTiles(win);
    
    switchPlayer();
  }
  // END EVENT HANDLERS

  // UI HELPERS
  function createTile(row, col) {
    const tile = document.createElement("div");
    tile.setAttribute("gridpos", row);
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
    for(const tile of tiles) {
      const [row, col] = tile.split(',');
      const tileDiv = document.querySelector(`row=${row} col=${col}`)
      console.log(tileDiv);
    }
  }
  // END UI HELPERS
}
