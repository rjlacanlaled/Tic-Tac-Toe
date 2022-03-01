import { Directions } from "../enums/directions.js";
import { TimeTravel } from "../enums/time-travel.js";
import { eventTarget } from "./tic-tac-toe-ui.js";

// VARIABLES

export const BOARD_CHANGE_EVENT = "board_change_event";

export let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const marker = ["o", "x"];
export let player = 0;
export let gameOver = false;

export let history = [board.map((row) => [...row])];
export let playerMoveHistory = [['o', [-1, -1]]];
export let currentHistoryIndex = 0;

// BOARD

export function switchPlayer() {
  player = player === 0 ? 1 : 0;
}

export function resetGame() {
  gameOver = false;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[row][col] = null;
    }
  }
  history = [board.map((row) => [...row])];
  currentHistoryIndex = 0;
  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

export function isWinner(player, position) {
  const [row, col] = position;
  const results = findCombinations(player, [row, col]);
  const winTiles = new Set();
  for (const result of results) {
    const [size, tiles] = result;

    if (size === 3) {
      tiles.forEach((tile) => {
        winTiles.add(tile);
      });
      gameOver = true;
    }
  }

  return winTiles.size > 0 ? winTiles : false;
}

export function markBoard(player, position) {
  let [row, col] = position;
  row = parseInt(row);
  col = parseInt(col);

  board[row][col] = marker[player];
  history.push(board.map((row) => [...row]));
  playerMoveHistory.push([player, [row, col]]);
  currentHistoryIndex++;
  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

export function timeTravel(timetravel, steps) {
  switch (timetravel) {
    case TimeTravel.Forward:
      board = history[++currentHistoryIndex];
      break;
    case TimeTravel.Backward:
      board = history[--currentHistoryIndex];
      break;
  }
  eventTarget.dispatchEvent(new Event(BOARD_CHANGE_EVENT));
}

// BOARD

// GRAPH TRAVERSAL

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

// GRAPH TRAVERSAL
