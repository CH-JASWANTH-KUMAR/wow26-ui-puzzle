import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  appName: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({ children, appName }) => {
  // Convert app name to URL format
  const getAppUrl = (name: string) => {
    switch (name.toLowerCase()) {
      case 'google search':
        return 'google.com';
      case 'gmail compose':
        return 'mail.google.com';
      case 'google photos':
        return 'photos.google.com';
      case 'google maps':
        return 'maps.google.com';
      case 'google calendar':
        return 'calendar.google.com';
      case 'google drive':
        return 'drive.google.com';
      case 'google pay':
        return 'pay.google.com';
      case 'youtube home':
        return 'youtube.com';
      case 'chrome new tab':
        return 'google.com';
      case 'google keep':
        return 'keep.google.com';
      default:
        return 'app.wow2026.internal';
    }
  };

  return (
    <div className="w-full h-full relative select-none">
      
      {/* 1. Subtle ambient shadow beneath the phone */}
      <div className="absolute -inset-[2%] bg-black/40 rounded-[10%] blur-lg pointer-events-none -z-20 translate-y-[3%] scale-[0.97]"></div>
      
      {/* 2. Outer Aluminum Frame (Brushed edge reflections) */}
      <div className="w-full h-full rounded-[10%] p-[1%] bg-gradient-to-b from-zinc-300 via-zinc-800 to-zinc-600 shadow-[5px_22px_45px_rgba(0,0,0,0.55)] border border-zinc-500/20 flex flex-col">
        
        {/* Metallic Bezel Layer (3D depth highlights) */}
        <div className="w-full h-full rounded-[9.5%] p-[1.8%] bg-[#09090b] relative flex flex-col">
          
          {/* Power Button (Right Edge) */}
          <div className="absolute right-[-1.5%] top-[22%] w-[1.5%] h-[7%] bg-gradient-to-b from-zinc-200 to-zinc-600 rounded-l-md border-l border-zinc-700/50 shadow-[1px_2px_3px_rgba(0,0,0,0.35)] z-50"></div>
          {/* Volume Rocker (Right Edge) */}
          <div className="absolute right-[-1.5%] top-[32%] w-[1.5%] h-[12%] bg-gradient-to-b from-zinc-200 to-zinc-600 rounded-l-md border-l border-zinc-700/50 shadow-[1px_2px_3px_rgba(0,0,0,0.35)] z-50"></div>

          {/* Symmetrical Inner Screen Border */}
          <div className="w-full h-full rounded-[8.2%] bg-[#121214] flex flex-col overflow-hidden relative border border-white/5">
            
            {/* Screen Glare Overlays */}
            {/* Diagonal light glass glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent rotate-12 translate-x-[-15%] translate-y-[-15%] scale-150 pointer-events-none z-30"></div>
            {/* Top ambient glare reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none z-30"></div>

            {/* Pixel Camera Cutout (Punch Hole) */}
            <div className="absolute top-[1.8%] left-1/2 -translate-x-1/2 w-[5.5%] aspect-square bg-black rounded-full z-40 border border-zinc-800/80 shadow-inner flex items-center justify-center">
              <div className="w-[30%] h-[30%] bg-[#0c1221] rounded-full flex items-center justify-center">
                <div className="w-[50%] h-[50%] bg-[#3b82f6] rounded-full opacity-50"></div>
              </div>
            </div>

            {/* Top Status Bar */}
            <div className="h-[6%] px-[6%] pt-[3%] flex justify-between items-center text-[1.5vh] text-zinc-400 font-semibold select-none z-20">
              <span>9:41</span>
              <div className="flex items-center gap-[6%]">
                {/* Signal Cellular Bars */}
                <div className="flex items-end gap-[1.5px] h-[1.2vh]">
                  <div className="w-[1.5px] h-[30%] bg-zinc-400 rounded-2xs"></div>
                  <div className="w-[1.5px] h-[55%] bg-zinc-400 rounded-2xs"></div>
                  <div className="w-[1.5px] h-[80%] bg-zinc-400 rounded-2xs"></div>
                  <div className="w-[1.5px] h-[100%] bg-zinc-500 rounded-2xs opacity-40"></div>
                </div>
                {/* Wi-Fi Icon */}
                <svg className="w-[1.8vh] h-[1.8vh] fill-zinc-400" viewBox="0 0 24 24">
                  <path d="M12 21l-12-14.3c.7-.6 5.5-4.7 12-4.7s11.3 4.1 12 4.7l-12 14.3zm0-18c-5.2 0-9.1 3-9.9 3.7l9.9 11.8 9.9-11.8c-.8-.7-4.7-3.7-9.9-3.7z"/>
                </svg>
                {/* Battery Icon */}
                <div className="w-[2.8vh] h-[1.4vh] border border-zinc-400 rounded-xs p-[1px] flex items-center">
                  <div className="h-full w-3/4 bg-zinc-400 rounded-3xs"></div>
                </div>
              </div>
            </div>

            {/* Browser Address Bar */}
            <div className="h-[6.5%] border-b border-zinc-800 bg-[#1e1e24]/40 flex items-center px-[4%] justify-between text-[1.4vh] text-zinc-400 select-none z-20">
              <div className="flex items-center gap-[4%] text-google-green">
                <svg className="w-[1.4vh] h-[1.4vh] fill-current" viewBox="0 0 24 24">
                  <path d="M18 10h-1.7c0-2.4-1.9-4.3-4.3-4.3s-4.3 1.9-4.3 4.3h-1.7c-1 0-1.8.8-1.8 1.8v8.4c0 1 .8 1.8 1.8 1.8h12c1 0 1.8-.8 1.8-1.8v-8.4c0-1-.8-1.8-1.8-1.8zm-9.3 0c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3h-4.6z"/>
                </svg>
                <span className="text-zinc-200 font-medium tracking-wide">
                  {getAppUrl(appName)}
                </span>
              </div>
              <svg className="w-[1.4vh] h-[1.4vh] fill-none stroke-zinc-400 stroke-2 cursor-pointer hover:stroke-zinc-200 transition-colors" viewBox="0 0 24 24">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-.73" />
              </svg>
            </div>

            {/* Screen Viewport Wrapper */}
            <div className="flex-grow bg-[#121214] relative overflow-hidden flex flex-col z-10">
              {children}
            </div>

            {/* Home Navigation Indicator Bar */}
            <div className="h-[3%] flex items-center justify-center pb-[1%]">
              <div className="w-[28%] h-[20%] bg-white/20 rounded-full"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
