import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'light',
  size = 'md' 
}) => {
  const isDark = variant === 'dark';
  
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-base sm:text-lg font-extrabold tracking-wider',
    lg: 'text-xl sm:text-2xl font-black tracking-wider'
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest'
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Visual Christian Modern Emblem with cross & soft wave */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-md shadow-blue-950/20 text-white ${iconSizes[size]} shrink-0 overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 opacity-60 mix-blend-overlay"></div>
        {/* Stylized Cross & Flame / Wind of the Spirit */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 relative z-10"
        >
          {/* Subtle cross */}
          <path d="M12 3v18" stroke="currentColor" strokeWidth="2.2" />
          <path d="M7 8h10" stroke="currentColor" strokeWidth="2.2" />
          {/* Subtle grace wave */}
          <path d="M4 17c3-2 6 2 9 0s5-1 7-1" stroke="currentColor" strokeWidth="1.6" opacity="0.8" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className={`${titleSizes[size]} ${isDark ? 'text-white' : 'text-slate-900'} uppercase font-heading`}>
          AD Barravento
        </span>
        <span className={`${subtitleSizes[size]} font-medium ${isDark ? 'text-blue-300' : 'text-slate-500'} uppercase mt-0.5`}>
          Igreja Evangélica
        </span>
      </div>
    </div>
  );
};
