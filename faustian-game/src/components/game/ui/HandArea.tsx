import React, { useState, memo } from 'react';
import { CardData } from '../../../game/state/types';
import Card from '../../Card';

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
  // State for showing/hiding the debug discard pile
  const [showDiscardPile, setShowDiscardPile] = useState(false);

  // Toggle function for the discard pile debug view
  const toggleDiscardPileView = () => {
    setShowDiscardPile(!showDiscardPile);
  };

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

      {/* Debug section */}
      <div className="mt-4 flex flex-col items-center border-t border-gray-800 pt-2">
        <button 
          onClick={toggleDiscardPileView}
          className="bg-purple-900 hover:bg-purple-800 text-white text-xs px-3 py-1 rounded border border-purple-700"
        >
          {showDiscardPile ? "Hide Discard Pile (Debug)" : "Show Discard Pile (Debug)"}
        </button>

        {/* Discard pile view that toggles on/off */}
        {showDiscardPile && (
          <div className="mt-3 w-full">
            <h3 className="text-purple-300 text-sm font-bold mb-2">Discard Pile ({discardPile.length} cards):</h3>
            <div className="bg-black bg-opacity-80 border border-purple-900 rounded-lg p-3">
              {discardPile.length === 0 ? (
                <div className="text-gray-500 text-center p-2">
                  No cards in discard pile
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2">
                  {discardPile.map(card => (
                    <div key={card.id} className="discard-card-slot" style={{transform: 'scale(0.8)'}}>
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
            </div>
            <div className="text-gray-500 text-xs mt-1 text-center">
              Debug info: Draw pile has {drawPile.length} cards remaining
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(HandArea); 