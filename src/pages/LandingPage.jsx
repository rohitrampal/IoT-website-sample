import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore';
import { useToast } from '../components/ToastContainer';

const PRODUCTS = [
  {
    id: 1,
    name: 'Smart Thermostat',
    description: 'Intelligent climate control with AI-powered optimization and remote access.',
    icon: '🌡️'
  },
  {
    id: 2,
    name: 'Environmental Sensors',
    description: 'Comprehensive monitoring of air quality, temperature, and humidity.',
    icon: '📊'
  },
  {
    id: 3,
    name: 'Security Cameras',
    description: 'Advanced surveillance with motion detection and cloud storage.',
    icon: '📹'
  },
  {
    id: 4,
    name: 'Smart Lighting',
    description: 'Energy-efficient LED systems with automated scheduling and dimming.',
    icon: '💡'
  },
  {
    id: 5,
    name: 'Air Quality Monitors',
    description: 'Real-time air quality tracking with alerts and recommendations.',
    icon: '🌬️'
  },
  {
    id: 6,
    name: 'Motion Detectors',
    description: 'Wireless motion sensors with instant notifications and integration.',
    icon: '🚨'
  }
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const login = useStore(state => state.login);
  const { showToast } = useToast();

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
            IoT Solutions Inc.
          </h1>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="btn-primary"
          >
            {showLogin ? 'Close' : 'Login'}
          </button>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="password123"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Sign In
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>john@example.com / password123</p>
              <p>jane@example.com / password123</p>
              <p>bob@example.com / password123</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white animate-fade-in">
          Next-Generation IoT Solutions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Empowering businesses with intelligent, connected devices that transform operations and drive efficiency.
        </p>
      </section>

      {/* Products Showcase */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              className="card hover:scale-105 transition-transform duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company Info */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">What We Build</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We specialize in creating cutting-edge IoT devices that seamlessly integrate into your infrastructure.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Remote monitoring and control systems</li>
              <li>Real-time analytics and insights</li>
              <li>Automated response and alerts</li>
              <li>Scalable cloud infrastructure</li>
            </ul>
          </div>
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Our Achievements</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">10M+ Devices Deployed</h3>
                <p className="text-gray-600 dark:text-gray-400">Trusted by enterprises worldwide</p>
              </div>
              <div>
                <h3 className="font-semibold">99.9% Uptime</h3>
                <p className="text-gray-600 dark:text-gray-400">Reliable infrastructure you can count on</p>
              </div>
              <div>
                <h3 className="font-semibold">50+ Countries</h3>
                <p className="text-gray-600 dark:text-gray-400">Global presence and support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Trusted Partners</h2>
        <div className="flex flex-wrap justify-center gap-8 opacity-60">
          <div className="text-2xl font-bold">TechCorp</div>
          <div className="text-2xl font-bold">CloudSystems</div>
          <div className="text-2xl font-bold">DataFlow</div>
          <div className="text-2xl font-bold">SmartNet</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 IoT Solutions Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}


