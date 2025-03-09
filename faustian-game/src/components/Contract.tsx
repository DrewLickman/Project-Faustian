import React from 'react';
import { FaSkull, FaScroll, FaSignature, FaHandshake } from 'react-icons/fa';
import { ContractProps } from '../types/gameTypes';

const Contract: React.FC<ContractProps> = ({
  contractKey,
  name,
  benefit,
  consequence,
  signed,
  onSign
}) => {
  return (
    <div 
      className={`contract-card p-4 rounded-lg border ${
        signed ? 'bg-infernal-950 border-infernal-700 cursor-default' : 
        'bg-black bg-opacity-80 border-infernal-800 cursor-pointer hover:bg-infernal-950 hover:border-infernal-700 transition-colors'
      }`}
      onClick={signed ? undefined : onSign}
    >
      <div className="contract-header mb-3 pb-2 border-b border-infernal-800">
        <h3 className="text-brimstone-200 font-bold text-base flex items-center">
          <FaHandshake className="mr-2 text-infernal-600" />
          {name}
        </h3>
      </div>

      <div className="contract-body text-sm">
        <div className="benefit mb-2">
          <h4 className="text-green-300 font-semibold mb-1">Benefit</h4>
          <p className="text-white">{benefit}</p>
        </div>

        <div className="consequence">
          <h4 className="text-red-400 font-semibold mb-1 flex items-center">
            <FaSkull className="mr-1 text-red-500" />
            Consequence
          </h4>
          <p className="text-gray-300">{consequence}</p>
        </div>
      </div>

      {!signed && (
        <div className="mt-3 text-center">
          <button 
            className="bg-infernal-800 hover:bg-infernal-700 text-white rounded px-3 py-1 text-sm"
            onClick={onSign}
          >
            Sign Contract
          </button>
        </div>
      )}
      
      {signed && (
        <div className="mt-3 text-center">
          <span className="text-infernal-400 text-sm">Contract Signed</span>
        </div>
      )}
    </div>
  );
};

export default Contract; 