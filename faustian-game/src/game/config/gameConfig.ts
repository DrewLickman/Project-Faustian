/**
 * Game Configuration
 * 
 * This file contains all configurable game parameters, making it easy to adjust
 * game balance without modifying the core logic.
 */

import { GameConfig } from '../state/types';

// Default game configuration
export const defaultConfig: GameConfig = {
  // Card settings
  cardValues: {
    valueRange: 13,
    bloodCostBase: 0,
    bloodCostDivisor: 4, // Lower makes cards more expensive
    maxActiveCards: 7,
  },
  
  // Resource settings
  resources: {
    initialBlood: 5, // Starting blood
    maxBlood: 999999, // Effectively unlimited for debugging
    initialGold: 0,
    initialHandSize: 10,
  },
  
  // Turn settings
  turnSettings: {
    playsPerLevel: 3,
    discardsPerLevel: 2,
    contractOptions: 3,
    corruptionPerPlay: 2,
    goldAnimationSpeed: 500, // milliseconds per 1000 gold
  },
  
  // Progress settings
  progressSettings: {
    levelsPerCircle: 3,
    baseGoldTarget: 50,
    goldTargetMultiplier: 1.5,
    corruptionThreshold: 100,
    soulDebtThreshold: 100,
  },
};

/**
 * Calculate the gold target for a specific circle and level
 * 
 * @param circle Current circle (1-indexed)
 * @param level Current level (1-indexed)
 * @param config Game configuration
 * @returns Required gold amount
 */
export function calculateGoldTarget(
  circle: number, 
  level: number, 
  config: GameConfig = defaultConfig
): number {
  const baseTarget = config.progressSettings.baseGoldTarget;
  const multiplier = config.progressSettings.goldTargetMultiplier;
  
  // Formula: base * (multiplier^(circle-1)) * level
  const circleMultiplier = Math.pow(multiplier, circle - 1);
  const calculatedTarget = baseTarget * circleMultiplier * level;
  
  // Round to nearest 5 for cleaner numbers
  return Math.round(calculatedTarget / 5) * 5;
}

/**
 * Calculate blood cost for a card
 * 
 * @param value Card value
 * @param config Game configuration
 * @returns Blood cost
 */
export function calculateBloodCost(
  value: number,
  config: GameConfig = defaultConfig
): number {
  // Very low value cards cost 1 blood
  if (value <= 3) {
    return 1;
  }
  
  // Formula: Math.ceil(value / bloodCostDivisor) + bloodCostBase
  return Math.max(
    1, 
    Math.ceil(value / config.cardValues.bloodCostDivisor) + 
    config.cardValues.bloodCostBase
  );
}

/**
 * Initialize game resources
 * 
 * @param config Game configuration
 * @returns Initial resources
 */
export function getInitialResources(config: GameConfig = defaultConfig) {
  return {
    gold: config.resources.initialGold,
    blood: config.resources.initialBlood,
    maxBlood: config.resources.maxBlood,
    corruption: 0,
    soulDebt: 0,
    maxHandSize: config.resources.initialHandSize,
    playsRemaining: config.turnSettings.playsPerLevel,
    discardsRemaining: config.turnSettings.discardsPerLevel,
  };
}

/**
 * Initialize game modifiers
 * 
 * @returns Initial modifiers
 */
export function getInitialModifiers() {
  return {
    handSizeBonus: 0,
    drawBonus: 0,
    playsPerLevelBonus: 0,
    goldMultiplier: 1.0,
    sameTypeBonus: 0,
    bloodCostReduction: 0,
    bloodCostIncrease: 0,
    corruptionReduction: 0,
    extraBloodPerTurn: 0,
    soulDebtReduction: 0,
    discardPerTurn: 0,
  };
} 