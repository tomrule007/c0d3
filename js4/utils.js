// general

export const randomIntBetween = (min, max) =>
  Math.round((max - min) * Math.random() + min);

export const pick = (prop) => (obj) => obj[prop];

// board (2d array) specific
export const mapBoardCells = (fn) => (board) => {
  return board.map((row, y) => row.map((cell, x) => fn(cell, { y, x }, board)));
};
export const forEachCell = (fn) => (board) => board.flat().forEach(fn);
export const reduceCells = (reducer, initialState) => (board) =>
  board.flat().reduce(reducer, initialState);

export const getRandomNonRepeatingCords = (
  count,
  maxCord,
  cords = new Set()
) => {
  if (cords.size === count)
    return [...cords].map((cordString) => {
      const [x, y] = cordString.split(',').map(Number);
      return { x, y };
    });

  const cordString = `${randomIntBetween(0, maxCord - 1)},${randomIntBetween(
    0,
    maxCord - 1
  )}`;

  return getRandomNonRepeatingCords(count, maxCord, cords.add(cordString));
};

export const forEachNeighborCell = (board, cellCords, fn) => {
  const directions = [
    { dy: -1, dx: -1, direction: 'top - left' },
    { dy: -1, dx: 0, direction: 'top - middle' },
    { dy: -1, dx: 1, direction: 'top - right' },
    { dy: 0, dx: -1, direction: 'middle - left' },
    { dy: 0, dx: 1, direction: 'middle - right' },
    { dy: 1, dx: -1, direction: 'bottom - left' },
    { dy: 1, dx: 0, direction: 'bottom - middle' },
    { dy: 1, dx: 1, direction: 'bottom - right' },
  ];

  directions.forEach(({ dy, dx, direction }) => {
    const y = cellCords.y + dy;
    const x = cellCords.x + dx;
    const cell = board?.[y]?.[x];
    if (cell !== undefined) fn(cell, board);
  });
};

export const getNeighborCell = ({ y, x }, board) => {
  const directions = [
    { dy: -1, dx: -1 }, // top - left
    { dy: -1, dx: 0 }, //  top - middle
    { dy: -1, dx: 1 }, //  top - right
    { dy: 0, dx: -1 }, //  middle - left
    { dy: 0, dx: 1 }, //   middle - right
    { dy: 1, dx: -1 }, //  bottom - left
    { dy: 1, dx: 0 }, //   bottom - middle
    { dy: 1, dx: 1 }, //   bottom - right
  ];

  return directions.reduce((cells, { dy, dx }) => {
    const cell = board?.[y + dy]?.[x + dx];
    if (cell !== undefined) cells.push(cell);
    return cells;
  }, []);
};
