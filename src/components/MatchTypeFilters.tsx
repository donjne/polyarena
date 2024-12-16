import { MatchTypeId, MatchType } from '@/types/arena';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchTypeFiltersProps {
    selectedType: MatchTypeId | null;
    onTypeSelect: (type: MatchTypeId | null) => void;
    matchTypes: MatchType[];
  }
  
  export const MatchTypeFilters: React.FC<MatchTypeFiltersProps> = ({
    selectedType,
    onTypeSelect,
    matchTypes
  }) => {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => onTypeSelect(null)}
          className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron'] whitespace-nowrap
            ${!selectedType
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
              : 'bg-white/50 text-purple-600 hover:bg-white'
            }`}
        >
          <span>ALL TYPES</span>
        </motion.button>
  
        {matchTypes.map(type => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => onTypeSelect(type.id)}
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
    );
  };