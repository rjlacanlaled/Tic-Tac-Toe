import animateDropObject from "../animations/fall.js";
import { faceImgs, faceLaserImgs } from "./ui-images.js";
import {
  createFace,
  createHistoryGrid,
  createHistoryText,
  createParachute,
  getImage,
  getParachute,
  getTile,
} from "./ui-elements.js";
import animateSpinShrink, {
  SPIN_SHRINK_EVENT,
} from "../animations/spin-shrink.js";
import animateOpacityTransition from "../animations/opacity-transition.js";
import { canLaunch } from "../app/tic-tac-toe.js";

export function delayTileUpdate(event) {
  // const playerMark = event.target.getAttribute("mark");
  // const imgUrl = imageMarkers[playerMark];
  // const img = document.createElement("img");
  // const [row, col] = event.target.getAttribute("gridpos").split(",");
  // img.src = imgUrl;
  // img.setAttribute("imgGridPos", `${row},${col}`);
  // // event.target.style.backgroundImage = `url(${imgUrl})`;
  // event.target.setAttribute("animating", "no");
  // event.target.appendChild(img);
  // const [player, position] = playerMoveHistory[playerMoveHistory.length - 1];
  // const latestTile = getTile(position);
  // if (latestTile.getAttribute("animating") === "yes") return;
  // updateBoardHighlight(marker[player], position);
}

export function updateBoard() {
  // for (let row = 0; row < 3; row++) {
  //   for (let col = 0; col < 3; col++) {
  //     const tile = getTile([row, col]);
  //     tile.setAttribute("mark", board[row][col] ? board[row][col] : "");
  //     const isAnimating = tile.getAttribute("animating") === "yes";
  //     if (board[row][col]) {
  //       const imgUrl = imageMarkers[board[row][col]];
  //       const [player, [playerRow, playerCol]] =
  //         playerMoveHistory[playerMoveHistory.length - 1];
  //       if (
  //         (playerRow === row && playerCol === col && !gameOver) ||
  //         isAnimating
  //       )
  //         continue;
  //       // tile.style.backgroundImage = `url(${imgUrl})`;
  //       const img = createFace(board[row][col], [row, col]);
  //       tile.appendChild(img);
  //     } else {
  //       const img = getImage([row, col]);
  //       if(img) img.remove();
  //     }
  //   }
  // }
}

export function markWinningTiles(tiles) {
  // for (const tile of tiles) {
  //   const position = tile.split(",");
  //   const tileDiv = getTile(position);
  //   tileDiv.style.backgroundColor = "red";
  // }
}

export function updateBoardHighlight(player, positions) {
  // const win = isWinner(player, positions);
  // if (win) {
  //   markWinningTiles(win);
  // } else {
  //   resetColor();
  // }
}

export function resetColor() {
  // for (let row = 0; row < 3; row++) {
  //   for (let col = 0; col < 3; col++) {
  //     const tile = getTile([row, col]);
  //     tile.style.backgroundColor = "white";
  //   }
  // }
}

// NEW FUNCTIONS

export function markTile(playerMark, tile) {
  tile.setAttribute("mark", playerMark);
}

export function showParachute(
  playerMark,
  imgUrl,
  imgContainer,
  callback,
  targetElement
) {
  const parachute = createParachute(imgUrl, imgContainer, callback);
  parachute.setAttribute(
    "parachuteGridPos",
    targetElement.getAttribute("gridPos")
  );
  parachute.setAttribute("mark", playerMark);
  animateDropObject(parachute, -100, targetElement);
  targetElement.setAttribute("animating", "yes");
}

export function showFace(tile) {
  const face = createFace(
    faceImgs[tile.getAttribute("mark")],
    tile.getAttribute("gridPos").split(",")
  );
  tile.appendChild(face);
}

export function resetTiles() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      resetTile([r, c]);
      removeImage([r, c]);
      removeParachute([r, c]);
    }
  }
}

export function resetTile([row, col]) {
  const tile = getTile([row, col]);
  if (tile.getAttribute("mark")) tile.setAttribute("mark", "");
}

export function resetImage([row, col]) {
  const image = getImage([row, col]);
  if (image.getAttribute("win")) image.setAttribute("win", "");
}

export function removeImage([row, col]) {
  const img = getImage([row, col]);
  if (img) img.remove();
}

export function removeParachute([row, col]) {
  const parachute = getParachute([row, col]);
  getTile([row, col]).setAttribute("animating", "no");
  if (parachute) parachute.remove();
}

export function useTimeMachine(playerMarker, position, timeMachine, callback) {
  let img = getImage(position);
  if (!img) {
    removeParachute(position);
    img = createFace(faceImgs[playerMarker], position);
  }

  img.addEventListener(SPIN_SHRINK_EVENT, callback);
  timeMachine.appendChild(img);
  animateSpinShrink(img, timeMachine, 0, 0);
}

export function addHistoryGrid(board, playerMove, historyGridContainer, historyText) {
  console.log(historyText);
  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  const grid = createHistoryGrid(board, playerMove, canLaunch);
  const text = createHistoryText(historyText);
  historyItem.appendChild(text);
  historyItem.appendChild(grid);
  historyGridContainer.prepend(historyItem);
  animateOpacityTransition(text, 0, 1);
  animateOpacityTransition(grid, 0, 1);
}

export function updateWinTiles(tiles) {
  if (!tiles) return;
  tiles.forEach((tile) => {
    const [row, col] = tile.split(",");
    const tileUi = getTile([row, col]);
    const img = getImage([row, col]);
    const newImage = createFace(faceLaserImgs[tileUi.getAttribute("mark")], [
      row,
      col,
    ]);
    newImage.setAttribute("win", "yes");
    if (img) img.remove();
    tileUi.appendChild(newImage);
  });
}

export function revertTileState() {
  const imgs = document.querySelectorAll("[win='yes']");
  imgs.forEach((img) => {
    const position = img.getAttribute("imgGridPos").split(",");
    const tile = getTile(position);
    const newImage = createFace(faceImgs[tile.getAttribute("mark")], position);
    img.remove();
    tile.appendChild(newImage);
  });
}


export function show(displayElements, displayTypes, displayNames) {
  displayElements.forEach((element, index) => {
    element.style.display = displayTypes[displayNames[index]];
  });
}

export function hide(displayElements ) {
  displayElements.forEach((element) => {
    element.style.display = "none";
  });
}

export function showWithAnimation(displayElements, displayTypes, displayNames) {
  displayElements.forEach((element, index) => {
    element.style.display = displayTypes[displayNames[index]];
  });
}

export function hideWithAnimation(displayElements) {
  displayElements.forEach((element) => {
    element.style.display = "none";
  });
}