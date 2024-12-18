// components/MatchTypeFilters.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { MatchType, MatchTypeId } from '@/types/arena';

interface MatchTypeFiltersProps {
  selectedType: MatchTypeId | null;  // Changed from string to MatchTypeId
  onTypeSelect: (type: MatchTypeId | null) => void;  // Changed from string to MatchTypeId
  matchTypes: MatchType[];
}

export function MatchTypeFilters({
  selectedType,
  onTypeSelect,
  matchTypes
}: MatchTypeFiltersProps) {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4">
      <div className="min-w-max">
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => onTypeSelect(null)}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
              ${!selectedType
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/50 text-purple-600 hover:bg-white'
              }`}
          >
            <span>ALL TYPES</span>
          </motion.button>

          {matchTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onTypeSelect(
                selectedType === type.id ? null : type.id
              )}
              className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
                ${selectedType === type.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/50 text-purple-600 hover:bg-white'
                }`}
            >
              <type.icon size={20} />
              <span>{type.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}