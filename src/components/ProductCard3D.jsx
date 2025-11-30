import { useState, useRef } from 'react';

export default function ProductCard3D({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setIsHovered(false);
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      className="card p-4 sm:p-6 relative overflow-hidden group cursor-pointer transition-all duration-300"
      style={{
        transformStyle: 'preserve-3d',
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Icon Effect */}
      <div
        className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transition-transform duration-500"
        style={{
          transform: isHovered
            ? 'translateZ(50px) rotateY(360deg) scale(1.2)'
            : 'translateZ(0) rotateY(0) scale(1)',
        }}
      >
        {product.icon}
      </div>

      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${product.color || 'rgba(14, 165, 233, 0.1)'}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{product.name}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{product.description}</p>
      </div>

      {/* Shine Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%)',
          transform: 'translateX(-100%)',
          animation: isHovered ? 'shine 0.6s ease-in-out' : 'none',
        }}
      />
    </div>
  );
}

