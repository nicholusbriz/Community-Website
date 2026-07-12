'use client';

import { Settings, User, Mail, Lock, Bell, Moon, Sun, Shield, Globe, Sparkles, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Account Settings',
      icon: User,
      items: [
        { label: 'Email Address', value: 'user@example.com', type: 'text' },
        { label: 'Password', value: '••••••••', type: 'password' },
        { label: 'Username', value: '@username', type: 'text' },
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      items: [
        { label: 'Dark Mode', value: 'Enabled', type: 'toggle' },
        { label: 'Notifications', value: 'On', type: 'toggle' },
        { label: 'Language', value: 'English', type: 'select' },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Auth', value: 'Disabled', type: 'toggle' },
        { label: 'Public Profile', value: 'Visible', type: 'toggle' },
        { label: 'Session Management', value: 'Active devices', type: 'action' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Sparkles className="w-4 h-4 text-[#0070f3]" />
            <span>Configuration</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your account and application preferences</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm">
          <Settings className="w-4 h-4" />
          Advanced Settings
        </button>
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
                <div className="w-8 h-8 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#0070f3]" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>

              {/* Settings Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <div className="flex items-center gap-3">
                      {item.type === 'toggle' && (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${item.value === 'Enabled' || item.value === 'On' ? 'text-[#0070f3]' : 'text-gray-400'}`}>
                            {item.value}
                          </span>
                          <div className={`w-10 h-5 rounded-full transition-colors ${
                            item.value === 'Enabled' || item.value === 'On' 
                              ? 'bg-gradient-to-r from-[#0070f3] to-[#7928ca]' 
                              : 'bg-gray-300'
                          }`}>
                            <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                              item.value === 'Enabled' || item.value === 'On' ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </div>
                        </div>
                      )}
                      {item.type === 'select' && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{item.value}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      {item.type === 'action' && (
                        <button className="text-sm text-[#0070f3] hover:text-[#7928ca] transition-colors font-medium">
                          Manage
                        </button>
                      )}
                      {(item.type === 'text' || item.type === 'password') && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{item.value}</span>
                          <button className="text-xs text-[#0070f3] hover:text-[#7928ca] transition-colors font-medium opacity-0 group-hover:opacity-100">
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 bg-red-50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-700 mb-1">Danger Zone</h4>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
