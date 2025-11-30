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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Device Actions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control and manage {device.name} • {device.location}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIONS.map(action => (
          <div key={action.id} className="card hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">{action.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{action.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
            <button
              onClick={() => handleAction(action.id)}
              disabled={loading[action.id]}
              className={`btn-primary w-full ${loading[action.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading[action.id] ? 'Processing...' : 'Execute'}
            </button>
          </div>
        ))}
      </div>

      {/* Action History */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Action History</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No actions performed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Time</th>
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Device</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium">{log.action}</td>
                    <td className="py-3 px-4">{device.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



