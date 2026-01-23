import React from 'react';
import { EN } from '../../i18n/en';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <img
        src="/logo.png"
        alt={EN.app.name}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export const LogoWithText: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Logo size={size} />
      <h1 className={`${textSizes[size]} font-bold text-gray-900 mt-2`}>
        {EN.app.name}
      </h1>
      <p className="text-sm text-gray-600 mt-1">{EN.app.tagline}</p>
    </div>
  );
};