import { useEffect, useRef } from 'react';

export default function FloatingElements() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = [];
    const icons = ['🌡️', '📊', '📹', '💡', '🌬️', '🚨', '🔋', '📡', '⚡', '🔌'];

    // Create floating elements
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.className = 'absolute text-4xl opacity-20 dark:opacity-10';
      element.textContent = icons[Math.floor(Math.random() * icons.length)];
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      element.style.animationDelay = `${Math.random() * 5}s`;
      element.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
      container.appendChild(element);
      elements.push(element);
    }

    return () => {
      elements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}

