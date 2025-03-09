/**
 * Card Engine
 * 
 * Core logic for card operations like drawing, playing, and discarding cards.
 * Separates the game logic from UI components.
 */

import { 
  CardData, 
  CardPlayResult, 
  CardDiscardResult, 
  GameModifiers, 
  GameResources 
} from '../state/types';

import { defaultConfig } from '../config/gameConfig';

/**
 * Draw cards from the draw pile, handling reshuffling the discard pile if needed
 */
export function drawCards(
  count: number,
  hand: CardData[],
  drawPile: CardData[],
  discardPile: CardData[],
  maxHandSize: number
): {
  newHand: CardData[];
  newDrawPile: CardData[];
  newDiscardPile: CardData[];
  cardsDrawn: number;
} {
  // Early return for invalid cases
  if (count <= 0 || hand.length >= maxHandSize) {
    return { 
      newHand: [...hand], 
      newDrawPile: [...drawPile], 
      newDiscardPile: [...discardPile],
      cardsDrawn: 0
    };
  }

  // Calculate how many cards to actually draw
  const cardsNeeded = Math.min(count, maxHandSize - hand.length);
  
  // Work with copies to avoid state mutation
  let newHand = [...hand];
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];
  let cardsDrawn = 0;
  
  // Case 1: Draw pile has enough cards
  if (newDrawPile.length >= cardsNeeded) {
    const drawnCards = newDrawPile.splice(0, cardsNeeded);
    newHand = [...newHand, ...drawnCards];
    cardsDrawn = drawnCards.length;
  }
  // Case 2: Draw pile has some cards, but not enough
  else if (newDrawPile.length > 0) {
    const drawnFromDraw = newDrawPile.splice(0, newDrawPile.length);
    newHand = [...newHand, ...drawnFromDraw];
    cardsDrawn = drawnFromDraw.length;
    
    // Check if we need more cards and have a discard pile
    const remainingNeeded = cardsNeeded - cardsDrawn;
    if (remainingNeeded > 0 && newDiscardPile.length > 0) {
      // Shuffle discard pile and use it as the new draw pile
      const shuffled = shuffleDeck([...newDiscardPile]);
      
      // Draw remaining cards from shuffled discard pile
      const drawnFromShuffled = shuffled.splice(0, Math.min(remainingNeeded, shuffled.length));
      newHand = [...newHand, ...drawnFromShuffled];
      newDrawPile = shuffled; // Remaining shuffled cards become new draw pile
      newDiscardPile = []; // Discard pile is now empty
      cardsDrawn += drawnFromShuffled.length;
    }
  }
  // Case 3: Draw pile is empty, use discard pile
  else if (newDrawPile.length === 0 && newDiscardPile.length > 0) {
    // Shuffle discard pile and use it as the new draw pile
    const shuffled = shuffleDeck([...newDiscardPile]);
    
    // Draw cards from shuffled discard pile
    const drawnCards = shuffled.splice(0, Math.min(cardsNeeded, shuffled.length));
    newHand = [...newHand, ...drawnCards];
    newDrawPile = shuffled;
    newDiscardPile = [];
    cardsDrawn = drawnCards.length;
  }

  return {
    newHand,
    newDrawPile,
    newDiscardPile,
    cardsDrawn
  };
}

/**
 * Play selected cards, calculating blood cost and gold earned
 */
