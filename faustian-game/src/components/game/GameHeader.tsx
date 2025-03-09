import React from 'react';
import { getCircleInfo } from '../../utils/gameUtils';
import { FaCircle, FaLayerGroup, FaClock } from 'react-icons/fa';

interface GameHeaderProps {
  circle: number;
  level: number;
  turn: number;
  message: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ circle, level, turn, message }) => {
  const circleInfo = getCircleInfo(circle);

  return (
    <div className="game-header bg-black bg-opacity-70 p-4 text-white rounded-lg border border-infernal-800 flex flex-col h-full">
      <h1 className="text-xl font-bold text-brimstone-200 mb-4 text-center border-b border-infernal-700 pb-2">
        Faustian
      </h1>
      
      <div className="game-info space-y-4">
        <div className="circle-info flex items-center">
          <FaCircle className="text-brimstone-400 mr-2" />
          <div>
            <div className="text-sm font-semibold">Circle {circle}</div>
            <div className="text-xs text-gray-400">{circleInfo.name}</div>
          </div>
        </div>
        
        <div className="level-info flex items-center">
          <FaLayerGroup className="text-brimstone-400 mr-2" />
          <div>
            <div className="text-sm font-semibold">Level {level}</div>
          </div>
        </div>
        
        <div className="turn-info flex items-center">
          <FaClock className="text-brimstone-400 mr-2" />
          <div>
            <div className="text-sm font-semibold">Turn {turn}</div>
          </div>
        </div>
      </div>
      
      <div className="message-box mt-auto">
        <div className="text-sm text-center p-3 bg-black bg-opacity-50 rounded border border-infernal-700 mt-4">
          <p className="text-brimstone-100">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default GameHeader; 