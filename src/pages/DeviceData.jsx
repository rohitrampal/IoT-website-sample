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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Device Data</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Raw telemetry data for {device.name} • {device.location}
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by date or status..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="timestamp">Timestamp</option>
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="battery">Battery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Data Points ({filteredData.length})</h2>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-gray-800">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">Temperature (°C)</th>
                <th className="text-left py-3 px-4">Humidity (%)</th>
                <th className="text-left py-3 px-4">Battery (%)</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No data points found
                  </td>
                </tr>
              ) : (
                filteredData.map(point => (
                  <tr key={point.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">{new Date(point.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4">{point.temperature}</td>
                    <td className="py-3 px-4">{point.humidity}</td>
                    <td className="py-3 px-4">{point.battery}</td>
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
  );
}



