'use client';

export default function SettingsComponent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Settings</h2>

      {/* Placeholder content */}
      <div className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚙️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[#A78BFA]">Settings Placeholder</h3>
          <p className="text-gray-400">
            User settings and preferences will be displayed here. This component will include account settings, notification preferences, theme options, and other user configuration options.
          </p>
        </div>
      </div>

      {/* Sample settings sections (placeholder) */}
      <div className="space-y-4">
        <div className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-[#A78BFA]">Account Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg">
              <span className="text-gray-300">Email Address</span>
              <span className="text-gray-500 text-sm">user@example.com</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg">
              <span className="text-gray-300">Password</span>
              <span className="text-gray-500 text-sm">••••••••</span>
            </div>
          </div>
        </div>

        <div className="bg-[#12121A] border border-[#8B5CF6]/20 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-[#A78BFA]">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg">
              <span className="text-gray-300">Dark Mode</span>
              <span className="text-[#8B5CF6] text-sm">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0A0A0F] rounded-lg">
              <span className="text-gray-300">Notifications</span>
              <span className="text-gray-500 text-sm">On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
