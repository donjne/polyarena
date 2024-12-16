// components/marketplace/viewer/ViewerSettings.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, X, Sun, Monitor, Zap,
  Layers, Eye, Sliders, RotateCw
} from 'lucide-react';

interface ViewerSettings {
  quality: 'low' | 'medium' | 'high';
  shadows: boolean;
  antiAlias: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  backgroundColor: string;
  environmentIntensity: number;
  renderScale: number;
  showWireframe: boolean;
}

interface ViewerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ViewerSettings;
  onSettingsChange: (settings: ViewerSettings) => void;
  onResetDefaults: () => void;
  fps: number;
}

export const ViewerSettings: React.FC<ViewerSettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onResetDefaults,
  fps
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [activeTab, setActiveTab] = React.useState<'visual' | 'performance'>('visual');

  const handleChange = <K extends keyof ViewerSettings>(
    key: K,
    value: ViewerSettings[K]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white">
              <Settings size={24} />
              <h2 className="text-lg font-bold">Viewer Settings</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-100">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'visual'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-purple-600 hover:text-purple-900'
              }`}
          >
            Visual
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === 'performance'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-purple-600 hover:text-purple-900'
              }`}
          >
            Performance
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'visual' ? (
            <>
              {/* Background Color */}
              <div>
                <label className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-purple-900">Background Color</span>
                  <input
                    type="color"
                    value={localSettings.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Environment Intensity */}
              <div>
                <label className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-purple-900">Lighting Intensity</span>
                  <span className="text-purple-600">{localSettings.environmentIntensity.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localSettings.environmentIntensity}
                  onChange={(e) => handleChange('environmentIntensity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Auto-Rotate */}
              <div>
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RotateCw size={18} className="text-purple-600" />
                    <span className="font-medium text-purple-900">Auto-Rotate</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.autoRotate}
                    onChange={(e) => handleChange('autoRotate', e.target.checked)}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
                {localSettings.autoRotate && (
                  <div className="mt-2">
                    <label className="flex items-center justify-between text-sm mb-2">
                      <span className="text-purple-600">Rotation Speed</span>
                      <span className="text-purple-900">{localSettings.autoRotateSpeed}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={localSettings.autoRotateSpeed}
                      onChange={(e) => handleChange('autoRotateSpeed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Wireframe Toggle */}
              <div>
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers size={18} className="text-purple-600" />
                    <span className="font-medium text-purple-900">Show Wireframe</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showWireframe}
                    onChange={(e) => handleChange('showWireframe', e.target.checked)}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              {/* Quality Preset */}
              <div>
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  Quality Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((quality) => (
                    <motion.button
                      key={quality}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleChange('quality', quality)}
                      className={`px-3 py-2 rounded-lg text-sm border-2 transition-colors
                        ${localSettings.quality === quality
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-purple-200 hover:border-purple-300'
                        }`}
                    >
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Performance Options */}
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye size={18} className="text-purple-600" />
                    <span className="font-medium text-purple-900">Anti-Aliasing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.antiAlias}
                    onChange={(e) => handleChange('antiAlias', e.target.checked)}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun size={18} className="text-purple-600" />
                    <span className="font-medium text-purple-900">Shadows</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.shadows}
                    onChange={(e) => handleChange('shadows', e.target.checked)}
                    className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                  />
                </label>

                <div>
                  <label className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center space-x-2">
                      <Monitor size={18} className="text-purple-600" />
                      <span className="font-medium text-purple-900">Render Scale</span>
                    </div>
                    <span className="text-purple-600">{localSettings.renderScale}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={localSettings.renderScale}
                    onChange={(e) => handleChange('renderScale', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* FPS Counter */}
              <div className="flex items-center justify-between text-sm p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap size={18} className="text-purple-600" />
                  <span className="font-medium text-purple-900">Current FPS</span>
                </div>
                <span className="font-mono text-purple-600">{fps}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-purple-100 p-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={onResetDefaults}
            className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg"
          >
            Reset to Defaults
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={handleApply}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Apply Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};