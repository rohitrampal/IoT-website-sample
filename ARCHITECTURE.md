# Architecture & Implementation Guide

## Overview

This IoT Dashboard application demonstrates a complete frontend solution for managing and monitoring IoT devices. The architecture emphasizes:

1. **Global State Management** with Zustand
2. **Real-time Data Simulation** with realistic patterns
3. **Multi-user, Multi-device** support
4. **Reactive UI Updates** based on state changes
5. **Clean Component Architecture**

## Data Flow Architecture

```
┌─────────────────┐
│  Landing Page   │
│  (Public)       │
└────────┬────────┘
         │ Login
         ▼
┌─────────────────┐
│  Zustand Store  │
│  - currentUser  │
│  - devices      │
│  - selectedDevice│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  App Layout     │
│  - Navbar       │
│  - Sidebar      │
└────────┬────────┘
         │
         ├──► Dashboard (Charts + Stats)
         ├──► Device Actions (Controls)
         └──► Device Data (Table)
```

## How Zustand Manages State

### Store Structure

The Zustand store (`src/stores/useStore.js`) is the single source of truth:

```javascript
{
  // Authentication
  currentUser: User | null,
  users: User[],
  
  // Device Management
  devices: { [deviceId]: Device },
  selectedDeviceId: string | null,
  
  // UI State
  theme: 'light' | 'dark',
  
  // Data & Filters
  dashboardFilters: { timeRange: string },
  deviceData: { [deviceId]: DataPoint[] },
  deviceActionsLog: { [deviceId]: ActionLog[] }
}
```

### State Updates Flow

1. **User Login**:
   ```
   User enters credentials
   → login(email, password) called
   → Validates against SAMPLE_USERS
   → Sets currentUser and selectedDeviceId (first device)
   → Persists to localStorage
   → Components re-render
   ```

2. **Device Selection**:
   ```
   User selects device from dropdown
   → setSelectedDevice(deviceId) called
   → selectedDeviceId updated in store
   → All components using getSelectedDevice() re-render
   → Dashboard, DeviceActions, DeviceData update
   ```

3. **Data Generation**:
   ```
   Component mounts with selectedDeviceId
   → Checks if deviceData[deviceId] exists
   → If not, generates 30 days of historical data
   → Stores in deviceData[deviceId]
   → Components display data
   ```

4. **Real-time Updates**:
   ```
   useEffect in Dashboard/DeviceData
   → setInterval every 30 seconds
   → addNewDataPoint() generates new data point
   → updateDeviceData() appends to array
   → Components automatically re-render
   ```

## Dummy Data Generation

### Device-Specific Patterns

Each device has unique characteristics defined in `src/utils/dataGenerator.js`:

```javascript
DEVICE_PATTERNS = {
  device1: { // Thermostat
    temp: { min: 18, max: 28, base: 22, variance: 3 },
    humidity: { min: 30, max: 60, base: 45, variance: 10 },
    battery: { min: 80, max: 100, base: 95, variance: 5 }
  },
  // ... more devices
}
```

### Data Generation Algorithm

1. **Historical Data** (`generateHistoricalData`):
   - Creates data points every 5 minutes
   - Spans 30 days (720 hours)
   - Uses time-based sine wave for smooth variation
   - Adds random variance for realism

2. **Real-time Updates** (`addNewDataPoint`):
   - Generates single new data point
   - Uses same pattern as historical data
   - Appends to existing array
   - Keeps last 1000 points (memory management)

3. **Value Calculation**:
   ```javascript
   value = base + (sin(timeOffset / 10000) * variance) + (random * variance * 0.5)
   value = clamp(value, min, max)
   ```

## Component Architecture

### Page Components

1. **LandingPage** (`/`)
   - Public route, no authentication required
   - Product showcase with animations
   - Login modal with hardcoded validation
   - Uses `useStore().login()` for authentication

2. **Dashboard** (`/app/dashboard`)
   - Protected route
   - Reads `selectedDeviceId` from store
   - Gets filtered data via `getFilteredDeviceData()`
   - Displays charts (Recharts) and statistics
   - Updates every 30 seconds with new data

3. **DeviceActions** (`/app/device-actions`)
   - Protected route
   - Shows action buttons for selected device
   - Calls `addActionLog()` on action execution
   - Displays action history from store

