type Player = 'X' | 'O' | null;
type Difficulty = 'easy' | 'medium' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const checkWinner = (
  board: Player[]
): { winner: Player | 'draw'; line?: number[] } | null => {
  // Check for winner
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }

  // Check for draw
  if (!board.includes(null)) {
    return { winner: 'draw' };
  }

  return null;
};

const getEmptyCells = (board: Player[]): number[] => {
  return board.reduce<number[]>((cells, cell, index) => {
    if (cell === null) cells.push(index);
    return cells;
  }, []);
};

const minimax = (
  board: Player[],
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: number } => {
  const result = checkWinner(board);

  if (result) {
    if (result.winner === 'O') return { score: 10 - depth };
    if (result.winner === 'X') return { score: depth - 10 };
    if (result.winner === 'draw') return { score: 0 };
  }

  if (depth === 0) {
    return { score: 0 };
  }

  const emptyCells = getEmptyCells(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove: number | undefined;

    for (const cell of emptyCells) {
      board[cell] = 'O';
      const { score } = minimax(board, depth - 1, false, alpha, beta);
      board[cell] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }

      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }

    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove: number | undefined;

    for (const cell of emptyCells) {
      board[cell] = 'X';
      const { score } = minimax(board, depth - 1, true, alpha, beta);
      board[cell] = null;

      if (score < bestScore) {
        bestScore = score;
        bestMove = cell;
      }

      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }

    return { score: bestScore, move: bestMove };
  }
};

export const getAIMove = (board: Player[], difficulty: Difficulty): number | null => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;

  // Easy: Random moves with 70% chance, smart move 30%
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  // Medium: Depth 2 minimax
  const depth = difficulty === 'hard' ? 6 : 2;
  const { move } = minimax(board.slice(), depth, true);
  return move ?? emptyCells[0];
};