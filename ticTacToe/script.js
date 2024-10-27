import questions from './questions.js';

const boxes = document.querySelectorAll('.box');
const turnBoxes = document.querySelectorAll('.turn-box');
const resultDisplay = document.getElementById('results');
const playAgainBtn = document.getElementById('play-again');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const playerScoreDisplay = document.getElementById('player-score');
const aiScoreDisplay = document.getElementById('ai-score');

const quizPopup = document.getElementById('quiz-popup');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const submitAnswer = document.getElementById('submit-answer');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let difficulty = 'easy';
let playerScore = 0;
let wasteScore = 0;

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

let currentQuestion = null;
let quizAnswered = false;
let canMove = false;

let selectedBox = null;

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
    quizAnswered = false;
    canMove = false;
}

function updateTurnDisplay() {
    turnBoxes.forEach(box => {
        box.style.backgroundColor = '';
        box.style.color = '';
    });
    const activeBox = currentPlayer === 'X' ? turnBoxes[0] : turnBoxes[1];
    activeBox.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    activeBox.style.color = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
}

function handleClick(e) {
  console.log("Box clicked");
  const box = e.target;
  const index = box.dataset.index;

  if (gameBoard[index] !== '' || !gameActive) {
    console.log("Invalid move");
    return;
  }

  console.log("Valid move, showing quiz popup");
  selectedBox = box;
  showQuizPopup();
}

function wasteMove() {
    let move;
    let delay;
    switch (difficulty) {
        case 'easy':
            move = getRandomMove();
            delay = 2000; // 2 seconds
            break;
        case 'medium':
            move = Math.random() < 0.5 ? getBestMove() : getRandomMove();
            delay = 1000; // 1 second
            break;
        case 'hard':
            move = getBestMove();
            delay = 500; // Keep the original 500ms delay for hard
            break;
    }
    
    setTimeout(() => {
        gameBoard[move] = 'O';
        boxes[move].innerHTML = '<i class="fas fa-biohazard"></i>';
        
        if (checkWin()) {
            endGame('Waste Wins :,(');
            wasteScore++;
            updateScore();
            return;
        }

        if (checkDraw()) {
            endGame("It's a Draw!");
            return;
        }

        currentPlayer = 'X';
        updateTurnDisplay();
    }, delay);
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
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('waste-score').textContent = wasteScore;
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

function showQuizPopup() {
  console.log("Showing quiz popup");
  currentQuestion = getRandomQuestion();
  quizQuestion.textContent = currentQuestion.question;
  quizOptions.innerHTML = '';
  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => selectOption(index));
    quizOptions.appendChild(button);
  });
  quizPopup.style.display = 'flex';
  submitAnswer.disabled = false;
}

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function selectOption(index) {
  const options = quizOptions.getElementsByTagName('button');
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove('selected');
  }
  options[index].classList.add('selected');
}

submitAnswer.addEventListener('click', () => {
  const selectedOption = quizOptions.querySelector('.selected');
  if (selectedOption) {
    const selectedIndex = Array.from(quizOptions.children).indexOf(selectedOption);
    submitAnswer.disabled = true; // Prevent multiple submissions

    if (selectedIndex === currentQuestion.correctAnswer) {
      quizQuestion.textContent = "Correct! Making your move.";
      setTimeout(() => {
        quizPopup.style.display = 'none';
        makeMove(selectedBox);
      }, 1500);
    } else {
      quizQuestion.textContent = "Incorrect. Try another question.";
      setTimeout(() => {
        showQuizPopup(); // Show a new question if the answer is incorrect
      }, 1500);
    }
  }
});

function makeMove(box) {
  const index = box.dataset.index;
  gameBoard[index] = currentPlayer;
  box.innerHTML = currentPlayer === 'X' ? '<i class="fas fa-seedling"></i>' : '<i class="fas fa-biohazard"></i>';
  box.style.backgroundColor = currentPlayer === 'X' ? getComputedStyle(document.documentElement).getPropertyValue('--main-color') : getComputedStyle(document.documentElement).getPropertyValue('--waste');
  box.classList.add('played');

  console.log(`Move made by ${currentPlayer} at index ${index}`);

  if (checkWin()) {
    resultDisplay.textContent = `${currentPlayer === 'X' ? 'Player' : 'AI'} wins!`;
    gameActive = false;
    updateScore(currentPlayer);
  } else if (isDraw()) {
    resultDisplay.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();
    console.log(`Current player is now ${currentPlayer}`);
    if (currentPlayer === 'O' && gameActive) {
      console.log("Scheduling AI move");
      setTimeout(aiMove, 2000); // Increased delay to 2 seconds for better visibility
    }
  }
}

function aiMove() {
  console.log("AI move started");
  let availableMoves = gameBoard.reduce((acc, cell, index) => {
    if (cell === '') acc.push(index);
    return acc;
  }, []);
  console.log("Available moves:", availableMoves);

  if (availableMoves.length > 0) {
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    console.log(`AI chose move at index ${move}`);
    makeMove(boxes[move]);
  } else {
    console.log("No available moves for AI");
  }
}
