import React from 'react';
import Card from './Card';
import { CardData, SinType } from '../types/gameTypes';
import { SINS } from '../data/sins';

interface DeckViewerProps {
  allCards: CardData[];
  usedCardIds: number[];
  onClose: () => void;
}

const DeckViewer: React.FC<DeckViewerProps> = ({
  allCards,
  usedCardIds,
  onClose
}) => {
  // Group cards by sin type
  const cardsBySin: Record<string, CardData[]> = {};

  // Initialize empty arrays for each sin type
  SINS.forEach(sin => {
    cardsBySin[sin.name] = [];
  });

  // Group all cards by sin and sort by value (descending)
  allCards.forEach(card => {
    // Make sure the sin type exists in our mapping
    if (!cardsBySin[card.sinType]) {
      cardsBySin[card.sinType] = [];
    }
    cardsBySin[card.sinType].push(card);
  });

  // Sort each sin group by value (descending)
  Object.keys(cardsBySin).forEach(sin => {
    cardsBySin[sin].sort((a, b) => b.value - a.value);
  });

  // Sort sin types alphabetically
  const sortedSinTypes = Object.keys(cardsBySin).sort();

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-infernal-700 rounded-lg p-4 max-h-[90vh] max-w-[90vw] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-infernal-400">Deck Viewer</h2>
          <button
            className="bg-infernal-800 hover:bg-infernal-700 text-white px-3 py-1 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid gap-4">
          {sortedSinTypes.map(sinType => (
            <div key={sinType} className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-infernal-300">{sinType}</h3>
              <div className="flex flex-wrap gap-2">
                {cardsBySin[sinType].map(card => (
                  <Card
                    key={card.id}
                    id={card.id}
                    sinType={card.sinType}
                    value={card.value}
                    bloodCost={card.bloodCost}
                    goldValue={card.goldValue}
                    selected={false}
                    active={false}
                    disabled={usedCardIds.includes(card.id)}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckViewer; 