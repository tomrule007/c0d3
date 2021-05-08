export const initializeBoard = (mineLocations, size) => ({
  type: 'INITIALIZE_BOARD',
  mineLocations,
  size,
});

export const exposeThisCell = (cell) => ({
  type: 'EXPOSE_THIS_CELL',
  cell,
});
export const exposeThisCellAmdNeighbors = (cell) => ({
  type: 'EXPOSE_THIS_CELL_AND_NEIGHBORS',
  cell,
});

export const toggleFlag = (cell) => ({
  type: 'TOGGLE_FLAG',
  x: cell.x,
  y: cell.y,
});

export const startGame = (newDate) => ({
  type: 'START_GAME',
  time: newDate.getTime(),
});

export const depressThisCell = (cell, andNeighbors = false) => ({
  type: 'DEPRESS_THIS_CELL',
  cell,
  andNeighbors,
});

export const unpressCells = () => ({
  type: 'UNPRESS_CELLS',
});

export const gameOver = (isWinner, endTime) => ({
  type: 'END_GAME',
  isWinner,
  endTime,
});
