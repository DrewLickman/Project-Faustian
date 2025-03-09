import { useState, useEffect } from 'react';
import { CardData, GameModifiers, GameResources, SortType } from '../types/gameTypes';
import { generateFullDeck, shuffleDeck } from '../utils/cardGenerator';
import { CARD_SETTINGS } from '../data/gameSettings';

interface UseCardManagementProps {
  initialResources: GameResources;
  modifiers: GameModifiers;
  onGoldEarned: (gold: number) => void;
  onResourceUpdate: (resources: GameResources) => void;
}

interface UseCardManagementReturn {
  fullDeck: CardData[];
  drawPile: CardData[];
  hand: CardData[];
  activeCards: CardData[];
  discardPile: CardData[];
  selectedCardIds: number[];
  usedCardIds: number[];
  drawCards: (count: number) => void;
  playSelectedCards: () => boolean;
  discardSelectedCards: () => boolean;
  toggleCardSelection: (cardId: number) => void;
  sortHandByValue: () => void;
  sortHandBySin: () => void;
  resetDeck: () => void;
  getMaxHandSize: () => number;
  clearActiveCards: () => void;
}

export const useCardManagement = ({
  initialResources,
  modifiers,
  onGoldEarned,
  onResourceUpdate,
}: UseCardManagementProps): UseCardManagementReturn => {
  // Card state
  const [fullDeck, setFullDeck] = useState<CardData[]>([]);
  const [drawPile, setDrawPile] = useState<CardData[]>([]);
  const [hand, setHand] = useState<CardData[]>([]);
  const [activeCards, setActiveCards] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);
  const [lastSortType, setLastSortType] = useState<SortType>('none');
  
  // Local resources state (copy of the resources from the main component)
  const [resources, setResources] = useState<GameResources>(initialResources);
  
  // Update resources when initialResources change
  useEffect(() => {
    console.log("initialResources updated in useCardManagement", initialResources);
    setResources(initialResources);
  }, [initialResources]);
  
  // Calculate max hand size
  const getMaxHandSize = (): number => {
    return resources.maxHandSize + modifiers.handSizeBonus;
  };
  
  // Reset/initialize deck
  const resetDeck = () => {
    const newDeck = shuffleDeck(generateFullDeck());
    setFullDeck(newDeck);
    setDrawPile(newDeck);
    setHand([]);
    setActiveCards([]);
    setDiscardPile([]);
    setSelectedCardIds([]);
    setUsedCardIds([]);
    setLastSortType('rank'); // Set default sort to rank
  };
  
  // Draw cards from draw pile to hand - with improved discard pile handling
  const drawCards = (count: number) => {
    // Log the current state
    console.log(`[drawCards] Request to draw ${count} cards. Hand: ${hand.length}, DrawPile: ${drawPile.length}, DiscardPile: ${discardPile.length}`);
    
    // Early returns for invalid cases
    if (count <= 0) {
      console.log('[drawCards] No cards requested, returning');
      return;
    }

    // Check if hand is already full
    const maxHandSize = getMaxHandSize();
    if (hand.length >= maxHandSize) {
      console.log('[drawCards] Hand is already full');
      return;
    }

    // Calculate how many cards to actually draw
    const cardsNeeded = Math.min(count, maxHandSize - hand.length);
    console.log(`[drawCards] Need to draw ${cardsNeeded} cards`);
    
    // Prepare card arrays for state updates - work with copies to avoid state mutation
    let newHand = [...hand];
    let newDrawPile = [...drawPile];
    let newDiscardPile = [...discardPile];
    let cardsDrawn = 0;
    
    // First-time initialization case - generate a completely new deck
    if (newDrawPile.length === 0 && newDiscardPile.length === 0 && hand.length === 0 && activeCards.length === 0) {
      console.log('[drawCards] First-time initialization - generating new deck');
      const newDeck = shuffleDeck(generateFullDeck());
      
      // Take cards for hand
      const drawnCards = newDeck.slice(0, cardsNeeded);
      const remainingDeck = newDeck.slice(cardsNeeded);
      
      // Sort the cards by rank by default
      const sortedDrawnCards = [...drawnCards].sort((a, b) => a.value - b.value);
      
      // Update state
      setFullDeck(newDeck);
      setHand(sortedDrawnCards);
      setDrawPile(remainingDeck);
      setLastSortType('rank');
      
      console.log(`[drawCards] Drew ${drawnCards.length} cards from new deck and sorted by rank`);
      return;
    }
    
    // Case 1: Draw pile has enough cards - simple case
    if (newDrawPile.length >= cardsNeeded) {
      console.log(`[drawCards] Drawing ${cardsNeeded} cards directly from draw pile`);
      const drawnCards = newDrawPile.splice(0, cardsNeeded);
      newHand = [...newHand, ...drawnCards];
      cardsDrawn = drawnCards.length;
    }
    // Case 2: Draw pile doesn't have enough cards, but we also have discard pile
    else if (newDrawPile.length > 0) {
      console.log(`[drawCards] Draw pile has only ${newDrawPile.length} cards, drawing those first`);
      
      // First draw what we can from draw pile
      const drawnFromDraw = newDrawPile.splice(0, newDrawPile.length);
      newHand = [...newHand, ...drawnFromDraw];
      cardsDrawn = drawnFromDraw.length;
      
      // Check if we still need more cards and have a discard pile
      const remainingNeeded = cardsNeeded - cardsDrawn;
      if (remainingNeeded > 0 && newDiscardPile.length > 0) {
        console.log(`[drawCards] Need ${remainingNeeded} more cards. Shuffling discard pile (${newDiscardPile.length} cards) into draw pile`);
        
        // Shuffle discard pile and use it as the new draw pile
        const shuffled = shuffleDeck([...newDiscardPile]);
        
        // Draw remaining cards from shuffled discard pile
        const drawnFromShuffled = shuffled.splice(0, Math.min(remainingNeeded, shuffled.length));
        newHand = [...newHand, ...drawnFromShuffled];
        newDrawPile = shuffled; // Remaining shuffled cards become new draw pile
        newDiscardPile = []; // Discard pile is now empty since we used all cards
        cardsDrawn += drawnFromShuffled.length;
        
        console.log(`[drawCards] Drew additional ${drawnFromShuffled.length} cards from shuffled discard pile`);
      }
    }
    // Case 3: Draw pile is empty, but we have discard pile
    else if (newDrawPile.length === 0 && newDiscardPile.length > 0) {
      console.log(`[drawCards] Draw pile is empty. Shuffling discard pile (${newDiscardPile.length} cards) into draw pile`);
      
      // Shuffle discard pile and use it as the new draw pile
      const shuffled = shuffleDeck([...newDiscardPile]);
      
      // Draw cards from shuffled discard pile
      const drawnCards = shuffled.splice(0, Math.min(cardsNeeded, shuffled.length));
      newHand = [...newHand, ...drawnCards];
      newDrawPile = shuffled; // Remaining shuffled cards become new draw pile
      newDiscardPile = []; // Discard pile is now empty since we used all cards
      cardsDrawn = drawnCards.length;
      
      console.log(`[drawCards] Drew ${drawnCards.length} cards from shuffled discard pile`);
    }
    // Case 4: Not enough cards anywhere - player is running out of cards
    else {
      console.log('[drawCards] Warning: Not enough cards available in draw or discard piles');
    }
    
    // Sort new cards according to current sort preference
    if (lastSortType === 'rank') {
      newHand.sort((a, b) => a.value - b.value);
    } else if (lastSortType === 'sin') {
      newHand.sort((a, b) => {
        if (a.sinType === b.sinType) {
          return a.value - b.value;
        }
        return a.sinType.localeCompare(b.sinType);
      });
    }
    
    // Update all state at once to avoid multiple renders
    console.log(`[drawCards] Drew ${cardsDrawn} cards. New hand size: ${newHand.length}, Draw pile: ${newDrawPile.length}, Discard pile: ${newDiscardPile.length}`);
    setHand(newHand);
    setDrawPile(newDrawPile);
    setDiscardPile(newDiscardPile);
    
    // Update used cards
    updateUsedCards([...newHand, ...activeCards, ...newDiscardPile]);
  };
  
  // Update the list of used cards
  const updateUsedCards = (allCards: CardData[]) => {
    const allUsedIds = allCards.map(card => card.id);
    const uniqueIds = Array.from(new Set(allUsedIds));
    setUsedCardIds(uniqueIds);
  };
  
  // Toggle card selection in hand
  const toggleCardSelection = (cardId: number) => {
    if (selectedCardIds.includes(cardId)) {
      // Deselect card
      setSelectedCardIds(selectedCardIds.filter(id => id !== cardId));
    } else {
      // Select card (if we have space)
      if (selectedCardIds.length < CARD_SETTINGS.maxActiveCards) {
        setSelectedCardIds([...selectedCardIds, cardId]);
      }
    }
  };
  
  // Play selected cards - implementing the requested card flow
  const playSelectedCards = () => {
    // Early validation
    if (selectedCardIds.length === 0) {
      console.log("[playSelectedCards] No cards to play");
      return false;
    }
    
    try {
      // Step 1: Save selected cards in a temporary array
      const cardsToPlay = hand.filter(card => selectedCardIds.includes(card.id));
      console.log(`[playSelectedCards] Selected ${cardsToPlay.length} cards to play`);
      
      // Step 2: Create a new hand array without the played cards
      const newHand = hand.filter(card => !selectedCardIds.includes(card.id));
      
      // Step 3: Move cards to the active cards area
      const newActiveCards = [...activeCards, ...cardsToPlay];
      
      // Step 4: Update the state to reflect these changes
      setHand(newHand);
      setActiveCards(newActiveCards);
      setSelectedCardIds([]);
      
      // Step 5: Apply sorting to maintain hand order preference
      if (lastSortType === 'rank') {
        sortHandByValue();
      } else if (lastSortType === 'sin') {
        sortHandBySin();
      }
      
      // Update used cards tracking
      updateUsedCards([...newHand, ...newActiveCards, ...discardPile]);
      
      console.log(`[playSelectedCards] Successfully moved ${cardsToPlay.length} cards to active area. Hand: ${newHand.length}, Active: ${newActiveCards.length}`);
      return true;
    } catch (error) {
      console.error("[playSelectedCards] Error playing cards:", error);
      return false;
    }
  };
  
  // Discard selected cards - implementing the requested card flow
  const discardSelectedCards = () => {
    // Early validation
    if (selectedCardIds.length === 0) {
      console.log("[discardSelectedCards] No cards to discard");
      return false;
    }
    
    try {
      // Step 1: Save selected cards in a temporary array
      const cardsToDiscard = hand.filter(card => selectedCardIds.includes(card.id));
      console.log(`[discardSelectedCards] Selected ${cardsToDiscard.length} cards to discard`);
      
      // Step 2: Create a new hand array without the discarded cards
      const newHand = hand.filter(card => !selectedCardIds.includes(card.id));
      
      // Step 3: Move cards to the discard pile (which is not visible to the player)
      const newDiscardPile = [...discardPile, ...cardsToDiscard];
      
      // Step 4: Update the state to reflect these changes
      setHand(newHand);
      setDiscardPile(newDiscardPile);
      setSelectedCardIds([]);
      
      // Step 5: Apply sorting to maintain hand order preference
      if (lastSortType === 'rank') {
        sortHandByValue();
      } else if (lastSortType === 'sin') {
        sortHandBySin();
      }
      
      // Update used cards tracking
      updateUsedCards([...newHand, ...activeCards, ...newDiscardPile]);
      
      console.log(`[discardSelectedCards] Successfully moved ${cardsToDiscard.length} cards to discard pile. Hand: ${newHand.length}, Discard: ${newDiscardPile.length}`);
      return true;
    } catch (error) {
      console.error("[discardSelectedCards] Error discarding cards:", error);
      return false;
    }
  };
  
  // Apply the last used sorting method
  const applySorting = () => {
    if (lastSortType === 'rank') {
      sortHandByValue();
    } else if (lastSortType === 'sin') {
      sortHandBySin();
    }
  };
  
  // Sort hand by value
  const sortHandByValue = () => {
    const sortedHand = [...hand].sort((a, b) => a.value - b.value);
    setHand(sortedHand);
    setLastSortType('rank');
  };
  
  // Sort hand by sin type
  const sortHandBySin = () => {
    const sortedHand = [...hand].sort((a, b) => {
      if (a.sinType === b.sinType) {
        return a.value - b.value;
      }
      return a.sinType.localeCompare(b.sinType);
    });
    setHand(sortedHand);
    setLastSortType('sin');
  };
  
  // Clear active cards
  const clearActiveCards = () => {
    setDiscardPile([...discardPile, ...activeCards]);
    setActiveCards([]);
    updateUsedCards([...hand, ...discardPile, ...activeCards]);
  };
  
  return {
    fullDeck,
    drawPile,
    hand,
    activeCards,
    discardPile,
    selectedCardIds,
    usedCardIds,
    drawCards,
    playSelectedCards,
    discardSelectedCards,
    toggleCardSelection,
    sortHandByValue,
    sortHandBySin,
    resetDeck,
    getMaxHandSize,
    clearActiveCards
  };
}; 