import { GameResources, GameState, GameModifiers, CircleRequirement } from '../types/gameTypes';
import { CIRCLE_REQUIREMENTS, CIRCLE_INFO } from '../data/circles';
import { DIFFICULTY_SETTINGS } from '../data/gameSettings';

/**
 * Get the requirements for a specific circle
 * @param circle Circle number (1-9)
 * @returns Circle requirement data
 */
export const getCircleRequirements = (circle: number): CircleRequirement => {
  const index = Math.min(circle - 1, CIRCLE_REQUIREMENTS.length - 1);
  return CIRCLE_REQUIREMENTS[index];
};

/**
 * Calculate the gold target for a specific circle and level
 * @param circle The current circle number (1-9)
 * @param modifiers Game modifiers that can affect the gold target
 * @returns The amount of gold needed to complete the level
 */
export const calculateGoldTarget = (circle: number, modifiers: GameModifiers): number => {
  // Base gold target for the circle
  const circleIndex = Math.min(circle - 1, CIRCLE_REQUIREMENTS.length - 1);
  const baseGoldTarget = CIRCLE_REQUIREMENTS[circleIndex]?.goldTarget || 50;
  
  // Gold target increases with each level within a circle
  const goldTargetMultiplier = 1 + (0.25 * (circle - 1));
  
  // Apply any reductions from contracts
  const reductionMultiplier = 1 - modifiers.goldTargetReduction;
  
  // Calculate final target (round to nearest 5)
  const calculatedTarget = baseGoldTarget * goldTargetMultiplier * reductionMultiplier;
  return Math.round(calculatedTarget / 5) * 5;
};

/**
 * Calculate level progress percentage
 * @param currentGold The current amount of gold
 * @param targetGold The target amount of gold
 * @returns Progress percentage (0-100)
 */
export const calculateLevelProgress = (currentGold: number, targetGold: number): number => {
  if (targetGold <= 0) return 100;
  const progress = (currentGold / targetGold) * 100;
  return Math.min(progress, 100);
};

/**
 * Check if the player has completed the current level
 * @param resources Player resources
 * @param gameState Current game state
 * @param modifiers Game modifiers
 * @returns Whether the level is complete
 */
export const isLevelComplete = (
  resources: GameResources,
  gameState: GameState,
  modifiers: GameModifiers
): boolean => {
  const goldTarget = calculateGoldTarget(gameState.circle, modifiers);
  return resources.gold >= goldTarget;
};

/**
 * Check if a circle is complete based on the current level
 * @param circle The current circle
 * @param level The current level within the circle
 * @returns Boolean indicating if the circle is complete
 */
export const isCircleComplete = (circle: number, level: number): boolean => {
  // Each circle has 3 levels
  return level >= 3;
};

/**
 * Check if the player has completed the game
 * @param gameState Current game state
 * @returns Whether the game is complete
 */
export const isGameComplete = (gameState: GameState): boolean => {
  return gameState.circle > CIRCLE_REQUIREMENTS.length;
};

/**
 * Check if the corruption level is too high, causing game over
 * @param resources Player resources
 * @param circle Current circle
 * @returns Whether corruption is too high
 */
export const isCorruptionTooHigh = (resources: GameResources, circle: number): boolean => {
  const { corruptionThreshold } = getCircleRequirements(circle);
  return resources.corruption >= corruptionThreshold;
};

/**
 * Get information about the current circle
 * @param circle Circle number (1-9)
 * @returns Information about the circle
 */
export const getCircleInfo = (circle: number) => {
  const index = Math.min(circle - 1, CIRCLE_INFO.length - 1);
  return CIRCLE_INFO[index];
};

/**
 * Calculate corruption effect on gameplay
 * @param corruption Current corruption percentage
 * @returns Object with penalty values
 */
export const calculateCorruptionEffects = (corruption: number): {
  bloodCostIncrease: number;
  goldMultiplierReduction: number;
} => {
  // Severe corruption (70%+) increases blood costs
  const bloodCostIncrease = corruption >= 70 ? Math.floor((corruption - 70) / 10) : 0;
  
  // High corruption (50%+) reduces gold generation
  const goldMultiplierReduction = corruption >= 50 ? (corruption - 50) / 100 : 0;
  
  return {
    bloodCostIncrease,
    goldMultiplierReduction
  };
};

/**
 * Format resource numbers for display
 * @param num The number to format
 * @returns Formatted number string
 */
export const formatResourceNumber = (num: number): string => {
  return num.toLocaleString();
}; 