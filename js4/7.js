//utility function
const randomIntBetween = (min, max) =>
  Math.round((max - min) * Math.random() + min);

const initialState = {
  selecting: false,
  x: 0,
  y: 0,
  x2: 0,
  y2: 0,
};

const MINE = 'M';

const getRandomNonRepeatingCords = (count, boardSize, cords = new Set()) => {
  if (cords.size === count)
    return [...cords].map((cordString) => {
      const [x, y] = cordString.split(',').map(Number);
      return { x, y };
    });

  const cordString = `${randomIntBetween(0, size - 1)},${randomIntBetween(
    0,
    size - 1
  )}`;

  return getRandomNonRepeatingCords(count, boardSize, cords.add(cordString));
};

const forEachCell = (board, fn) => {};

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
} = {}) => {
  if (x === undefined || y === undefined)
    throw Error('Must Provide Cords to cell!');

  return { value, x, y, isMine, isExposed, isFlagged };
};

const generateBoard = (size, mineLocations) => {
  //build 2d array with mines placed and touching mine count
  console.log(mineLocations);
  const board = new Array(size).fill(null).map((_, y, a) =>
    a.map((_, x) =>
      createCell({
        isMine: mineLocations.some((mine) => mine.x === x && mine.y === y),
        x,
        y,
      })
    )
  );

  // **Mutates board adding mine neighbor count
  mineLocations.forEach((mine) =>
    forEachNeighborCell(board, mine, incMineCount)
  );

  return board;
};

const size = 10;
const mineCount = 10;
const mineLocations = getRandomNonRepeatingCords(mineCount, size);
const board = generateBoard(size, mineLocations);

console.log({ mineLocations, board });

const createCellRowNode = () => {
  const rowNode = document.createElement('div');
  rowNode.classList.add('row');
  return rowNode;
};

function createCellNode(cell) {
  const cellNode = document.createElement('div');
  cellNode.classList.add('cell');
  cellNode.addEventListener('mousedown', (e) => {
    e.preventDefault();
    // console.log('mousedown');
    cellNode.classList.add('depressed');
  });
  cellNode.addEventListener('mouseout', () => {
    if (cell.isExposed || cell.isFlagged) return;
    cellNode.classList.remove('depressed');
  });
  cellNode.addEventListener('mouseup', () => {
    // console.log('mouseup');
    cellNode.classList.remove('depressed');
  });
  cellNode.addEventListener('click', (e) => {
    e.preventDefault();
    if (cell.isExposed) return;
    console.log(e.button);
    if (e.button === 2) {
      //toggle flag
      cell.isFlagged = !cell.isFlagged;
      cell.dataset.value = cell.isFlagged ? 'flag' : '';
      return;
    }
    cellNode.classList.add('exposed');
    console.log(cell.isMine, cell);
    cellNode.dataset.value = cell.isMine ? 'mine hit' : cell.value;
  });
  return cellNode;
}

const initializeView = (boardNode, board) => {
  const rowNodes = board.map((row) => {
    const rowNode = createCellRowNode();
    const cells = row.map(createCellNode);
    rowNode.append(...cells);

    return rowNode;
  });
  boardNode.replaceChildren(...rowNodes);
};

const boardNode = document.querySelector('.game');
initializeView(boardNode, board);

function masterClickHandler(cell) {
  console.log('master', cell);

  if (cell.isExposed) return;
}

const renderBoard = (board) => {
  //set data-value for exposed cells
};

const exposeCell = (board, cellCords) => {
  const { x, y } = cellCords;

  const cellState = board;
};

const moveReducer = (board, clickCordsAndButton) => {
  //return nextBoard
};

const isGameOver = (board) => {
  // return 1 of 4 states
};
