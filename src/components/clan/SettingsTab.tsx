// components/clan/SettingsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, Users2, Star, Lock, 
  Image, Save, AlertTriangle, Check, Flag
} from 'lucide-react';
import { Clan } from '@/types/community';

interface SettingsTabProps {
  clan: Clan;
  onUpdateSettings: (settings: Partial<Clan>) => Promise<boolean>;
  onUpdateBranding: (file: File) => Promise<string>;
  currentUserRole: 'owner' | 'admin' | 'member';
}

interface SettingsSection {
  title: string;
  description: string;
  icon: typeof Settings;
  requiredRole: 'owner' | 'admin';
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  clan,
  onUpdateSettings,
  onUpdateBranding,
  currentUserRole
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState(clan);

  const sections: SettingsSection[] = [
    {
      title: 'General Settings',
      description: 'Basic clan information and branding',
      icon: Settings,
      requiredRole: 'admin'
    },
    {
      title: 'Membership Requirements',
      description: 'Set minimum requirements for new members',
      icon: Shield,
      requiredRole: 'owner'
    },
    {
      title: 'Roles & Permissions',
      description: 'Manage member roles and access levels',
      icon: Lock,
      requiredRole: 'owner'
    }
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onUpdateSettings(settings);
      setSuccessMessage('Settings updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await onUpdateBranding(file);
      setSettings({ ...settings, logoUrl: imageUrl });
      setSuccessMessage('Clan logo updated successfully');
    } catch (err) {
      setError('Failed to upload clan logo');
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <Settings className="text-purple-600" size={24} />
          <div>
            <h2 className="text-xl font-bold text-purple-900">Clan Settings</h2>
            <p className="text-purple-600">Manage your clan's configuration</p>
          </div>
        </div>

        {/* Status Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 rounded-lg flex items-center space-x-2 text-green-700"
          >
            <Check size={20} />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700"
          >
            <AlertTriangle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          currentUserRole === 'owner' || 
          (currentUserRole === 'admin' && section.requiredRole === 'admin') ? (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-6">
                <section.icon className="text-purple-600" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-purple-900">{section.title}</h3>
                  <p className="text-purple-600">{section.description}</p>
                </div>
              </div>

              {section.title === 'General Settings' && (
                <div className="space-y-6">
                  {/* Clan Name */}
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Clan Name
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Description
                    </label>
                    <textarea
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Clan Logo */}
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Clan Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg bg-purple-50 flex items-center justify-center">
                        {settings.logoUrl ? (
                          <img
                            src={settings.logoUrl}
                            alt="Clan Logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Flag className="text-purple-300" size={32} />
                        )}
                      </div>
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="px-4 py-2 rounded-lg border-2 border-dashed border-purple-200
                                    text-purple-600 hover:border-purple-300 hover:bg-purple-50
                                    cursor-pointer transition-colors text-center">
                          Upload New Logo
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {section.title === 'Membership Requirements' && (
                <div className="space-y-6">
                  {/* Minimum Level */}
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Minimum Level Required
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settings.requirements.minLevel}
                      onChange={(e) => setSettings({
                        ...settings,
                        requirements: {
                          ...settings.requirements,
                          minLevel: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Minimum Win Rate */}
                  <div>
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Minimum Win Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.requirements.minWinRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        requirements: {
                          ...settings.requirements,
                          minWinRate: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              )}

              {section.title === 'Roles & Permissions' && (
                <div className="space-y-6">
                  {/* Role Management */}
                  <div className="space-y-4">
                    {['admin', 'member'].map((role) => (
                      <div key={role} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {role === 'admin' ? (
                            <Shield className="text-purple-600" size={20} />
                          ) : (
                            <Users2 className="text-purple-600" size={20} />
                          )}
                          <div>
                            <div className="font-medium text-purple-900 capitalize">
                              {role}
                            </div>
                            <div className="text-sm text-purple-600">
                              {role === 'admin' 
                                ? 'Can manage members and clan settings'
                                : 'Basic member permissions'
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2
            ${isLoading
              ? 'bg-purple-300 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
        >
          <Save size={20} />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </motion.button>
      </div>
    </div>
  );
};