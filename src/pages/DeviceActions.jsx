import { useState } from 'react';
import { useStore } from '../stores/useStore';
import { useToast } from '../components/ToastContainer';

const ACTIONS = [
  { id: 'turn-on', label: 'Turn ON', icon: '🔛', description: 'Power on the device' },
  { id: 'turn-off', label: 'Turn OFF', icon: '🔴', description: 'Power off the device' },
  { id: 'restart', label: 'Restart Device', icon: '🔄', description: 'Reboot the device' },
  { id: 'sync', label: 'Sync Now', icon: '🔄', description: 'Force immediate data synchronization' },
  { id: 'alert', label: 'Trigger Alert', icon: '🚨', description: 'Send a test alert notification' }
];

export default function DeviceActions() {
  const selectedDeviceId = useStore(state => state.selectedDeviceId);
  const getSelectedDevice = useStore(state => state.getSelectedDevice);
  const addActionLog = useStore(state => state.addActionLog);
  const deviceActionsLog = useStore(state => state.deviceActionsLog);
  const { showToast } = useToast();
  const [loading, setLoading] = useState({});

  const device = getSelectedDevice();
  const logs = device ? (deviceActionsLog[device.id] || []) : [];

  const handleAction = async (actionId) => {
    if (!device) {
      showToast('Please select a device first', 'error');
      return;
    }

    setLoading({ ...loading, [actionId]: true });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const action = ACTIONS.find(a => a.id === actionId);
    const logEntry = addActionLog(device.id, action.label);

    showToast(
      `${action.label} executed on ${device.name} at ${new Date(logEntry.timestamp).toLocaleTimeString()}`,
      'success'
    );

    setLoading({ ...loading, [actionId]: false });
  };

  if (!device) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Please select a device from the dropdown above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Device Actions</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Control and manage {device.name} • {device.location}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {ACTIONS.map(action => (
          <div key={action.id} className="card p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{action.icon}</div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{action.label}</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{action.description}</p>
            <button
              onClick={() => handleAction(action.id)}
              disabled={loading[action.id]}
              className={`btn-primary w-full text-sm sm:text-base py-2 ${loading[action.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading[action.id] ? 'Processing...' : 'Execute'}
            </button>
          </div>
        ))}
      </div>

      {/* Action History */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Action History</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No actions performed yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {logs.map(log => (
                    <div key={log.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                          <p className="text-sm font-medium">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Action</p>
                        <p className="text-sm font-semibold">{log.action}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Device</p>
                        <p className="text-sm">{device.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop Table View */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Action</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm font-medium">{log.action}</td>
                        <td className="py-3 px-4 text-sm">{device.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



