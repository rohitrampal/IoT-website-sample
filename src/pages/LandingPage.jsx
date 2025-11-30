import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { useToast } from '../components/ToastContainer';
import Interactive3D from '../components/Interactive3D';
import FloatingElements from '../components/FloatingElements';
import ProductCard3D from '../components/ProductCard3D';

const PRODUCTS = [
  {
    id: 1,
    name: 'Smart Thermostat',
    description: 'Intelligent climate control with AI-powered optimization and remote access.',
    icon: '🌡️',
    color: 'rgba(239, 68, 68, 0.1)'
  },
  {
    id: 2,
    name: 'Environmental Sensors',
    description: 'Comprehensive monitoring of air quality, temperature, and humidity.',
    icon: '📊',
    color: 'rgba(34, 197, 94, 0.1)'
  },
  {
    id: 3,
    name: 'Security Cameras',
    description: 'Advanced surveillance with motion detection and cloud storage.',
    icon: '📹',
    color: 'rgba(59, 130, 246, 0.1)'
  },
  {
    id: 4,
    name: 'Smart Lighting',
    description: 'Energy-efficient LED systems with automated scheduling and dimming.',
    icon: '💡',
    color: 'rgba(251, 191, 36, 0.1)'
  },
  {
    id: 5,
    name: 'Air Quality Monitors',
    description: 'Real-time air quality tracking with alerts and recommendations.',
    icon: '🌬️',
    color: 'rgba(168, 85, 247, 0.1)'
  },
  {
    id: 6,
    name: 'Motion Detectors',
    description: 'Wireless motion sensors with instant notifications and integration.',
    icon: '🚨',
    color: 'rgba(236, 72, 153, 0.1)'
  }
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const { showToast } = useToast();
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      showToast('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 500);
    } else {
      showToast(result.error || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* 3D Background Effects */}
      <Interactive3D />
      <FloatingElements />

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 relative z-10">
        <div className="flex justify-between items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-2xl font-bold text-primary-700 dark:text-primary-400 relative flex-shrink-0 min-w-0">
            <span className="relative z-10 truncate">IoT Solutions Inc.</span>
            <span className="absolute inset-0 blur-sm opacity-50 hidden sm:block">IoT Solutions Inc.</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="btn-primary relative overflow-hidden group text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2"
              style={{
                transformStyle: 'preserve-3d',
              }}
              aria-label={showLogin ? 'Close login modal' : 'Open login modal'}
            >
              <span className="relative z-10">{showLogin ? 'Close' : 'Login'}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>
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
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm p-4">
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 max-w-md w-full animate-slide-up relative overflow-hidden max-h-[90vh] overflow-y-auto"
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-500/10 opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Login</h2>
              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field text-sm"
                    placeholder="password123"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full relative overflow-hidden group text-sm sm:text-base">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </form>
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-1 sm:mb-2">Demo Credentials:</p>
                <p className="break-all">john@example.com / password123</p>
                <p className="break-all">jane@example.com / password123</p>
                <p className="break-all">bob@example.com / password123</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center relative z-10">
        <div className="relative">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white animate-fade-in relative"
            style={{
              textShadow: '0 0 30px rgba(14, 165, 233, 0.3)',
              transformStyle: 'preserve-3d',
            }}
          >
            <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ transformStyle: 'preserve-3d' }}>
              Next-Generation
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
              IoT Solutions
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto relative z-10 px-2">
            Empowering businesses with intelligent, connected devices that transform operations and drive efficiency.
          </p>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto mt-8 sm:mt-12">
            {[
              { value: '10M+', label: 'Devices' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Countries' }
            ].map((stat, i) => (
              <div
                key={i}
                className="card p-3 sm:p-4 md:p-6 hover:scale-110 transition-all duration-300 relative overflow-hidden group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 sm:mb-2">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12 relative">
          <span className="relative z-10">Our Products</span>
          <span className="absolute inset-0 blur-lg opacity-30 text-primary-500 hidden sm:block">Our Products</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {PRODUCTS.map((product, index) => (
            <ProductCard3D key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      {/* Company Info */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          <div 
            className="card p-4 sm:p-6 relative overflow-hidden group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">What We Build</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                We specialize in creating cutting-edge IoT devices that seamlessly integrate into your infrastructure.
              </p>
              <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li className="hover:translate-x-2 transition-transform duration-200">Remote monitoring and control systems</li>
                <li className="hover:translate-x-2 transition-transform duration-200">Real-time analytics and insights</li>
                <li className="hover:translate-x-2 transition-transform duration-200">Automated response and alerts</li>
                <li className="hover:translate-x-2 transition-transform duration-200">Scalable cloud infrastructure</li>
              </ul>
            </div>
          </div>
          <div 
            className="card p-4 sm:p-6 relative overflow-hidden group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Our Achievements</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { title: '10M+ Devices Deployed', desc: 'Trusted by enterprises worldwide' },
                  { title: '99.9% Uptime', desc: 'Reliable infrastructure you can count on' },
                  { title: '50+ Countries', desc: 'Global presence and support' }
                ].map((achievement, i) => (
                  <div 
                    key={i}
                    className="hover:scale-105 transition-transform duration-200"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <h3 className="font-semibold text-sm sm:text-base">{achievement.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Trusted Partners</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {['TechCorp', 'CloudSystems', 'DataFlow', 'SmartNet'].map((partner, i) => (
            <div
              key={i}
              className="text-lg sm:text-xl md:text-2xl font-bold opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
              style={{
                textShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
                transformStyle: 'preserve-3d',
              }}
            >
              {partner}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-600 dark:text-gray-400 relative z-10">
        <p className="text-sm sm:text-base">&copy; 2024 IoT Solutions Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
