import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Shield, Clock, HelpCircle } from 'lucide-react';
import type { PlayerSettingsStepProps } from '@/types/arena';

export const PlayerSettings: React.FC<PlayerSettingsStepProps> = ({
  value,
  onChange,
  errors
}) => {
  return (
    <div className="space-y-8">
      {/* Player Limits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-purple-900">Player Limits</h3>
          <Users className="text-purple-600" size={24} />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Minimum Players
            </label>
            <input
              type="number"
              min="2"
              value={value.players?.minimum || ''}
              onChange={(e) => onChange({
                players: {
                  ...value.players,
                  minimum: parseInt(e.target.value)
                }
              })}
              className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
                ${errors?.minPlayers
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-purple-200 focus:ring-purple-500'
                } focus:outline-none focus:ring-2`}
            />
            {errors?.minPlayers && (
              <p className="mt-1 text-sm text-red-600">{errors.minPlayers}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Maximum Players
            </label>
            <input
              type="number"
              min={value.players?.minimum || 2}
              value={value.players?.maximum || ''}
              onChange={(e) => onChange({
                players: {
                  ...value.players,
                  maximum: parseInt(e.target.value)
                }
              })}
              className={`w-full px-4 py-3 rounded-lg bg-purple-50 border
                ${errors?.maxPlayers
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-purple-200 focus:ring-purple-500'
                } focus:outline-none focus:ring-2`}
            />
            {errors?.maxPlayers && (
              <p className="mt-1 text-sm text-red-600">{errors.maxPlayers}</p>
            )}
          </div>
        </div>
      </div>

      {/* Entry Fee and Stakes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-purple-900">Entry Fee & Stakes</h3>
          <DollarSign className="text-purple-600" size={24} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Entry Fee (USDC)
            </label>
            <div className="relative">
              <DollarSign 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600"
                size={20}
              />
              <input
                type="text"
                pattern="^\d*\.?\d*$"
                value={value.entryFee || ''}
                onChange={(e) => onChange({
                  entryFee: e.target.value
                })}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-purple-50 border
                  ${errors?.entryFee
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-purple-200 focus:ring-purple-500'
                  } focus:outline-none focus:ring-2`}
              />
            </div>
            {errors?.entryFee && (
              <p className="mt-1 text-sm text-red-600">{errors.entryFee}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Minimum Stake (USDC)
            </label>
            <div className="relative">
              <DollarSign 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600"
                size={20}
              />
              <input
                type="text"
                pattern="^\d*\.?\d*$"
                value={value.validationRules?.minimumStake || ''}
                onChange={(e) => onChange({
                  validationRules: {
                    ...value.validationRules,
                    minimumStake: e.target.value
                  }
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Maximum Stake (USDC)
            </label>
            <div className="relative">
              <DollarSign 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600"
                size={20}
              />
              <input
                type="text"
                pattern="^\d*\.?\d*$"
                value={value.validationRules?.maximumStake || ''}
                onChange={(e) => onChange({
                  validationRules: {
                    ...value.validationRules,
                    maximumStake: e.target.value
                  }
                })}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Windows */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-purple-900">Time Windows</h3>
          <Clock className="text-purple-600" size={24} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Prediction Window (seconds)
            </label>
            <input
              type="number"
              min="30"
              value={value.validationRules?.predictionWindow || 30}
              onChange={(e) => onChange({
                validationRules: {
                  ...value.validationRules,
                  predictionWindow: parseInt(e.target.value)
                }
              })}
              className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Dispute Period (seconds)
            </label>
            <input
              type="number"
              min="300"
              value={value.validationRules?.disputePeriod || 300}
              onChange={(e) => onChange({
                validationRules: {
                  ...value.validationRules,
                  disputePeriod: parseInt(e.target.value)
                }
              })}
              className="w-full px-4 py-3 rounded-lg bg-purple-50 border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <HelpCircle className="text-blue-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>Set minimum players to ensure competitive gameplay</li>
              <li>Entry fee should be reasonable for your target audience</li>
              <li>Prediction window should give players enough time to participate</li>
              <li>Consider a longer dispute period for high-stakes arenas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};