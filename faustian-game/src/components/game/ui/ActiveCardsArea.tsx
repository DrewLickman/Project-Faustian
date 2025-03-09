import React, { memo } from 'react';
import { CardData, CardAnimationState } from '../../../game/state/types';
import Card from '../../Card';

interface ActiveCardsAreaProps {
  activeCards: CardData[];
  maxActiveCards: number;
  animationState: CardAnimationState;
  animatingCards: number[];
}

const ActiveCardsArea: React.FC<ActiveCardsAreaProps> = ({
  activeCards,
  maxActiveCards,
  animationState,
  animatingCards
}) => {
  // Generate placeholder slots for empty positions
  const emptySlots = maxActiveCards - activeCards.length;
  const placeholders = Array(emptySlots > 0 ? emptySlots : 0).fill(null);
  
  return (
    <div className="active-cards-area">
      <h2 className="text-center text-brimstone-200 font-bold text-sm mb-2">Active Cards</h2>
      
      <div className="flex justify-center items-center h-48">
        {activeCards.length === 0 && placeholders.length === 0 ? (
          <div className="text-gray-500 text-center">
            Play cards to see them here
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {/* Render active cards */}
            {activeCards.map(card => (
              <div 
                key={card.id} 
                className={`active-card-slot ${
                  animatingCards.includes(card.id) ? 'animate-pulse' : ''
                }`}
              >
                <Card 
                  id={card.id}
                  value={card.value}
                  sinType={card.sinType}
                  bloodCost={card.bloodCost}
                  goldValue={card.goldValue}
                  selected={false}
                  active={true}
                  onClick={() => {}} // No action for active cards
                />
              </div>
            ))}
            
            {/* Render placeholder slots */}
            {placeholders.map((_, index) => (
              <div 
                key={`placeholder-${index}`} 
                className="active-card-slot placeholder"
              >
                <div className="w-24 h-32 border border-dashed border-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-gray-700 text-xs">Empty</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ActiveCardsArea); 