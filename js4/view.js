import { forEachCell, reduceCells } from './utils.js';

export class View {
  constructor(size) {
    this.createCellNode = this.createCellNode.bind(this);
    this.render = this.render.bind(this);

    // DOM Refs
    this.statusButtonNode = document.querySelector('.game-status');
    this.mineCountNode = document.querySelector('.mine-count');
    this.gameTimerNode = document.querySelector('.game-timer');
    this.boardNode = document.querySelector('.game');

    // Add Event Listeners (more in createCellNode)
    this.statusButtonNode.addEventListener('click', () =>
      this._handleStatusButtonClick()
    );
    this.statusButtonNode.addEventListener('mousedown', (e) => {
      this.statusButtonNode.classList.add('depressed');
    });
    this.statusButtonNode.addEventListener('mouseout', (e) => {
      this.statusButtonNode.classList.remove('depressed');
    });
    this.statusButtonNode.addEventListener('mouseup', () => {
      this.statusButtonNode.classList.remove('depressed');
    });

    // Development debugging helper
    function placeHolder(e) {
      console.log('unbound event handler!!', e.type);
    }
    // Must be rebound with bindEvent Method!
    this._handleStatusButtonClick = placeHolder;
    this._handleCellClick = placeHolder;
    this._handleCellCtrlClick = placeHolder;
    this._handleCellShiftClick = placeHolder;
    this._handleCellRightClick = placeHolder;
    this._handleCellMousedown = placeHolder;
    this._handleCellMouseout = placeHolder;
    this._handleCellMouseup = placeHolder;

    this.timerRef = null;

    // Create and Append Cell Nodes
    this._cellNodes = new Array(size)
      .fill(null)
      .map((_, y, a) => a.map((_, x) => this.createCellNode({ y, x })));

    const rowNodes = this._cellNodes.map((row) => {
      const rowNode = this.createCellRowNode();
      rowNode.append(...row);

      return rowNode;
    });
    this.boardNode.replaceChildren(...rowNodes);
  }
  createCellRowNode() {
    const rowNode = document.createElement('div');
    rowNode.classList.add('row');
    return rowNode;
  }
  createCellNode({ y, x }) {
    const cellNode = document.createElement('div');
    cellNode.classList.add('cell');
    cellNode.addEventListener('mousedown', (e) =>
      this._handleCellMousedown(e, { x, y }, cellNode)
    );
    cellNode.addEventListener('mouseout', (e) =>
      this._handleCellMouseout(e, { y, x }, cellNode)
    );
    cellNode.addEventListener('mouseup', (e) =>
      this._handleCellMouseup(e, { y, x }, cellNode)
    );
    cellNode.addEventListener('contextmenu', (e) => {
      this._handleCellRightClick(e, { y, x }, cellNode);
    });
    cellNode.addEventListener('click', (e) => {
      if (e.ctrlKey) {
        this._handleCellCtrlClick(e, { y, x }, cellNode);
      } else if (e.shiftKey) {
        this._handleCellShiftClick(e, { y, x }, cellNode);
      } else {
        this._handleCellClick(e, { y, x }, cellNode);
      }
    });
    return cellNode;
  }
  renderTime(time) {
    // Initial state
    if (!time.start && !time.end) {
      clearInterval(this.timerRef);
      this.timerRef = null;
      this.gameTimerNode.textContent = '000';
      return;
    }
    // Game Started first render
    if (time.start && !this.timerRef) {
      this.timerRef = setInterval(() => {
        this.renderTime({ start: time.start, end: null });
      }, 200);
    }

    // Timer Tick
    const seconds = Math.trunc(
      ((time.end || new Date().getTime()) - time.start) / 1000
    );

    // Set Node Value
    this.gameTimerNode.textContent =
      seconds > 999 ? '999' : String(seconds).padStart(3, '0');

    // Check Game Over
    if (time.start && time.end) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  render(prevState, state) {
    const { board, mineCount, status, time, depressedCells } = state;
    const cellNodes = this._cellNodes;

    // TIME
    if (prevState.time !== time) this.renderTime(time);

    // CELL DEPRESSION
    prevState.depressedCells.forEach(({ y, x }) => {
      cellNodes[y][x].classList.remove('depressed');
    });
    state.depressedCells.forEach((cell) => {
      if (!(cell.isExposed || cell.isFlagged))
        cellNodes[cell.y][cell.x].classList.add('depressed');
    });

    // CELLS
    forEachCell((cell) => {
      // Do not render unchanged cells
      if (cell === prevState.board[cell.y][cell.x]) return;

      const cellNode = cellNodes[cell.y][cell.x];

      const { isExposed, value, isMine, isHit, isFlagged } = cell;

      // Data-value
      if (isExposed) {
        cellNode.classList.add('exposed');
        cellNode.dataset.value = isMine ? (isHit ? 'mine hit' : 'mine') : value;
      } else {
        cellNode.classList.remove('exposed');
        cellNode.dataset.value = isFlagged ? 'flag' : '';
      }
    })(board);

    // Flag Count
    const totalFlags = (total, cell) => (cell.isFlagged ? total + 1 : total);

    const unflaggedMines = mineCount - reduceCells(totalFlags, 0)(board);

    this.mineCountNode.textContent = String(
      unflaggedMines > 0 ? unflaggedMines : 0
    ).padStart(3, '0');

    //
    // STATUS BUTTON
    this.statusButtonNode.dataset.state = depressedCells.length
      ? 'depressed'
      : status;
  }

  /**
   * @typedef {"statusButtonClick" | "cellClick" | "cellCtrlClick" | "cellShiftClick" |
   * "cellRightClick" | "cellMousedown" | "cellMouseout" | "cellMouseup" } ViewEventType
   */
  /**
   * Registers viewEvent handlers.
   * @param {ViewEventType} eventName
   * @param {function} handler
   */
  bindEvent(eventName, handler) {
    switch (eventName) {
      case 'statusButtonClick':
        this._handleStatusButtonClick = handler;
        break;
      case 'cellClick':
        this._handleCellClick = handler;
        break;
      case 'cellCtrlClick':
        this._handleCellCtrlClick = handler;
        break;
      case 'cellShiftClick':
        this._handleCellShiftClick = handler;
        break;
      case 'cellRightClick':
        this._handleCellRightClick = handler;
        break;
      case 'cellMousedown':
        this._handleCellMousedown = handler;
        break;
      case 'cellMouseout':
        this._handleCellMouseout = handler;
        break;
      case 'cellMouseup':
        this._handleCellMouseup = handler;
        break;
      default:
        throw Error(`Invalid eventName: ${eventName} `);
    }

    return this;
  }
}
