'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Moon, 
  Shield, 
  Globe, 
  Sparkles, 
  ChevronRight,
  Check,
  AlertTriangle
} from 'lucide-react';

// Define types for settings items
type BaseSettingItem = {
  label: string;
  value: string;
  icon: any;
};

type ToggleSettingItem = BaseSettingItem & {
  type: 'toggle';
  checked: boolean;
  onChange: () => void;
};

type SelectSettingItem = BaseSettingItem & {
  type: 'select';
  options: string[];
};

type ActionSettingItem = BaseSettingItem & {
  type: 'action';
  action: string;
};

type TextSettingItem = BaseSettingItem & {
  type: 'text' | 'password';
  action: string;
};

type SettingItem = ToggleSettingItem | SelectSettingItem | ActionSettingItem | TextSettingItem;

type SettingsSection = {
  title: string;
  icon: any;
  items: SettingItem[];
};

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [language, setLanguage] = useState('English');

  const settingsSections: SettingsSection[] = [
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { 
          label: 'Email Address', 
          value: 'user@example.com', 
          type: 'text' as const,
          icon: Mail,
          action: 'Change'
        },
        { 
          label: 'Password', 
          value: '••••••••', 
          type: 'password' as const,
          icon: Lock,
          action: 'Update'
        },
        { 
          label: 'Username', 
          value: '@username', 
          type: 'text' as const,
          icon: User,
          action: 'Change'
        },
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      items: [
        { 
          label: 'Dark Mode', 
          value: darkMode ? 'Enabled' : 'Disabled', 
          type: 'toggle' as const,
          icon: Moon,
          checked: darkMode,
          onChange: () => setDarkMode(!darkMode)
        },
        { 
          label: 'Notifications', 
          value: notifications ? 'On' : 'Off', 
          type: 'toggle' as const,
          icon: Bell,
          checked: notifications,
          onChange: () => setNotifications(!notifications)
        },
        { 
          label: 'Language', 
          value: language, 
          type: 'select' as const,
          icon: Globe,
          options: ['English', 'Spanish', 'French', 'German', 'Chinese']
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { 
          label: 'Two-Factor Auth', 
          value: twoFactorAuth ? 'Enabled' : 'Disabled', 
          type: 'toggle' as const,
          icon: Shield,
          checked: twoFactorAuth,
          onChange: () => setTwoFactorAuth(!twoFactorAuth)
        },
        { 
          label: 'Public Profile', 
          value: publicProfile ? 'Visible' : 'Hidden', 
          type: 'toggle' as const,
          icon: Globe,
          checked: publicProfile,
          onChange: () => setPublicProfile(!publicProfile)
        },
        { 
          label: 'Session Management', 
          value: 'Active devices', 
          type: 'action' as const,
          icon: Settings,
          action: 'Manage'
        },
      ]
    }
  ];

  // Type guard function to check if item has options
  const hasOptions = (item: SettingItem): item is SelectSettingItem => {
    return item.type === 'select';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Configuration</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>

              {/* Settings Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {ItemIcon && (
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                            <ItemIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {item.type === 'toggle' && (
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${item.checked ? 'text-blue-600' : 'text-gray-400'}`}>
                              {item.value}
                            </span>
                            <button
                              onClick={item.onChange}
                              className={`w-11 h-6 rounded-full transition-colors relative ${
                                item.checked 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                                  : 'bg-gray-300'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                                item.checked ? 'translate-x-5' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        )}
                        
                        {item.type === 'select' && (
                          <div className="flex items-center gap-2">
                            <select
                              value={item.value}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="text-sm text-gray-700 bg-transparent border-0 focus:ring-0 cursor-pointer"
                            >
                              {item.options?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        
                        {item.type === 'action' && (
                          <button className="text-sm text-blue-600 hover:text-purple-600 transition-colors font-medium">
                            {item.action}
                          </button>
                        )}
                        
                        {(item.type === 'text' || item.type === 'password') && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">{item.value}</span>
                            <button className="text-xs text-blue-600 hover:text-purple-600 transition-colors font-medium opacity-0 group-hover:opacity-100">
                              {item.action}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-700 mb-1">Danger Zone</h4>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Reset
        </button>
        <button className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}