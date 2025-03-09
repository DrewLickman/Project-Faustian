import { SinType } from '../types/gameTypes';

/**
 * Sin types and their characteristics
 */
export interface SinData {
  name: SinType;
  description: string;
  color: string;
  bonusEffect: string;
}

/**
 * Detailed information about each sin type
 * 
 * To add a new sin:
 * 1. Add a new entry to this array
 * 2. Update the SinType type in gameTypes.ts
 * 3. Add a color class in the Card.tsx component
 */
export const SINS: SinData[] = [
  {
    name: 'Pride',
    description: 'Excessive belief in one\'s own abilities',
    color: 'from-purple-900 to-infernal-900',
    bonusEffect: 'Corruption is reduced when used with other Pride cards',
  },
  {
    name: 'Greed',
    description: 'Desire for material wealth',
    color: 'from-brimstone-900 to-infernal-900',
    bonusEffect: 'Generates more gold when combined with other Greed cards',
  },
  {
    name: 'Lust',
    description: 'Excessive thoughts or desires of a physical nature',
    color: 'from-pink-900 to-infernal-900',
    bonusEffect: 'Draws cards when combined with other Lust cards',
  },
  {
    name: 'Envy',
    description: 'Desire for others\' traits, status, or possessions',
    color: 'from-green-900 to-infernal-900',
    bonusEffect: 'Can copy effects of other sins when combined',
  },
  {
    name: 'Gluttony',
    description: 'Overindulgence to the point of waste',
    color: 'from-amber-900 to-infernal-900',
    bonusEffect: 'Provides more blood when used with other Gluttony cards',
  },
  {
    name: 'Wrath',
    description: 'Uncontrolled feelings of hatred and anger',
    color: 'from-red-900 to-infernal-900',
    bonusEffect: 'Adds bonus damage (in future combat features)',
  },
  {
    name: 'Sloth',
    description: 'Avoidance of physical or spiritual work',
    color: 'from-blue-900 to-infernal-900',
    bonusEffect: 'Reduces costs when combined with other Sloth cards',
  },
]; 