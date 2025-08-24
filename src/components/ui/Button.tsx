import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 border-3';
  
  const variants = {
    primary: 'bg-navy-500 hover:bg-navy-600 text-white border-navy-500 focus:ring-navy-500 disabled:bg-gray-400 disabled:border-gray-400',
    secondary: 'bg-gray-700 hover:bg-gray-800 text-white border-gray-700 focus:ring-gray-700 disabled:bg-gray-400 disabled:border-gray-400',
    outline: 'bg-white text-navy-900 border-navy-900 hover:bg-gray-50 focus:ring-navy-500',
    ghost: 'bg-white text-navy-900 border-transparent hover:border-navy-900 hover:bg-gray-50 focus:ring-navy-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-lg min-h-[56px]',
    md: 'px-6 py-3 text-xl min-h-[64px]',
    lg: 'px-8 py-4 text-2xl min-h-[72px]',
    xl: 'px-12 py-6 text-3xl min-h-[96px]'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};