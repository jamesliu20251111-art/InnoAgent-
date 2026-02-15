
import React from 'react';

const MagicCircle: React.FC<{ size?: number; className?: string; rotating?: boolean }> = ({ 
  size = 300, 
  className = "",
  rotating = true 
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        className={`${rotating ? 'animate-[spin_10s_linear_infinite]' : ''} opacity-40`}
      >
        <circle cx="100" cy="100" r="95" fill="none" stroke="#ff9d00" strokeWidth="1" strokeDasharray="10 5" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="#ff4d00" strokeWidth="0.5" />
        <path d="M100 5 L100 195 M5 100 L195 100" stroke="#ff9d00" strokeWidth="0.5" />
        <polygon points="100,20 170,140 30,140" fill="none" stroke="#ff9d00" strokeWidth="1" />
        <polygon points="100,180 30,60 170,60" fill="none" stroke="#ff4d00" strokeWidth="1" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#ff9d00" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4/5 h-4/5 rounded-full border border-orange-500/20 blur-xl animate-pulse" />
      </div>
    </div>
  );
};

export default MagicCircle;
