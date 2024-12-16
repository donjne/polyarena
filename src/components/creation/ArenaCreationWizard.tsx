import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Settings, Flag, Timer, Users,
  DollarSign, Database, ChevronRight, ChevronLeft,
  AlertCircle, Check, Crown, Target
} from 'lucide-react';
import type { 
  Arena,
  ArenaCreationWizardProps,
  CreationStep
} from '@/types/arena';
import { BasicInformation } from './steps/BasicInformation';
import { MatchConfiguration } from './steps/MatchConfiguration';
import { PrizeStructure } from './steps/PrizeStructure';
import { PlayerSettings } from './steps/PlayerSettings';
import { OracleIntegration } from './steps/OracleIntegration';

export const ArenaCreationWizard: React.FC<ArenaCreationWizardProps> = ({
  availableMatchTypes,
  availableOracles,
  onSubmit,
  minStake,
  maxStake
}) => {
  // State
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  
  // Initial form data
const [formData, setFormData] = React.useState<Partial<Arena>>({
  matchType: 'standard',
  predictionScope: 'crypto_price',
  status: 'pending',
  timestamp: Date.now(),
  rounds: {
    current: 0,
    total: 1,
    timePerRound: 300
  },
  players: {
    current: 0,
    minimum: 2,
    maximum: 100
  },
  entryFee: '', // Initialize with empty string
  validationRules: {
    minimumStake: minStake,
    maximumStake: maxStake,
    predictionWindow: 60,
    disputePeriod: 300
  },
  prizeStructure: {
    totalPool: "100.00",
    platformFee: 5,
    referralReward: 2.5,
    communityIncentive: 2.5,
    distribution: [
      { position: 1, percentage: 60 },
      { position: 2, percentage: 30 },
      { position: 3, percentage: 10 }
    ]
  }
});

  // Step configuration
  const steps: CreationStep[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Set up your arena name and type',
      icon: Flag,
      isValid: (data) => Boolean(
        data.name?.trim() &&
        data.matchType &&
        data.predictionScope
      )
    },
    {
      id: 2,
      title: 'Match Settings',
      description: 'Configure rounds and timing',
      icon: Settings,
      isValid: (data) => Boolean(
        data.rounds?.total &&
        data.rounds.total >= 1 &&
        data.rounds.timePerRound >= 60
      )
    },
    {
      id: 3,
      title: 'Prize Structure',
      description: 'Set up prize pool and distribution',
      icon: Crown,
      isValid: (data) => {
        const distribution = data.prizeStructure?.distribution;
        const total = distribution?.reduce((sum, tier) => sum + tier.percentage, 0);
        return Boolean(
          data.prizeStructure?.totalPool &&
          distribution?.length &&
          total === 100
        );
      }
    },
    {
      id: 4,
      title: 'Player Settings',
      description: 'Configure player limits and fees',
      icon: Users,
      isValid: (data) => Boolean(
        data.players?.minimum && 
        data.players?.maximum && 
        data.players.minimum >= 2 &&
        data.players.maximum > data.players.minimum &&
        data.entryFee &&
        parseFloat(data.entryFee) >= parseFloat(minStake) &&
        parseFloat(data.entryFee) <= parseFloat(maxStake)
      )
    },
    {
      id: 5,
      title: 'Oracle Integration',
      description: 'Set up data feeds and validation',
      icon: Target,
      isValid: (data) => Boolean(
        data.oracle?.provider &&
        data.oracle.feedId &&
        data.oracle.updateFrequency >= 10 &&
        data.validationRules?.predictionWindow && 
        data.validationRules.predictionWindow >= 30
      )
    }
  ];

  // Validation
  const validateStep = (step: number): boolean => {
    setError(null);
    const stepConfig = steps.find(s => s.id === step);
    if (!stepConfig) return false;
    return stepConfig.isValid(formData);
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setError('Please fill in all required fields correctly');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Ensure all required fields are present before submission
      if (!formData.name || !formData.matchType || !formData.oracle) {
        throw new Error('Missing required fields');
      }
      
      await onSubmit(formData as Arena);
      setSuccess('Arena created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create arena');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                currentStep === step.id
                  ? 'text-purple-600'
                  : currentStep > step.id
                  ? 'text-green-500'
                  : 'text-gray-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center
                ${currentStep === step.id
                  ? 'bg-purple-100'
                  : currentStep > step.id
                  ? 'bg-green-100'
                  : 'bg-gray-100'
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={24} />
                ) : (
                  <step.icon size={24} />
                )}
              </div>
              <div className="text-sm mt-2 font-medium">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl p-8 shadow-lg"
        >
          {currentStep === 1 && (
            <BasicInformation
              value={{
                name: formData.name,
                matchType: formData.matchType,
                predictionScope: formData.predictionScope
              }}
              onChange={(updates) => setFormData({ ...formData, ...updates })}
              errors={error ? { form: error } : {}}
              availableMatchTypes={availableMatchTypes}
            />
          )}
          {currentStep === 2 && (
            <MatchConfiguration
              value={{
                rounds: formData.rounds,
                predictions: formData.predictions
              }}
              onChange={(updates) => setFormData({ ...formData, ...updates })}
              errors={error ? { form: error } : {}}
            />
          )}
          {currentStep === 3 && formData.prizeStructure && (
            <PrizeStructure
              value={{ prizeStructure: formData.prizeStructure }}
              onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
              errors={error ? { form: error } : {}}
            />
          )}

          {currentStep === 4 && formData.players && formData.validationRules && (
            <PlayerSettings
              value={{
                players: formData.players,
                entryFee: formData.entryFee ?? '', // Provide default empty string
                validationRules: formData.validationRules
              }}
              onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
              errors={error ? { form: error } : {}}
            />
          )}
          {currentStep === 5 && (
            <OracleIntegration
              value={{ oracle: formData.oracle }}
              onChange={(updates) => setFormData({ ...formData, ...updates })}
              errors={error ? { form: error } : {}}
              availableOracles={availableOracles}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg flex items-center space-x-2
            ${currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={currentStep === steps.length ? handleSubmit : handleNext}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg flex items-center space-x-2
            ${isSubmitting
              ? 'bg-purple-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
        >
          <span>{currentStep === steps.length ? 'Create Arena' : 'Next'}</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Status Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 rounded-lg flex items-center space-x-2 text-green-700"
        >
          <Check size={20} />
          <span>{success}</span>
        </motion.div>
      )}
    </div>
  );
};