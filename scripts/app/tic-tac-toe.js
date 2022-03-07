import { Directions } from "../enums/directions.js";
import { TimeTravel } from "../enums/time-travel.js";
import { eventTarget } from "./main-controller.js";

// VARIABLES
export const BOARD_CHANGE_EVENT = "board_change_event";

export let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const names = {
  'x': "Sith",
  "o": "Jedi"
}

export const scores = {
  'x': 0,
  'o': 0
}

export const marker = ["o", "x"];
export let currentPlayer = 0;
export let chosenPlayer = 0;
export let gameOver = false;
export let canLaunch = false;
export let winTiles = false;
export let gameStarted = false;

export let boardHistory = {
  past: [],
  present: board.map((row) => [...row]),
  future: [],
};

export let playerMoveHistory = {
  past: [],
  present: null,
  future: [],
};


// BOARD

export function switchPlayer() {
  currentPlayer = currentPlayer === 0 ? 1 : 0;
}

export function redoMove() {
  // gameOver = !gameOver;
  revertMove();
}

export function endGame() {
  gameOver = true;
}

export function setChosenPlayer(player) {
  chosenPlayer = player;
  currentPlayer = chosenPlayer;
}

export function resetGame() {
  gameOver = false;
  gameStarted = false;
  canLaunch = false;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = null;
    }
  }

  currentPlayer = chosenPlayer;
  boardHistory = {
    past: [],
    present: board.map((row) => [...row]),
    future: [],
  };

  playerMoveHistory = {
    past: [],
    present: null,
    future: [],
  };

  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

export function startGame() {
  gameStarted = true;
}

export function checkWinner() {
  if (playerMoveHistory.past.length < 5) return canLaunch = false;
  const [player, position] = playerMoveHistory.present;
  canLaunch = isWinner(marker[player], position);
}

export function isWinner(player, position) {
  const [row, col] = position;
  const results = findCombinations(player, [row, col]);
  winTiles = new Set();

  for (const result of results) {

    const [size, tiles] = result;
    if (size === 3) {
      tiles.forEach((tile) => {
        winTiles.add(tile);
      });
    }
  }

  return winTiles.size > 0 ? winTiles : false;
}

export function markBoard(position) {
  let [row, col] = position;
  row = parseInt(row);
  col = parseInt(col);

  board[row][col] = marker[currentPlayer];

  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

export function updateHistoryState(position) {
  let [row, col] = position;
  row = parseInt(row);
  col = parseInt(col);

  boardHistory.past.push(boardHistory.present.map((row) => [...row]));
  boardHistory.present = board.map((row) => [...row]);

  playerMoveHistory.past.push(playerMoveHistory.present);
  playerMoveHistory.future = [];
  playerMoveHistory.present = [currentPlayer, [row, col]];
}

export function timeTravel(timetravel, steps) {
  switch (timetravel) {
    case TimeTravel.Forward:
      redo();
      break;
    case TimeTravel.Backward:
      undo();
      break;
  }
  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

function undo() {
  if (gameOver) return;
  if (boardHistory.past < 1) return;

  playerMoveHistory.future.push(playerMoveHistory.present);
  if (playerMoveHistory.past.length > 0)
    playerMoveHistory.present = playerMoveHistory.past.pop();
  boardHistory.future.push(boardHistory.present.map((row) => [...row]));
  boardHistory.present = boardHistory.past.pop().map((row) => [...row]);

  board = boardHistory.present.map((row) => [...row]);
  checkWinner();
  switchPlayer();
}

function redo() {
  if (gameOver) return;
  if (boardHistory.future < 1) return;

  playerMoveHistory.past.push(playerMoveHistory.present);
  if (playerMoveHistory.future.length > 0)
    playerMoveHistory.present = playerMoveHistory.future.pop();
  boardHistory.past.push(boardHistory.present.map((row) => [...row]));
  boardHistory.present = boardHistory.future.pop().map((row) => [...row]);

  board = boardHistory.present.map((row) => [...row]);
  checkWinner();
  switchPlayer();
}

// GRID FUNCTIONS
function findCombinations(player, position) {
  const results = [];
  const [row, col] = position;

  for (const direction in Directions) {
    const visited = new Set();
    results.push(
      findCombinationForDirection(
        player,
        [row, col],
        visited,
        Directions[direction]
      )
    );
  }
  return results;
}

function findCombinationForDirection(player, position, visited, direction) {
  let [row, col] = position;
  col = parseInt(col);
  row = parseInt(row);
  const isRowValid = 0 <= row && row < 3;
  const isColValid = 0 <= col && col < 3;
  if (!isRowValid || !isColValid) return [0, visited];
  if (board[row][col] === null) return [0, visited];
  if (board[row][col] !== player) return [0, visited];

  const pos = `${row},${col}`;
  if (visited.has(pos)) return [0, visited];
  visited.add(pos);

  const positions = getNextPossiblePositionsForDirection([row, col], direction);

  let size = 1;
  for (const position of positions) {
    const [row, col] = position;
    const [additionalSize] = findCombinationForDirection(
      player,
      [row, col],
      visited,
      direction
    );
    size += additionalSize;
  }
  return [size, visited];
}

function getNextPossiblePositionsForDirection(position, direction) {
  const [row, col] = position;
  switch (direction) {
    case Directions.LeftDiagonal:
      return [
        [row - 1, col + 1],
        [row + 1, col - 1],
      ];
    case Directions.RightDiagonal:
      return [
        [row - 1, col - 1],
        [row + 1, col + 1],
      ];
    case Directions.Horizontal:
      return [
        [row, col - 1],
        [row, col + 1],
      ];
    case Directions.Vertical:
      return [
        [row - 1, col],
        [row + 1, col],
      ];
  }
}

// GRAPH FUNCTIONS
