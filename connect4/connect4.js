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
    const col = Number(event.target.dataset.col);
    for (let row = rows - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            console.log(`Placed ${currentPlayer} at (${row}, ${col})`);
            console.log("Current board state:", board);
            updateBoard(row, col);
            if (checkWin(row, col)) {
                message.innerText = `${currentPlayer = currentPlayer === 'red' ? 'player1' : 'player2'} Wins!`;
                endGame();
                return;
            }
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            if (currentPlayer == 'red'){
              message.innerText = `it is currently Player1's turn!`;
            } else {
              message.innerText = `it is currently Player2's turn!`;
            }
            return;
        }
    }
}

function updateBoard(row, col) {
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(currentPlayer);
}

function checkWin(row, col) {
    console.log(`Checking win at (${row}, ${col}) for ${currentPlayer}`);
    return (
        checkDirection(row, col, 0, 1) ||  // Horizontal
        checkDirection(row, col, 1, 0) ||  // Vertical
        checkDirection(row, col, 1, 1) ||  // Diagonal /
        checkDirection(row, col, 1, -1)    // Diagonal \
    );
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
  
    count += countInDirection(row, col, rowDir, colDir);
    count += countInDirection(row, col, -rowDir, -colDir);
  
    console.log(`Direction (${rowDir}, ${colDir}): Total Count = ${count} for ${currentPlayer}`);
    return count >= 4;
}

function countInDirection(row, col, rowDir, colDir) {
    let consecutive = 0;
    for (let i = 1; i < 4; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
    
        if (r < 0 || r >= rows || c < 0 || c >= columns) {
            console.log(`Out of bounds at (${r}, ${c})`);
            break;
        }
    
        if (board[r][c] !== currentPlayer) {
            console.log(`No match at (${r}, ${c}) - found ${board[r][c]} instead of ${currentPlayer}`);
            break;
        }
        consecutive++;
    }
  
    console.log(`countInDirection for ${currentPlayer}: ${consecutive} consecutive cells`);
    return consecutive;
}

function endGame() {
  Array.from(document.querySelectorAll('.cell')).forEach(cell =>
    cell.removeEventListener('click', handleCellClick)
  );
  gameBoard.classList.add('over');
}

function resetGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    currentPlayer = 'red';
    gameBoard.classList.remove('over');
    message.innerText = '';
    Array.from(document.querySelectorAll('.cell')).forEach(cell => {
      cell.classList.remove('red', 'yellow');
      cell.removeEventListener('click', handleCellClick);  // Reset events to prevent issues
      cell.addEventListener('click', handleCellClick);
    });
}
  
createBoard();