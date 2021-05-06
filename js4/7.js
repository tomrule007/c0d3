// utility function
const randomIntBetween = (min, max) =>
  Math.round((max - min) * Math.random() + min);

const pick = (prop) => (obj) => obj[prop];

// DOM Node Refs
const statusButtonNode = document.querySelector('.game-status');
const mineCountNode = document.querySelector('.mine-count');
const gameTimerNode = document.querySelector('.game-timer');
const boardNode = document.querySelector('.game');

statusButtonNode.addEventListener('click', initializeGame);
statusButtonNode.addEventListener('mousedown', (e) => {
  statusButtonNode.classList.add('depressed');
});
statusButtonNode.addEventListener('mouseout', (e) => {
  statusButtonNode.classList.remove('depressed');
});
statusButtonNode.addEventListener('mouseup', () => {
  statusButtonNode.classList.remove('depressed');
});

// Timer -- VIEW SHOULD BE HANDLING ALL OF THIS LOGIC
const timer = {
  startTime: null,
  endTime: null,
  intervalRef: null,
  clearInterval: false,
  reset() {
    this.startTime = null;
    this.endTime = null;
    clearInterval(this.intervalRef);
    this.intervalRef = null;

    gameTimerNode.textContent = '000';
  },
  start() {
    //only start once
    if (this.startTime) return;
    this.startTime = new Date().getTime();
    this.endTime = null;

    this.intervalRef = setInterval(() => {
      const seconds = this.getSeconds();
      gameTimerNode.textContent = String(seconds).padStart(3, '0');
      if (this.endTime) clearInterval(this.intervalRef);
    }, 100);
  },
  getSeconds() {
    if (!this.startTime) return 0;

    return Math.trunc(
      ((this.endTime ? this.endTime : new Date().getTime()) - this.startTime) /
        1000
    );
  },
  stop() {
    this.endTime = new Date().getTime();
  },
};

