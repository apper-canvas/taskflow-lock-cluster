import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Settings = () => {
  const [preferences, setPreferences] = useLocalStorage("taskflow-preferences", {
    theme: "light",
    notifications: true,
    emailDigest: "weekly",
    defaultView: "kanban",
    compactMode: false
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "Project Manager",
    timezone: "America/New_York"
  });

  const [activeTab, setActiveTab] = useState("general");

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    toast.success("Preferences updated!");
  };

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const tabs = [
    { id: "general", name: "General", icon: "Settings" },
    { id: "profile", name: "Profile", icon: "User" },
    { id: "notifications", name: "Notifications", icon: "Bell" },
    { id: "appearance", name: "Appearance", icon: "Palette" },
    { id: "data", name: "Data & Privacy", icon: "Shield" }
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">Settings</h1>
            <p className="text-primary-100 text-lg">Manage your preferences and account</p>
          </div>
          
          <ApperIcon name="Settings" size={48} className="text-primary-200" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
        {/* Settings Navigation */}
        <div className="lg:w-80 bg-white border-r border-gray-200">
          <nav className="p-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={tab.icon} size={18} className="mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
                    General Preferences
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="defaultView">Default Project View</Label>
                      <Select
                        id="defaultView"
                        value={preferences.defaultView}
                        onChange={(e) => handlePreferenceChange("defaultView", e.target.value)}
                      >
                        <option value="kanban">Kanban Board</option>
                        <option value="list">List View</option>
                        <option value="calendar">Calendar View</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        id="timezone"
                        value={profile.timezone}
                        onChange={(e) => handleProfileChange("timezone", e.target.value)}
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Compact Mode</h4>
                        <p className="text-sm text-gray-500">Use smaller spacing and condensed layout</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.compactMode}
                          onChange={(e) => handlePreferenceChange("compactMode", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
                    Profile Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile.role}
                        onChange={(e) => handleProfileChange("role", e.target.value)}
                        placeholder="Enter your role"
                      />
                    </div>

                    <Button onClick={handleSaveProfile}>
                      Save Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
                    Notification Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications for task updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notifications}
                          onChange={(e) => handlePreferenceChange("notifications", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div>
                      <Label htmlFor="emailDigest">Email Digest Frequency</Label>
                      <Select
                        id="emailDigest"
                        value={preferences.emailDigest}
                        onChange={(e) => handlePreferenceChange("emailDigest", e.target.value)}
                      >
                        <option value="never">Never</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
                    Appearance Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        id="theme"
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">
                        Auto theme will follow your system preference
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <div className="w-full h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded mb-3"></div>
                        <p className="text-sm font-medium text-gray-900">Light Theme</p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-900">
                        <div className="w-full h-20 bg-gradient-to-r from-primary-400 to-primary-500 rounded mb-3"></div>
                        <p className="text-sm font-medium text-white">Dark Theme</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
                    Data & Privacy
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <ApperIcon name="Info" size={20} className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-blue-900">Data Storage</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your data is stored locally in your browser. No data is transmitted to external servers.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button variant="secondary" className="flex items-center space-x-2">
                        <ApperIcon name="Download" size={16} />
                        <span>Export Data</span>
                      </Button>
                      
                      <Button variant="danger" className="flex items-center space-x-2">
                        <ApperIcon name="Trash2" size={16} />
                        <span>Clear All Data</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;