// components/profile/tabs/SettingsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Shield, Eye, 
  Wallet, Save, Camera, Globe, Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import type { UserProfile } from '@/types/user';

interface SettingsTabProps {
  user: UserProfile;
  onUpdateSettings: (settings: Partial<UserProfile>) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<string>;
}

interface NotificationSettings {
    arenaStart: boolean;
    roundEnd: boolean;
    predictions: boolean;
    rewards: boolean;
    mentions: boolean;
    clanEvents: boolean;
    achievements: boolean;
  }
  
  interface PrivacySettings {
    profileVisibility: 'public' | 'friends' | 'private';
    showStats: boolean;
    showHistory: boolean;
    showRewards: boolean;
  }

export const SettingsTab: React.FC<SettingsTabProps> = ({
  user,
  onUpdateSettings,
  onUpdateAvatar
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    username: user.username,
    notifications: {
      arenaStart: true,
      roundEnd: true,
      predictions: true,
      rewards: true,
      mentions: true,
      clanEvents: true,
      achievements: user.settings?.notifications?.achievements || true
    } as NotificationSettings,
    privacy: {
      profileVisibility: user.settings?.privacy?.profileVisibility || 'public',
      showStats: user.settings?.privacy?.showStats || true,
      showHistory: user.settings?.privacy?.showHistory || true,
      showRewards: user.settings?.privacy?.showRewards || true
    } as PrivacySettings
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onUpdateSettings({
        ...user,
        username: form.username,
        settings: {
          notifications: form.notifications,
          privacy: form.privacy
        }
      });
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await onUpdateAvatar(file);
      await onUpdateSettings({ ...user, avatar: avatarUrl });
      setSuccess('Avatar updated successfully');
    } catch (err) {
      setError('Failed to update avatar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <User className="text-purple-600" size={24} />
          <h3 className="text-lg font-bold text-purple-900">Profile Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={user.username}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-purple-100 flex items-center justify-center">
                    <User size={32} className="text-purple-400" />
                  </div>
                )}
                <label className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-purple-600 text-white
                               hover:bg-purple-700 cursor-pointer transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="text-sm text-purple-600">
                Recommended: Square image, at least 500x500px
              </div>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="text-purple-600" size={24} />
          <h3 className="text-lg font-bold text-purple-900">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(form.notifications).map(([key, enabled]) => (
            <label key={key} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-sm text-purple-600">
                  {getNotificationDescription(key as keyof NotificationSettings)}
                </div>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setForm({
                  ...form,
                  notifications: {
                    ...form.notifications,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-purple-300 text-purple-600 
                         focus:ring-purple-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="text-purple-600" size={24} />
          <h3 className="text-lg font-bold text-purple-900">Privacy Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              Profile Visibility
            </label>
            <select
              value={form.privacy.profileVisibility}
              onChange={(e) => setForm({
                ...form,
                privacy: {
                  ...form.privacy,
                  profileVisibility: e.target.value as PrivacySettings['profileVisibility']
                }
              })}
              className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-4">
            {Object.entries(form.privacy)
              .filter(([key]) => key !== 'profileVisibility')
              .map(([key, enabled]) => (
                <label key={key} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium text-purple-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-purple-600">
                      {getPrivacyDescription(key as keyof Omit<PrivacySettings, 'profileVisibility'>)}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setForm({
                      ...form,
                      privacy: {
                        ...form.privacy,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded border-purple-300 text-purple-600 
                             focus:ring-purple-500"
                  />
                </label>
              ))}
          </div>
        </div>
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

      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 rounded-lg flex items-center space-x-2 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

// Utility functions
function getNotificationDescription(key: keyof NotificationSettings): string {
  const descriptions: Record<keyof NotificationSettings, string> = {
      arenaStart: 'Get notified when your registered arenas are about to start',
      roundEnd: 'Receive alerts when prediction rounds are ending soon',
      predictions: 'Updates about your prediction results and outcomes',
      rewards: 'Notifications about rewards and prize distributions',
      mentions: 'Get notified when other players mention you',
      clanEvents: 'Updates about your clan activities and events',
      achievements: 'Unlock more achievements'
  };
  return descriptions[key];
}

function getPrivacyDescription(key: keyof Omit<PrivacySettings, 'profileVisibility'>): string {
  const descriptions: Record<keyof Omit<PrivacySettings, 'profileVisibility'>, string> = {
    showStats: 'Allow others to view your performance statistics',
    showHistory: 'Make your arena history visible to others',
    showRewards: 'Display your earnings and rewards publicly'
  };
  return descriptions[key];
}