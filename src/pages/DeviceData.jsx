import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../stores/useStore';
import { generateAllDeviceData } from '../utils/dataGenerator';

export default function DeviceData() {
  const selectedDeviceId = useStore(state => state.selectedDeviceId);
  const getSelectedDevice = useStore(state => state.getSelectedDevice);
  const getFilteredDeviceData = useStore(state => state.getFilteredDeviceData);
  const deviceData = useStore(state => state.deviceData);
  const updateDeviceData = useStore(state => state.updateDeviceData);
  const dashboardFilters = useStore(state => state.dashboardFilters);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

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
    let data = getFilteredDeviceData(selectedDeviceId);

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(point => {
        const dateStr = new Date(point.timestamp).toLocaleString().toLowerCase();
        const statusStr = point.status.toLowerCase();
        return dateStr.includes(term) || statusStr.includes(term);
      });
    }

    // Apply sorting
    data = [...data].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'temperature':
          aVal = a.temperature;
          bVal = b.temperature;
          break;
        case 'humidity':
          aVal = a.humidity;
          bVal = b.humidity;
          break;
        case 'battery':
          aVal = a.battery;
          bVal = b.battery;
          break;
        default:
          aVal = a.timestamp;
          bVal = b.timestamp;
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [selectedDeviceId, getFilteredDeviceData, searchTerm, sortBy, sortOrder, dashboardFilters.timeRange, deviceData]);

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Device Data</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Raw telemetry data for {device.name} • {device.location}
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by date or status..."
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-sm"
            >
              <option value="timestamp">Timestamp</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="battery">Battery</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Data Points ({filteredData.length})</h2>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3 max-h-[600px] overflow-y-auto px-4">
                {filteredData.length === 0 ? (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">No data points found</p>
                ) : (
                  filteredData.map(point => (
                    <div key={point.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Timestamp</p>
                          <p className="text-sm font-medium">{new Date(point.timestamp).toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          point.status === 'online' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                  ))
                )}
              </div>
              
              {/* Desktop Table View */}
              <table className="hidden sm:table w-full">
                <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Temperature (°C)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Humidity (%)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Battery (%)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                        No data points found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map(point => (
                      <tr key={point.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-sm">{new Date(point.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm">{point.temperature}</td>
                        <td className="py-3 px-4 text-sm">{point.humidity}</td>
                        <td className="py-3 px-4 text-sm">{point.battery}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            point.status === 'online' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {point.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



