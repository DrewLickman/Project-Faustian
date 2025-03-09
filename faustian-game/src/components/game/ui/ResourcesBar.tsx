import React, { memo } from 'react';
import { GameResources } from '../../../game/state/types';

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
  // Format numbers nicely
  const formatResourceNumber = (num: number): string => {
    return num.toLocaleString();
  };
  
  // Calculate progress percentage
  const goldProgress = goldTarget > 0 
    ? Math.min((resources.gold / goldTarget) * 100, 100)
    : 100;
  
  // Calculate how much gold is currently visible during animation
  const displayedGold = animatingGold > 0
    ? resources.gold - animatingGold + Math.floor(animatingGold * (animationProgress / 100))
    : resources.gold;
  
  return (
    <div className="resources-bar bg-black bg-opacity-70 p-3 rounded-lg border border-infernal-900">
      <div className="grid grid-cols-4 gap-4">
        {/* Gold */}
        <div className="resource-item">
          <div className="flex items-center text-gold-400">
            <span className="text-lg mr-1">🪙</span>
            <span className="font-bold">Gold:</span>
            <span className="ml-1">{formatResourceNumber(displayedGold)} / {formatResourceNumber(goldTarget)}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-1 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gold-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${goldProgress}%` }}
            />
          </div>
        </div>
        
        {/* Blood */}
        <div className="resource-item">
          <div className="flex items-center text-blood-600">
            <span className="text-lg mr-1">🩸</span>
            <span className="font-bold">Blood:</span>
            <span className="ml-1">{formatResourceNumber(resources.blood)} / {formatResourceNumber(resources.maxBlood)}</span>
          </div>
        </div>
        
        {/* Corruption */}
        <div className="resource-item">
          <div className="flex items-center text-corruption-500">
            <span className="text-lg mr-1">💀</span>
            <span className="font-bold">Corruption:</span>
            <span className="ml-1">{resources.corruption}%</span>
          </div>
          {/* Corruption progress bar */}
          <div className="mt-1 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-corruption-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${resources.corruption}%` }}
            />
          </div>
        </div>
        
        {/* Soul Debt */}
        <div className="resource-item">
          <div className="flex items-center text-purple-400">
            <span className="text-lg mr-1">👁️</span>
            <span className="font-bold">Soul Debt:</span>
            <span className="ml-1">{formatResourceNumber(resources.soulDebt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ResourcesBar); 