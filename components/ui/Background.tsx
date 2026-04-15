import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-arista-blue/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-arista-purple/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Local texture overlay avoids a runtime dependency on external decorative assets. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.05)_0_1px,transparent_1px),radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.035)_0_1px,transparent_1px)] bg-size-[18px_18px,24px_24px] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100px_100px] mask-[radial-gradient(ellipse_at_center,black,transparent)]" />
    </div>
  );
};
