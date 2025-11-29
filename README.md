# IoT Solutions Dashboard

A production-ready demo IoT product company website built with React, Vite, and Zustand for global state management.

## 🏗️ Architecture & Data Flow

### Architecture Overview

The application follows a modern React architecture with:

- **Global State Management**: Zustand store manages user authentication, device selection, theme preferences, dashboard filters, and device telemetry data
- **Component Structure**: Modular components with clear separation of concerns (pages, layouts, components, stores, utils)
- **Real-time Simulation**: Dummy data generators create realistic IoT telemetry with time-based patterns and periodic updates
- **Protected Routes**: Authentication-based routing ensures only logged-in users can access the dashboard

### Data Flow

1. **User Login**: User enters credentials → Zustand validates against hardcoded users → Sets `currentUser` and `selectedDeviceId` → Redirects to dashboard
2. **Device Selection**: User selects device from dropdown → Zustand updates `selectedDeviceId` → All pages reactively update to show selected device data
3. **Data Generation**: On device selection, historical data (30 days) is generated with device-specific patterns → Stored in Zustand `deviceData`
4. **Real-time Updates**: `setInterval` adds new data points every 30 seconds → Updates Zustand store → Components re-render with new data
5. **Time Filtering**: User selects time range → Zustand filters data by timestamp → Charts and tables update automatically
6. **Theme Management**: Theme toggle updates Zustand → Persists to localStorage → Applies dark/light mode globally

## 📁 Project Structure

```
demo/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation with device dropdown, theme toggle, profile
│   │   ├── Sidebar.jsx         # Side navigation menu
│   │   ├── Toast.jsx           # Toast notification component
│   │   ├── ToastContainer.jsx  # Toast provider and context
│   │   └── ProtectedRoute.jsx  # Route protection wrapper
│   ├── layouts/
│   │   └── AppLayout.jsx       # Main app layout (navbar + sidebar + outlet)
│   ├── pages/
│   │   ├── LandingPage.jsx     # Public landing page with products and login
│   │   ├── Dashboard.jsx       # Analytics dashboard with charts and stats
│   │   ├── DeviceActions.jsx   # Device control actions page
│   │   └── DeviceData.jsx       # Raw device data table view
│   ├── stores/
│   │   └── useStore.js         # Zustand store with all global state
│   ├── utils/
│   │   └── dataGenerator.js    # IoT telemetry data generation logic
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles with Tailwind
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔐 Demo Credentials

The application includes three sample users:

1. **John Doe**
   - Email: `john@example.com`
   - Password: `password123`
   - Devices: 1 device (Smart Thermostat Alpha)

2. **Jane Smith**
   - Email: `jane@example.com`
   - Password: `password123`
   - Devices: 2 devices (Environmental Sensor Beta, Security Camera Gamma)

3. **Bob Johnson**
   - Email: `bob@example.com`
   - Password: `password123`
   - Devices: 3 devices (Smart Light Delta, Air Quality Monitor Epsilon, Motion Detector Zeta)

## 📊 Features

### Landing Page (`/`)
- Product showcase with 6 IoT products
- Company information and achievements
- Partnership section
- Login modal with hardcoded authentication

### Dashboard (`/app/dashboard`)
- Real-time charts (temperature, humidity, battery)
- Summary statistics cards
- Time range filters (30m, 1h, 1d, 1w, 1M, 1y)
- Recent data points table
- Device-specific data visualization

### Device Actions (`/app/device-actions`)
- 5 device control actions:
  - Turn ON/OFF
  - Restart Device
  - Sync Now
  - Trigger Alert
- Action history log
- Toast notifications for executed actions

### Device Data (`/app/device-data`)
- Raw telemetry data table
- Search and filter functionality
- Sortable columns (timestamp, temperature, humidity, battery)
- Scrollable table with pagination-like view

## 🎨 Styling

- **Tailwind CSS v3**: Utility-first CSS framework
- **Dark Mode**: Toggleable theme with persistence
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and entrance animations

## 🔄 State Management (Zustand)

### Store Structure

```javascript
{
  // User state
  currentUser: null | User,
  users: User[],
  devices: DeviceMap,
  
  // Device state
  selectedDeviceId: string | null,
  
  // Theme
  theme: 'light' | 'dark',
  
  // Filters
  dashboardFilters: {
    timeRange: '30m' | '1h' | '1d' | '1w' | '1M' | '1y'
  },
  
  // Data
  deviceData: { [deviceId]: DataPoint[] },
  deviceActionsLog: { [deviceId]: ActionLog[] }
}
```

### Key Actions

- `login(email, password)`: Authenticate user
- `logout()`: Clear user session
- `setSelectedDevice(deviceId)`: Change active device
- `toggleTheme()`: Switch light/dark mode
- `setTimeRange(range)`: Update dashboard time filter
- `updateDeviceData(deviceId, data)`: Update device telemetry
- `addActionLog(deviceId, action)`: Log device action

## 📈 Data Generation

### Device Patterns

Each device has unique data patterns:

- **Temperature**: Device-specific ranges (18-32°C) with time-based variation
- **Humidity**: Ranges from 20-70% depending on device type
- **Battery**: Varies by device (30-100%)
- **Status**: 95% online, 5% offline (random)

### Data Generation Strategy

1. **Historical Data**: Pre-generated 30 days of data on device selection
2. **Real-time Updates**: New data points added every 30 seconds
3. **Time-based Variation**: Sine wave patterns for smooth value changes
4. **Device-specific Ranges**: Each device has unique min/max/base values

### Filtering

Time filters work by:
1. Getting current timestamp
2. Calculating cutoff time based on selected range
3. Filtering data points where `timestamp >= cutoff`
4. Updating charts and tables reactively

## 🔧 How Device Switching Works

1. User selects device from navbar dropdown
2. Zustand updates `selectedDeviceId`
3. All components using `getSelectedDevice()` or `getFilteredDeviceData()` automatically re-render
4. If device data doesn't exist, it's generated on-the-fly
5. Charts, tables, and stats update to show new device's data

## 🎯 Key Implementation Details

### Protected Routes
- `ProtectedRoute` component checks for `currentUser` in Zustand
- Redirects to landing page if not authenticated
- Wraps all `/app/*` routes

### Real-time Simulation
- `useEffect` hooks in Dashboard and DeviceData pages
- `setInterval` adds new data points every 30 seconds
- Data is appended to existing array (keeps last 1000 points)

### Theme Persistence
- Zustand `persist` middleware saves theme to localStorage
- Theme is applied on app load via `document.documentElement.classList`

### Toast Notifications
- Context-based toast system
- Global provider in App component
- Auto-dismiss after 3 seconds (configurable)

## 🛠️ Tech Stack

- **React 19**: UI library
- **Vite 7**: Build tool and dev server
- **Zustand 5**: State management
- **React Router DOM**: Routing
- **Recharts**: Chart library
- **Tailwind CSS 3**: Styling
- **PostCSS**: CSS processing

## 📝 Notes

- All data is mocked/simulated (no backend)
- Authentication is hardcoded (no real security)
- Data persists in Zustand store (lost on page refresh except theme/user)
- Designed as a demo/prototype for IoT dashboard concepts

## 🎨 Design Inspiration

The design takes inspiration from modern dashboard interfaces like Binance, focusing on:
- Clean, professional layout
- Clear data visualization
- Intuitive navigation
- Responsive design
- Smooth animations and transitions
