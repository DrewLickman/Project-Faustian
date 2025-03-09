import { CardData } from '../types/gameTypes';
import { CARD_SETTINGS } from '../data/gameSettings';
import { SINS } from '../data/sins';

/**
 * Generate a full deck of cards
 * @returns Array of card data objects
 */
export const generateFullDeck = (): CardData[] => {
  const deck: CardData[] = [];
  let cardId = 1;
  
  // For each sin type
  SINS.forEach(sin => {
    // Generate value range (1-13 by default)
    for (let value = 1; value <= CARD_SETTINGS.valueRange; value++) {
      // Create only one card of each value and sin type
      deck.push(createCard(cardId++, sin.name, value));
    }
  });
  
  return deck;
};

/**
 * Create a single card
 * @param id Unique card ID
 * @param sinType Sin type (Pride, Greed, etc.)
 * @param value Card value (1-13)
 * @returns Card data object
 */
export const createCard = (id: number, sinType: string, value: number): CardData => {
  return {
    id,
    sinType,
    value,
    bloodCost: calculateBloodCost(value),
    goldValue: value, // Gold value equals card rank
  };
};

/**
 * Calculate blood cost for a card
 * @param value Card value
 * @returns Blood cost
 */
export const calculateBloodCost = (value: number): number => {
  // For values 1-3, make cards cheaper to give players some low-cost starter cards
  if (value <= 3) {
    return 1; // Low rank cards all cost 1 blood
  }
  
  // Standard formula
  return Math.max(1, Math.ceil(value / CARD_SETTINGS.bloodCostDivisor) + CARD_SETTINGS.bloodCostBase);
};

/**
 * Calculate gold value for a card
 * @param value Card value
 * @returns Gold value
 */
export const calculateGoldValue = (value: number): number => {
  // Gold value equals the card's rank
  return value;
};

/**
 * Shuffle a deck of cards
 * @param deck Array of card data objects
 * @returns Shuffled deck
 */
export const shuffleDeck = <T>(deck: T[]): T[] => {
  const newDeck = [...deck];
  
  // Fisher-Yates shuffle
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  
  return newDeck;
}; 