import React, { useState, useEffect } from 'react';

interface Badge {
  id: string;
  src: string;
  alt: string;
  size?: number;
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
  };
}

interface FloatingBadgesProps {
  badges: Badge[];
}

export const FloatingBadges: React.FC<FloatingBadgesProps> = ({ badges }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide badges on very small screens
  if (windowWidth < 768) {
    return null;
  }

  return (
    <>
      {badges.map((badge) => (
        <div
          key={badge.id}
          style={{
            position: 'fixed',
            top: badge.position?.top || 'auto',
            right: badge.position?.right || '20px',
            bottom: badge.position?.bottom || 'auto',
            zIndex: 1000,
            pointerEvents: 'auto', // Allow interaction with badges
            opacity: 0.85,
            transition: 'all 0.3s ease',
            transform: 'scale(1)',
            cursor: 'pointer'
          }}
        >
          <img
            src={badge.src}
            alt={badge.alt}
            style={{
              width: badge.size || 80,
              height: badge.size || 80,
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback for missing images
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div style="
                    width: ${badge.size || 80}px;
                    height: ${badge.size || 80}px;
                    background: linear-gradient(135deg, #2bdfee, #98fb98);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Monaco, monospace;
                    font-size: 12px;
                    color: #000;
                    font-weight: bold;
                    text-align: center;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                  ">
                    ${badge.alt}
                  </div>
                `;
              }
            }}
          />
        </div>
      ))}
    </>
  );
};