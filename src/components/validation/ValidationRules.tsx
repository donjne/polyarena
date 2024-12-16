import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, AlertTriangle, Clock, DollarSign, 
  Users, Check, X, HelpCircle 
} from 'lucide-react';
import type { Arena } from '../../types/arena';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationRulesProps {
  arena: Arena;
  onValidate: (result: ValidationResult) => void;
  showDetails?: boolean;
}

export const ValidationRules: React.FC<ValidationRulesProps> = ({
  arena,
  onValidate,
  showDetails = false
}) => {
  const [validationResult, setValidationResult] = React.useState<ValidationResult>({
    isValid: false,
    errors: [],
    warnings: []
  });

  const validateArena = React.useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Time window validation
    if (arena.rounds.timePerRound < 60) {
      errors.push('Round duration must be at least 60 seconds');
    }
    if (arena.rounds.timePerRound > 86400) {
      warnings.push('Long round duration may affect user engagement');
    }

    // Player limits validation
    if (arena.players.minimum < 2) {
      errors.push('Minimum 2 players required');
    }
    if (arena.players.maximum > 10000) {
      warnings.push('Large player cap may affect performance');
    }

    // Entry fee validation
    const minFee = parseFloat(arena.validationRules.minimumStake);
    const maxFee = parseFloat(arena.validationRules.maximumStake);
    const entryFee = parseFloat(arena.entryFee);

    if (entryFee < minFee) {
      errors.push(`Entry fee below minimum stake (${minFee})`);
    }
    if (entryFee > maxFee) {
      errors.push(`Entry fee above maximum stake (${maxFee})`);
    }

    // Prize pool validation
    const totalPrize = parseFloat(arena.prizeStructure.totalPool);
    if (totalPrize <= 0) {
      errors.push('Prize pool must be greater than 0');
    }

    const distributionTotal = arena.prizeStructure.distribution
      .reduce((sum, tier) => sum + tier.percentage, 0);
    
    if (distributionTotal !== 100) {
      errors.push('Prize distribution must total 100%');
    }

    const result = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    setValidationResult(result);
    onValidate(result);

    return result;
  }, [arena, onValidate]);

  React.useEffect(() => {
    validateArena();
  }, [validateArena]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="text-purple-600" size={24} />
          <h3 className="text-lg font-medium text-purple-900">Validation Rules</h3>
        </div>

        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          validationResult.isValid
            ? 'bg-green-100 text-green-600'
            : 'bg-red-100 text-red-600'
        }`}>
          {validationResult.isValid ? 'Valid' : 'Invalid'}
        </div>
      </div>

      {/* Validation Summary */}
      <div className="space-y-4">
        {/* Time Rules */}
        <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
          <Clock className="text-purple-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <div className="font-medium text-purple-900">Time Rules</div>
            <div className="text-sm text-purple-600 mt-1">
              Round Duration: {arena.rounds.timePerRound}s
            </div>
            <div className="text-sm text-purple-600">
              Prediction Window: {arena.validationRules.predictionWindow}s
            </div>
          </div>
          {arena.rounds.timePerRound >= 60 ? (
            <Check className="text-green-500 flex-shrink-0" size={20} />
          ) : (
            <X className="text-red-500 flex-shrink-0" size={20} />
          )}
        </div>

        {/* Stake Rules */}
        <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
          <DollarSign className="text-purple-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <div className="font-medium text-purple-900">Stake Rules</div>
            <div className="text-sm text-purple-600 mt-1">
              Min Stake: {arena.validationRules.minimumStake}
            </div>
            <div className="text-sm text-purple-600">
              Max Stake: {arena.validationRules.maximumStake}
            </div>
          </div>
          {parseFloat(arena.entryFee) >= parseFloat(arena.validationRules.minimumStake) &&
           parseFloat(arena.entryFee) <= parseFloat(arena.validationRules.maximumStake) ? (
            <Check className="text-green-500 flex-shrink-0" size={20} />
          ) : (
            <X className="text-red-500 flex-shrink-0" size={20} />
          )}
        </div>

        {/* Player Rules */}
        <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
          <Users className="text-purple-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <div className="font-medium text-purple-900">Player Rules</div>
            <div className="text-sm text-purple-600 mt-1">
              Min Players: {arena.players.minimum}
            </div>
            <div className="text-sm text-purple-600">
              Max Players: {arena.players.maximum}
            </div>
          </div>
          {arena.players.minimum >= 2 ? (
            <Check className="text-green-500 flex-shrink-0" size={20} />
          ) : (
            <X className="text-red-500 flex-shrink-0" size={20} />
          )}
        </div>

        {/* Validation Messages */}
        {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
          <div className="mt-6 space-y-4">
            {validationResult.errors.map((error, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg"
              >
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-red-700">{error}</span>
              </div>
            ))}

            {validationResult.warnings.map((warning, index) => (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
              >
                <HelpCircle className="text-yellow-500 flex-shrink-0" size={20} />
                <span className="text-yellow-700">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {showDetails && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={validateArena}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-purple-100 text-purple-600
                     hover:bg-purple-200 transition-colors"
          >
            Revalidate Arena
          </motion.button>
        )}
      </div>
    </div>
  );
};