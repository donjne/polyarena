import React from 'react';
import { motion } from 'framer-motion';
import type { MatchType, PredictionScope } from '@/types/arena';

interface BasicInformationProps {
  value: {
    name?: string;
    matchType?: MatchType['id'];
    predictionScope?: PredictionScope;
    description?: string;
  };
  onChange: (value: BasicInformationProps['value']) => void;
  errors?: Record<string, string>;
  availableMatchTypes: MatchType[];
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  value,
  onChange,
  errors,
  availableMatchTypes
}) => {
  const predictionScopes: PredictionScope[] = [
    'crypto_price',
    'sports_outcome',
    'event_result',
    'binary_outcome'
  ];

  return (
    <div className="space-y-6">
      {/* Arena Name */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Arena Name
        </label>
        <input
          type="text"
          value={value.name || ''}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
            ${errors?.name 
              ? 'border-red-300 focus:ring-red-500'
              : 'border-purple-200 focus:ring-purple-500'
            } focus:outline-none focus:ring-2`}
          placeholder="Enter arena name..."
        />
        {errors?.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Match Type */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Match Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {availableMatchTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onChange({ ...value, matchType: type.id })}
              className={`p-4 rounded-lg border-2 text-left transition-all
                ${value.matchType === type.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-purple-200 hover:border-purple-300'
                }`}
            >
              <div className="flex items-center space-x-3">
                <type.icon className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium text-purple-900">
                    {type.label}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    {type.description}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
        {errors?.matchType && (
          <p className="mt-1 text-sm text-red-600">{errors.matchType}</p>
        )}
      </div>

      {/* Prediction Scope */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Prediction Scope
        </label>
        <select
          value={value.predictionScope || ''}
          onChange={(e) => onChange({
            ...value,
            predictionScope: e.target.value as PredictionScope
          })}
          className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
            ${errors?.predictionScope
              ? 'border-red-300 focus:ring-red-500'
              : 'border-purple-200 focus:ring-purple-500'
            } focus:outline-none focus:ring-2`}
        >
          <option value="">Select prediction scope...</option>
          {predictionScopes.map((scope) => (
            <option key={scope} value={scope}>
              {scope.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </option>
          ))}
        </select>
        {errors?.predictionScope && (
          <p className="mt-1 text-sm text-red-600">{errors.predictionScope}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Description
        </label>
        <textarea
          value={value.description || ''}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Describe your arena..."
        />
      </div>
    </div>
  );
};