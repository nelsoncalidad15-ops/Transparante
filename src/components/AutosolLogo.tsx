import React from 'react';

interface AutosolLogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'white';
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AutosolLogo: React.FC<AutosolLogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtitle = true,
  size = 'md',
}) => {
  const isLight = variant === 'light' || variant === 'white';
  const strokeColor = isLight ? '#FFFFFF' : '#0B2265';
  const textColor = isLight ? 'text-white' : 'text-[#0B2265]';
  const subColor = isLight ? 'text-blue-200' : 'text-slate-500';

  const sizeConfig = {
    sm: { height: 28, vwSize: 26, text: 'text-lg', badge: 'text-[9px]' },
    md: { height: 38, vwSize: 34, text: 'text-2xl', badge: 'text-[10px]' },
    lg: { height: 48, vwSize: 42, text: 'text-3xl', badge: 'text-xs' },
    xl: { height: 60, vwSize: 54, text: 'text-4xl', badge: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* VW Round Emblem SVG */}
      <svg
        width={sizeConfig.vwSize}
        height={sizeConfig.vwSize}
        viewBox="0 0 100 100"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke={strokeColor} strokeWidth="6" />
        <circle cx="50" cy="50" r="41" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        {/* V */}
        <path
          d="M 28 26 L 45 66 L 55 66 L 72 26"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* W */}
        <path
          d="M 23 48 L 41 84 L 50 67 L 59 84 L 77 48"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 37 49 L 50 25 L 63 49"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Divider line */}
      <div
        className="w-[2.5px] rounded-full self-stretch my-1"
        style={{ backgroundColor: strokeColor }}
      />

      {/* Autosol Wordmark & Subtitle */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${sizeConfig.text} ${textColor} font-sans`}
            style={{ letterSpacing: '-0.03em' }}
          >
            Autosol
          </span>
          <span className="bg-blue-600 text-white font-extrabold text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wider ml-0.5">
            Transparente
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${subColor} hidden sm:block`}>
            Centro digital de orientación
          </span>
        )}
      </div>
    </div>
  );
};
