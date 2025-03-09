/**
 * Game settings and constants
 * 
 * This file contains configurable parameters for the game.
 * Change these values to adjust the game balance.
 */

/**
 * Initial resources the player starts with
 */
export const INITIAL_RESOURCES = {
  gold: 0,
  blood: 5,       // Start with some blood to allow immediate play
  maxBlood: 15,   // Maximum blood capacity
  corruption: 0,
  soulDebt: 0,
  maxHandSize: 10, // Increasing hand size to 10
  playsRemaining: 3, // Player can play 3 hands per level
  discardsRemaining: 2, // Player can discard 2 times per level
};

/**
 * Card-related settings
 */
export const CARD_SETTINGS = {
  // Number of card values (1-13 by default, like playing cards)
  valueRange: 13,
  
  // Blood cost calculation
  // Formula: Math.ceil(value / bloodCostDivisor) + bloodCostBase
  bloodCostBase: 0,
  bloodCostDivisor: 4, // Lower makes cards more expensive
  
  // Initial cards
  initialHandSize: 10, // Starting hand size
  maxActiveCards: 7,  // Maximum cards that can be played at once
  
  // Blood gained per discarded card
  bloodPerDiscard: 2,
  
  maxCardValue: 10
};

/**
 * Turn-related settings
 */
export const TURN_SETTINGS = {
  // Contract options
  maxContractsAvailable: 3,
  
  // Plays per level
  playsPerLevel: 3,
  
  // Discards per level
  discardsPerLevel: 2,
  
  // Corruption increase per turn
  corruptionPerTurn: 2,
  
  // Soul debt increase per turn
  soulDebtPerTurn: 5,
  
  // Gold animation speed
  goldAnimationSpeed: 500 // milliseconds per 1000 gold for animation
};

/**
 * Difficulty settings
 */
export const DIFFICULTY_SETTINGS = {
  // Levels per circle before progressing
  levelsPerCircle: 3,
  
  // Circles in the game
  circleCount: 9,
  
  // Thresholds for failure
  corruptionThreshold: 100,
  soulDebtThreshold: 100
}; 