import React from 'react';
import { IconMap } from '../data/puzzles';
import type { PieceShape } from '../data/puzzles';
import { Search } from 'lucide-react';

interface AppPieceRendererProps {
  id?: string;
  label: string;
  iconName: string;
  shape: PieceShape;
  brandColor: string;
  isSilhouette?: boolean;
}

export const AppPieceRenderer: React.FC<AppPieceRendererProps> = ({
  label,
  iconName,
  shape,
  brandColor,
  isSilhouette = false,
}) => {
  const IconComponent = IconMap[iconName] || null;

  // Global silhouette class
  const silhouetteClass = isSilhouette 
    ? 'grayscale opacity-20 border-dashed border-app-border' 
    : 'shadow-md border-app-border';

  // Custom component renderers
  const renderContent = () => {
    // 1. Special Case: Google Wordmark Logo
    if (iconName === 'SiGoogle' && shape === 'rect') {
      return (
        <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl tracking-tight select-none">
          <span className="text-google-blue">G</span>
          <span className="text-google-red">o</span>
          <span className="text-google-yellow">o</span>
          <span className="text-google-blue">g</span>
          <span className="text-google-green">l</span>
          <span className="text-google-red">e</span>
        </div>
      );
    }

    // 2. Story Avatar (Circle with gradient border for Instagram)
    if (label.toLowerCase().includes('story') && shape === 'circle') {
      return (
        <div className={`w-full h-full rounded-full flex items-center justify-center p-0.5 ${
          isSilhouette 
            ? 'bg-transparent border-2 border-dashed' 
            : 'bg-gradient-to-tr from-[#fccc63] via-[#fbad50] to-[#cd486b] shadow-xs'
        }`}>
          <div className="w-full h-full bg-app-surface rounded-full flex items-center justify-center overflow-hidden">
            {IconComponent && <IconComponent className="w-1/2 h-1/2 text-app-text-secondary" />}
          </div>
        </div>
      );
    }

    // Standard rendering based on shape
    switch (shape) {
      case 'circle':
        return (
          <div 
            className={`w-full h-full rounded-full flex items-center justify-center bg-app-surface border ${
              isSilhouette ? 'border-dashed' : 'border-solid'
            }`}
            style={!isSilhouette ? { borderTopColor: brandColor } : {}}
          >
            {IconComponent && <IconComponent className="w-5 h-5" style={{ color: isSilhouette ? undefined : brandColor }} />}
          </div>
        );

      case 'pill':
        return (
          <div className={`w-full h-full px-4 rounded-full bg-app-surface border flex items-center gap-2 text-xs font-medium text-app-text-secondary select-none ${
            isSilhouette ? 'border-dashed' : 'border-solid'
          }`}>
            <Search className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
            <span className="truncate text-left opacity-60 flex-1">{label}</span>
          </div>
        );

      case 'rect':
        return (
          <div 
            className={`w-full h-full px-3.5 flex items-center justify-between bg-app-surface border rounded-xl text-xs font-semibold ${
              isSilhouette ? 'border-dashed' : 'border-solid border-l-4'
            }`}
            style={!isSilhouette ? { borderLeftColor: brandColor } : {}}
          >
            <div className="flex items-center gap-2 truncate">
              {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: isSilhouette ? undefined : brandColor }} />}
              <span className="truncate text-app-text-primary">{label}</span>
            </div>
          </div>
        );

      case 'button':
        return (
          <div 
            className="w-full h-full flex items-center justify-center text-[10px] md:text-xs font-bold rounded-xl border text-center transition-colors"
            style={!isSilhouette ? { 
              backgroundColor: `${brandColor}15`, 
              borderColor: brandColor,
              color: brandColor
            } : {}}
          >
            {label}
          </div>
        );

      case 'square':
        return (
          <div className={`w-full h-full bg-app-surface rounded-2xl border flex flex-col items-center justify-center p-3 gap-1.5 ${
            isSilhouette ? 'border-dashed' : 'border-solid shadow-md'
          }`}>
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={!isSilhouette ? { backgroundColor: `${brandColor}15` } : {}}
            >
              {IconComponent && <IconComponent className="w-6 h-6" style={{ color: isSilhouette ? undefined : brandColor }} />}
            </div>
            {!isSilhouette && <span className="text-[9px] font-bold text-app-text-secondary truncate max-w-full">{label}</span>}
          </div>
        );

      case 'video':
        return (
          <div className={`w-full h-full rounded-2xl bg-app-surface border overflow-hidden flex flex-col justify-between ${
            isSilhouette ? 'border-dashed' : 'border-solid shadow-md'
          }`}>
            {/* Mock Player Screen */}
            <div className="flex-1 bg-black/20 flex items-center justify-center relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                style={!isSilhouette ? { backgroundColor: brandColor } : {}}
              >
                {IconComponent && <IconComponent className="w-4 h-4 text-white" />}
              </div>
              <span className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/60 text-[8px] text-white font-mono">10:41</span>
            </div>
            {!isSilhouette && (
              <div className="p-2 border-t border-app-border/40 text-[9px] font-bold text-app-text-primary text-left truncate bg-app-surface">
                {label}
              </div>
            )}
          </div>
        );

      case 'post':
        return (
          <div className={`w-full h-full bg-app-surface rounded-2xl border p-3 flex flex-col justify-between ${
            isSilhouette ? 'border-dashed' : 'border-solid shadow-md'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-app-border flex items-center justify-center">
                {IconComponent && <IconComponent className="w-3.5 h-3.5 text-app-text-secondary" />}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-app-text-primary">{label}</span>
                <span className="text-[7px] text-app-text-secondary">Sponsored</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center text-left py-2 text-[9px] text-app-text-secondary leading-relaxed">
              <div className="h-1.5 w-full bg-app-border rounded-xs mb-1"></div>
              <div className="h-1.5 w-5/6 bg-app-border rounded-xs"></div>
            </div>
            <div className="border-t border-app-border/30 pt-2 flex justify-between text-[8px] font-semibold text-app-text-secondary">
              <span>👍 Like</span>
              <span>💬 Comment</span>
              <span>🔁 Share</span>
            </div>
          </div>
        );

      case 'nav':
        return (
          <div className={`w-full h-full bg-app-surface/90 border-t border-app-border flex items-center justify-around px-4 ${
            isSilhouette ? 'border-dashed bg-transparent' : 'border-solid'
          }`}>
            {[1, 2, 3, 4].map((index) => {
              const active = index === 1;
              return (
                <div key={index} className="flex flex-col items-center gap-1 cursor-pointer">
                  {IconComponent && (
                    <IconComponent 
                      className="w-4.5 h-4.5 transition-colors" 
                      style={!isSilhouette && active ? { color: brandColor } : { color: 'var(--app-text-secondary)', opacity: 0.6 }} 
                    />
                  )}
                  <span 
                    className="text-[7px] font-bold uppercase tracking-wider"
                    style={!isSilhouette && active ? { color: brandColor } : { color: 'var(--app-text-secondary)', opacity: 0.6 }}
                  >
                    {active ? 'Home' : 'Tab'}
                  </span>
                </div>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center border border-dashed rounded-xl">
            {label}
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full select-none transition-all duration-200 ${silhouetteClass}`}>
      {renderContent()}
    </div>
  );
};
