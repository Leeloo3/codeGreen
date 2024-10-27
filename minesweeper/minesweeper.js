const board = document.getElementById('minesweeper-board');
const resetButton = document.getElementById('reset-game');
const quizPopup = document.getElementById('quiz-popup');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const submitAnswer = document.getElementById('submit-answer');

const ROWS = 10;
const COLS = 10;
const MINES = 10;

let grid = [];
let gameOver = false;
let currentQuestion = null;
let pendingReveal = null;

const questions = [
    {
        question: "What happens to waste that isn't recycled?",
        options: ["It floats away", "Landfill or incineration", "It decomposes", "It is reused"],
        correctAnswer: 1
    },
    {
        question: "Which of these is a renewable energy source?",
        options: ["Coal", "Natural gas", "Solar power", "Oil"],
        correctAnswer: 2
    },
    {
        question: "What is the main cause of ocean acidification?",
        options: ["Oil spills", "Plastic pollution", "Absorption of CO2 from the atmosphere", "Overfishing"],
        correctAnswer: 2
    },
    // Add more questions here...
];

function createBoard() {
    board.innerHTML = '';
    grid = [];
    gameOver = false;

    // Create cells
    for (let i = 0; i < ROWS; i++) {
        grid[i] = [];
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
            grid[i][j] = {
                element: cell,
                isMine: false,
                isRevealed: false,
                neighborMines: 0
            };
        }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if (!grid[row][col].isMine) {
            grid[row][col].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate neighbor mines
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!grid[i][j].isMine) {
                grid[i][j].neighborMines = countNeighborMines(i, j);
            }
        }
    }
}

function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (grid[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function handleCellClick(e) {
    if (gameOver) return;
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    showQuizPopup(row, col);
}

function showQuizPopup(row, col) {
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
    pendingReveal = { row, col };
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
        if (selectedIndex === currentQuestion.correctAnswer) {
            quizPopup.style.display = 'none';
            revealCell(pendingReveal.row, pendingReveal.col);
        } else {
            alert('Incorrect answer. Try again!');
        }
    }
});

function revealCell(row, col) {
    const cell = grid[row][col];
    if (cell.isRevealed) return;

    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.isMine) {
        cell.element.textContent = '💣';
        gameOver = true;
        alert('Game Over! You hit a mine.');
    } else {
        if (cell.neighborMines > 0) {
            cell.element.textContent = cell.neighborMines;
        } else {
            // Reveal neighbors for cells with no adjacent mines
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    checkWin();
}

function checkWin() {
    let unrevealedSafeCells = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (!grid[i][j].isMine && !grid[i][j].isRevealed) {
                unrevealedSafeCells++;
            }
        }
    }
    if (unrevealedSafeCells === 0) {
        gameOver = true;
        alert('Congratulations! You won!');
    }
}

resetButton.addEventListener('click', createBoard);

// Initialize the game
createBoard();
