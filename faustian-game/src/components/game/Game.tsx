import React, { useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useCardManagement } from '../../hooks/useCardManagement';
import { useContractSystem } from '../../hooks/useContractSystem';
import { calculateGoldTarget } from '../../utils/gameUtils';
import { CARD_SETTINGS } from '../../data/gameSettings';
import GameHeader from './GameHeader';
import ResourcesBar from './ResourcesBar';
import ActiveCards from './ActiveCards';
import HandArea from './HandArea';
import ContractShop from './ContractShop';
import SignedContractsBanner from '../SignedContractsBanner';
import { ContractData } from '../../types/gameTypes';

// Define the ExtendedContractData interface locally to match what SignedContractsBanner expects
interface ExtendedContractData extends ContractData {
  contractKey: string;
}

const Game: React.FC = () => {
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

  // Initialize game
  useEffect(() => {
    resetGame();
    resetDeck();
    drawCards(getMaxHandSize());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    
    internalPlayCards();
  };

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
    
    internalDiscardCards();
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
        drawCards(getMaxHandSize());
      }, 300);
    }, 1500);
  };

  // Handler for skipping contract selection
  const skipContractSelection = () => {
    moveToNextLevel(hasContract("infernal_capacity"));
    clearActiveCards();
    
    // Make sure the player has a full hand
    setTimeout(() => {
      drawCards(getMaxHandSize());
    }, 300);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <GameHeader 
        circle={gameState.circle}
        level={gameState.level}
        turn={gameState.turn}
        message={gameState.message}
      />
      
      <main className="game-container mt-4">
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
            <div className="mt-4">
              <ActiveCards 
                activeCards={activeCards}
                maxActiveCards={CARD_SETTINGS.maxActiveCards}
                animationState={gameState.animationState}
                animatingCards={gameState.animatingCards}
              />
            </div>
            
            {/* Hand area */}
            <div className="mt-4">
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
      </main>
    </div>
  );
};

export default Game; 