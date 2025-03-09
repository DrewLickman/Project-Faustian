import { useState, useEffect } from 'react';
import { CONTRACTS, selectRandomContracts } from '../data/contracts';
import { TURN_SETTINGS } from '../data/gameSettings';
import { ContractData, GameModifiers, GameResources } from '../types/gameTypes';

interface UseContractSystemProps {
  circle: number;
}

interface UseContractSystemReturn {
  availableContractKeys: string[];
  signedContractKeys: string[];
  signContract: (contractKey: string) => void;
  applyContractEffects: (
    contractKey: string, 
    resources: GameResources, 
    modifiers: GameModifiers
  ) => { newResources: GameResources, newModifiers: GameModifiers };
  selectContractsForCircle: (circle: number) => void;
  getContractByKey: (key: string) => ContractData | undefined;
  hasContract: (contractKey: string) => boolean;
}

export const useContractSystem = ({ circle }: UseContractSystemProps): UseContractSystemReturn => {
  const [availableContractKeys, setAvailableContractKeys] = useState<string[]>([]);
  const [signedContractKeys, setSignedContractKeys] = useState<string[]>([]);

  // Select random contracts for current circle
  const selectContractsForCircle = (circle: number) => {
    // Select random contracts for the current circle
    const contracts = selectRandomContracts(
      circle,
      TURN_SETTINGS.maxContractsAvailable,
      signedContractKeys
    );
    
    setAvailableContractKeys(contracts);
  };

  // Initialize available contracts for current circle
  useEffect(() => {
    selectContractsForCircle(circle);
  }, [circle]);

  // Sign a contract
  const signContract = (contractKey: string) => {
    if (!signedContractKeys.includes(contractKey)) {
      setSignedContractKeys(prev => [...prev, contractKey]);
    }
  };

  // Apply effects of a specific contract
  const applyContractEffects = (
    contractKey: string,
    resources: GameResources,
    modifiers: GameModifiers
  ) => {
    let newResources = { ...resources };
    let newModifiers = { ...modifiers };

    switch (contractKey) {
      case "devils_bargain":
        newResources.gold += 20;
        newResources.corruption += 10;
        break;
      case "blood_pact":
        newModifiers.goldMultiplier = 1.5;
        newResources.maxBlood -= 3;
        newResources.blood = Math.min(newResources.blood, newResources.maxBlood);
        break;
      case "soul_mortgage":
        newModifiers.bloodCostReduction += 1;
        // Soul debt will increase per turn, handled in game logic
        break;
      case "unholy_investiture":
        newModifiers.extraDraw += 2;
        // Corruption will increase per turn, handled in game logic
        break;
      case "infernal_blessing":
        newModifiers.bloodPerDiscard += 3;
        newModifiers.goldMultiplier = Math.max(newModifiers.goldMultiplier * 0.75, 0.5);
        break;
      case "vile_revelation":
        newModifiers.extraDraw += 3;
        newModifiers.bloodCostIncrease += 1;
        break;
      case "blasphemous_pact":
        newResources.corruption = Math.max(newResources.corruption - 15, 0);
        newResources.soulDebt += 20;
        break;
      case "diabolic_insight":
        newModifiers.sameTypeBonus += 3;
        newModifiers.discardPerTurn += 2;
        break;
      case "eternal_servitude":
        newModifiers.goldTargetReduction += 0.25;
        newModifiers.corruptionHealingDisabled = true;
        break;
      case "infernal_capacity":
        newModifiers.handSizeBonus += 5;
        // Corruption increase at start of level handled elsewhere
        break;
      case "strategic_advantage":
        newModifiers.playsPerLevelBonus += 2;
        newModifiers.discardsPerLevelBonus += 2;
        newResources.maxBlood -= 5;
        newResources.blood = Math.min(newResources.blood, newResources.maxBlood);
        break;
    }

    return { newResources, newModifiers };
  };

  // Get contract data by key
  const getContractByKey = (key: string): ContractData | undefined => {
    return CONTRACTS[key];
  };

  // Check if player has a specific contract
  const hasContract = (contractKey: string): boolean => {
    return signedContractKeys.includes(contractKey);
  };

  return {
    availableContractKeys,
    signedContractKeys,
    signContract,
    applyContractEffects,
    selectContractsForCircle,
    getContractByKey,
    hasContract
  };
}; 