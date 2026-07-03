import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'filled' | 'tonal' | 'outlined' | 'elevated' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'filled',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  // Material Design 3 Variant Styles
  let variantStyles = '';

  if (variant === 'filled') {
    variantStyles = 'bg-md-primary text-md-on-primary hover:shadow-md shadow-md shadow-black/10';
  } else if (variant === 'tonal') {
    variantStyles = 'bg-md-secondary/15 text-md-primary hover:bg-md-secondary/25';
  } else if (variant === 'outlined') {
    variantStyles = 'bg-transparent border border-md-outline/40 text-md-primary hover:bg-md-primary/5';
  } else if (variant === 'elevated') {
    variantStyles = 'bg-md-surface text-md-primary border border-md-surface-variant/40 shadow-md shadow-black/10 hover:bg-md-surface/80';
  } else if (variant === 'text') {
    variantStyles = 'bg-transparent text-md-primary hover:bg-md-primary/5 px-2';
  }

  // Material Design 3 Sizing
  let sizeStyles = 'px-6 py-2.5 text-sm rounded-full';
  if (size === 'sm') {
    sizeStyles = 'px-4 py-1.5 text-xs rounded-full';
  } else if (size === 'lg') {
    sizeStyles = 'px-8 py-3.5 text-base rounded-full';
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03, y: -0.5 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 font-bold tracking-wide transition-all duration-150 cursor-pointer select-none ${
        disabled 
          ? 'opacity-35 cursor-not-allowed shadow-none' 
          : ''
      } ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
