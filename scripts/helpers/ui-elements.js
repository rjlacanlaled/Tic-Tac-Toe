import { FALL_END_EVENT } from "../animations/fall.js";
import { canLaunch, marker } from "../app/tic-tac-toe.js";
import { faceImgs, faceLaserImgs } from "./ui-images.js";

export function createTile([row, col], classList = [], events = [], posName) {
  const tile = document.createElement("div");
  tile.setAttribute(posName, `${row},${col}`);
  classList.forEach((className) => tile.classList.add(className));
  events.forEach((event) => {
    tile.addEventListener(event.name, event.callback);
  });
  return tile;
}

export function createTiles(boardContainer, tileEvents) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tile = createTile([row, col], ["tile"], tileEvents, "gridpos");
      boardContainer.appendChild(tile);
    }
  }
}

export function createParachute(imgUrl, imgContainer, callback) {
  const img = document.createElement("img");
  img.src = imgUrl;
  img.addEventListener(FALL_END_EVENT, callback);
  imgContainer.appendChild(img);
  return img;
}

export function createFace(imgUrl, [row, col]) {
  const img = document.createElement("img");
  img.src = imgUrl;
  img.setAttribute("imgGridPos", `${row},${col}`);
  return img;
}

export function createHistoryGrid(board, playerMove, canLaunch) {
  const grid = document.createElement("div");
  grid.classList.add("history-grid");
  const [player, [playerRow, playerCol]] =
    playerMove === null ? ["", [-1, -1]] : playerMove;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const tile = createTile(
        [r, c],
        ["history-tile"],
        [],
        "historyTileGridPos"
      );
      if (board[r][c]) {
        let imgUrl = "";
        if (canLaunch) {
          imgUrl = canLaunch.has(`${r},${c}`)
            ? faceLaserImgs[board[r][c]]
            : faceImgs[board[r][c]];
        } else {
          imgUrl = faceImgs[board[r][c]];
        }
        tile.style.backgroundImage = `url('${imgUrl}')`;
      }
      grid.appendChild(tile);
      if (playerRow == r && playerCol == c) tile.classList.add("history-move");
    }
  }
  return grid;
}

export function createHistoryText(historyText) {
  const text = document.createElement("p");
  text.textContent = historyText;
  return text;
}

export function getTile([row, col]) {
  return document.querySelector(`[gridpos='${row},${col}']`);
}

export function getImage([row, col]) {
  return document.querySelector(`[imgGridPos='${row},${col}']`);
}

export function getParachute([row, col]) {
  return document.querySelector(`[parachuteGridPos='${row},${col}']`);
}
