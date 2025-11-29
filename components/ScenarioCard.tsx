import React from 'react';
import { Scenario } from '../types';

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, isSelected, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-3xl p-4 transition-all duration-300 transform
        flex flex-col items-center justify-center gap-2 aspect-square shadow-lg
        ${isSelected ? 'ring-4 ring-offset-2 ring-indigo-500 scale-105' : 'hover:scale-105'}
        ${scenario.color}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="text-5xl drop-shadow-md">{scenario.icon}</div>
      <div className="text-lg font-bold text-white drop-shadow-md text-center leading-tight">
        {scenario.title}
      </div>
    </button>
  );
};

export default ScenarioCard;
