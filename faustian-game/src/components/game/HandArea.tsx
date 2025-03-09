import React from 'react';
import { CardData } from '../../types/gameTypes';
import Card from '../Card';

interface HandAreaProps {
  hand: CardData[];
  drawPile: CardData[];
  discardPile: CardData[];
  selectedCardIds: number[];
  toggleCardSelection: (id: number) => void;
  onPlayCards: () => void;
  onDiscardCards: () => void;
  onSortByRank: () => void;
  onSortBySin: () => void;
  playsRemaining: number;
  discardsRemaining: number;
  maxHandSize: number;
}

const HandArea: React.FC<HandAreaProps> = ({
  hand,
  drawPile,
  discardPile,
  selectedCardIds,
  toggleCardSelection,
  onPlayCards,
  onDiscardCards,
  onSortByRank,
  onSortBySin,
  playsRemaining,
  discardsRemaining,
  maxHandSize
}) => {
  return (
    <div className="hand-area">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-brimstone-200 font-bold text-sm">Your Hand ({hand.length}/{maxHandSize})</h2>
      </div>
      
      <div className="hand-container bg-black bg-opacity-60 border border-infernal-800 rounded-lg p-4">
        {hand.length === 0 ? (
          <div className="text-gray-500 text-center p-4">
            No cards in hand
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {hand.map(card => (
              <div key={card.id} className="hand-card-slot">
                <Card 
                  id={card.id}
                  value={card.value}
                  sinType={card.sinType}
                  bloodCost={card.bloodCost}
                  goldValue={card.goldValue}
                  selected={selectedCardIds.includes(card.id)}
                  active={false}
                  onClick={() => toggleCardSelection(card.id)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex justify-center space-x-4">
        <button 
          onClick={onDiscardCards}
          disabled={selectedCardIds.length === 0 || discardsRemaining <= 0}
          className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center ${
            selectedCardIds.length === 0 || discardsRemaining <= 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-blue-900 hover:bg-blue-800 text-white'
          }`}
        >
          <span className="mr-1">Discard</span>
          <span className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
            {discardsRemaining}
          </span>
        </button>
        
        <button 
          onClick={onPlayCards}
          disabled={selectedCardIds.length === 0 || playsRemaining <= 0}
          className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center ${
            selectedCardIds.length === 0 || playsRemaining <= 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-infernal-700 hover:bg-infernal-600 text-white'
          }`}
        >
          <span className="mr-1">Play</span>
          <span className="bg-black bg-opacity-50 px-2 py-0.5 rounded-full text-xs">
            {playsRemaining}
          </span>
        </button>
      </div>
      
      <div className="mt-2 flex justify-center space-x-3">
        <button 
          onClick={onSortByRank}
          className="bg-black bg-opacity-60 hover:bg-opacity-80 text-gray-300 text-xs px-3 py-1 rounded border border-infernal-800"
        >
          Sort by Rank
        </button>
        <button 
          onClick={onSortBySin}
          className="bg-black bg-opacity-60 hover:bg-opacity-80 text-gray-300 text-xs px-3 py-1 rounded border border-infernal-800"
        >
          Sort by Sin
        </button>
      </div>
    </div>
  );
};

export default HandArea; 