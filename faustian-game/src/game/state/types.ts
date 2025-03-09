/**
 * Core game types for Project Faustian
 * This file contains all type definitions used throughout the game
 */

// Card related types
export type SinType = 'Pride' | 'Greed' | 'Lust' | 'Envy' | 'Gluttony' | 'Wrath' | 'Sloth';

export interface CardData {
  id: number;
  sinType: SinType;
  value: number;
  bloodCost: number;
  goldValue: number;
}

// Game phases
export type GamePhase = 'setup' | 'gameplay' | 'contract_shop' | 'game_over';

// Animation states
export type CardAnimationState = 'none' | 'playing' | 'discarding' | 'drawing';

// Game resources
export interface GameResources {
  gold: number;
  blood: number;
  maxBlood: number;
  corruption: number;
  soulDebt: number;
  maxHandSize: number;
  playsRemaining: number;
  discardsRemaining: number;
}

// Game modifiers from contracts and other effects
export interface GameModifiers {
  // Hand size and draw modifiers
  handSizeBonus: number;
  drawBonus: number;
  
  // Play modifiers
  playsPerLevelBonus: number;
  goldMultiplier: number;
  sameTypeBonus: number;
  
  // Resource modifiers
  bloodCostReduction: number;
  bloodCostIncrease: number;
  
  // Special effects
  corruptionReduction: number;
  extraBloodPerTurn: number;
  soulDebtReduction: number;
  discardPerTurn: number;
}

// Core game state
export interface GameState {
  // Game progression
  circle: number;
  level: number;
  turn: number;
  gameOver: boolean;
  
  // UI state
  message: string;
  phase: GamePhase;
  animationState: CardAnimationState;
  animatingCards: number[];
  lastSortType: 'none' | 'rank' | 'sin';
  
  // Animation state
  animatingGold: number;
  goldAnimationProgress: number;
}

// Contract-related types
export type ContractRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface ContractData {
  name: string;
  benefit: string;
  consequence: string;
  rarity: ContractRarity;
  minCircle: number;
}

export interface ExtendedContractData extends ContractData {
  contractKey: string;
}

// Action types for the reducer pattern
export type GameAction = 
  | { type: 'INITIALIZE_GAME' }
  | { type: 'PLAY_CARDS', payload: { cardIds: number[] } }
  | { type: 'DISCARD_CARDS', payload: { cardIds: number[] } }
  | { type: 'SIGN_CONTRACT', payload: { contractKey: string } }
  | { type: 'SKIP_CONTRACT' }
  | { type: 'SELECT_CARD', payload: { cardId: number } }
  | { type: 'DESELECT_CARD', payload: { cardId: number } }
  | { type: 'NEXT_LEVEL' }
  | { type: 'NEXT_CIRCLE' }
  | { type: 'UPDATE_MESSAGE', payload: { message: string } }
  | { type: 'UPDATE_ANIMATION', payload: { state: CardAnimationState, cards: number[] } }
  | { type: 'CLEAR_ANIMATION' }
  | { type: 'DRAW_CARDS', payload: { count: number } }
  | { type: 'SORT_CARDS', payload: { sortType: 'rank' | 'sin' } }
  | { type: 'UPDATE_RESOURCES', payload: Partial<GameResources> }
  | { type: 'UPDATE_MODIFIERS', payload: Partial<GameModifiers> }
  | { type: 'GOLD_ANIMATION_PROGRESS', payload: { progress: number } }
  | { type: 'GAME_OVER' };

// Return types for various hooks and functions
export interface CardPlayResult {
  success: boolean;
  goldEarned: number;
  bloodCost: number;
  newHand: CardData[];
  newActiveCards: CardData[];
  message?: string;
}

export interface CardDiscardResult {
  success: boolean;
  bloodGained: number;
  newHand: CardData[];
  newDiscardPile: CardData[];
  cardsDiscarded: number;
  message?: string;
}

// For circle progression and level requirements
export interface CircleRequirement {
  goldTarget: number;
  corruptionThreshold: number;
}

// Game configuration interface
export interface GameConfig {
  // Card settings
  cardValues: {
    valueRange: number;
    bloodCostBase: number;
    bloodCostDivisor: number;
    maxActiveCards: number;
  };
  
  // Resource settings
  resources: {
    initialBlood: number;
    maxBlood: number;
    initialGold: number;
    initialHandSize: number;
  };
  
  // Turn settings
  turnSettings: {
    playsPerLevel: number;
    discardsPerLevel: number;
    contractOptions: number;
    corruptionPerPlay: number;
    goldAnimationSpeed: number;
  };
  
  // Progress settings
  progressSettings: {
    levelsPerCircle: number;
    baseGoldTarget: number;
    goldTargetMultiplier: number;
    corruptionThreshold: number;
    soulDebtThreshold: number;
  };
} 