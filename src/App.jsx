import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DeviceActions from './pages/DeviceActions';
import DeviceData from './pages/DeviceData';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="device-actions" element={<DeviceActions />} />
            <Route path="device-data" element={<DeviceData />} />
            <Route index element={<Navigate to="/app/dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
