import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Trash2, PieChart } from 'lucide-react';
import type { PrizeStructureStepProps } from '@/types/arena';

export const PrizeStructure: React.FC<PrizeStructureStepProps> = ({
  value,
  onChange,
  errors
}) => {
  const handleDistributionChange = (index: number, field: 'position' | 'percentage', val: number) => {
    const newDistribution = [...(value.prizeStructure.distribution || [])];
    newDistribution[index] = {
      ...newDistribution[index],
      [field]: val
    };
    onChange({
      prizeStructure: {
        ...value.prizeStructure,
        distribution: newDistribution
      }
    });
  };

  const addTier = () => {
    const newPosition = (value.prizeStructure.distribution?.length || 0) + 1;
    onChange({
      prizeStructure: {
        ...value.prizeStructure,
        distribution: [
          ...(value.prizeStructure.distribution || []),
          { position: newPosition, percentage: 0 }
        ]
      }
    });
  };

  const removeTier = (index: number) => {
    const newDistribution = value.prizeStructure.distribution
      .filter((_, i) => i !== index)
      .map((tier, i) => ({ ...tier, position: i + 1 }));
    
    onChange({
      prizeStructure: {
        ...value.prizeStructure,
        distribution: newDistribution
      }
    });
  };

  const totalPercentage = value.prizeStructure.distribution?.reduce(
    (sum, tier) => sum + tier.percentage,
    0
  ) || 0;

  return (
    <div className="space-y-8">
      {/* Total Prize Pool */}
      <div>
        <label className="block text-sm font-medium text-purple-900 mb-2">
          Total Prize Pool (USDC)
        </label>
        <div className="relative">
          <DollarSign 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600"
            size={20}
          />
          <input
            type="text"
            pattern="^\d*\.?\d*$"
            value={value.prizeStructure.totalPool}
            onChange={(e) => onChange({
              prizeStructure: {
                ...value.prizeStructure,
                totalPool: e.target.value
              }
            })}
            className={`w-full pl-10 pr-4 py-3 rounded-lg bg-purple-50 border
              ${errors?.totalPool
                ? 'border-red-300 focus:ring-red-500'
                : 'border-purple-200 focus:ring-purple-500'
              } focus:outline-none focus:ring-2`}
            placeholder="Enter prize pool amount..."
          />
        </div>
        {errors?.totalPool && (
          <p className="mt-1 text-sm text-red-600">{errors.totalPool}</p>
        )}
      </div>

      {/* Prize Distribution */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-purple-900">
            Prize Distribution
          </label>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${
              totalPercentage === 100 ? 'text-green-600' : 'text-red-600'
            }`}>
              Total: {totalPercentage}%
            </span>
            <button
              onClick={addTier}
              className="p-2 rounded-lg bg-purple-100 text-purple-600
                       hover:bg-purple-200 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {value.prizeStructure.distribution.map((tier, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20">
                <label className="block text-xs text-purple-600 mb-1">
                  Position
                </label>
                <input
                  type="number"
                  value={tier.position}
                  onChange={(e) => handleDistributionChange(
                    index,
                    'position',
                    parseInt(e.target.value)
                  )}
                  className="w-full px-3 py-2 rounded-lg bg-purple-50 border border-purple-200
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs text-purple-600 mb-1">
                  Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tier.percentage}
                    onChange={(e) => handleDistributionChange(
                      index,
                      'percentage',
                      parseFloat(e.target.value)
                    )}
                    className="w-full px-3 py-2 rounded-lg bg-purple-50 border border-purple-200
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2
                                text-purple-600">%</span>
                </div>
              </div>

              <button
                onClick={() => removeTier(index)}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50
                         transition-colors self-end"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        {errors?.distribution && (
          <p className="mt-1 text-sm text-red-600">{errors.distribution}</p>
        )}
      </div>

      {/* Platform Fees */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Platform Fee (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={value.prizeStructure.platformFee}
            onChange={(e) => onChange({
              prizeStructure: {
                ...value.prizeStructure,
                platformFee: parseFloat(e.target.value)
              }
            })}
            className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Referral Reward (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={value.prizeStructure.referralReward}
            onChange={(e) => onChange({
              prizeStructure: {
                ...value.prizeStructure,
                referralReward: parseFloat(e.target.value)
              }
            })}
            className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2">
            Community Incentive (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={value.prizeStructure.communityIncentive}
            onChange={(e) => onChange({
              prizeStructure: {
                ...value.prizeStructure,
                communityIncentive: parseFloat(e.target.value)
              }
            })}
            className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Distribution Preview */}
      {value.prizeStructure.distribution.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="text-purple-600" size={20} />
            <span className="font-medium text-purple-900">Distribution Preview</span>
          </div>
          <div className="h-4 bg-white rounded-full overflow-hidden flex">
            {value.prizeStructure.distribution.map((tier, index) => (
              <div
                key={index}
                className="h-full transition-all duration-300"
                style={{
                  width: `${tier.percentage}%`,
                  backgroundColor: `hsl(${(index * 20 + 250) % 360}, 70%, 60%)`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};