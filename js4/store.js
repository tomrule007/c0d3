import {
  forEachNeighborCell,
  getNeighborCell,
  mapBoardCells,
} from './utils.js';

export function Store() {
  this.subscribers = [];
  this.prevState = {};
  this.state = {
    status: 'idle',
  };

  this.state = this.reduce(this.state, {});
}
Store.prototype.getState = function () {
  return this.state;
};
Store.prototype.dispatch = function (action) {
  this.prevState = this.state;
  this.state = this.reduce(this.state, action);
  console.log(action);
  this.notifySubscribers();
  return action;
};
Store.prototype.subscribe = function (fn) {
  this.subscribers.push(fn);
};
Store.prototype.notifySubscribers = function () {
  this.subscribers.forEach((subscriber) =>
    subscriber(this.prevState, this.state)
  );
};

Store.prototype.reduce = function (state, action) {
  // THE ROOT REDUCER
  return {
    board: updateBoard(state, action),
    status: updateStatus(state, action),
    size: 10,
    mineCount: 10,
    time: updateTime(state, action),
    depressedCells: updateDepressedCells(state, action),
  };
};

// Board Creation

export const createCell = ({
  value = 0,
  x,
  y,
  isMine = false,
  isExposed = false,
  isFlagged = false,
  isHit = false,
} = {}) => {
  if (x === undefined || y === undefined)
    throw Error('Must Provide Cords to cell!');

  return { value, x, y, isMine, isExposed, isFlagged, isHit };
};

// Reducers
const incMineCount = ({ value, y, x, isMine }, board) => {
  if (isMine) return;
  board[y][x].value += 1;
};

export const generateBoard = (size, mineLocations) => {
  //build 2d array with mines placed and touching mine count
  const board = new Array(size).fill(null).map((_, y, a) =>
    a.map((_, x) => {
      const cell = createCell({
        isMine: mineLocations.some((mine) => mine.x === x && mine.y === y),
        x,
        y,
      });

      return cell;
    })
  );

  // **Mutates board adding mine neighbor count
  mineLocations.forEach((mine) =>
    forEachNeighborCell(board, mine, incMineCount)
  );

  return board;
};

function exposeCells(
  cell,
  board,
  forceAllNeighbors = false,
  boardCopy = board.map((row) => [...row])
) {
  if (cell.isFlagged || (cell.isExposed && !forceAllNeighbors))
    return boardCopy;
  boardCopy[cell.y][cell.x] = { ...cell, isExposed: true, isHit: cell.isMine };
  if (cell.isMine) return boardCopy;
  if (cell.value === 0 || forceAllNeighbors)
    getNeighborCell(cell, boardCopy).forEach((neighborCell) =>
      exposeCells(neighborCell, null, false, boardCopy)
    );

  return boardCopy;
}

const exposeMine = (cell) =>
  cell.isMine && !cell.isExposed ? { ...cell, isExposed: true } : cell;

export const toggleThisFlag = ({ x, y }) => (cell) =>
  cell.x === x && cell.y === y ? { ...cell, isFlagged: !cell.isFlagged } : cell;

function updateDepressedCells(state, action) {
  if (state.status === 'loss' || state.status === 'won')
    return state.depressedCells;

  switch (action.type) {
    case 'UNPRESS_CELLS':
      return [];
      break;
    case 'DEPRESS_THIS_CELL':
      const neighbors = [];
      if (action.andNeighbors)
        forEachNeighborCell(state.board, action.cell, (cell) => {
          if (!cell.isExposed) neighbors.push(cell);
        });
      return [...state.depressedCells, action.cell, ...neighbors];
      break;
    default:
      return state.depressedCells || [];
      break;
  }
}

function updateBoard(state, action) {
  if (
    action.type !== 'INITIALIZE_BOARD' &&
    (state.status === 'loss' || state.status === 'won')
  )
    return state.board;
  let boardCopy;
  switch (action.type) {
    case 'INITIALIZE_BOARD':
      return generateBoard(action.size, action.mineLocations);
      break;

    case 'TOGGLE_FLAG':
      return mapBoardCells(toggleThisFlag(action))(state.board);
      break;

    case 'EXPOSE_THIS_CELL':
      return exposeCells(action.cell, state.board);
      break;

    case 'EXPOSE_THIS_CELL_AND_NEIGHBORS':
      return exposeCells(action.cell, state.board, true);
      break;
    case 'END_GAME':
      return mapBoardCells(exposeMine)(state.board);
      break;
    default:
      return state.board;
      break;
  }
}

function updateStatus(state, action) {
  switch (action.type) {
    case 'INITIALIZE_BOARD':
      return 'idle';
      break;
    case 'START_GAME':
      return 'playing';
      break;
    case 'END_GAME':
      return action.isWinner ? 'won' : 'loss';
      break;
    default:
      return state.status;
      break;
  }
}

function updateTime(state, action) {
  switch (action.type) {
    case 'INITIALIZE_BOARD':
      return { start: null, end: null };
      break;
    case 'START_GAME':
      return { start: action.time, end: null };
      break;
    case 'END_GAME':
      return { ...state.time, end: action.endTime };
      break;

    default:
      return state.time;
      break;
  }
}
