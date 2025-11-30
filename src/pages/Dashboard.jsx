import { useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStore } from '../stores/useStore';
import { generateAllDeviceData } from '../utils/dataGenerator';

const TIME_RANGES = [
  { value: '30m', label: 'Last 30 minutes' },
  { value: '1h', label: 'Last 1 hour' },
  { value: '1d', label: 'Last 1 day' },
  { value: '1w', label: 'Last 1 week' },
  { value: '1M', label: 'Last 1 month' },
  { value: '1y', label: 'Last 1 year' }
];

export default function Dashboard() {
  const selectedDeviceId = useStore(state => state.selectedDeviceId);
  const getSelectedDevice = useStore(state => state.getSelectedDevice);
  const getFilteredDeviceData = useStore(state => state.getFilteredDeviceData);
  const setTimeRange = useStore(state => state.setTimeRange);
  const dashboardFilters = useStore(state => state.dashboardFilters);
  const updateDeviceData = useStore(state => state.updateDeviceData);
  const deviceData = useStore(state => state.deviceData);

  const device = getSelectedDevice();

  // Initialize device data on mount
  useEffect(() => {
    if (selectedDeviceId && !deviceData[selectedDeviceId]) {
      const data = generateAllDeviceData([selectedDeviceId]);
      updateDeviceData(selectedDeviceId, data[selectedDeviceId]);
    }
  }, [selectedDeviceId, deviceData, updateDeviceData]);

  // Simulate real-time updates
  useEffect(() => {
    if (!selectedDeviceId) return;

    const interval = setInterval(() => {
      const currentData = deviceData[selectedDeviceId] || [];
      const { addNewDataPoint } = require('../utils/dataGenerator');
      const newData = addNewDataPoint(selectedDeviceId, currentData);
      updateDeviceData(selectedDeviceId, newData);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedDeviceId, deviceData, updateDeviceData]);

  const filteredData = useMemo(() => {
    if (!selectedDeviceId) return [];
    return getFilteredDeviceData(selectedDeviceId);
  }, [selectedDeviceId, getFilteredDeviceData, dashboardFilters.timeRange, deviceData]);

  // Format data for charts
  const chartData = useMemo(() => {
    return filteredData.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      timestamp: point.timestamp,
      temperature: point.temperature,
      humidity: point.humidity,
      battery: point.battery
    }));
  }, [filteredData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        avgTemp: 0,
        avgHumidity: 0,
        avgBattery: 0,
        lastSeen: 'Never',
        status: 'offline'
      };
    }

    const avgTemp = filteredData.reduce((sum, p) => sum + p.temperature, 0) / filteredData.length;
    const avgHumidity = filteredData.reduce((sum, p) => sum + p.humidity, 0) / filteredData.length;
    const avgBattery = filteredData.reduce((sum, p) => sum + p.battery, 0) / filteredData.length;
    const lastPoint = filteredData[filteredData.length - 1];
    const lastSeen = new Date(lastPoint.timestamp).toLocaleString();

    return {
      avgTemp: Math.round(avgTemp * 10) / 10,
      avgHumidity: Math.round(avgHumidity * 10) / 10,
      avgBattery: Math.round(avgBattery * 10) / 10,
      lastSeen,
      status: lastPoint.status
    };
  }, [filteredData]);

  if (!device) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Please select a device from the dropdown above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {device.name} • {device.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                dashboardFilters.timeRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Temperature</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.avgTemp}°C</p>
            </div>
            <div className="text-2xl sm:text-3xl">🌡️</div>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Humidity</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.avgHumidity}%</p>
            </div>
            <div className="text-2xl sm:text-3xl">💧</div>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Battery Level</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.avgBattery}%</p>
            </div>
            <div className="text-2xl sm:text-3xl">🔋</div>
          </div>
        </div>
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className={`text-xl sm:text-2xl font-bold ${stats.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                {stats.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="text-2xl sm:text-3xl">{stats.status === 'online' ? '🟢' : '🔴'}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Temperature Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="temperature" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Humidity Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Combined Chart */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">All Metrics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#0ea5e9" strokeWidth={2} name="Temperature (°C)" dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} name="Humidity (%)" dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="battery" stroke="#f59e0b" strokeWidth={2} name="Battery (%)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Events Table */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Data Points</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {filteredData.slice(-10).reverse().map(point => (
                  <div key={point.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                        <p className="text-sm font-medium">{new Date(point.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        point.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {point.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Temp</p>
                        <p className="text-sm font-semibold">{point.temperature}°C</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
                        <p className="text-sm font-semibold">{point.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
                        <p className="text-sm font-semibold">{point.battery}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Table View */}
              <table className="hidden sm:table w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Temperature</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Humidity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Battery</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(-10).reverse().map(point => (
                    <tr key={point.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-sm">{new Date(point.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{point.temperature}°C</td>
                      <td className="py-3 px-4 text-sm">{point.humidity}%</td>
                      <td className="py-3 px-4 text-sm">{point.battery}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          point.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {point.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



