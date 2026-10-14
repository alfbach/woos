(() => {
  const HUMAN = "X";
  const COMPUTER = "O";
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const CORNERS = [0, 2, 6, 8];
  const CENTER = 4;
  const AI_DELAY_MS = 300;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("reset");
  const cells = Array.from(document.querySelectorAll(".cell"));

  /** @type {(null | 'X' | 'O')[]} */
  let board = Array(9).fill(null);
  let gameActive = true;
  let aiPending = false;

  function checkWinner(state) {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return { winner: state[a], line };
      }
    }
    if (state.every((cell) => cell !== null)) {
      return { winner: "draw", line: null };
    }
    return null;
  }

  function findWinningMove(state, player) {
    for (let i = 0; i < 9; i++) {
      if (state[i] !== null) continue;
      const next = state.slice();
      next[i] = player;
      const result = checkWinner(next);
      if (result && result.winner === player) return i;
    }
    return null;
  }

  function pickComputerMove(state) {
    const win = findWinningMove(state, COMPUTER);
    if (win !== null) return win;

    const block = findWinningMove(state, HUMAN);
    if (block !== null) return block;

    if (state[CENTER] === null) return CENTER;

    const freeCorners = CORNERS.filter((i) => state[i] === null);
    if (freeCorners.length > 0) {
      return freeCorners[Math.floor(Math.random() * freeCorners.length)];
    }

    const free = [];
    for (let i = 0; i < 9; i++) {
      if (state[i] === null) free.push(i);
    }
    return free[Math.floor(Math.random() * free.length)];
  }

  function setStatus(text, kind = "") {
    statusEl.textContent = text;
    statusEl.classList.remove("is-win", "is-loss", "is-draw");
    if (kind) statusEl.classList.add(kind);
  }

  function render(lastIndex = null, winLine = null) {
    cells.forEach((cell, i) => {
      const mark = board[i];
      cell.textContent = mark ?? "";
      cell.classList.toggle("mark-x", mark === HUMAN);
      cell.classList.toggle("mark-o", mark === COMPUTER);
      cell.classList.toggle("win", winLine !== null && winLine.includes(i));
      cell.disabled = !gameActive || mark !== null || aiPending;

      if (i === lastIndex) {
        cell.classList.remove("pop");
        // restart animation
        void cell.offsetWidth;
        cell.classList.add("pop");
      }
    });
  }

  function endGame(result) {
    gameActive = false;
    aiPending = false;
    if (result.winner === HUMAN) {
      setStatus("Du gewinnst", "is-win");
    } else if (result.winner === COMPUTER) {
      setStatus("Computer gewinnt", "is-loss");
    } else {
      setStatus("Unentschieden", "is-draw");
    }
    render(null, result.line);
  }

  function makeMove(index, player) {
    if (!gameActive || board[index] !== null) return false;
    board[index] = player;
    return true;
  }

  function afterHumanMove() {
    const result = checkWinner(board);
    if (result) {
      endGame(result);
      return;
    }

    aiPending = true;
    setStatus("Computer denkt…");
    render();

    setTimeout(() => {
      if (!gameActive) return;
      const move = pickComputerMove(board);
      makeMove(move, COMPUTER);
      aiPending = false;

      const aiResult = checkWinner(board);
      if (aiResult) {
        endGame(aiResult);
        return;
      }

      setStatus("Dein Zug");
      render(move);
    }, AI_DELAY_MS);
  }

  function onCellClick(event) {
    const cell = event.target.closest(".cell");
    if (!cell || !gameActive || aiPending) return;

    const index = Number(cell.dataset.index);
    if (!makeMove(index, HUMAN)) return;

    render(index);
    afterHumanMove();
  }

  function reset() {
    board = Array(9).fill(null);
    gameActive = true;
    aiPending = false;
    setStatus("Dein Zug");
    cells.forEach((cell) => cell.classList.remove("pop", "win", "mark-x", "mark-o"));
    render();
  }

  boardEl.addEventListener("click", onCellClick);
  resetBtn.addEventListener("click", reset);
  render();
})();
