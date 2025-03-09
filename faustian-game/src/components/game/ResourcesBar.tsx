import React from 'react';
import { GameResources } from '../../types/gameTypes';
import { FaGem, FaTint, FaSkull, FaBalanceScale } from 'react-icons/fa';
import { calculateLevelProgress, formatResourceNumber } from '../../utils/gameUtils';

interface ResourcesBarProps {
  resources: GameResources;
  goldTarget: number;
  animatingGold: number;
  animationProgress: number;
}

const ResourcesBar: React.FC<ResourcesBarProps> = ({ 
  resources, 
  goldTarget, 
  animatingGold,
  animationProgress
}) => {
  const levelProgress = calculateLevelProgress(resources.gold, goldTarget);

  return (
    <div className="resources-bar bg-black bg-opacity-70 p-3 rounded-lg border border-infernal-800">
      <div className="flex flex-wrap justify-between">
        {/* Gold Resource */}
        <div className="resource-box flex items-center space-x-2 w-full md:w-auto mb-2 md:mb-0">
          <FaGem className="text-amber-400" />
          <div>
            <span className="text-amber-400 font-bold">Gold: </span>
            <span className="text-white">
              {formatResourceNumber(resources.gold)} / {formatResourceNumber(goldTarget)}
            </span>
            {animatingGold > 0 && (
              <span className="text-sm text-amber-300 ml-2">
                +{animatingGold} ({animationProgress}%)
              </span>
            )}
          </div>
        </div>

        {/* Blood Resource */}
        <div className="resource-box flex items-center space-x-2 w-full md:w-auto mb-2 md:mb-0">
          <FaTint className="text-red-600" />
          <div>
            <span className="text-red-600 font-bold">Blood: </span>
            <span className="text-white">
              {formatResourceNumber(resources.blood)}
            </span>
          </div>
        </div>

        {/* Corruption Meter */}
        <div className="resource-box flex items-center space-x-2 w-full md:w-auto mb-2 md:mb-0">
          <FaSkull className="text-purple-500" />
          <div>
            <span className="text-purple-500 font-bold">Corruption: </span>
            <span className={`${resources.corruption >= 70 ? 'text-red-400' : 
              resources.corruption >= 50 ? 'text-orange-400' : 'text-white'}`}>
              {formatResourceNumber(resources.corruption)}%
            </span>
          </div>
        </div>

        {/* Soul Debt */}
        <div className="resource-box flex items-center space-x-2 w-full md:w-auto">
          <FaBalanceScale className="text-cyan-400" />
          <div>
            <span className="text-cyan-400 font-bold">Soul Debt: </span>
            <span className={`${resources.soulDebt >= 70 ? 'text-red-400' : 
              resources.soulDebt >= 40 ? 'text-orange-400' : 'text-white'}`}>
              {formatResourceNumber(resources.soulDebt)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 bg-black bg-opacity-50 rounded-full h-2 border border-infernal-800 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-infernal-900 to-infernal-500 h-full transition-all duration-500"
          style={{ width: `${levelProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ResourcesBar; 