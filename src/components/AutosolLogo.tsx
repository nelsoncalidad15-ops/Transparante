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
  const sizeConfig = {
    sm: { width: 150, subtitle: 'text-[9px]' },
    md: { width: 190, subtitle: 'text-[10px]' },
    lg: { width: 235, subtitle: 'text-xs' },
    xl: { width: 290, subtitle: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}images/autosol-logo-official.png`}
        alt="Volkswagen | Autosol"
        width={sizeConfig.width}
        className={`h-auto max-w-full ${isLight ? 'brightness-0 invert' : ''}`}
      />
      {showSubtitle && (
        <span className={`mt-1 hidden pl-[22%] font-normal leading-none sm:block ${sizeConfig.subtitle} ${isLight ? 'text-white/75' : 'text-[#404759]'}`}>
          Centro digital de orientación
        </span>
      )}
    </div>
  );
};
