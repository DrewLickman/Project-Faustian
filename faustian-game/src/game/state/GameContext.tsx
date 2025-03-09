import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
  GameState, 
  GameResources, 
  GameModifiers, 
  GameAction,
  CardData,
  CardPlayResult,
  CardDiscardResult
} from './types';
import { defaultConfig, getInitialResources, getInitialModifiers } from '../config/gameConfig';
import { 
  generateFullDeck, 
  shuffleDeck, 
  drawCards, 
  playCards,
  discardCards,
  clearActiveCards 
} from '../engine/cardEngine';

// Initial game state
const initialGameState: GameState = {
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
};

// Initial card state
interface CardState {
  fullDeck: CardData[];
  drawPile: CardData[];
  hand: CardData[];
  activeCards: CardData[];
  discardPile: CardData[];
  selectedCardIds: number[];
  usedCardIds: number[];
}

const initialCardState: CardState = {
  fullDeck: [],
  drawPile: [],
  hand: [],
  activeCards: [],
  discardPile: [],
  selectedCardIds: [],
  usedCardIds: []
};

// Combined state interface
interface FullGameState {
  gameState: GameState;
  resources: GameResources;
  modifiers: GameModifiers;
  cardState: CardState;
}

// Initialize the full state
const initialState: FullGameState = {
  gameState: initialGameState,
  resources: getInitialResources(),
  modifiers: getInitialModifiers(),
  cardState: initialCardState
};

// Game reducer function
function gameReducer(state: FullGameState, action: GameAction): FullGameState {
  switch (action.type) {
    case 'INITIALIZE_GAME':
      // Generate a new deck and draw initial hand
      const fullDeck = generateFullDeck();
      const shuffledDeck = shuffleDeck(fullDeck);
      const initialMaxHandSize = state.resources.maxHandSize + state.modifiers.handSizeBonus;
      
      // Draw initial hand
      const initialHandResult = drawCards(
        initialMaxHandSize,
        [],
        shuffledDeck,
        [],
        initialMaxHandSize
      );
      
      return {
        ...state,
        gameState: {
          ...initialGameState,
          message: `Welcome to the first circle of Hell: Limbo.`
        },
        resources: getInitialResources(),
        modifiers: getInitialModifiers(),
        cardState: {
          ...initialCardState,
          fullDeck,
          drawPile: initialHandResult.newDrawPile,
          hand: initialHandResult.newHand,
        }
      };
      
    case 'PLAY_CARDS':
      if (action.payload.cardIds.length === 0) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            message: "Select cards to play first!"
          }
        };
      }
      
      // Play the selected cards
      const playResult: CardPlayResult = playCards(
        action.payload.cardIds,
        state.cardState.hand,
        state.cardState.activeCards,
        state.resources,
        state.modifiers
      );
      
      if (!playResult.success) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            message: playResult.message || "Failed to play cards."
          }
        };
      }
      
      // Update resources
      const updatedResources = {
        ...state.resources,
        gold: state.resources.gold + playResult.goldEarned,
        blood: state.resources.blood - playResult.bloodCost,
        playsRemaining: state.resources.playsRemaining - 1
      };
      
      // Increment turn counter
      const newTurn = state.gameState.turn + 1;
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          turn: newTurn,
          animatingGold: playResult.goldEarned,
          goldAnimationProgress: 0,
          message: `Played ${action.payload.cardIds.length} cards for ${playResult.goldEarned} gold.`
        },
        resources: updatedResources,
        cardState: {
          ...state.cardState,
          hand: playResult.newHand,
          activeCards: playResult.newActiveCards,
          selectedCardIds: []
        }
      };
      
    case 'DISCARD_CARDS':
      if (action.payload.cardIds.length === 0) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            message: "Select cards to discard first!"
          }
        };
      }
      
      // Discard the selected cards
      const discardResult: CardDiscardResult = discardCards(
        action.payload.cardIds,
        state.cardState.hand,
        state.cardState.discardPile,
        state.resources
      );
      
      if (!discardResult.success) {
        return {
          ...state,
          gameState: {
            ...state.gameState,
            message: discardResult.message || "Failed to discard cards."
          }
        };
      }
      
      // Update resources after discarding
      const resourcesAfterDiscard = {
        ...state.resources,
        blood: state.resources.blood + discardResult.bloodGained,
        discardsRemaining: state.resources.discardsRemaining - 1
      };
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          message: `Discarded ${discardResult.cardsDiscarded} cards and gained ${discardResult.bloodGained} blood.`
        },
        resources: resourcesAfterDiscard,
        cardState: {
          ...state.cardState,
          hand: discardResult.newHand,
          discardPile: discardResult.newDiscardPile,
          selectedCardIds: []
        }
      };
      
    case 'DRAW_CARDS':
      const currentMaxHandSize = state.resources.maxHandSize + state.modifiers.handSizeBonus;
      
      // Draw cards
      const drawResult = drawCards(
        action.payload.count,
        state.cardState.hand,
        state.cardState.drawPile,
        state.cardState.discardPile,
        currentMaxHandSize
      );
      
      return {
        ...state,
        cardState: {
          ...state.cardState,
          hand: drawResult.newHand,
          drawPile: drawResult.newDrawPile,
          discardPile: drawResult.newDiscardPile
        }
      };
    
    case 'SELECT_CARD':
      // Only allow selection if not at max active cards
      if (state.cardState.selectedCardIds.includes(action.payload.cardId)) {
        // Deselect the card
        return {
          ...state,
          cardState: {
            ...state.cardState,
            selectedCardIds: state.cardState.selectedCardIds.filter(id => id !== action.payload.cardId)
          }
        };
      } else {
        // Don't select if we're at the max
        if (state.cardState.selectedCardIds.length >= defaultConfig.cardValues.maxActiveCards) {
          return state;
        }
        
        // Select the card
        return {
          ...state,
          cardState: {
            ...state.cardState,
            selectedCardIds: [...state.cardState.selectedCardIds, action.payload.cardId]
          }
        };
      }
    
    case 'CLEAR_ANIMATION':
      // Move active cards to discard pile
      const clearResult = clearActiveCards(
        state.cardState.activeCards,
        state.cardState.discardPile
      );
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          animatingGold: 0,
          goldAnimationProgress: 0,
          animationState: 'none',
          animatingCards: []
        },
        cardState: {
          ...state.cardState,
          activeCards: clearResult.newActiveCards,
          discardPile: clearResult.newDiscardPile
        }
      };
      
    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: {
          ...state.resources,
          ...action.payload
        }
      };
      
    case 'UPDATE_MODIFIERS':
      return {
        ...state,
        modifiers: {
          ...state.modifiers,
          ...action.payload
        }
      };
      
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          message: action.payload.message
        }
      };
      
    case 'GOLD_ANIMATION_PROGRESS':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          goldAnimationProgress: action.payload.progress
        }
      };
      
    case 'SORT_CARDS':
      // Sort hand based on the specified sort type
      let sortedHand = [...state.cardState.hand];
      
      if (action.payload.sortType === 'rank') {
        sortedHand.sort((a, b) => a.value - b.value);
      } else if (action.payload.sortType === 'sin') {
        sortedHand.sort((a, b) => {
          if (a.sinType === b.sinType) {
            return a.value - b.value;
          }
          return a.sinType.localeCompare(b.sinType);
        });
      }
      
      return {
        ...state,
        gameState: {
          ...state.gameState,
          lastSortType: action.payload.sortType
        },
        cardState: {
          ...state.cardState,
          hand: sortedHand
        }
      };
      
    default:
      return state;
  }
}