const getRandomNonRepeatingCords = (count, maxCord, cords = new Set()) => {
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

// forEachNeighborCell :: [[]] => CellCords => fn => undefined
const forEachNeighborCell = (board, cellCords, fn) => {
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

const incMineCount = ({ value, y, x, isMine }, board) => {
  if (isMine) return;
  board[y][x].value += 1;
};

const createCell = ({
  value = 0,
  x,
  y,
  isMine = false,
  isExposed = false,
  isFlagged = false,
  isHit = false,
  ...rest
} = {}) => {
  if (x === undefined || y === undefined)
    throw Error('Must Provide Cords to cell!');

  return { value, x, y, isMine, isExposed, isFlagged, isHit, ...rest };
};

const generateBoard = (size, mineLocations) => {
  //build 2d array with mines placed and touching mine count
  const board = new Array(size).fill(null).map((_, y, a) =>
    a.map((_, x) => {
      const cell = createCell({
        isMine: mineLocations.some((mine) => mine.x === x && mine.y === y),
        x,
        y,
      });
      cell.cellNode = createCellNode(cell);

      return cell;
    })
  );

  // **Mutates board adding mine neighbor count
  mineLocations.forEach((mine) =>
    forEachNeighborCell(board, mine, incMineCount)
  );

  return board;
};

// MODEL

const IDLE = 'idle';
const PLAYING = 'playing';
const LOSS = 'loss';
const WON = 'won';

const state = {
  status: IDLE,
  board: undefined,
  timer: 0,
};

// VIEW
const createCellRowNode = () => {
  const rowNode = document.createElement('div');
  rowNode.classList.add('row');
  return rowNode;
};

const toggleFlag = (cell) => (board) => {
  state.board[cell.y][cell.x] = { ...cell, isFlagged: !cell.isFlagged };
};

const toggleDepress = (on) => (cell) =>
  on && !cell.isExposed
    ? cell.cellNode.classList.add('depressed')
    : cell.cellNode.classList.remove('depressed');

function createCellNode({ y, x }) {
  const cellNode = document.createElement('div');
  cellNode.classList.add('cell');
  cellNode.addEventListener('mousedown', (e) => {
    if (!(state.status === IDLE || state.status === PLAYING) || e.ctrlKey)
      return;
    const cell = state.board[y][x];
    if (e.shiftKey) {
      forEachNeighborCell(state.board, cell, toggleDepress(true));
      statusButtonNode.dataset.state = 'depressed';
    }

    if (e.button !== 0 || cell.isFlagged || cell.isExposed) return;
    cellNode.classList.add('depressed');
    statusButtonNode.dataset.state = 'depressed';
  });
  cellNode.addEventListener('mouseout', (e) => {
    if (!(state.status === IDLE || state.status === PLAYING)) return;

    const cell = state.board[y][x];

    cellNode.classList.remove('depressed');
    forEachNeighborCell(state.board, cell, toggleDepress(false));
    statusButtonNode.dataset.state = '';
  });
  cellNode.addEventListener('mouseup', () => {
    if (!(state.status === IDLE || state.status === PLAYING)) return;

    const cell = state.board[y][x];
    cellNode.classList.remove('depressed');
    forEachNeighborCell(state.board, cell, toggleDepress(false));
    statusButtonNode.dataset.state = '';
  });
  cellNode.addEventListener('contextmenu', (e) => {
    if (!(state.status === IDLE || state.status === PLAYING)) return;
    if (state.status === IDLE) state.status = PLAYING;
    const cell = state.board[y][x];
    e.preventDefault();
    if (cell.isExposed) return;
    toggleFlag(cell)(state.board);
    render(state);
    setTimer(state.status);
  });
  cellNode.addEventListener('click', (e) => {
    if (!(state.status === IDLE || state.status === PLAYING)) return;
    if (state.status === IDLE) state.status = PLAYING;

    const cell = state.board[y][x];

    if (cell.isExposed && !e.shiftKey) return;

    if (e.shiftKey) {
      // shift click force all neighbors (even mines)
      exposeCell(cell, state.board, true);
    } else if (e.ctrlKey) {
      //flag cell
      console.log(cell);
      toggleFlag(cell)(state.board);
    } else if (!cell.isFlagged) {
      // expose cell

      exposeCell(cell, state.board);
    }

    const isExposedMine = state.board
      .flat()
      .some((cell) => cell.isExposed && cell.isMine);

    if (isExposedMine) {
      state.status = LOSS;

      exposeRemainingMines(state);
    } else {
      // check for win
      const exposedNonMineCount = (total, cell) =>
        cell.isExposed || cell.isMine ? total : 1 + total;
      const remainingNonMines = reduceCells(
        exposedNonMineCount,
        0
      )(state.board);

      if (remainingNonMines === 0) {
        state.status = WON;
        exposeRemainingMines(state);
      }
    }
    render(state);
    setTimer(state.status);
  });
  return cellNode;
}

function exposeRemainingMines(state) {
  state.mineLocations.forEach(({ y, x }) => {
    const cell = state.board[y][x];
    if (!cell.isExposed) state.board[y][x] = { ...cell, isExposed: true };
  });
}

function setTimer(status) {
  switch (status) {
    case IDLE:
      timer.reset();
      break;
    case PLAYING:
      timer.start();
      break;
    case LOSS:
    case WON:
      timer.stop();
      break;

    default:
      throw Error(`setTimer: Unknown Status: ${status}`);
      break;
  }
}

const initializeView = (boardNode, state) => {
  const { board } = state;
  const rowNodes = board.map((row) => {
    const rowNode = createCellRowNode();
    const cells = row.map(pick('cellNode'));
    rowNode.append(...cells);

    return rowNode;
  });
  boardNode.replaceChildren(...rowNodes);
};

const forEachCell = (fn) => (board) => board.flat().forEach(fn);
const reduceCells = (reducer, initialState) => (board) =>
  board.flat().reduce(reducer, initialState);

function render(state) {
  const { board, lastRender, mineCount } = state;

  // Render Cell State
  forEachCell((cell) => {
    //only render cells that have changed
    if (lastRender.has(cell)) return;

    lastRender.set(cell, true);

    const { cellNode, isExposed, value, isMine, isHit, isFlagged } = cell;

    if (isExposed) {
      cellNode.classList.add('exposed');
      cellNode.dataset.value = isMine ? (isHit ? 'mine hit' : 'mine') : value;
    } else {
      cellNode.dataset.value = isFlagged ? 'flag' : '';
    }
  })(board);

  // Flagged mine counter
  const totalFlags = (total, cell) => (cell.isFlagged ? total + 1 : total);

  const unflaggedMines = mineCount - reduceCells(totalFlags, 0)(board);

  mineCountNode.textContent = String(
    unflaggedMines > 0 ? unflaggedMines : 0
  ).padStart(3, '0');

  //

  statusButtonNode.dataset.state = state.status;
}

function exposeCell(cell, board, forceAllNeighbors = false) {
  if ((cell.isFlagged || cell.isExposed) && !forceAllNeighbors) return;
  board[cell.y][cell.x] = { ...cell, isExposed: true, isHit: cell.isMine };
  if (cell.isMine) return;
  if (cell.value === 0 || forceAllNeighbors)
    return forEachNeighborCell(board, cell, exposeCell);
}

const moveReducer = (board, clickCordsAndButton) => {
  //return nextBoard
};

function initializeGame() {
  timer.reset();
  state.status = IDLE;
  state.alreadyStarted = false;
  const size = 10;
  state.mineCount = 10;
  state.lastRender = new WeakMap();
  state.mineLocations = getRandomNonRepeatingCords(state.mineCount, size);
  state.board = generateBoard(size, state.mineLocations);
  initializeView(boardNode, state);
  render(state);
  setTimer(state.status);
}

initializeGame();
