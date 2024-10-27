const boxes = document.querySelectorAll('.box');
const turnBoxes = document.querySelectorAll('.turn-box');
const resultDisplay = document.getElementById('results');
const playAgainBtn = document.getElementById('play-again');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const playerScoreDisplay = document.getElementById('player-score');
const aiScoreDisplay = document.getElementById('ai-score');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let difficulty = 'easy';
let playerScore = 0;
let aiScore = 0;

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    resultDisplay.textContent = '';
    boxes.forEach(box => {
        box.innerHTML = '';
        box.style.backgroundColor = '';
    });
    updateTurnDisplay();
}

function updateTurnDisplay() {
    turnBoxes.forEach(box => box.style.backgroundColor = '');
    const activeBox = currentPlayer === 'X' ? turnBoxes[0] : turnBoxes[1];
    activeBox.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark');
}

function handleClick(e) {
    const box = e.target;
    const index = box.dataset.index;

    if (gameBoard[index] !== '' || !gameActive) return;

    gameBoard[index] = currentPlayer;
    box.innerHTML = currentPlayer === 'X' 
        ? '<i class="fas fa-seedling"></i>' 
        : '<i class="fas fa-biohazard"></i>';
    
    if (checkWin()) {
        endGame(`${currentPlayer} Wins!`);
        currentPlayer === 'X' ? playerScore++ : aiScore++;
        updateScore();
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();

    if (currentPlayer === 'O') {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let move;
    switch (difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            break;
        case 'hard':
            move = getBestMove();
            break;
    }
    gameBoard[move] = 'O';
    boxes[move].innerHTML = '<i class="fas fa-biohazard"></i>';
    
    if (checkWin()) {
        endGame('O Wins!');
        aiScore++;
        updateScore();
        return;
    }

    if (checkDraw()) {
        endGame("It's a Draw!");
        return;
    }

    currentPlayer = 'X';
    updateTurnDisplay();
}

function getRandomMove() {
    const emptyBoxes = gameBoard.reduce((acc, val, index) => {
        if (val === '') acc.push(index);
        return acc;
    }, []);
    return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinForPlayer('O')) return 10 - depth;
    if (checkWinForPlayer('X')) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === currentPlayer);
    });
}

function checkWinForPlayer(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === player);
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function endGame(message) {
    gameActive = false;
    resultDisplay.textContent = message;
}

function updateScore() {
    playerScoreDisplay.textContent = playerScore;
    aiScoreDisplay.textContent = aiScore;
}

function setDifficulty(e) {
    difficulty = e.target.dataset.difficulty;
    difficultyBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    startGame();
}

boxes.forEach(box => box.addEventListener('click', handleClick));
playAgainBtn.addEventListener('click', startGame);
difficultyBtns.forEach(btn => btn.addEventListener('click', setDifficulty));

startGame();
