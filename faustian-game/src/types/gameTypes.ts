/**
 * Game type definitions for Faustian
 */

// Card types
export type SinType = 'Pride' | 'Greed' | 'Lust' | 'Envy' | 'Gluttony' | 'Wrath' | 'Sloth';

export interface CardData {
  id: number;
  sinType: string;
  value: number;
  bloodCost: number;
  goldValue: number;
}

// Contract types
export type ContractRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface ContractData {
  name: string;
  benefit: string;
  consequence: string;
  rarity: ContractRarity;
  minCircle: number;
}

export interface ContractProps {
  contractKey: string;
  name: string;
  benefit: string;
  consequence: string;
  signed: boolean;
  onSign: () => void;
}

// Circle information
export interface CircleRequirement {
  goldTarget: number;
  corruptionThreshold: number;
}

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

// Game modifiers
export interface GameModifiers {
  goldMultiplier: number;
  bloodCostReduction: number;
  bloodCostIncrease: number;
  extraDraw: number;
  extraBloodPerTurn: number;
  corruptionHealingDisabled: boolean;
  sameTypeBonus: number;
  discardPerTurn: number;
  goldTargetReduction: number;
  bloodPerDiscard: number;
  handSizeBonus: number;
  playsPerLevelBonus: number;
  discardsPerLevelBonus: number;
}

// Game phase
export type GamePhase = 'gameplay' | 'contractShop' | 'victory' | 'defeat';

// Animation states
export type CardAnimationState = 'none' | 'moving' | 'counting' | 'exiting';

// Sort type
export type SortType = 'none' | 'rank' | 'sin';

// Game state
export interface GameState {
  circle: number;
  level: number;
  turn: number;
  gameOver: boolean;
  message: string;
  phase: GamePhase;
  animationState: CardAnimationState;
  animatingCards: CardData[];
  lastSortType: SortType;
  animatingGold: number;
  goldAnimationProgress: number;
} 