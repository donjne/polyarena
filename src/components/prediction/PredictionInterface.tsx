import React from 'react';
import { motion } from 'framer-motion';
import { 
  Timer, AlertCircle, ChevronUp, ChevronDown, 
  DollarSign,  
} from 'lucide-react';
import type { Arena } from '../../types/arena';

type OddsOption = string | number | 'yes' | 'no';

interface PredictionValue {
    type: 'binary' | 'numeric' | 'multi_choice';
    value: OddsOption;
    confidence?: number;
    stake: string;
  }
  
interface PredictionInterfaceProps {
    arena: Arena;
    onSubmitPrediction: (prediction: PredictionValue) => Promise<boolean>;
    timeRemaining: number; // in seconds
    currentOdds?: {
      forOption: Record<OddsOption, number>;
      totalStaked: string;
    };
}

export const PredictionInterface: React.FC<PredictionInterfaceProps> = ({
  arena,
  onSubmitPrediction,
  timeRemaining,
  currentOdds
}) => {
  const [prediction, setPrediction] = React.useState<PredictionValue | null>(null);
  const [stake, setStake] = React.useState<string>(arena.validationRules.minimumStake);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const formattedTimeRemaining = React.useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  const potentialReward = React.useMemo(() => {
    if (!prediction || !currentOdds) return '0';
    
    const odds = currentOdds.forOption[prediction.value] || 1;
    const stakeNum = parseFloat(stake);
    
    return (stakeNum * odds).toFixed(2);
  }, [prediction, currentOdds, stake]);

  const handleStakeChange = (value: string) => {
    const numValue = parseFloat(value);
    const min = parseFloat(arena.validationRules.minimumStake);
    const max = parseFloat(arena.validationRules.maximumStake);

    if (numValue < min) {
      setError(`Minimum stake is ${min}`);
      return;
    }
    if (numValue > max) {
      setError(`Maximum stake is ${max}`);
      return;
    }

    setStake(value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!prediction) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await onSubmitPrediction({
        ...prediction,
        stake
      });

      if (!success) {
        setError('Failed to submit prediction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-xl p-6">
      {/* Timer */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-purple-900">
          <Timer size={20} className="text-purple-600" />
          <span className="font-medium">Time Remaining</span>
        </div>
        <div className="font-['Orbitron'] text-xl text-purple-900">
          {formattedTimeRemaining}
        </div>
      </div>

      {/* Prediction Input */}
      <div className="space-y-6">
        {arena.predictions.type === 'binary' && (
          <div className="grid grid-cols-2 gap-4">
            {['yes', 'no'].map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                onClick={() => setPrediction({
                  type: 'binary',
                  value: option,
                  stake
                })}
                className={`p-4 rounded-lg border-2 transition-all duration-300
                  ${prediction?.value === option
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-purple-200 hover:border-purple-300'
                  }`}
              >
                <div className="text-center">
                  <div className="font-medium text-purple-900 mb-2">
                    {option === 'yes' ? 'Yes' : 'No'}
                    </div>
                    {currentOdds && (
                    <div className="text-sm text-purple-600">
                      {currentOdds.forOption[option]}x
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {arena.predictions.type === 'numeric' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={prediction?.value as number || ''}
                onChange={(e) => setPrediction({
                  type: 'numeric',
                  value: parseFloat(e.target.value),
                  stake
                })}
                className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                          focus:outline-none focus:ring-2 focus:ring-purple-500/30 
                          focus:border-purple-500"
                placeholder="Enter your prediction..."
                min={arena.predictions.range?.min}
                max={arena.predictions.range?.max}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col">
                <button
                  onClick={() => {
                    const current = (prediction?.value as number) || 0;
                    setPrediction({
                      type: 'numeric',
                      value: current + 1,
                      stake
                    });
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ChevronUp size={20} />
                </button>
                <button
                  onClick={() => {
                    const current = (prediction?.value as number) || 0;
                    setPrediction({
                      type: 'numeric',
                      value: current - 1,
                      stake
                    });
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
            </div>
            
            {arena.predictions.range && (
              <div className="flex justify-between text-sm text-purple-600">
                <span>Min: {arena.predictions.range.min}</span>
                <span>Max: {arena.predictions.range.max}</span>
              </div>
            )}
          </div>
        )}

        {arena.predictions.type === 'multi_choice' && (
          <div className="space-y-2">
            {arena.predictions.options?.map((option) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.01 }}
                onClick={() => setPrediction({
                  type: 'multi_choice',
                  value: option,
                  stake
                })}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300
                  ${prediction?.value === option
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-purple-200 hover:border-purple-300'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-purple-900">{option}</span>
                  {currentOdds && (
                    <span className="text-purple-600">
                      {currentOdds.forOption[option]}x
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Stake Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-purple-900">
            Your Stake
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-600">
              <DollarSign size={20} />
            </div>
            <input
              type="number"
              value={stake}
              onChange={(e) => handleStakeChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                        focus:outline-none focus:ring-2 focus:ring-purple-500/30 
                        focus:border-purple-500"
              placeholder="Enter stake amount..."
            />
          </div>
          
          {/* Potential Reward */}
          {prediction && (
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <span className="text-purple-600">Potential Reward</span>
              <span className="font-bold text-purple-900">${potentialReward}</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          disabled={!prediction || isSubmitting}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-medium shadow-lg transition-all duration-300
            ${(!prediction || isSubmitting)
              ? 'bg-purple-200 text-purple-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/20 hover:shadow-purple-500/40'
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Prediction'}
        </motion.button>
      </div>
    </div>
  );
};