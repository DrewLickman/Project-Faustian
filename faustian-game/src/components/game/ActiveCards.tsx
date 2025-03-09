import React from 'react';
import { CardData, CardAnimationState } from '../../types/gameTypes';
import Card from '../Card';

interface ActiveCardsProps {
  activeCards: CardData[];
  maxActiveCards: number;
  animationState: CardAnimationState;
  animatingCards: CardData[];
}

const ActiveCards: React.FC<ActiveCardsProps> = ({
  activeCards,
  maxActiveCards,
  animationState,
  animatingCards
}) => {
  return (
    <div className="active-cards-area mb-4">
      <h2 className="text-brimstone-200 font-bold text-sm mb-2">Active Cards</h2>
      <div className="active-cards-container bg-black bg-opacity-60 border border-infernal-800 rounded-lg p-4">
        {activeCards.length === 0 && animatingCards.length === 0 ? (
          <div className="text-gray-500 text-center p-4">
            Play cards to see them here
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {/* Active cards */}
            {activeCards.map(card => (
              <div key={card.id} className="active-card-slot">
                <Card 
                  id={card.id}
                  value={card.value}
                  sinType={card.sinType}
                  bloodCost={card.bloodCost}
                  goldValue={card.goldValue}
                  selected={false}
                  active={true}
                  onClick={() => {}} 
                />
              </div>
            ))}
            
            {/* Animating cards with appropriate animation class */}
            {animationState !== 'none' && animatingCards.map(card => (
              <div 
                key={card.id} 
                className={`active-card-slot ${
                  animationState === 'moving' ? 'animate-move-to-center' :
                  animationState === 'counting' ? 'animate-pulse' :
                  animationState === 'exiting' ? 'animate-exit-right' : ''
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
                  onClick={() => {}} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCards; 