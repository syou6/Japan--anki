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

// 色とアイコンの組み合わせで機能を明確に
const variantStyles = {
  primary: {
    bg: 'bg-black',
    hover: 'hover:bg-gray-800',
    text: 'text-white',
    border: 'border-black',
    iconBg: 'bg-white/20'
  },
  secondary: {
    bg: 'bg-gray-600',
    hover: 'hover:bg-gray-700',
    text: 'text-white',
    border: 'border-gray-600',
    iconBg: 'bg-white/20'
  },
  danger: {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    text: 'text-white',
    border: 'border-red-600',
    iconBg: 'bg-white/20'
  },
  success: {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    text: 'text-white',
    border: 'border-green-600',
    iconBg: 'bg-white/20'
  }
};

const sizeStyles = {
  small: {
    padding: 'px-4 py-3',
    text: 'text-base',
    icon: 'w-5 h-5',
    minHeight: 'min-h-[56px]'
  },
  medium: {
    padding: 'px-6 py-4',
    text: 'text-lg',
    icon: 'w-6 h-6',
    minHeight: 'min-h-[72px]'
  },
  large: {
    padding: 'px-8 py-5',
    text: 'text-xl',
    icon: 'w-8 h-8',
    minHeight: 'min-h-[88px]'
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
  
  // 位置に基づいたスタイル（一貫性のため）
  const positionClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  }[position];

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${style.bg} ${style.hover} ${style.text}
        ${sizeStyle.padding} ${sizeStyle.minHeight}
        ${positionClass}
        border-3 ${style.border}
        rounded-xl font-bold
        flex items-center gap-3
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-black
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
      `}
    >
      {/* アイコン背景 */}
      <div className={`
        ${style.iconBg}
        rounded-lg p-2
        flex items-center justify-center
      `}>
        <Icon className={sizeStyle.icon} />
      </div>
      
      {/* テキストラベル */}
      <span className={sizeStyle.text}>
        {label}
      </span>
      
      {/* 視覚的な方向性指示 */}
      {position === 'right' && (
        <span className="ml-auto text-2xl">→</span>
      )}
      {position === 'left' && (
        <span className="mr-auto text-2xl">←</span>
      )}
    </motion.button>
  );
};