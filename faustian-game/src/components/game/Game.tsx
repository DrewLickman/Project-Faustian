import React, { useEffect } from 'react';
import { useGameContext } from '../../game/state/GameContext';
import { calculateGoldTarget } from '../../game/config/gameConfig';
import { defaultConfig } from '../../game/config/gameConfig';

// Import UI components
import GameHeader from './ui/GameHeader';
import ResourcesBar from './ui/ResourcesBar';
import ActiveCardsArea from './ui/ActiveCardsArea';
import HandArea from './ui/HandArea';
import ContractShop from './ContractShop';
import SignedContractsBanner from '../SignedContractsBanner';
import { ExtendedContractData, ContractData } from '../../game/state/types';

const Game: React.FC = () => {
  // Get state and actions from context
  const { 
    state, 
    dispatch,
    drawCards,
    playSelectedCards,
    discardSelectedCards,
    toggleCardSelection,
    sortCards
  } = useGameContext();
  
  // Destructure state for easier access
  const { gameState, resources, modifiers, cardState } = state;
  
  // Initialize game on component mount
  useEffect(() => {
    dispatch({ type: 'INITIALIZE_GAME' });
  }, [dispatch]);
  
  // Calculate gold target based on current circle and level
  const goldTarget = calculateGoldTarget(
    gameState.circle, 
    gameState.level, 
    defaultConfig
  );
  
  // Handle contract signing
  const handleSignContract = (contractKey: string) => {
    dispatch({ 
      type: 'SIGN_CONTRACT', 
      payload: { contractKey } 
    });
  };
  
  // Handle skipping contract selection
  const skipContractSelection = () => {
    dispatch({ type: 'SKIP_CONTRACT' });
  };
  
  // Sort cards by rank
  const handleSortByRank = () => {
    sortCards('rank');
  };
  
  // Sort cards by sin
  const handleSortBySin = () => {
    sortCards('sin');
  };
  
  // Temporary mock data for contracts until we implement contract state in context
  const signedContracts: ExtendedContractData[] = [];
  const availableContractKeys: string[] = [];
  
  // Mock contract getter function
  const getContractByKey = (key: string): ContractData | undefined => {
    return undefined;
  };
  
  return (
    <div className="game-container bg-black text-white min-h-screen p-4">
      {/* Game header with circle, level, turn info */}
      <GameHeader 
        circle={gameState.circle}
        level={gameState.level}
        turn={gameState.turn}
        message={gameState.message}
      />
      
      {/* Resources bar */}
      <ResourcesBar 
        resources={resources}
        goldTarget={goldTarget}
        animatingGold={gameState.animatingGold}
        animationProgress={gameState.goldAnimationProgress}
      />
      
      {/* Main game content */}
      <main className="mt-4">
        {gameState.phase === 'gameplay' && (
          <>
            {/* Signed contracts banner */}
            {signedContracts.length > 0 && (
              <div className="mt-4">
                <SignedContractsBanner 
                  signedContracts={signedContracts}
                />
              </div>
            )}
            
            {/* Active cards area */}
            <div className="mt-4">
              <ActiveCardsArea 
                activeCards={cardState.activeCards}
                maxActiveCards={defaultConfig.cardValues.maxActiveCards}
                animationState={gameState.animationState}
                animatingCards={gameState.animatingCards}
              />
            </div>
            
            {/* Hand area */}
            <div className="mt-4">
              <HandArea 
                hand={cardState.hand}
                drawPile={cardState.drawPile}
                discardPile={cardState.discardPile}
                selectedCardIds={cardState.selectedCardIds}
                toggleCardSelection={toggleCardSelection}
                onPlayCards={playSelectedCards}
                onDiscardCards={discardSelectedCards}
                onSortByRank={handleSortByRank}
                onSortBySin={handleSortBySin}
                playsRemaining={resources.playsRemaining}
                discardsRemaining={resources.discardsRemaining}
                maxHandSize={resources.maxHandSize}
              />
            </div>
          </>
        )}
        
        {gameState.phase === 'contract_shop' && (
          <div className="mt-4">
            <ContractShop 
              availableContractKeys={availableContractKeys}
              getContractByKey={getContractByKey}
              onSignContract={handleSignContract}
              onSkip={skipContractSelection}
            />
          </div>
        )}
        
        {gameState.phase === 'game_over' && (
          <div className="mt-4 text-center">
            <h2 className="text-2xl text-red-500 font-bold">Game Over</h2>
            <p className="mt-2 text-gray-400">Your soul belongs to the devil now.</p>
            <button 
              className="mt-4 px-6 py-2 bg-infernal-700 hover:bg-infernal-600 text-white rounded-lg"
              onClick={() => dispatch({ type: 'INITIALIZE_GAME' })}
            >
              Try Again
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Game; 