import React from 'react';
import { X, Circle } from 'lucide-react';

interface BoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningLine }) => {
  const renderCell = (index: number) => {
    const isWinningCell = winningLine?.includes(index);
    const cellContent = board[index];
    
    return (
      <button
        key={index}
        onClick={() => onCellClick(index)}
        className={`w-full h-24 bg-white border-2 rounded-lg flex items-center justify-center transition-all transform hover:scale-105 ${
          isWinningCell
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
        disabled={!!cellContent}
      >
        {cellContent === 'X' && (
          <X
            className={`w-12 h-12 ${
              isWinningCell ? 'text-green-500' : 'text-blue-500'
            }`}
          />
        )}
        {cellContent === 'O' && (
          <Circle
            className={`w-12 h-12 ${
              isWinningCell ? 'text-green-500' : 'text-red-500'
            }`}
          />
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 aspect-square">
      {Array(9)
        .fill(null)
        .map((_, index) => renderCell(index))}
    </div>
  );
};

export default Board;