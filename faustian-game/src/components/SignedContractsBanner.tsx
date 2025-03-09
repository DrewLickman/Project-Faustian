import React, { useState } from 'react';
import { FaScroll, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ContractData } from '../types/gameTypes';

interface ExtendedContractData extends ContractData {
  contractKey: string;
}

interface SignedContractsBannerProps {
  signedContracts: ExtendedContractData[];
}

const SignedContractsBanner: React.FC<SignedContractsBannerProps> = ({ signedContracts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (signedContracts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-2">
        No contracts signed yet
      </div>
    );
  }

  return (
    <div className="signed-contracts bg-black bg-opacity-70 rounded-lg border border-infernal-800 overflow-hidden">
      <div 
        className="header flex items-center justify-between p-2 cursor-pointer bg-infernal-900"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaScroll className="text-infernal-400 mr-2" />
          <span className="text-brimstone-200 font-bold">Signed Contracts ({signedContracts.length})</span>
        </div>
        <div>
          {isExpanded ? (
            <FaChevronUp className="text-gray-400" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded ? (
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {signedContracts.map(contract => (
            <div 
              key={contract.contractKey} 
              className="contract p-2 bg-black bg-opacity-70 rounded border border-infernal-800"
            >
              <h3 className="text-infernal-400 font-bold text-sm">{contract.name}</h3>
              <div className="text-xs mt-1">
                <div className="text-green-500">{contract.benefit}</div>
                <div className="text-red-500">{contract.consequence}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-2 flex flex-wrap gap-2">
          {signedContracts.map(contract => (
            <div 
              key={contract.contractKey} 
              className="contract-tag px-2 py-1 text-xs bg-black bg-opacity-70 rounded border border-infernal-800"
            >
              {contract.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignedContractsBanner; 