import React from 'react';

export function ErgoWiseLogo({ size = 48 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ marginRight: 12 }}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#0a2540" />
        </linearGradient>
        <linearGradient id="lightBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bbdefb" />
          <stop offset="100%" stopColor="#1976d2" />
        </linearGradient>
      </defs>
      
      {/* Background rounded square */}
  <rect x="8" y="8" rx="14" ry="14" width="84" height="64" fill="url(#lightBlueGradient)" stroke="url(#blueGradient)" strokeWidth="2" />

      {/* Monitor body */}
      <g transform="translate(0,0)">
  <rect x="18" y="18" width="64" height="36" rx="6" ry="6" fill="url(#blueGradient)" />
  {/* Screen inner */}
  <rect x="24" y="24" width="52" height="24" rx="4" ry="4" fill="#fff" />

  {/* Stand */}
  <rect x="44" y="56" width="12" height="8" rx="2" ry="2" fill="url(#blueGradient)" />
  <rect x="38" y="64" width="24" height="4" rx="2" ry="2" fill="url(#lightBlueGradient)" />

  {/* Checkmark on screen */}
  <path d="M34 36 L44 46 L62 30" stroke="#1976d2" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}