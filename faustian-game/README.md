# FAUSTIAN

A roguelike deckbuilding game where players make unholy bargains with demons, signing contracts for power while managing the consequences. Set across the nine circles of Hell, players must generate enough unholy wealth to satisfy increasingly demanding demonic contracts.

![Faustian Game](https://i.imgur.com/placeholder.png)

## 🔥 Game Overview

In FAUSTIAN, you'll:
- Use a deck of 91 cards (13 values across 7 deadly sin categories)
- Convert your vital blood essence into cursed gold
- Sign dangerous demonic contracts for power
- Balance corruption and power as you descend through the circles of Hell
- Make strategic decisions with long-term consequences

## 🎮 How to Play

1. **Play cards** from your hand to generate gold
2. **Sign contracts** to gain powerful abilities with lasting negative consequences
3. **Manage corruption** - too much will end your game
4. **Complete levels** by reaching the gold target for each circle
5. **Descend deeper** through all 9 circles of Hell to win

## 💻 Technical Details

This project was built with:
- React (TypeScript)
- Tailwind CSS
- React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/faustian-game.git
cd faustian-game
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## 🏗️ Project Structure

```
src/
├── components/         # React components
│   ├── Card.tsx        # Card component
│   ├── Contract.tsx    # Contract component
│   └── Game.tsx        # Main game logic and UI
├── data/               # Game data
│   ├── circles.ts      # Circle requirements and info
│   ├── contracts.ts    # Contract definitions
│   ├── gameSettings.ts # Game constants and settings
│   └── sins.ts         # Sin types and attributes
├── types/              # TypeScript definitions
│   └── gameTypes.ts    # Type definitions
├── utils/              # Utility functions
│   ├── cardGenerator.ts # Card generation functions
│   ├── contractUtils.ts # Contract utility functions
│   └── gameUtils.ts     # Game utility functions
├── App.tsx             # Main application component
└── index.tsx           # Entry point
```

## 🎮 Game Mechanics

### Card System
- Each card has a sin type, value, blood cost, and gold value
- Up to 7 cards can be played at once
- Cards require blood to play and generate gold

### Contract System
- Contracts offer powerful benefits with negative consequences
- Signed contracts are permanent
- More powerful contracts become available in deeper circles

### Circle Progression
- Each circle has 3 levels
- Complete a level by reaching the gold target
- Each circle introduces higher difficulty and rewards

## 🔧 Extending the Game

The game is designed to be modular and easy to extend. Here's how you can add or modify various game elements:

### Adding New Contracts

1. Open `src/data/contracts.ts`
2. Add a new entry to the `CONTRACTS` array:
```typescript
{
  id: 10, // Use a unique ID
  name: "Your Contract Name",
  benefit: "Describe the benefit",
  consequence: "Describe the consequence",
  rarity: "common", // Choose from: common, uncommon, rare, legendary
  minCircle: 1, // Minimum circle required to see this contract
},
```
3. Add the contract effect logic in `Game.tsx` in the `signContract` function:
```typescript
case 10: // Your Contract Name
  newModifiers.someProperty += someValue;
  newResources.someResource += someValue;
  break;
```

### Adding New Sin Types

1. Open `src/types/gameTypes.ts` and add the new sin to the `SinType` type
2. Open `src/data/sins.ts` and add the sin details to the `SINS` array:
```typescript
{
  name: 'YourSin',
  description: 'Description of the sin',
  color: 'from-yourcolor-900 to-infernal-900', // Use Tailwind CSS classes
  bonusEffect: 'Description of any special effect',
},
```

### Modifying Game Settings

Open `src/data/gameSettings.ts` to change various game parameters:
- Initial resources
- Card generation formulas
- Turn-based settings
- Difficulty settings

### Modifying Circle Requirements

Open `src/data/circles.ts` to change the requirements for each circle:
- Gold targets
- Corruption thresholds
- Circle descriptions and themes

## 🌟 Future Enhancements

- **Special Card Combinations**: Bonuses for specific sin combinations
- **Card Modification**: Allow players to modify card values and sin types
- **More Circles**: Additional levels with unique mechanics
- **Additional Contracts**: More strategic options for players
- **Sound Effects & Music**: Atmospheric audio to enhance the hellish experience
- **Boss Encounters**: Special high-difficulty challenges at the end of each circle
- **Unlockable Characters**: Different starting conditions and unique abilities
- **Achievement System**: Track player accomplishments and milestones
- **Different Game Modes**: Challenge modes with unique rules and objectives
- **Card Animation Effects**: Add special visual effects for different sin types
- **Save/Load System**: Store game progress across sessions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by roguelike deck builders like Slay the Spire and Monster Train
- Demonic visuals inspired by games like DOOM
- Card mechanics inspired by traditional card games and poker

---

*"What shall it profit a man if he gain the whole world but lose his own soul?" - Mark 8:36*