export function playCards(
  selectedCardIds: number[],
  hand: CardData[],
  activeCards: CardData[],
  resources: GameResources,
  modifiers: GameModifiers
): CardPlayResult {
  // Early validation
  if (selectedCardIds.length === 0) {
    return {
      success: false,
      goldEarned: 0,
      bloodCost: 0,
      newHand: hand,
      newActiveCards: activeCards,
      message: "No cards selected to play"
    };
  }
  
  if (resources.playsRemaining <= 0) {
    return {
      success: false,
      goldEarned: 0,
      bloodCost: 0,
      newHand: hand,
      newActiveCards: activeCards,
      message: "No plays remaining for this level"
    };
  }
  
  // Step 1: Identify the cards to play
  const cardsToPlay = hand.filter(card => selectedCardIds.includes(card.id));
  
  // Calculate blood cost (currently set to 0 for debugging)
  const totalBloodCost = 0; // TEMP: Disabled for debugging purposes
  
  // Check blood availability
  if (resources.blood < totalBloodCost) {
    return {
      success: false,
      goldEarned: 0,
      bloodCost: totalBloodCost,
      newHand: hand,
      newActiveCards: activeCards,
      message: "Not enough blood to play these cards"
    };
  }
  
  // Step 2: Create a new hand without the played cards
  const newHand = hand.filter(card => !selectedCardIds.includes(card.id));
  
  // Step 3: Move cards to the active area
  const newActiveCards = [...activeCards, ...cardsToPlay];
  
  // Step 4: Check for sin affinity bonus (5+ cards of the same type)
  let goldMultiplier = modifiers.goldMultiplier;
  const sinTypeCounts: Record<string, number> = {};
  
  // Count the occurrences of each sin type
  cardsToPlay.forEach(card => {
    sinTypeCounts[card.sinType] = (sinTypeCounts[card.sinType] || 0) + 1;
  });
  
  // Check if any sin type has 5 or more cards
  const maxSinTypeCount = Math.max(...Object.values(sinTypeCounts), 0);
  if (maxSinTypeCount >= 5) {
    goldMultiplier *= 2; // Double gold for 5+ cards of the same sin
  }
  
  // Step 5: Calculate gold earned
  const baseGoldEarned = cardsToPlay.reduce((total, card) => total + card.goldValue, 0);
  const goldEarned = Math.floor(baseGoldEarned * goldMultiplier);
  
  return {
    success: true,
    goldEarned,
    bloodCost: totalBloodCost,
    newHand,
    newActiveCards
  };
}

/**
 * Discard selected cards, calculating blood gain
 */
export function discardCards(
  selectedCardIds: number[],
  hand: CardData[],
  discardPile: CardData[],
  resources: GameResources
): CardDiscardResult {
  // Early validation
  if (selectedCardIds.length === 0) {
    return {
      success: false,
      bloodGained: 0,
      newHand: hand,
      newDiscardPile: discardPile,
      cardsDiscarded: 0,
      message: "No cards selected to discard"
    };
  }
  
  if (resources.discardsRemaining <= 0) {
    return {
      success: false,
      bloodGained: 0,
      newHand: hand,
      newDiscardPile: discardPile,
      cardsDiscarded: 0,
      message: "No discards remaining for this level"
    };
  }
  
  // Step 1: Identify the cards to discard
  const cardsToDiscard = hand.filter(card => selectedCardIds.includes(card.id));
  const numCardsDiscarded = cardsToDiscard.length;
  
  // Step 2: Create a new hand without the discarded cards
  const newHand = hand.filter(card => !selectedCardIds.includes(card.id));
  
  // Step 3: Move cards to the discard pile
  const newDiscardPile = [...discardPile, ...cardsToDiscard];
  
  // Step 4: Calculate blood gained from discarding
  const bloodGained = cardsToDiscard.reduce((total, card) => total + card.bloodCost, 0);
  
  return {
    success: true,
    bloodGained,
    newHand,
    newDiscardPile,
    cardsDiscarded: numCardsDiscarded
  };
}

/**
 * Move active cards to the discard pile
 */
export function clearActiveCards(
  activeCards: CardData[],
  discardPile: CardData[]
): {
  newActiveCards: CardData[];
  newDiscardPile: CardData[];
} {
  return {
    newActiveCards: [],
    newDiscardPile: [...discardPile, ...activeCards]
  };
}

/**
 * Generate a complete deck of cards
 */
export function generateFullDeck(): CardData[] {
  const sinTypes: string[] = [
    'Pride', 'Greed', 'Lust', 'Envy', 
    'Gluttony', 'Wrath', 'Sloth'
  ];
  
  const deck: CardData[] = [];
  let cardId = 1;
  
  // Generate cards for each sin type with values 1-13
  sinTypes.forEach(sinType => {
    for (let value = 1; value <= defaultConfig.cardValues.valueRange; value++) {
      deck.push({
        id: cardId++,
        sinType: sinType as any,
        value,
        bloodCost: calculateBloodCost(value),
        goldValue: value
      });
    }
  });
  
  return deck;
}

/**
 * Calculate blood cost based on card value
 */
function calculateBloodCost(value: number): number {
  // Very low value cards cost 1 blood
  if (value <= 3) {
    return 1;
  }
  
  // Formula from game config
  return Math.max(
    1, 
    Math.ceil(value / defaultConfig.cardValues.bloodCostDivisor) + 
    defaultConfig.cardValues.bloodCostBase
  );
}

/**
 * Shuffle a deck of cards using Fisher-Yates algorithm
 */
export function shuffleDeck<T>(deck: T[]): T[] {
  // Create a copy to avoid mutation
  const newDeck = [...deck];
  
  // Fisher-Yates shuffle algorithm
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  
  return newDeck;
} 