import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useCardManagement } from '../hooks/useCardManagement';
import { useContractSystem } from '../hooks/useContractSystem';
import { calculateGoldTarget } from '../utils/gameUtils';
import { CARD_SETTINGS } from '../data/gameSettings';
import { ContractData } from '../types/gameTypes';

// Components
import GameHeader from './game/GameHeader';
import ResourcesBar from './game/ResourcesBar';
import ActiveCards from './game/ActiveCards';
import HandArea from './game/HandArea';
import ContractShop from './game/ContractShop';
import SignedContractsBanner from './SignedContractsBanner';
import DeckViewer from './DeckViewer';
import Card from './Card';
import ScorePreview from './game/ScorePreview';

// Define the ExtendedContractData interface locally to match what SignedContractsBanner expects
interface ExtendedContractData extends ContractData {
  contractKey: string;
}

const Game: React.FC = () => {
  // Deck viewer state
  const [showDeckViewer, setShowDeckViewer] = useState(false);
  // Initialization state to prevent multiple initializations
  const [isInitialized, setIsInitialized] = useState(false);
  // Use a ref to truly ensure one-time initialization
  const initRef = useRef(false);

  // Game state management
  const {
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
  } = useGameState();

  // Contract system
  const {
    availableContractKeys,
    signedContractKeys,
    signContract,
    applyContractEffects,
    selectContractsForCircle,
    getContractByKey,
    hasContract
  } = useContractSystem({ circle: gameState.circle });

  // Get signed contracts objects with proper type
  const signedContracts: ExtendedContractData[] = signedContractKeys
    .map(key => {
      const contract = getContractByKey(key);
      if (contract) {
        return {
          ...contract,
          contractKey: key
        };
      }
      return null;
    })
    .filter((contract): contract is ExtendedContractData => contract !== null);

  // Card management
  const {
    fullDeck,
    hand,
    activeCards,
    drawPile,
    discardPile,
    selectedCardIds,
    usedCardIds,
    drawCards,
    playSelectedCards: internalPlayCards,
    discardSelectedCards: internalDiscardCards,
    toggleCardSelection,
    sortHandByValue,
    sortHandBySin,
    resetDeck,
    getMaxHandSize,
    clearActiveCards
  } = useCardManagement({
    initialResources: resources,
    modifiers,
    onGoldEarned: (gold: number) => {
      setAnimatingGold(gold);
      
      // Check if level is complete
      const goldTarget = calculateGoldTarget(gameState.circle, modifiers);
      
      if (checkLevelComplete(resources.gold + gold, goldTarget)) {
        setTimeout(() => {
          moveToContractShop();
        }, 1000);
      }
    },
    onResourceUpdate: updateResources
  });

  // Initialize game only once when component mounts
  useEffect(() => {
    // Use ref to ensure we never initialize twice
    if (initRef.current) return;
    initRef.current = true;
    
    console.log("Game component initializing for the first time - guaranteed only once");
    
    // Simple one-time initialization with no refreshes
    const initializeGame = () => {
      // Reset game state first
      resetGame();
      
      // Reset and initialize deck - direct operation
      resetDeck();
      
      // Draw initial hand - single operation, no async
      const maxHand = getMaxHandSize();
      console.log(`Drawing initial ${maxHand} cards for new game`);
      drawCards(maxHand);
      
      // Update game message
      updateGameState({
        message: "Game started! Discard cards to gain blood, then play cards to earn gold."
      });
      
      // Mark as initialized
      setIsInitialized(true);
    };
    
    // Run initialization as a direct call, not async
    initializeGame();
  }, []); // Empty dependency array - we control re-runs with the ref

  // Handler for discarding cards
  const discardSelectedCards = () => {
    if (selectedCardIds.length === 0) {
      updateGameState({
        message: "Select cards to discard first!"
      });
      return;
    }
    
    if (resources.discardsRemaining <= 0) {
      updateGameState({
        message: "No more discards remaining for this level!"
      });
      return;
    }
    
    // Step 1: Save selected cards in temporary variables before they're removed
    const selectedCards = hand.filter(card => selectedCardIds.includes(card.id));
    const discardCount = selectedCards.length;
    const bloodGained = discardCount * (modifiers.bloodPerDiscard || CARD_SETTINGS.bloodPerDiscard);
    
    // Step 2: Update resources - blood gained from discards and reduce discards remaining
    const newResources = {
      ...resources,
      blood: Math.min(resources.blood + bloodGained, resources.maxBlood),
      discardsRemaining: resources.discardsRemaining - 1
    };
    updateResources(newResources);
    
    // Step 3: Update message to show blood gains
    updateGameState({
      message: `Discarded ${discardCount} cards to gain ${bloodGained} blood`
    });
    
    // Step 4: Call internal discard function to move cards to discard pile and update hand
    console.log(`Discarding ${discardCount} cards. Current hand size: ${hand.length}`);
    const discardResult = internalDiscardCards();
    
    // Step 5: Draw new cards after a short delay to replace the discarded ones
    if (discardResult) {
      setTimeout(() => {
        // Calculate exactly how many cards to draw to replace discarded ones
        const cardsToDrawCount = Math.min(discardCount, getMaxHandSize() - hand.length);
        
        if (cardsToDrawCount > 0) {
          console.log(`Drawing ${cardsToDrawCount} new cards to replace discarded ones`);
          drawCards(cardsToDrawCount);
        }
      }, 300);
    }
  };

  // Handler for playing cards
  const playSelectedCards = () => {
    if (selectedCardIds.length === 0) {
      updateGameState({
        message: "Select cards to play first!"
      });
      return;
    }
    
    if (resources.playsRemaining <= 0) {
      updateGameState({
        message: "No more plays remaining for this level!"
      });
      return;
    }
    
    // Step 1: Save selected cards in temporary variables before they're removed
    const selectedCards = hand.filter(card => selectedCardIds.includes(card.id));
    const playCount = selectedCards.length;
    
    // Step 2: Calculate total blood cost of selected cards
    const totalBloodCost = selectedCards.reduce((total, card) => {
      const actualCost = Math.max(
        card.bloodCost - modifiers.bloodCostReduction + modifiers.bloodCostIncrease, 
        1
      );
      return total + actualCost;
    }, 0);
    
    // Check if we have enough blood
    if (resources.blood < totalBloodCost) {
      updateGameState({
        message: "Not enough blood to play these cards!"
      });
      return;
    }
    
    // Step 3: Calculate gold earned from played cards
    let totalGold = 0;
    selectedCards.forEach(card => {
      let earnedGold = Math.round(card.goldValue * modifiers.goldMultiplier);
      
      // Apply same type bonus if applicable
      if (modifiers.sameTypeBonus > 0) {
        const sameTypeCount = selectedCards.filter(c => c.sinType === card.sinType).length - 1;
        if (sameTypeCount > 0) {
          earnedGold += modifiers.sameTypeBonus * sameTypeCount;
        }
      }
      
      totalGold += earnedGold;
    });
    
    // Step 4: Calculate corruption increase
    const corruptionIncrease = playCount * 2;
    const newCorruption = Math.min(resources.corruption + corruptionIncrease, 100);
    
    // Step 5: Update resources (blood cost, gold earned, plays remaining, corruption)
    const updatedResources = {
      ...resources,
      corruption: newCorruption,
      blood: resources.blood - totalBloodCost,
      gold: resources.gold + totalGold,
      playsRemaining: resources.playsRemaining - 1
    };
    updateResources(updatedResources);
    
    // Step 6: Update message to show what happened
    updateGameState({
      message: `Played ${playCount} cards. Earned ${totalGold} gold. Corruption +${corruptionIncrease}%!`
    });
    
    // Step 7: Call internal play function to move cards to active area and update hand
    console.log(`Playing ${playCount} cards. Current hand size: ${hand.length}`);
    internalPlayCards();
    
    // Step 8: Trigger gold animation
    setAnimatingGold(totalGold);
    
    // Step 9: Check if level is complete
    const goldTarget = calculateGoldTarget(gameState.circle, modifiers);
    if (checkLevelComplete(resources.gold + totalGold, goldTarget)) {
      setTimeout(() => {
        moveToContractShop();
      }, 1000);
    }
  };

  // Handler for signing contracts
  const handleSignContract = (contractKey: string) => {
    // Apply contract effects
    const { newResources, newModifiers } = applyContractEffects(contractKey, resources, modifiers);
    
    // Update resources and modifiers
    updateResources(newResources);
    updateModifiers(newModifiers);
    
    // Sign the contract
    signContract(contractKey);
    
    // Continue to next level
    setTimeout(() => {
      moveToNextLevel(hasContract("infernal_capacity"));
      clearActiveCards();
      
      // Make sure the player has a full hand
      setTimeout(() => {
        console.log("Drawing cards after signing contract");
        const maxHandSize = getMaxHandSize();
        // Calculate how many cards to draw
        const cardsToDraw = Math.max(0, maxHandSize - hand.length);
        
        if (cardsToDraw > 0) {
          drawCards(cardsToDraw);
        }
      }, 300);
    }, 1500);
  };

  // Handler for skipping contract selection
  const skipContractSelection = () => {
    moveToNextLevel(hasContract("infernal_capacity"));
    clearActiveCards();
    
    // Make sure the player has a full hand without causing infinite loops
    console.log("Drawing cards after skipping contract selection");
    const maxHandSize = getMaxHandSize();
    // Calculate how many cards to draw
    const cardsToDraw = Math.max(0, maxHandSize - hand.length);
    
    if (cardsToDraw > 0) {
      setTimeout(() => {
        drawCards(cardsToDraw);
      }, 300);
    }
  };

  // Toggle deck viewer
  const toggleDeckViewer = () => {
    setShowDeckViewer(!showDeckViewer);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="game-layout flex flex-col md:flex-row gap-4">
        {/* Left column with game header and score preview */}
        <div className="left-column w-full md:w-64 md:min-w-64 flex flex-col gap-4">
          <div className="md:h-1/2">
            <GameHeader 
              circle={gameState.circle}
              level={gameState.level}
              turn={gameState.turn}
              message={gameState.message}
            />
          </div>
          
          <div className="mt-4">
            <ScorePreview 
              gold={resources.gold}
              corruption={resources.corruption}
            />
          </div>
          
          {/* Plays and Discards remaining */}
          <div className="mt-4 bg-black bg-opacity-50 p-3 rounded border border-infernal-700">
            <div className="flex flex-col space-y-2">
              <div className={`${resources.playsRemaining > 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium flex justify-between`}>
                <span>Plays remaining:</span>
                <span>{resources.playsRemaining}</span>
              </div>
              <div className={`${resources.discardsRemaining > 0 ? 'text-blue-400' : 'text-red-400'} text-sm font-medium flex justify-between`}>
                <span>Discards remaining:</span>
                <span>{resources.discardsRemaining}</span>
              </div>
            </div>
          </div>
          
          {/* Deck viewer button */}
          <div className="mt-4 flex flex-col items-center">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={toggleDeckViewer}
              title="View Deck"
            >
              <Card 
                id={-1}
                sinType=""
                value={0}
                bloodCost={0}
                goldValue={0}
                selected={false}
                active={false}
                onClick={toggleDeckViewer}
                showBack={true}
              />
            </div>
            <div className="text-xs text-center mt-2 text-gray-400">
              Deck ({drawPile.length}/{drawPile.length + discardPile.length + hand.length})
            </div>
          </div>
          
          {/* Bottom buttons */}
          <div className="mt-auto mb-4 flex justify-center space-x-4">
            <button className="bg-black bg-opacity-70 hover:bg-opacity-90 text-brimstone-200 px-4 py-2 rounded border border-infernal-700 text-sm">
              Info
            </button>
            <button className="bg-black bg-opacity-70 hover:bg-opacity-90 text-brimstone-200 px-4 py-2 rounded border border-infernal-700 text-sm">
              Settings
            </button>
          </div>
        </div>
        
        {/* Main game area */}
        <div className="main-content flex-grow flex flex-col h-screen">
          {/* Resources bar */}
          <ResourcesBar 
            resources={resources}
            goldTarget={calculateGoldTarget(gameState.circle, modifiers)}
            animatingGold={gameState.animatingGold}
            animationProgress={gameState.goldAnimationProgress}
          />
          
          {gameState.phase === 'gameplay' && (
            <>
              {/* Signed contracts banner */}
              {signedContractKeys.length > 0 && (
                <div className="mt-4">
                  <SignedContractsBanner 
                    signedContracts={signedContracts}
                  />
                </div>
              )}
              
              {/* Active cards area */}
              <div className="mt-4 flex-grow">
                <ActiveCards 
                  activeCards={activeCards}
                  maxActiveCards={CARD_SETTINGS.maxActiveCards}
                  animationState={gameState.animationState}
                  animatingCards={gameState.animatingCards}
                />
              </div>
              
              {/* Hand area */}
              <div className="mt-auto mb-4">
                <HandArea 
                  hand={hand}
                  drawPile={drawPile}
                  discardPile={discardPile}
                  selectedCardIds={selectedCardIds}
                  toggleCardSelection={toggleCardSelection}
                  onPlayCards={playSelectedCards}
                  onDiscardCards={discardSelectedCards}
                  onSortByRank={sortHandByValue}
                  onSortBySin={sortHandBySin}
                  playsRemaining={resources.playsRemaining}
                  discardsRemaining={resources.discardsRemaining}
                  maxHandSize={getMaxHandSize()}
                />
              </div>
            </>
          )}
          
          {gameState.phase === 'contractShop' && (
            <div className="mt-4">
              <ContractShop
                availableContractKeys={availableContractKeys}
                getContractByKey={getContractByKey}
                onSignContract={handleSignContract}
                onSkip={skipContractSelection}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Deck viewer modal */}
      {showDeckViewer && (
        <DeckViewer
          allCards={fullDeck}
          usedCardIds={usedCardIds}
          onClose={toggleDeckViewer}
        />
      )}
    </div>
  );
};

export default Game; 