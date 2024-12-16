import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Settings, DollarSign, Users, Clock, 
  ChevronRight, ChevronLeft, Save, AlertCircle,
  Check, Database
} from 'lucide-react';
import type { 
  Arena, 
  MatchType, 
  PredictionScope,
  MarketOracle
} from '@/types/arena';

interface ArenaCreationStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Trophy;
}

interface ArenaCreationProps {
  onSubmit: (arena: Arena) => Promise<boolean>;
  availableMatchTypes: MatchType[];
  availableOracles: MarketOracle[];
}

interface ArenaFormData {
  name: string;
  matchType: MatchType['id'];
  predictionScope: PredictionScope;
  rounds: {
    total: number;
    timePerRound: number;
  };
  oracle: MarketOracle;
  prizeStructure: {
    totalPool: string;
    distribution: {
      position: number;
      percentage: number;
    }[];
    platformFee: number;
    referralReward: number;
    communityIncentive: number;
  };
  entryFee: string;
  players: {
    minimum: number;
    maximum: number;
  };
  predictions: {
    type: 'binary' | 'numeric' | 'multi_choice';
    options?: string[];
    range?: {
      min: number;
      max: number;
    };
  };
  validationRules: {
    minimumStake: string;
    maximumStake: string;
    predictionWindow: number;
    disputePeriod: number;
  };
}

export const ArenaCreation: React.FC<ArenaCreationProps> = ({
  onSubmit,
  availableMatchTypes,
  availableOracles
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [formData, setFormData] = React.useState<Partial<ArenaFormData>>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const steps: ArenaCreationStep[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Set up your arena name and type',
      icon: Trophy
    },
    {
      id: 2,
      title: 'Match Configuration',
      description: 'Configure rounds and timing',
      icon: Settings
    },
    {
      id: 3,
      title: 'Prize Structure',
      description: 'Set up prize pool and distribution',
      icon: DollarSign
    },
    {
      id: 4,
      title: 'Player Settings',
      description: 'Configure player limits and entry fees',
      icon: Users
    },
    {
      id: 5,
      title: 'Oracle Integration',
      description: 'Set up data feeds and validation',
      icon: Database
    }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name?.trim()) {
          newErrors.name = 'Arena name is required';
        }
        if (!formData.matchType) {
          newErrors.matchType = 'Match type is required';
        }
        if (!formData.predictionScope) {
          newErrors.predictionScope = 'Prediction scope is required';
        }
        break;

      case 2:
        if (!formData.rounds?.total || formData.rounds.total < 1) {
          newErrors.totalRounds = 'At least 1 round is required';
        }
        if (!formData.rounds?.timePerRound || formData.rounds.timePerRound < 60) {
          newErrors.timePerRound = 'Round time must be at least 60 seconds';
        }
        break;

      case 3:
        if (!formData.prizeStructure?.totalPool) {
          newErrors.totalPool = 'Prize pool is required';
        }
        if (!formData.prizeStructure?.distribution?.length) {
          newErrors.distribution = 'Prize distribution is required';
        } else {
          const total = formData.prizeStructure.distribution
            .reduce((sum, tier) => sum + tier.percentage, 0);
          if (total !== 100) {
            newErrors.distribution = 'Prize distribution must total 100%';
          }
        }
        break;

      case 4:
        if (!formData.players?.minimum || formData.players.minimum < 2) {
          newErrors.minPlayers = 'Minimum 2 players required';
        }
        if (!formData.players?.maximum || formData.players.maximum < formData.players.minimum) {
          newErrors.maxPlayers = 'Maximum players must be greater than minimum';
        }
        if (!formData.entryFee) {
          newErrors.entryFee = 'Entry fee is required';
        }
        break;

      case 5:
        if (!formData.oracle) {
          newErrors.oracle = 'Oracle selection is required';
        }
        if (!formData.validationRules?.minimumStake) {
          newErrors.minimumStake = 'Minimum stake is required';
        }
        if (!formData.validationRules?.maximumStake) {
          newErrors.maximumStake = 'Maximum stake is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData as Arena);
      if (success) {
        // Handle successful creation
      }
    } catch (error) {
      setErrors({
        submit: 'Failed to create arena. Please try again.'
      });
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${currentStep === step.id
                  ? 'bg-purple-100'
                  : currentStep > step.id
                  ? 'bg-green-100'
                  : 'bg-gray-100'
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <div className="text-sm mt-2">{step.title}</div>
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
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          {/* Form fields based on current step */}
          {/* Implementation continues with specific form fields for each step */}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
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
          className="px-6 py-3 rounded-lg bg-purple-600 text-white flex items-center space-x-2
                   hover:bg-purple-700 disabled:bg-purple-300"
        >
          <span>{currentStep === steps.length ? 'Create Arena' : 'Next'}</span>
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};