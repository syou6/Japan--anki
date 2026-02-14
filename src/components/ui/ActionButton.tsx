import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  position?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const variantStyles = {
  primary: {
    bg: 'bg-brand-600',
    hover: 'hover:bg-brand-700',
    text: 'text-white',
    border: 'border-transparent',
    iconBg: 'bg-white/15'
  },
  secondary: {
    bg: 'bg-gray-100',
    hover: 'hover:bg-gray-200',
    text: 'text-gray-900',
    border: 'border-transparent',
    iconBg: 'bg-gray-200'
  },
  danger: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-white',
    border: 'border-transparent',
    iconBg: 'bg-white/15'
  },
  success: {
    bg: 'bg-emerald-500',
    hover: 'hover:bg-emerald-600',
    text: 'text-white',
    border: 'border-transparent',
    iconBg: 'bg-white/15'
  }
};

const sizeStyles = {
  small: {
    padding: 'px-3 py-2',
    text: 'text-sm',
    icon: 'w-4 h-4',
    minHeight: 'min-h-[40px]'
  },
  medium: {
    padding: 'px-4 py-3',
    text: 'text-sm',
    icon: 'w-5 h-5',
    minHeight: 'min-h-[48px]'
  },
  large: {
    padding: 'px-6 py-4',
    text: 'text-base',
    icon: 'w-6 h-6',
    minHeight: 'min-h-[56px]'
  }
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  position = 'center',
  size = 'medium',
  disabled = false
}) => {
  const style = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const positionClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  }[position];

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${style.bg} ${style.hover} ${style.text}
        ${sizeStyle.padding} ${sizeStyle.minHeight}
        ${positionClass}
        border ${style.border}
        rounded-xl font-medium
        flex items-center gap-2.5
        transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-soft
      `}
    >
      <div className={`
        ${style.iconBg}
        rounded-lg p-1.5
        flex items-center justify-center
      `}>
        <Icon className={sizeStyle.icon} />
      </div>

      <span className={sizeStyle.text}>
        {label}
      </span>

      {position === 'right' && (
        <span className="ml-auto text-lg opacity-60">→</span>
      )}
      {position === 'left' && (
        <span className="mr-auto text-lg opacity-60">←</span>
      )}
    </motion.button>
  );
};
