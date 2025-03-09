import { ContractData } from '../types/gameTypes';

/**
 * Available contracts in the game
 * 
 * To add a new contract:
 * 1. Add a new entry to this object
 * 2. Use a unique key (lowercase with underscores)
 * 3. Add name, benefit text, and consequence text
 * 4. Add any special effects in the contract system hook
 */
export const CONTRACTS: Record<string, ContractData> = {
  "devils_bargain": {
    name: "Devil's Bargain",
    benefit: "Gain +20 gold instantly",
    consequence: "Corruption +10%",
    rarity: "common",
    minCircle: 1,
  },
  "blood_pact": {
    name: "Blood Pact",
    benefit: "Cards generate +50% gold",
    consequence: "Maximum blood -3",
    rarity: "common",
    minCircle: 1,
  },
  "soul_mortgage": {
    name: "Soul Mortgage",
    benefit: "All blood costs -1",
    consequence: "Soul Debt +5 per turn",
    rarity: "common",
    minCircle: 1,
  },
  "unholy_investiture": {
    name: "Unholy Investiture",
    benefit: "Draw +2 cards each turn",
    consequence: "Corruption +2% per turn",
    rarity: "uncommon",
    minCircle: 2,
  },
  "infernal_blessing": {
    name: "Infernal Blessing",
    benefit: "Gain +3 blood per discard",
    consequence: "Gold generation -25%",
    rarity: "uncommon",
    minCircle: 2,
  },
  "vile_revelation": {
    name: "Vile Revelation",
    benefit: "See 3 additional cards in hand",
    consequence: "Cards cost +1 blood",
    rarity: "uncommon",
    minCircle: 3,
  },
  "blasphemous_pact": {
    name: "Blasphemous Pact",
    benefit: "Corruption reduced by 15%",
    consequence: "Soul Debt +20 immediately",
    rarity: "rare",
    minCircle: 4,
  },
  "diabolic_insight": {
    name: "Diabolic Insight",
    benefit: "Cards of the same sin type give +3 gold bonus",
    consequence: "Discard 2 random cards each turn",
    rarity: "rare",
    minCircle: 5,
  },
  "eternal_servitude": {
    name: "Eternal Servitude",
    benefit: "Gold target -25% for each level",
    consequence: "Cannot heal corruption",
    rarity: "legendary",
    minCircle: 7,
  },
  "infernal_capacity": {
    name: "Infernal Capacity",
    benefit: "Increase maximum hand size by 5 cards",
    consequence: "Start each level with +10% corruption",
    rarity: "uncommon",
    minCircle: 2,
  },
  "strategic_advantage": {
    name: "Strategic Advantage",
    benefit: "Get +2 plays and +2 discards per level",
    consequence: "Decrease maximum blood by 5",
    rarity: "rare",
    minCircle: 3,
  },
};

// Helper function to get contract keys for a specific circle
export const getContractKeysForCircle = (circle: number): string[] => {
  return Object.entries(CONTRACTS)
    .filter(([_, contract]) => contract.minCircle <= circle)
    .map(([key, _]) => key);
};

// Helper to get all contract keys
export const getAllContractKeys = (): string[] => {
  return Object.keys(CONTRACTS);
};

// Select random contracts for a circle
export const selectRandomContracts = (
  circle: number,
  count: number,
  excludeKeys: string[] = []
): string[] => {
  const availableKeys = getContractKeysForCircle(circle)
    .filter(key => !excludeKeys.includes(key));
  
  // Randomize order
  const shuffled = [...availableKeys].sort(() => Math.random() - 0.5);
  
  // Return only the number requested
  return shuffled.slice(0, count);
}; 