import React from 'react';
import { ContractData } from '../../types/gameTypes';
import Contract from '../Contract';

interface ContractShopProps {
  availableContractKeys: string[];
  getContractByKey: (key: string) => ContractData | undefined;
  onSignContract: (contractKey: string) => void;
  onSkip: () => void;
}

const ContractShop: React.FC<ContractShopProps> = ({
  availableContractKeys,
  getContractByKey,
  onSignContract,
  onSkip
}) => {
  return (
    <div className="contract-shop bg-black bg-opacity-80 p-6 rounded-lg border border-infernal-800">
      <h2 className="text-xl font-bold text-brimstone-200 mb-4 text-center">
        Select a Contract to Sign
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {availableContractKeys.map(contractKey => {
          const contract = getContractByKey(contractKey);
          if (!contract) return null;
          
          return (
            <div key={contractKey} className="contract-item">
              <Contract
                contractKey={contractKey}
                name={contract.name}
                benefit={contract.benefit}
                consequence={contract.consequence}
                signed={false}
                onSign={() => onSignContract(contractKey)}
              />
            </div>
          );
        })}
      </div>
      
      <div className="text-center mt-6">
        <button
          onClick={onSkip}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
        >
          Skip - Continue Without Signing
        </button>
        
        <p className="text-gray-400 text-sm mt-2">
          Warning: Skipping will not grant any additional powers.
        </p>
      </div>
    </div>
  );
};

export default ContractShop; 