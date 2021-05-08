import {
  depressThisCell,
  exposeThisCell,
  exposeThisCellAmdNeighbors,
  gameOver,
  initializeBoard,
  startGame,
  toggleFlag,
  unpressCells,
} from './actions.js';
// utility function
import { getRandomNonRepeatingCords, reduceCells } from './utils.js';

import { Store } from './store.js';
import { View } from './view.js';

// Constant settings
const size = 10;
const mineCount = 10;
const IDLE = 'idle';
const LOSS = 'loss';
const WON = 'won';

// MODEL
const store = new Store();

const initializeStore = () => {
  store.dispatch(
    initializeBoard(getRandomNonRepeatingCords(mineCount, size), size)
  );
};

initializeStore();

// helper
const getCellAndStateAndIsGameOver = ({ y, x }) => {
  const state = store.getState();

  return {
    ...state,
    cell: state.board[y][x],
    isGameOver: state.status === WON || state.status === LOSS,
  };
};

const checkGameOver = () => {
  const { board } = store.getState();
  const { allNonMinesExposed, hitMine } = reduceCells(
    (acc, cell) => ({
      allNonMinesExposed: acc.allNonMinesExposed
        ? cell.isExposed || cell.isMine
        : acc.allNonMinesExposed,
      hitMine: acc.hitMine ? true : cell.isMine && cell.isExposed,
    }),
    {
      allNonMinesExposed: true,
      hitMine: false,
    }
  )(board);

  //LOSE
  if (hitMine) return store.dispatch(gameOver(false, new Date().getTime()));

  // WIN
  if (allNonMinesExposed)
    return store.dispatch(gameOver(true, new Date().getTime()));
};

// Click Handlers

const handleCellClick = (e, cords) => {
  const { cell, status, isGameOver } = getCellAndStateAndIsGameOver(cords);
  if (isGameOver || cell.isExposed || cell.isFlagged) return;

  if (status === IDLE) store.dispatch(startGame(new Date()));

  store.dispatch(exposeThisCell(cell));

  checkGameOver();
};

const handleCellRightClick = (e, cords) => {
  e.preventDefault();
  const { cell, isGameOver, status } = getCellAndStateAndIsGameOver(cords);

  if (isGameOver || cell.isExposed) return;

  if (status === IDLE) store.dispatch(startGame(new Date()));
  store.dispatch(toggleFlag(cell));
};

const handleCellCtrlClick = (e, cords) => {
  const { cell, isGameOver, status } = getCellAndStateAndIsGameOver(cords);
  if (isGameOver || cell.isExposed) return;

  if (status === IDLE) store.dispatch(startGame(new Date()));
  store.dispatch(toggleFlag(cell));
};

const handleCellShiftClick = (e, cords) => {
  const { cell, isGameOver, status } = getCellAndStateAndIsGameOver(cords);
  if (isGameOver) return;

  if (status === IDLE) store.dispatch(startGame(new Date()));
  store.dispatch(exposeThisCellAmdNeighbors(cell));

  checkGameOver();
};

// Bonus handlers for depress Animation
const handleCellMouseup = (e, cords) => {
  const { isGameOver, depressedCells } = getCellAndStateAndIsGameOver(cords);
  if (isGameOver || !depressedCells.length) return;
  store.dispatch(unpressCells());
};

const handleCellMouseout = (e, cords) => {
  const { isGameOver, depressedCells } = getCellAndStateAndIsGameOver(cords);
  if (isGameOver || !depressedCells.length) return;

  store.dispatch(unpressCells());
};

const handleCellMousedown = (e, cords) => {
  const { cell, isGameOver, status } = getCellAndStateAndIsGameOver(cords);

  if (isGameOver || e.button !== 0 || e.ctrlKey) return;

  store.dispatch(depressThisCell(cell, e.shiftKey));
};

// VIEW
const view = new View(size);

store.subscribe(view.render);

view
  .bindEvent('statusButtonClick', initializeStore)
  .bindEvent('cellClick', handleCellClick)
  .bindEvent('cellCtrlClick', handleCellCtrlClick)
  .bindEvent('cellShiftClick', handleCellShiftClick)
  .bindEvent('cellRightClick', handleCellRightClick)
  .bindEvent('cellMousedown', handleCellMousedown)
  .bindEvent('cellMouseout', handleCellMouseout)
  .bindEvent('cellMouseup', handleCellMouseup);
