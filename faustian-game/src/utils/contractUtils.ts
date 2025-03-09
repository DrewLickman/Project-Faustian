import { ContractData } from '../types/gameTypes';
import { CONTRACTS, getContractKeysForCircle } from '../data/contracts';
import { shuffleDeck } from './cardGenerator';

/**
 * Get all contracts in the game
 * @returns Array of all contract data objects
 */
export const getAllContracts = (): ContractData[] => {
  return Object.values(CONTRACTS);
};

/**
 * Get contracts available for a specific circle
 * @param circle Current circle (1-9)
 * @returns Array of contract data objects
 */
export const getContractsForCircle = (circle: number): ContractData[] => {
  const keys = getContractKeysForCircle(circle);
  return keys.map(key => CONTRACTS[key]);
};

/**
 * Select random contracts for contract shop
 * @param circle Current circle
 * @param count Number of contracts to select
 * @param excludeKeys Keys of contracts to exclude (usually already signed)
 * @returns Array of selected contract data objects
 */
export const selectRandomContracts = (
  circle: number,
  count: number,
  excludeKeys: string[] = []
): ContractData[] => {
  // Get contracts available for this circle
  const availableKeys = getContractKeysForCircle(circle)
    .filter(key => !excludeKeys.includes(key));
  
  // Shuffle and select the requested number
  const shuffledKeys = [...availableKeys].sort(() => Math.random() - 0.5);
  const selectedKeys = shuffledKeys.slice(0, count);
  
  // Convert keys to contract data
  return selectedKeys.map(key => CONTRACTS[key]);
};

/**
 * Get contract by its key
 * @param key Contract key
 * @returns Contract data or undefined
 */
export const getContractByKey = (key: string): ContractData | undefined => {
  return CONTRACTS[key];
}; 