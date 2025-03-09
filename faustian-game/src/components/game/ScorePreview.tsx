import React from 'react';
import { FaGem, FaSkull, FaTimes } from 'react-icons/fa';

interface ScorePreviewProps {
  gold: number;
  corruption: number;
}

const ScorePreview: React.FC<ScorePreviewProps> = ({ gold, corruption }) => {
  return (
    <div className="score-preview bg-black bg-opacity-70 p-4 rounded-lg border border-infernal-800">
      <h2 className="text-lg font-bold text-infernal-300 text-center mb-4">Score Preview</h2>
      
      <div className="flex items-center justify-center space-x-2 text-2xl">
        <div className="gold-value flex items-center">
          <FaGem className="text-amber-400 mr-1" />
          <span className="text-amber-300">{gold}</span>
        </div>
        
        <FaTimes className="text-gray-500" />
        
        <div className="corruption-value flex items-center">
          <FaSkull className="text-purple-500 mr-1" />
          <span className="text-purple-400">{corruption}%</span>
        </div>
      </div>
      
      <div className="score-info text-xs text-gray-400 text-center mt-3">
        Higher gold and lower corruption result in a better score
      </div>
    </div>
  );
};

export default ScorePreview; 