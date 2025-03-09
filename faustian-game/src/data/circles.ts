import { CircleRequirement } from '../types/gameTypes';

/**
 * Requirements and difficulty settings for each circle of Hell
 * 
 * To modify circle difficulty:
 * 1. Adjust the goldTarget (amount needed to progress)
 * 2. Adjust the corruptionThreshold (maximum corruption allowed)
 * 
 * To add a new circle:
 * 1. Add a new entry to this array
 * 2. Make sure it follows the progression pattern
 */
export const CIRCLE_REQUIREMENTS: CircleRequirement[] = [
  { goldTarget: 100, corruptionThreshold: 30 },   // Circle 1
  { goldTarget: 200, corruptionThreshold: 40 },   // Circle 2
  { goldTarget: 300, corruptionThreshold: 50 },   // Circle 3
  { goldTarget: 400, corruptionThreshold: 60 },   // Circle 4
  { goldTarget: 500, corruptionThreshold: 70 },   // Circle 5
  { goldTarget: 600, corruptionThreshold: 80 },   // Circle 6
  { goldTarget: 700, corruptionThreshold: 85 },   // Circle 7
  { goldTarget: 800, corruptionThreshold: 90 },   // Circle 8
  { goldTarget: 1000, corruptionThreshold: 95 },  // Circle 9
];

/**
 * Information about each circle of Hell
 */
export interface CircleInfo {
  name: string;
  description: string;
  sin: string;
  punishment: string;
}

/**
 * Thematic descriptions for each circle of Hell
 * Based on Dante's Inferno
 */
export const CIRCLE_INFO: CircleInfo[] = [
  {
    name: "Limbo",
    description: "The first circle of Hell, home to the unbaptized and virtuous pagans",
    sin: "None (lack of baptism)",
    punishment: "Denied the presence of God",
  },
  {
    name: "Lust",
    description: "The second circle, where souls are blown about by violent winds",
    sin: "Lust and carnal desires",
    punishment: "Eternal whirlwind",
  },
  {
    name: "Gluttony",
    description: "The third circle, where souls lie in vile slush produced by ceaseless foul rain",
    sin: "Gluttony and overindulgence",
    punishment: "Cold, putrid rain and mud",
  },
  {
    name: "Greed",
    description: "The fourth circle, where souls push great weights against one another",
    sin: "Greed and hoarding/wasting wealth",
    punishment: "Pushing weights in eternal conflict",
  },
  {
    name: "Wrath",
    description: "The fifth circle, where the wrathful fight each other on the surface of the River Styx",
    sin: "Wrath and anger",
    punishment: "Fighting in the muddy river Styx",
  },
  {
    name: "Heresy",
    description: "The sixth circle, filled with flaming tombs",
    sin: "Heresy and false beliefs",
    punishment: "Trapped in flaming tombs",
  },
  {
    name: "Violence",
    description: "The seventh circle, divided into three rings for violence against others, self, and God",
    sin: "Violence in its various forms",
    punishment: "Boiling blood, thorny forest, burning sand",
  },
  {
    name: "Fraud",
    description: "The eighth circle, divided into ten trenches for different types of fraud",
    sin: "Fraud and deception",
    punishment: "Various torments specific to each sin",
  },
  {
    name: "Treachery",
    description: "The ninth and final circle, reserved for betrayers and traitors",
    sin: "Treachery and betrayal",
    punishment: "Frozen in ice",
  },
]; 