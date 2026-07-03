import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DropSlotProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  isHinted?: boolean;
  isCorrectFlash?: boolean;
  isWrongFlash?: boolean;
  brandColor?: string;
}

// Helper to convert hex colors to rgb comma list for alpha-transparency styling
const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '66, 133, 244'; // Google blue fallback
};

export const DropSlot: React.FC<DropSlotProps> = ({
  id,
  children,
  className = '',
  isHinted = false,
  isCorrectFlash = false,
  isWrongFlash = false,
  brandColor = '#4285F4',
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  // Determine border status and active classes
  let statusClasses = 'border-dashed border-app-border bg-app-surface/10 hover:border-app-text-secondary/40 hover:bg-app-surface/20';
  let glowRgb = hexToRgb(brandColor);

  if (isCorrectFlash) {
    statusClasses = 'border-solid border-google-green bg-google-green/10 scale-100 animate-flash-correct';
  } else if (isWrongFlash) {
    statusClasses = 'border-solid border-google-red bg-google-red/10 animate-shake animate-flash-wrong';
  } else if (isHinted) {
    statusClasses = 'border-solid border-google-yellow bg-google-yellow/5 animate-glow-custom';
    glowRgb = '251, 188, 5'; // Google Yellow rgb
  } else if (isOver) {
    statusClasses = 'border-solid scale-[1.03] animate-glow-custom';
  }

  // Set the CSS custom variable inline to power the glow color in tailwind
  const style = {
    '--glow-color': glowRgb,
    borderColor: isOver && !isCorrectFlash && !isWrongFlash ? brandColor : undefined,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-300 border-2 rounded-xl flex items-center justify-center relative overflow-hidden ${statusClasses} ${className}`}
    >
      {children}
    </div>
  );
};
