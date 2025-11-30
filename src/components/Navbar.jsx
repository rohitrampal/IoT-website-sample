import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { IoIosLogOut } from "react-icons/io";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const getCurrentUserDevices = useStore(state => state.getCurrentUserDevices);
  const selectedDeviceId = useStore(state => state.selectedDeviceId);
  const setSelectedDevice = useStore(state => state.setSelectedDevice);
  const logout = useStore(state => state.logout);

  const devices = getCurrentUserDevices();
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-lg sm:text-xl font-bold text-primary-600 dark:text-primary-400 truncate">
              IoT Dashboard
            </h1>
            
            {/* Device Dropdown - Hidden on mobile, shown on tablet+ */}
            {devices.length > 0 && (
              <div className="relative hidden sm:block flex-1 max-w-xs">
                <select
                  value={selectedDeviceId || ''}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="input-field appearance-none pr-8 cursor-pointer text-sm"
                >
                  <option value="">Select Device</option>
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name} ({device.location})
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Profile - Simplified on mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold truncate max-w-[120px]">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{currentUser?.email}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="btn-secondary text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden"><IoIosLogOut /></span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Device Selector - Shown only on mobile */}
        {devices.length > 0 && (
          <div className="mt-3 sm:hidden relative">
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="input-field appearance-none pr-8 cursor-pointer w-full text-sm"
            >
              <option value="">Select Device</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.location})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