4. **DeviceData** (`/app/device-data`)
   - Protected route
   - Shows raw telemetry data table
   - Supports search and sorting
   - Filters data based on time range from store

### Layout Components

1. **AppLayout**
   - Wraps all protected routes
   - Contains Navbar and Sidebar
   - Uses React Router `<Outlet />` for child routes

2. **Navbar**
   - Device dropdown (reads from `getCurrentUserDevices()`)
   - Theme toggle (calls `toggleTheme()`)
   - Profile display (shows `currentUser`)
   - Logout button (calls `logout()`)

3. **Sidebar**
   - Navigation links using React Router `NavLink`
   - Active route highlighting
   - Icons for visual clarity

## How Device Switching Affects All Pages

### Reactive Updates

When `selectedDeviceId` changes in Zustand:

1. **Dashboard**:
   ```javascript
   const selectedDeviceId = useStore(state => state.selectedDeviceId);
   const filteredData = useStore(state => state.getFilteredDeviceData(selectedDeviceId));
   // Component re-renders automatically
   ```

2. **DeviceActions**:
   ```javascript
   const device = useStore(state => state.getSelectedDevice());
   // Shows actions for new device
   ```

3. **DeviceData**:
   ```javascript
   const filteredData = useStore(state => state.getFilteredDeviceData(selectedDeviceId));
   // Table updates with new device's data
   ```

### Data Initialization

When switching to a device without data:

```javascript
useEffect(() => {
  if (selectedDeviceId && !deviceData[selectedDeviceId]) {
    const data = generateAllDeviceData([selectedDeviceId]);
    updateDeviceData(selectedDeviceId, data[selectedDeviceId]);
  }
}, [selectedDeviceId]);
```

## Time Filtering Implementation

### Filter Logic

```javascript
getFilteredDeviceData: (deviceId) => {
  const data = deviceData[deviceId] || [];
  const now = Date.now();
  const ranges = {
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    // ... more ranges
  };
  const cutoff = now - ranges[dashboardFilters.timeRange];
  return data.filter(point => point.timestamp >= cutoff);
}
```

### How It Works

1. User selects time range (e.g., "Last 1 hour")
2. `setTimeRange('1h')` updates store
3. `getFilteredDeviceData()` recalculates filtered array
4. Components using filtered data re-render
5. Charts update with new time window

## Theme Management

### Implementation

```javascript
toggleTheme: () => {
  const newTheme = theme === 'light' ? 'dark' : 'dark';
  set({ theme: newTheme });
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
}
```

### Persistence

- Zustand `persist` middleware saves theme to localStorage
- On app load, theme is restored and applied
- All components use Tailwind dark mode classes

## Real-time Simulation

### Update Strategy

```javascript
useEffect(() => {
  if (!selectedDeviceId) return;
  
  const interval = setInterval(() => {
    const currentData = deviceData[selectedDeviceId] || [];
    const newData = addNewDataPoint(selectedDeviceId, currentData);
    updateDeviceData(selectedDeviceId, newData);
  }, 30000); // 30 seconds
  
  return () => clearInterval(interval);
}, [selectedDeviceId, deviceData]);
```

### Why This Works

- `setInterval` runs independently of React render cycle
- Updates Zustand store directly
- Components subscribe to store changes
- Automatic re-renders show new data
- Cleanup on unmount prevents memory leaks

## Key Design Decisions

1. **Zustand over Redux**: Simpler API, less boilerplate, perfect for this use case
2. **Pre-generated Historical Data**: Better UX than empty state, realistic charts
3. **Device-specific Patterns**: Makes switching devices visually obvious
4. **Time-based Filtering**: Client-side filtering is fast enough for demo
5. **Toast Notifications**: Context-based system for user feedback
6. **Protected Routes**: Simple wrapper component, no complex auth logic needed

## Performance Considerations

1. **Data Limits**: Keeps last 1000 data points per device
2. **Memoization**: Uses `useMemo` for expensive calculations (filtering, stats)
3. **Lazy Data Generation**: Only generates data when device is selected
4. **Efficient Re-renders**: Zustand only re-renders components using changed state
5. **Chart Optimization**: Recharts handles large datasets efficiently

## Future Enhancements (Not Implemented)

- WebSocket integration for real-time data
- Backend API integration
- User management and permissions
- Device configuration pages
- Alert/notification system
- Data export functionality
- Advanced analytics and ML insights


