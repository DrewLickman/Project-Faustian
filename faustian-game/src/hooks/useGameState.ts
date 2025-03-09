import { useState, useEffect } from 'react';
import { 
  GameState, 
  GameResources, 
  GameModifiers, 
  GamePhase,
  CardAnimationState,
  SortType
} from '../types/gameTypes';
import { INITIAL_RESOURCES, TURN_SETTINGS, CARD_SETTINGS } from '../data/gameSettings';

interface UseGameStateReturn {
  resources: GameResources;
  gameState: GameState;
  modifiers: GameModifiers;
  updateResources: (newResources: Partial<GameResources>) => void;
  updateGameState: (newState: Partial<GameState>) => void;
  updateModifiers: (newModifiers: Partial<GameModifiers>) => void;
  resetGame: () => void;
  setAnimatingGold: (gold: number) => void;
  moveToNextLevel: (hasInfernalCapacity: boolean) => void;
  moveToContractShop: () => void;
  checkLevelComplete: (gold: number, goldTarget: number) => boolean;
}

export const useGameState = (): UseGameStateReturn => {
  // Main game state
  const [gameState, setGameState] = useState<GameState>({
    circle: 1,
    level: 1,
    turn: 1,
    gameOver: false,
    message: "Welcome to the first circle of Hell.",
    phase: 'gameplay',
    animationState: 'none',
    animatingCards: [],
    lastSortType: 'none',
    animatingGold: 0,
    goldAnimationProgress: 0
  });
  
  // Resources
  const [resources, setResources] = useState<GameResources>({
    gold: 0,
    blood: 0,
    corruption: 0,
    soulDebt: 0,
    maxHandSize: INITIAL_RESOURCES.maxHandSize,
    playsRemaining: TURN_SETTINGS.playsPerLevel,
    discardsRemaining: TURN_SETTINGS.discardsPerLevel
  });
  
  // Game modifiers
  const [modifiers, setModifiers] = useState<GameModifiers>({
    goldMultiplier: 1,
    bloodCostReduction: 0,
    bloodCostIncrease: 0,
    extraDraw: 0,
    extraBloodPerTurn: 0,
    corruptionHealingDisabled: false,
    sameTypeBonus: 0,
    discardPerTurn: 0,
    goldTargetReduction: 0,
    bloodPerDiscard: CARD_SETTINGS.bloodPerDiscard,
    handSizeBonus: 0,
    playsPerLevelBonus: 0,
    discardsPerLevelBonus: 0
  });
  
  // Gold animation effect
  useEffect(() => {
    if (gameState.animatingGold > 0) {
      const duration = Math.max(
        (gameState.animatingGold / 1000) * TURN_SETTINGS.goldAnimationSpeed,
        300 // Minimum animation duration
      );
      
      const animationInterval = setInterval(() => {
        setGameState(prev => {
          const newProgress = prev.goldAnimationProgress + 2;
          
          if (newProgress >= 100) {
            // Animation complete
            clearInterval(animationInterval);
            return {
              ...prev,
              goldAnimationProgress: 0,
              animatingGold: 0
            };
          }
          
          return {
            ...prev,
            goldAnimationProgress: newProgress
          };
        });
      }, duration / 50); // 50 animation steps
      
      return () => clearInterval(animationInterval);
    }
  }, [gameState.animatingGold]);
  
  // Update resources
  const updateResources = (newResources: Partial<GameResources>) => {
    setResources(prev => ({
      ...prev,
      ...newResources
    }));
  };
  
  // Update modifiers
  const updateModifiers = (newModifiers: Partial<GameModifiers>) => {
    setModifiers(prev => ({
      ...prev,
      ...newModifiers
    }));
  };
  
  // Update game state
  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...newState
    }));
  };
  
  // Reset game
  const resetGame = () => {
    setGameState({
      circle: 1,
      level: 1,
      turn: 1,
      gameOver: false,
      message: "Welcome to the first circle of Hell.",
      phase: 'gameplay',
      animationState: 'none',
      animatingCards: [],
      lastSortType: 'none',
      animatingGold: 0,
      goldAnimationProgress: 0
    });
    
    setResources({
      gold: 0,
      blood: 0,
      corruption: 0,
      soulDebt: 0,
      maxHandSize: INITIAL_RESOURCES.maxHandSize,
      playsRemaining: TURN_SETTINGS.playsPerLevel,
      discardsRemaining: TURN_SETTINGS.discardsPerLevel
    });
    
    setModifiers({
      goldMultiplier: 1,
      bloodCostReduction: 0,
      bloodCostIncrease: 0,
      extraDraw: 0,
      extraBloodPerTurn: 0,
      corruptionHealingDisabled: false,
      sameTypeBonus: 0,
      discardPerTurn: 0,
      goldTargetReduction: 0,
      bloodPerDiscard: CARD_SETTINGS.bloodPerDiscard,
      handSizeBonus: 0,
      playsPerLevelBonus: 0,
      discardsPerLevelBonus: 0
    });
  };
  
  // Set animating gold
  const setAnimatingGold = (gold: number) => {
    setGameState(prev => ({
      ...prev,
      animatingGold: gold,
      goldAnimationProgress: 0
    }));
  };
  
  // Move to next level
  const moveToNextLevel = (hasInfernalCapacity: boolean) => {
    const isCircleComplete = gameState.level >= 3;
    
    if (isCircleComplete) {
      // Move to next circle
      setGameState(prev => ({
        ...prev,
        circle: prev.circle + 1,
        level: 1,
        phase: 'gameplay',
        message: `Welcome to circle ${prev.circle + 1} of Hell!`,
      }));
    } else {
      // Move to next level in same circle
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        phase: 'gameplay',
        message: `You've reached level ${prev.level + 1} of circle ${prev.circle}!`,
      }));
    }
    
    // Update resources for new level
    setResources(prev => {
      // Check for corruption increase from Infernal Capacity contract
      const levelStartCorruption = hasInfernalCapacity ? 
        Math.min(prev.corruption + 10, 100) : prev.corruption;
      
      return {
        ...prev,
        gold: 0,
        corruption: levelStartCorruption,
        playsRemaining: TURN_SETTINGS.playsPerLevel + modifiers.playsPerLevelBonus,
        discardsRemaining: TURN_SETTINGS.discardsPerLevel + modifiers.discardsPerLevelBonus,
        blood: 0 // Start with 0 blood each level
      };
    });
  };
  
  // Move to contract shop
  const moveToContractShop = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'contractShop',
      message: `Level complete! Select a contract to continue.`,
    }));
  };
  
  // Check if level is complete
  const checkLevelComplete = (gold: number, goldTarget: number): boolean => {
    return gold >= goldTarget;
  };
  
  return {
    resources,
    gameState,
    modifiers,
    updateResources,
    updateGameState,
    updateModifiers,
    resetGame,
    setAnimatingGold,
    moveToNextLevel,
    moveToContractShop,
    checkLevelComplete
  };
}; 