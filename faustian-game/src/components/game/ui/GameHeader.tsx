import React, { memo } from 'react';

interface GameHeaderProps {
  circle: number;
  level: number;
  turn: number;
  message: string;
}

const circleNames: Record<number, string> = {
  1: 'Limbo',
  2: 'Lust',
  3: 'Gluttony',
  4: 'Greed',
  5: 'Anger',
  6: 'Heresy',
  7: 'Violence',
  8: 'Fraud',
  9: 'Treachery'
};

const GameHeader: React.FC<GameHeaderProps> = ({
  circle,
  level,
  turn,
  message
}) => {
  // Get the circle name, or default to "Unknown" if not found
  const circleName = circleNames[circle] || 'Unknown';
  
  return (
    <header className="game-header flex flex-col mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brimstone-200 tracking-wide">
          Faustian
        </h1>
        
        <div className="flex space-x-6">
          {/* Circle indicator */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-black font-bold text-xs">C</span>
            </div>
            <div>
              <span className="text-brimstone-200 text-sm font-medium">Circle {circle}</span>
              <span className="text-gray-500 text-xs block">{circleName}</span>
            </div>
          </div>
          
          {/* Level indicator */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-black font-bold text-xs">L</span>
            </div>
            <div>
              <span className="text-brimstone-200 text-sm font-medium">Level {level}</span>
            </div>
          </div>
          
          {/* Turn indicator */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-black font-bold text-xs">T</span>
            </div>
            <div>
              <span className="text-brimstone-200 text-sm font-medium">Turn {turn}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game message */}
      <div className="mt-3 bg-black bg-opacity-50 border border-infernal-800 rounded-lg p-2 text-center">
        <p className="text-gray-300 text-sm">{message}</p>
      </div>
    </header>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(GameHeader); 