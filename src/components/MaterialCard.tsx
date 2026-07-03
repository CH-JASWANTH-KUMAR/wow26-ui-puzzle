import React from 'react';

interface MaterialCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined';
  className?: string;
  onClick?: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  children,
  variant = 'elevated',
  className = '',
  onClick,
}) => {
  let variantStyles = '';

  if (variant === 'elevated') {
    variantStyles = 'bg-md-surface shadow-md border border-md-surface-variant/30 text-md-on-surface shadow-black/10';
  } else if (variant === 'filled') {
    variantStyles = 'bg-md-surface-variant/20 text-md-on-surface border border-transparent';
  } else if (variant === 'outlined') {
    variantStyles = 'bg-transparent border border-md-outline/30 text-md-on-surface';
  }

  const cursorClass = onClick ? 'cursor-pointer hover:scale-[1.005] active:scale-[0.995] hover:shadow-lg transition-all duration-200' : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 relative overflow-hidden ${variantStyles} ${cursorClass} ${className}`}
    >
      {children}
    </div>
  );
};
