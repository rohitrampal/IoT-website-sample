// Device-specific data patterns
const DEVICE_PATTERNS = {
  device1: { // Thermostat
    temp: { min: 18, max: 28, base: 22, variance: 3 },
    humidity: { min: 30, max: 60, base: 45, variance: 10 },
    battery: { min: 80, max: 100, base: 95, variance: 5 }
  },
  device2: { // Environmental Sensor
    temp: { min: 20, max: 25, base: 23, variance: 2 },
    humidity: { min: 40, max: 70, base: 55, variance: 15 },
    battery: { min: 60, max: 90, base: 75, variance: 10 }
  },
  device3: { // Security Camera
    temp: { min: 15, max: 30, base: 22, variance: 5 },
    humidity: { min: 20, max: 50, base: 35, variance: 8 },
    battery: { min: 40, max: 100, base: 85, variance: 15 }
  },
  device4: { // Smart Light
    temp: { min: 19, max: 26, base: 23, variance: 2 },
    humidity: { min: 35, max: 65, base: 50, variance: 12 },
    battery: { min: 70, max: 100, base: 90, variance: 8 }
  },
  device5: { // Air Quality Monitor
    temp: { min: 18, max: 27, base: 22, variance: 4 },
    humidity: { min: 30, max: 60, base: 45, variance: 10 },
    battery: { min: 50, max: 100, base: 80, variance: 12 }
  },
  device6: { // Motion Detector
    temp: { min: 10, max: 35, base: 20, variance: 8 },
    humidity: { min: 25, max: 55, base: 40, variance: 10 },
    battery: { min: 30, max: 100, base: 70, variance: 20 }
  }
};

// Generate a random value within a range with some variance
function generateValue(pattern, timeOffset = 0) {
  const { min, max, base, variance } = pattern;
  // Add some time-based variation (sine wave for smooth changes)
  const timeVariation = Math.sin(timeOffset / 10000) * variance;
  const randomVariation = (Math.random() - 0.5) * variance * 0.5;
  const value = base + timeVariation + randomVariation;
  return Math.max(min, Math.min(max, Math.round(value * 10) / 10));
}

// Generate historical data for a device
export function generateHistoricalData(deviceId, hours = 24) {
  const pattern = DEVICE_PATTERNS[deviceId] || DEVICE_PATTERNS.device1;
  const data = [];
  const now = Date.now();
  const interval = 5 * 60 * 1000; // 5 minutes between data points
  const points = (hours * 60) / 5; // Number of points
  
  for (let i = points; i >= 0; i--) {
    const timestamp = now - (i * interval);
    const timeOffset = timestamp - now;
    
    data.push({
      id: `${deviceId}-${timestamp}`,
      timestamp,
      temperature: generateValue(pattern.temp, timeOffset),
      humidity: generateValue(pattern.humidity, timeOffset),
      battery: generateValue(pattern.battery, timeOffset),
      status: Math.random() > 0.05 ? 'online' : 'offline' // 95% online
    });
  }
  
  return data;
}

// Generate data for all devices
export function generateAllDeviceData(deviceIds) {
  const allData = {};
  deviceIds.forEach(deviceId => {
    // Generate 30 days of historical data
    allData[deviceId] = generateHistoricalData(deviceId, 24 * 30);
  });
  return allData;
}

// Add a new data point to existing data (for real-time simulation)
export function addNewDataPoint(deviceId, existingData = []) {
  const pattern = DEVICE_PATTERNS[deviceId] || DEVICE_PATTERNS.device1;
  const now = Date.now();
  const lastPoint = existingData[existingData.length - 1];
  const timeOffset = lastPoint ? now - lastPoint.timestamp : 0;
  
  const newPoint = {
    id: `${deviceId}-${now}`,
    timestamp: now,
    temperature: generateValue(pattern.temp, timeOffset),
    humidity: generateValue(pattern.humidity, timeOffset),
    battery: generateValue(pattern.battery, timeOffset),
    status: Math.random() > 0.05 ? 'online' : 'offline'
  };
  
  return [...existingData, newPoint].slice(-1000); // Keep last 1000 points
}


