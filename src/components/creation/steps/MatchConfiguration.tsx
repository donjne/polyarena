import React from 'react';
import { motion } from 'framer-motion';

// Define the base types first
type PredictionType = 'binary' | 'numeric' | 'multi_choice';

interface NumericRange {
  min: number;
  max: number;
}

interface RoundsConfig {
  current: number;
  total: number;
  timePerRound: number;
}

interface PredictionConfig {
  type: PredictionType;
  options?: string[];
  range?: NumericRange;
}

interface MatchConfigurationValue {
  rounds?: {
    current: number;
    total: number;
    timePerRound: number;
  };
  predictions?: {
    type: 'binary' | 'numeric' | 'multi_choice';
    options?: string[];
    range?: {
      min: number;
      max: number;
    };
  };
}

interface MatchConfigurationProps {
  value: MatchConfigurationValue;
  onChange: (value: MatchConfigurationValue) => void;
  errors?: Record<string, string>;
}

export const MatchConfiguration: React.FC<MatchConfigurationProps> = ({
  value,
  onChange,
  errors
}) => {
  const handleRoundChange = (field: keyof Omit<RoundsConfig, 'current'>, val: string) => {
    const parsedValue = parseInt(val) || 0;
    onChange({
      ...value,
      rounds: {
        ...(value.rounds || { current: 0, total: 0, timePerRound: 0 }),
        [field]: parsedValue
      }
    });
  };

  const predictionTypes = [
    { id: 'binary' as const, label: 'Binary (Yes/No)' },
    { id: 'numeric' as const, label: 'Numeric Range' },
    { id: 'multi_choice' as const, label: 'Multiple Choice' }
  ];

  const handlePredictionTypeChange = (type: PredictionType) => {
    const newPredictions: PredictionConfig = {
      type,
      ...(type === 'numeric' ? { range: { min: 0, max: 100 } } : {}),
      ...(type === 'multi_choice' ? { options: [] } : {})
    };

    onChange({
      ...value,
      predictions: newPredictions
    });
  };

  const handleNumericRangeChange = (field: keyof NumericRange, val: string) => {
    const parsedValue = parseInt(val) || 0;
    onChange({
      ...value,
      predictions: {
        ...value.predictions,
        range: {
          ...(value.predictions?.range || { min: 0, max: 100 }),
          [field]: parsedValue
        }
      } as PredictionConfig
    });
  };

  const handleOptionsChange = (index: number, newValue: string) => {
    const newOptions = [...(value.predictions?.options || [])];
    newOptions[index] = newValue;
    onChange({
      ...value,
      predictions: {
        ...value.predictions,
        options: newOptions
      } as PredictionConfig
    });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = value.predictions?.options?.filter((_, i) => i !== index);
    onChange({
      ...value,
      predictions: {
        ...value.predictions,
        options: newOptions
      } as PredictionConfig
    });
  };

  const handleAddOption = () => {
    onChange({
      ...value,
      predictions: {
        ...value.predictions,
        options: [...(value.predictions?.options || []), '']
      } as PredictionConfig
    });
  };

  return (
    <div className="space-y-6">
      {/* Rounds Configuration */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Total Rounds
          </label>
          <input
            type="number"
            min="1"
            value={value.rounds?.total || ''}
            onChange={(e) => handleRoundChange('total', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
              ${errors?.totalRounds
                ? 'border-red-300 focus:ring-red-500'
                : 'border-purple-200 focus:ring-purple-500'
              } focus:outline-none focus:ring-2`}
          />
          {errors?.totalRounds && (
            <p className="mt-1 text-sm text-red-600">{errors.totalRounds}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Time per Round (seconds)
          </label>
          <input
            type="number"
            min="60"
            step="60"
            value={value.rounds?.timePerRound || ''}
            onChange={(e) => handleRoundChange('timePerRound', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
              ${errors?.timePerRound
                ? 'border-red-300 focus:ring-red-500'
                : 'border-purple-200 focus:ring-purple-500'
              } focus:outline-none focus:ring-2`}
          />
          {errors?.timePerRound && (
            <p className="mt-1 text-sm text-red-600">{errors.timePerRound}</p>
          )}
        </div>
      </div>

      {/* Prediction Type */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Prediction Type
        </label>
        <div className="grid grid-cols-3 gap-4">
          {predictionTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePredictionTypeChange(type.id)}
              className={`p-4 rounded-lg border-2 transition-all
                ${value.predictions?.type === type.id
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-purple-200 hover:border-purple-300'
                }`}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Prediction Type Specific Configuration */}
      {value.predictions?.type === 'numeric' && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Minimum Value
            </label>
            <input
              type="number"
              value={value.predictions.range?.min ?? ''}
              onChange={(e) => handleNumericRangeChange('min', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                        focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Maximum Value
            </label>
            <input
              type="number"
              value={value.predictions.range?.max ?? ''}
              onChange={(e) => handleNumericRangeChange('max', e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                        focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {value.predictions?.type === 'multi_choice' && (
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {value.predictions.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionsChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="w-full p-2 rounded-lg border-2 border-dashed border-purple-200
                       text-purple-600 hover:border-purple-300 hover:bg-purple-50"
            >
              Add Option
            </button>
          </div>
        </div>
      )}
    </div>
  );
};