import { Directions } from "../helpers/directions.js";

export const board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export const marker = ["o", "x"];
export let player = 0;
export let gameOver = false;

export function switchPlayer() {
  player = player === 0 ? 1 : 0;
}

export function isWinner(player, position) {
  const [row, col] = position;
  const results = findCombinations(player, row, col);
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

export function findCombinations(player, row, col) {
  const results = [];

  for (const direction in Directions) {
    const visited = new Set();
    results.push(
      findCombinationForDirection(
        player,
        row,
        col,
        visited,
        Directions[direction]
      )
    );
  }
  return results;
}

export function findCombinationForDirection(
  player,
  row,
  col,
  visited,
  direction
) {
  const isRowValid = 0 <= row && row < 3;
  const isColValid = 0 <= col && col < 3;
  if (!isRowValid || !isColValid) return [0, visited];
  if (board[row][col] === null) return [0, visited];
  if (board[row][col] !== player) return [0, visited];

  const pos = `${row},${col}`;
  if (visited.has(pos)) return [0, visited];
  visited.add(pos);

  const positions = getNextPossiblePositionsForDirection(row, col, direction);

  let size = 1;
  for (const position of positions) {
    const [row, col] = position;
    const [additionalSize] = findCombinationForDirection(
      player,
      row,
      col,
      visited,
      direction
    );
    size += additionalSize;
  }
  return [size, visited];
}

export function getNextPossiblePositionsForDirection(row, col, direction) {
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
