import React from 'react';
import { FaTint } from 'react-icons/fa';

interface CardProps {
  id: number;
  sinType: string;
  value: number;
  bloodCost: number;
  goldValue: number;
  selected: boolean;
  active: boolean;
  onClick: () => void;
  showBack?: boolean;
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  sinType,
  value,
  bloodCost,
  goldValue,
  selected,
  active,
  onClick,
  showBack = false,
  disabled = false
}) => {
  const getSinColor = (sinType: string): string => {
    switch (sinType.toLowerCase()) {
      case 'pride':
        return 'text-purple-500';
      case 'greed':
        return 'text-yellow-400';
      case 'lust':
        return 'text-pink-500';
      case 'envy':
        return 'text-green-500';
      case 'gluttony':
        return 'text-orange-500';
      case 'wrath':
        return 'text-red-600';
      case 'sloth':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSinBackground = (sinType: string): string => {
    switch (sinType.toLowerCase()) {
      case 'pride':
        return 'bg-purple-900 bg-opacity-30';
      case 'greed':
        return 'bg-yellow-900 bg-opacity-30';
      case 'lust':
        return 'bg-pink-900 bg-opacity-30';
      case 'envy':
        return 'bg-green-900 bg-opacity-30';
      case 'gluttony':
        return 'bg-orange-900 bg-opacity-30';
      case 'wrath':
        return 'bg-red-900 bg-opacity-30';
      case 'sloth':
        return 'bg-blue-900 bg-opacity-30';
      default:
        return 'bg-gray-900 bg-opacity-30';
    }
  };

  // Card backside rendering
  if (showBack) {
    return (
      <div 
        className="w-24 h-36 rounded-lg border-2 border-infernal-700 bg-infernal-950 flex items-center justify-center cursor-default"
        style={{ transform: 'scale(1)' }}
      >
        <div className="text-center">
          <div className="text-infernal-600 text-xl font-bold mb-1">Faustian</div>
          <div className="text-infernal-500 text-xs">A devil's bargain</div>
        </div>
      </div>
    );
  }

  // Normal card rendering
  return (
    <div
      className={`
        card w-24 h-36 
        rounded-lg shadow-lg
        border-2 cursor-pointer
        transition-all duration-200
        ${getSinBackground(sinType)}
        ${selected ? 'border-amber-500 transform scale-105 shadow-amber-900' : 'border-infernal-700'}
        ${active ? 'opacity-90' : 'hover:shadow-md hover:border-infernal-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ transform: active ? 'scale(0.95)' : 'scale(1)' }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Sin type centered at top */}
      <div className="card-header flex justify-center items-center p-1">
        <div className={`card-type text-xs font-semibold uppercase ${getSinColor(sinType)}`}>
          {sinType}
        </div>
      </div>

      {/* Sin initial + rank in center */}
      <div className="card-center h-16 flex items-center justify-center">
        <div className={`text-2xl font-bold ${getSinColor(sinType)}`}>
          {sinType.charAt(0).toUpperCase()}{value}
        </div>
      </div>

      {/* Blood cost at bottom */}
      <div className="card-footer flex justify-center items-center p-1 mt-auto">
        <div className="cost flex items-center">
          <FaTint className="text-red-600 mr-1 text-sm" />
          <span className="text-sm font-bold text-white">{bloodCost}</span>
        </div>
      </div>
    </div>
  );
};

export default Card; 