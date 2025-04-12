import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Settings,
  Bell,
  Shield,
  UserCircle,
  X,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';

// Mock data and types
interface Scenario {
  id: string;
  name: string;
  description: string;
  projections: Array<{ year: number; value: number }>;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: Date;
}

interface UserSettings {
  dashboardLayout: {
    showNetWorth: boolean;
    showExpenses: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
  display: {
    currency: string;
    timezone: string;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}

const mockData = {
  netWorth: [
    { month: 'Jan', value: 50000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 51500 },
    { month: 'Apr', value: 53000 },
    { month: 'May', value: 54500 },
    { month: 'Jun', value: 56000 },
  ],
  expenses: {
    housing: 2000,
    transportation: 500,
    food: 600,
    utilities: 300,
    entertainment: 400,
  },
  suggestions: [
    {
      id: 1,
      impact: 'high',
      title: 'Optimize Emergency Fund',
      description: 'Increase emergency savings to cover 6 months of expenses',
      potentialSavings: 5000,
    },
    {
      id: 2,
      impact: 'medium',
      title: 'Refinance Mortgage',
      description: 'Current rates are 1.5% lower than your existing mortgage',
      potentialSavings: 3000,
    },
    {
      id: 3,
      impact: 'low',
      title: 'Review Subscriptions',
      description: 'Identified potential savings in recurring subscriptions',
      potentialSavings: 600,
    },
  ],
  notifications: [
    {
      id: '1',
      title: 'Portfolio Alert',
      message: 'Your investment portfolio has exceeded your target growth rate',
      type: 'success',
      read: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Budget Warning',
      message: 'Entertainment spending is 15% over budget this month',
      type: 'warning',
      read: false,
      timestamp: new Date(),
    },
  ],
};

const defaultSettings: UserSettings = {
  dashboardLayout: {
    showNetWorth: true,
    showExpenses: true,
  },
  notifications: {
    email: true,
    push: true,
  },
  display: {
    currency: 'USD',
    timezone: 'UTC-05:00',
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 30,
  },
};

export function Dashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [notifications, setNotifications] = useState<Notification[]>(mockData.notifications);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [analysisReport, setAnalysisReport] = useState<any>(null);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const showNotification = useCallback((type: string, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      switch (action) {
        case 'scenarios':
          await handleScenarioPlanning();
          break;
        case 'analysis':
          await handleRunAnalysis();
          break;
        case 'suggestions':
          setActiveModal('suggestions');
          break;
        default:
          throw new Error('Invalid action');
      }
      showNotification('success', `${action.charAt(0).toUpperCase() + action.slice(1)} completed successfully`);
    } catch (error) {
      console.error('Action error:', error);
      showNotification('error', `Failed to execute ${action}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPlanning = async () => {
    // Simulate API call for scenario planning
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newScenario: Scenario = {
      id: `scenario-${scenarios.length + 1}`,
      name: `Scenario ${scenarios.length + 1}`,
      description: 'New financial scenario',
      projections: Array.from({ length: 5 }, (_, i) => ({
        year: new Date().getFullYear() + i,
        value: 50000 * (1 + Math.random() * 0.2),
      })),
    };
    setScenarios(prev => [...prev, newScenario]);
    setActiveModal('scenarios');
  };

  const handleRunAnalysis = async () => {
    // Simulate API call for financial analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    const report = {
      timestamp: new Date(),
      summary: {
        status: 'healthy',
        score: 85,
        improvements: 3,
      },
      metrics: {
        savingsRate: 0.25,
        debtToIncome: 0.32,
        investmentDiversification: 0.78,
      },
    };
    setAnalysisReport(report);
    setActiveModal('analysis');
  };

  const handleSettingsSave = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    showNotification('success', 'Settings saved successfully');
  };

  const handleNotificationClick = () => {
    setShowNotificationsPanel(!showNotificationsPanel);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xl font-bold">WealthWarp</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative"
              >
                <Bell className="h-5 w-5 cursor-pointer hover:text-indigo-200" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                )}
              </button>
              {showNotificationsPanel && (
                <NotificationsPanel
                  notifications={notifications}
                  onMarkAsRead={markNotificationAsRead}
                  onClose={() => setShowNotificationsPanel(false)}
                />
              )}
            </div>
            <Settings 
              className="h-5 w-5 cursor-pointer hover:text-indigo-200" 
              onClick={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <QuickStat
            icon={<Wallet className="h-6 w-6 text-green-500" />}
            title="Net Worth"
            value="$54,500"
            trend="+8.2%"
          />
          <QuickStat
            icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
            title="Investments"
            value="$32,000"
            trend="+5.4%"
          />
          <QuickStat
            icon={<PiggyBank className="h-6 w-6 text-purple-500" />}
            title="Savings"
            value="$12,500"
            trend="+2.1%"
          />
          <QuickStat
            icon={<CreditCard className="h-6 w-6 text-red-500" />}
            title="Debt"
            value="$8,000"
            trend="-3.5%"
          />
        </div>

        {/* Charts */}
        {settings.dashboardLayout.showNetWorth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Net Worth Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.netWorth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {settings.dashboardLayout.showExpenses && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
                <div className="space-y-4">
                  {Object.entries(mockData.expenses).map(([category, amount]) => (
                    <ExpenseBar
                      key={category}
                      category={category}
                      amount={amount}
                      maxAmount={2000}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Investment Opportunities"
            description="AI-detected opportunities based on your risk profile"
            actionText="View Suggestions"
            onClick={() => handleAction('suggestions')}
            loading={loading}
          />
          <ActionCard
            title="Scenario Planning"
            description="Create and compare different financial scenarios"
            actionText="Plan Scenarios"
            onClick={() => handleAction('scenarios')}
            loading={loading}
          />
          <ActionCard
            title="Financial Health Check"
            description="Get a detailed analysis of your financial well-being"
            actionText="Run Analysis"
            onClick={() => handleAction('analysis')}
            loading={loading}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Action Modals */}
      {activeModal === 'suggestions' && (
        <SuggestionsModal 
          suggestions={mockData.suggestions} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'scenarios' && (
        <ScenariosModal
          scenarios={scenarios}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'analysis' && (
        <AnalysisModal
          report={analysisReport}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all transform ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickStat({ icon, title, value, trend }) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ExpenseBar({ category, amount, maxAmount }) {
  const percentage = (amount / maxAmount) * 100;
  return (
    <div className="transform transition-all duration-200 hover:scale-[1.02]">
      <div className="flex justify-between text-sm mb-1">
        <span className="capitalize">{category}</span>
        <span>${amount}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActionCard({ title, description, actionText, onClick, loading }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-200 hover:shadow-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button 
        className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors ${
          loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
        }`}
        onClick={onClick}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin h-5 w-5 mr-2" />
            <span>Processing...</span>
          </div>
        ) : (
          actionText
        )}
      </button>
    </div>
  );
}

