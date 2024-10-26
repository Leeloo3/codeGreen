// script.js

const columns = 7;
const rows = 6;
let currentPlayer = 'red';
let board = Array.from({ length: rows }, () => Array(columns).fill(null));
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');

function createBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
}

function handleCellClick(event) {
  const col = event.target.dataset.col;
  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      updateBoard(row, col);
      if (checkWin(row, col)) {
        message.innerText = `${currentPlayer.toUpperCase()} Wins!`;
        endGame();
        return;
      }
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      return;
    }
  }
}

function updateBoard(row, col) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(currentPlayer);
}

function checkWin(row, col) {
  return (
    checkDirection(row, col, 1, 0) || // Horizontal
    checkDirection(row, col, 0, 1) || // Vertical
    checkDirection(row, col, 1, 1) || // Diagonal /
    checkDirection(row, col, 1, -1)   // Diagonal \
  );
}

function checkDirection(row, col, rowDir, colDir) {
  let count = 1;
  for (let i = 1; i < 4; i++) {
    if (board[row + i * rowDir]?.[col + i * colDir] === currentPlayer) count++;
    else break;
  }
  for (let i = 1; i < 4; i++) {
    if (board[row - i * rowDir]?.[col - i * colDir] === currentPlayer) count++;
    else break;
  }
  return count >= 4;
}

function endGame() {
  Array.from(document.querySelectorAll('.cell')).forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
}

function resetGame() {
  board = Array.from({ length: rows }, () => Array(columns).fill(null));
  currentPlayer = 'red';
  message.innerText = '';
  Array.from(document.querySelectorAll('.cell')).forEach(cell => {
    cell.classList.remove('red', 'yellow');
    cell.addEventListener('click', handleCellClick);
  });
}

createBoard();
