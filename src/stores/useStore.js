import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Sample users data
const SAMPLE_USERS = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    devices: ['device1']
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    devices: ['device2', 'device3']
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    devices: ['device4', 'device5', 'device6']
  }
];

// Sample devices data
const SAMPLE_DEVICES = {
  device1: {
    id: 'device1',
    name: 'Smart Thermostat Alpha',
    type: 'Thermostat',
    location: 'Living Room',
    status: 'online',
    userId: 'user1'
  },
  device2: {
    id: 'device2',
    name: 'Environmental Sensor Beta',
    type: 'Sensor',
    location: 'Office',
    status: 'online',
    userId: 'user2'
  },
  device3: {
    id: 'device3',
    name: 'Security Camera Gamma',
    type: 'Camera',
    location: 'Front Door',
    status: 'offline',
    userId: 'user2'
  },
  device4: {
    id: 'device4',
    name: 'Smart Light Delta',
    type: 'Light',
    location: 'Bedroom',
    status: 'online',
    userId: 'user3'
  },
  device5: {
    id: 'device5',
    name: 'Air Quality Monitor Epsilon',
    type: 'Monitor',
    location: 'Kitchen',
    status: 'online',
    userId: 'user3'
  },
  device6: {
    id: 'device6',
    name: 'Motion Detector Zeta',
    type: 'Sensor',
    location: 'Garage',
    status: 'offline',
    userId: 'user3'
  }
};

export const useStore = create(
  persist(
    (set, get) => ({
      // User state
      currentUser: null,
      users: SAMPLE_USERS,
      devices: SAMPLE_DEVICES,
      
      // Device state
      selectedDeviceId: null,
      
      // Theme state
      theme: 'light',
      
      // Dashboard filters
      dashboardFilters: {
        timeRange: '1h' // 30m, 1h, 1d, 1w, 1M, 1y
      },
      
      // Device data (will be populated by data generator)
      deviceData: {},
      
      // Action logs
      deviceActionsLog: {},
      
      // Actions
      login: (email, password) => {
        const user = SAMPLE_USERS.find(u => u.email === email && u.password === password);
        if (user) {
          const userDevices = user.devices;
          set({
            currentUser: user,
            selectedDeviceId: userDevices.length > 0 ? userDevices[0] : null
          });
          return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
      },
      
      logout: () => {
        set({
          currentUser: null,
          selectedDeviceId: null
        });
      },
      
      setSelectedDevice: (deviceId) => {
        set({ selectedDeviceId: deviceId });
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      
      setTimeRange: (range) => {
        set({
          dashboardFilters: {
            ...get().dashboardFilters,
            timeRange: range
          }
        });
      },
      
      updateDeviceData: (deviceId, data) => {
        set({
          deviceData: {
            ...get().deviceData,
            [deviceId]: data
          }
        });
      },
      
      addActionLog: (deviceId, action) => {
        const logs = get().deviceActionsLog[deviceId] || [];
        const newLog = {
          id: Date.now().toString(),
          action,
          timestamp: new Date().toISOString(),
          deviceId
        };
        set({
          deviceActionsLog: {
            ...get().deviceActionsLog,
            [deviceId]: [newLog, ...logs].slice(0, 50) // Keep last 50 actions
          }
        });
        return newLog;
      },
      
      getCurrentUserDevices: () => {
        const { currentUser, devices } = get();
        if (!currentUser) return [];
        return currentUser.devices.map(id => devices[id]).filter(Boolean);
      },
      
      getSelectedDevice: () => {
        const { selectedDeviceId, devices } = get();
        return selectedDeviceId ? devices[selectedDeviceId] : null;
      },
      
      getDeviceData: (deviceId) => {
        return get().deviceData[deviceId] || [];
      },
      
      getFilteredDeviceData: (deviceId) => {
        const { deviceData, dashboardFilters } = get();
        const data = deviceData[deviceId] || [];
        const now = Date.now();
        const ranges = {
          '30m': 30 * 60 * 1000,
          '1h': 60 * 60 * 1000,
          '1d': 24 * 60 * 60 * 1000,
          '1w': 7 * 24 * 60 * 60 * 1000,
          '1M': 30 * 24 * 60 * 60 * 1000,
          '1y': 365 * 24 * 60 * 60 * 1000
        };
        const range = ranges[dashboardFilters.timeRange] || ranges['1h'];
        const cutoff = now - range;
        return data.filter(point => point.timestamp >= cutoff);
      }
    }),
    {
      name: 'iot-dashboard-storage',
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
        selectedDeviceId: state.selectedDeviceId,
        dashboardFilters: state.dashboardFilters
      })
    }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('iot-dashboard-storage');
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme);
      if (parsed.state?.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}



