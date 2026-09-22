import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'auto' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'auto',
  size = 'md'
}) => {
  const onDarkBg = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl'
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-flame text-white shadow-glow ${iconSizes[size]} shrink-0 overflow-hidden`}
      >
        <span className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 relative z-10"
        >
          <path d="M12 3v18" />
          <path d="M7 8h10" />
          <path d="M4 17c3-2 6 2 9 0s5-1 7-1" strokeWidth="1.6" opacity="0.85" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`${titleSizes[size]} font-extrabold tracking-wide ${
            onDarkBg ? 'text-white' : 'text-fg'
          } uppercase font-heading`}
        >
          AD Barravento
        </span>
        <span
          className={`${subtitleSizes[size]} font-semibold tracking-[0.22em] ${
            onDarkBg ? 'text-gold-bright' : 'text-terracotta dark:text-gold'
          } uppercase mt-1`}
        >
          Igreja Evangélica
        </span>
      </div>
    </div>
  );
};
