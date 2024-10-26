import React, { useState } from 'react';
import { X, Circle, Trophy, Swords, Bot, RotateCcw } from 'lucide-react';
import Board from './components/Board';
import { checkWinner, getAIMove } from './utils/gameLogic';

type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'X' | 'O' | null;

function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
    } else {
      // AI's turn
      setTimeout(() => {
        const aiMove = getAIMove(newBoard, difficulty);
        if (aiMove !== null) {
          const afterAIBoard = [...newBoard];
          afterAIBoard[aiMove] = 'O';
          setBoard(afterAIBoard);
          
          const aiResult = checkWinner(afterAIBoard);
          if (aiResult) {
            handleGameEnd(aiResult);
          }
        }
        setIsPlayerTurn(true);
      }, 500);
    }
  };

  const handleGameEnd = (result: { winner: Player | 'draw', line?: number[] }) => {
    setGameOver(true);
    setWinner(result.winner);
    setWinningLine(result.line || null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine(null);
  };

  const getDifficultyColor = (level: Difficulty) => {
    return difficulty === level
      ? 'bg-blue-500 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Swords className="w-8 h-8 text-blue-500" />
            Tic Tac Toe
          </h1>
          <p className="text-gray-600">Challenge the AI!</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${getDifficultyColor(
                level
              )}`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
        />

        {gameOver && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-4">
              {winner === 'X' && (
                <>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-green-600">You Won!</span>
                </>
              )}
              {winner === 'O' && (
                <>
                  <Bot className="w-6 h-6 text-red-500" />
                  <span className="text-red-600">AI Won!</span>
                </>
              )}
              {winner === 'draw' && (
                <span className="text-gray-600">It's a Draw!</span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={resetGame}
          className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          New Game
        </button>
      </div>
    </div>
  );
}

export default App;