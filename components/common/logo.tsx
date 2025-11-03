"use client";

import React from "react";

// Logo Icon Component
export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Camera shutter/snap element */}
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />

    {/* Candlestick chart elements */}
    <g className="chart-bars">
      {/* Bullish candle 1 */}
      <rect x="20" y="45" width="8" height="25" fill="#10B981" rx="1" />
      <line x1="24" y1="40" x2="24" y2="45" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="70" x2="24" y2="75" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

      {/* Bullish candle 2 */}
      <rect x="35" y="35" width="8" height="30" fill="#10B981" rx="1" />
      <line x1="39" y1="30" x2="39" y2="35" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="39" y1="65" x2="39" y2="70" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

      {/* Bearish candle */}
      <rect x="50" y="40" width="8" height="15" fill="#EF4444" rx="1" />
      <line x1="54" y1="35" x2="54" y2="40" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="54" y1="55" x2="54" y2="60" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />

      {/* Bullish candle 3 - tallest */}
      <rect x="65" y="25" width="8" height="35" fill="#10B981" rx="1" />
      <line x1="69" y1="20" x2="69" y2="25" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="69" y1="60" x2="69" y2="65" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Lightning bolt for "snap" speed */}
    <path
      d="M75 15 L70 25 L75 25 L72 35 L78 23 L73 23 Z"
      fill="#FBBF24"
      stroke="#F59E0B"
      strokeWidth="1"
    />
  </svg>
);

// Full Logo with Text
export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <LogoIcon className="w-10 h-10" />
    <span className="text-2xl font-bold tracking-tight">
      <span className="text-primary">Snap</span>
      <span className="text-foreground">PChart</span>
    </span>
  </div>
);

// Compact Logo for Mobile/Small Spaces
export const LogoCompact: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center gap-1.5 ${className}`}>
    <LogoIcon className="w-8 h-8" />
    <span className="text-lg font-bold">
      <span className="text-primary">Snap</span>
      <span className="text-foreground">PChart</span>
    </span>
  </div>
);

// Export default as full logo
export default Logo;