// Create the context
const GameContext = createContext<{
  state: FullGameState;
  dispatch: React.Dispatch<GameAction>;
  drawCards: (count: number) => void;
  playSelectedCards: () => void;
  discardSelectedCards: () => void;
  toggleCardSelection: (cardId: number) => void;
  sortCards: (sortType: 'rank' | 'sin') => void;
  updateMessage: (message: string) => void;
}>({
  state: initialState,
  dispatch: () => null,
  drawCards: () => {},
  playSelectedCards: () => {},
  discardSelectedCards: () => {},
  toggleCardSelection: () => {},
  sortCards: () => {},
  updateMessage: () => {}
});

// Provider component
export const GameProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Helper functions for common actions
  const drawCardsAction = useCallback((count: number) => {
    dispatch({ type: 'DRAW_CARDS', payload: { count } });
  }, []);
  
  const playSelectedCardsAction = useCallback(() => {
    dispatch({ 
      type: 'PLAY_CARDS', 
      payload: { cardIds: state.cardState.selectedCardIds } 
    });
  }, [state.cardState.selectedCardIds]);
  
  const discardSelectedCardsAction = useCallback(() => {
    dispatch({ 
      type: 'DISCARD_CARDS', 
      payload: { cardIds: state.cardState.selectedCardIds } 
    });
    
    // After a short delay, draw cards to replace the discarded ones
    const numCardsDiscarded = state.cardState.selectedCardIds.length;
    
    if (numCardsDiscarded > 0) {
      setTimeout(() => {
        dispatch({ 
          type: 'DRAW_CARDS', 
          payload: { count: numCardsDiscarded } 
        });
      }, 500);
    }
  }, [state.cardState.selectedCardIds]);
  
  const toggleCardSelectionAction = useCallback((cardId: number) => {
    if (state.cardState.selectedCardIds.includes(cardId)) {
      dispatch({ type: 'SELECT_CARD', payload: { cardId } });
    } else {
      dispatch({ type: 'SELECT_CARD', payload: { cardId } });
    }
  }, [state.cardState.selectedCardIds]);
  
  const sortCardsAction = useCallback((sortType: 'rank' | 'sin') => {
    dispatch({ type: 'SORT_CARDS', payload: { sortType } });
  }, []);
  
  const updateMessageAction = useCallback((message: string) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { message } });
  }, []);
  
  const value = {
    state,
    dispatch,
    drawCards: drawCardsAction,
    playSelectedCards: playSelectedCardsAction,
    discardSelectedCards: discardSelectedCardsAction,
    toggleCardSelection: toggleCardSelectionAction,
    sortCards: sortCardsAction,
    updateMessage: updateMessageAction
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 