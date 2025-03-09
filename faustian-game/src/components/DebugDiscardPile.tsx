import React from 'react';
import { CardData } from '../types/gameTypes';
import Card from './Card';

interface DebugDiscardPileProps {
  isVisible: boolean;
  discardPile: CardData[];
  onClose: () => void;
}

const DebugDiscardPile: React.FC<DebugDiscardPileProps> = ({ isVisible, discardPile, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6 overflow-auto">
      <div className="bg-infernal-900 border-2 border-infernal-700 rounded-lg p-6 max-w-4xl max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-infernal-200 font-bold">Debug: Discard Pile ({discardPile.length} cards)</h2>
          <button 
            onClick={onClose}
            className="bg-infernal-700 text-white px-3 py-1 rounded hover:bg-infernal-600"
          >
            Close
          </button>
        </div>
        
        {discardPile.length === 0 ? (
          <div className="text-gray-400 text-center p-6">No cards in discard pile</div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {discardPile.map((card) => (
              <div key={card.id} className="debug-card">
                <Card 
                  id={card.id}
                  value={card.value}
                  sinType={card.sinType}
                  bloodCost={card.bloodCost}
                  goldValue={card.goldValue}
                  selected={false}
                  active={false}
                  onClick={() => {}} // No action on click
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-400">
          <p>Debug Information:</p>
          <ul className="list-disc pl-5 mt-1">
            {discardPile.map((card, index) => (
              <li key={index}>
                ID: {card.id} | {card.sinType}{card.value} | Blood: {card.bloodCost} | Gold: {card.goldValue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugDiscardPile; 