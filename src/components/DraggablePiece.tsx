import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { soundEffects } from '../utils/soundEffects';

interface DraggablePieceProps {
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({ id, disabled = false, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  // Apply scale and rotation on pickup
  const style: React.CSSProperties = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.04) rotate(-1.5deg)` 
      : undefined,
    zIndex: isDragging ? 100 : undefined,
    touchAction: 'none',
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!disabled) {
      soundEffects.playPickup();
    }
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onPointerDown={handlePointerDown}
      className={`touch-none select-none w-full flex justify-center ${
        disabled 
          ? 'cursor-default opacity-40' 
          : isDragging 
            ? 'cursor-grabbing drop-shadow-2xl opacity-90 scale-[1.02]' 
            : 'cursor-grab hover:drop-shadow-lg hover:-translate-y-0.5 active:cursor-grabbing transition-all duration-150'
      }`}
    >
      {children}
    </div>
  );
};