function SettingsModal({ settings, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState('preferences');
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSave(localSettings);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === 'preferences' ? 'bg-indigo-600 text-white' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeTab === 'security' ? 'bg-indigo-600 text-white' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
          </div>

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Dashboard Layout</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.dashboardLayout.showNetWorth}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dashboardLayout: {
                          ...localSettings.dashboardLayout,
                          showNetWorth: e.target.checked,
                        },
                      })}
                      className="form-checkbox"
                    />
                    <span>Show net worth chart</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.dashboardLayout.showExpenses}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        dashboardLayout: {
                          ...localSettings.dashboardLayout,
                          showExpenses: e.target.checked,
                        },
                      })}
                      className="form-checkbox"
                    />
                    <span>Show expense breakdown</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.notifications.email}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          email: e.target.checked,
                        },
                      })}
                      className="form-checkbox"
                    />
                    <span>Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.notifications.push}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          push: e.target.checked,
                        },
                      })}
                      className="form-checkbox"
                    />
                    <span>Push notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={localSettings.display.currency}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        display: {
                          ...localSettings.display,
                          currency: e.target.value,
                        },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Zone</label>
                    <select
                      value={localSettings.display.timezone}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        display: {
                          ...localSettings.display,
                          timezone: e.target.value,
                        },
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                      <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                      <option value="UTC+01:00">UTC+01:00 (Central European Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Authentication</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.security.twoFactorEnabled}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        security: {
                          ...localSettings.security,
                          twoFactorEnabled: e.target.checked,
                        },
                      })}
                      className="form-checkbox"
                    />
                    <span>Enable two-factor authentication</span>
                  </label>
                  <button className="text-indigo-600 hover:text-indigo-700">
                    Change password
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Session Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session Timeout</label>
                  <select
                    value={localSettings.security.sessionTimeout}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      security: {
                        ...localSettings.security,
                        sessionTimeout: Number(e.target.value),
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Data Management</h3>
                <div className="space-y-2">
                  <button className="text-indigo-600 hover:text-indigo-700 block">
                    Export all data
                  </button>
                  <button className="text-red-600 hover:text-red-700 block">
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md ${
                saving ? 'opacity-75 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {saving ? (
                <div className="flex items-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel({ notifications, onMarkAsRead, onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-indigo-50'
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold">{notification.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    notification.type === 'success' ? 'bg-green-100 text-green-800' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SuggestionsModal({ suggestions, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Investment Suggestions</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div 
                key={suggestion.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{suggestion.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    suggestion.impact === 'high' 
                      ? 'bg-green-100 text-green-800'
                      : suggestion.impact === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{suggestion.description}</p>
                <p className="text-sm text-gray-500">
                  Potential savings: <span className="font-semibold">${suggestion.potentialSavings}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenariosModal({ scenarios, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Financial Scenarios</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="space-y-6">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{scenario.name}</h3>
                <p className="text-gray-600 mb-4">{scenario.description}</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scenario.projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#4F46E5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Financial Health Analysis</h2>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full ${
                  report.summary.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.summary.status.charAt(0).toUpperCase() + report.summary.status.slice(1)}
                </div>
                <div className="text-lg font-semibold">
                  Score: {report.summary.score}/100
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <MetricBar
                  label="Savings Rate"
                  value={report.metrics.savingsRate}
                  target={0.2}
                />
                <MetricBar
                  label="Debt to Income"
                  value={report.metrics.debtToIncome}
                  target={0.36}
                  inverse
                />
                <MetricBar
                  label="Investment Diversification"
                  value={report.metrics.investmentDiversification}
                  target={0.7}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, target, inverse = false }) {
  const percentage = (value / target) * 100;
  const isGood = inverse ? percentage <= 100 : percentage >= 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className={isGood ? 'text-green-600' : 'text-yellow-600'}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isGood ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}