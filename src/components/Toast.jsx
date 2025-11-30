import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type] || 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-2 sm:right-4 left-2 sm:left-auto max-w-sm sm:max-w-md ${bgColor} text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg z-50 animate-slide-down flex items-center gap-2 sm:gap-3 text-sm sm:text-base`}>
      <span className="flex-1 break-words">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-lg sm:text-xl flex-shrink-0"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}



