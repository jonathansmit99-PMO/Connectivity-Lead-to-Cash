import React from "react";

interface ConnectNavLogoProps {
  className?: string;
  light?: boolean; // If true, colors are optimized for a dark background
}

export default function ConnectNavLogo({ className = "", light = false }: ConnectNavLogoProps) {
  // Brand colors matching the UI color scheme
  const textColor = light ? "#FFFFFF" : "#1E293B"; // Slate-900 or White
  const brandTeal = "#0D9488"; // Teal-600
  const lightTeal = "#2DD4BF"; // Teal-400
  const subTextColor = light ? "#94A3B8" : "#64748B"; // Slate-400 or Slate-500

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} style={{ height: "40px" }} id="connectnav-logo">
      {/* Sleek navigation & connectivity waypoint SVG icon */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 filter drop-shadow-xs"
      >
        {/* Outer glowing orbital path */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          stroke={light ? "rgba(45, 212, 191, 0.15)" : "rgba(13, 148, 136, 0.1)"} 
          strokeWidth="2" 
          strokeDasharray="4 4"
        />
        
        {/* Connection node lines */}
        <line x1="50" y1="50" x2="18" y2="35" stroke={light ? "rgba(255,255,255,0.2)" : "rgba(30,41,59,0.15)"} strokeWidth="2" />
        <line x1="50" y1="50" x2="82" y2="35" stroke={light ? "rgba(255,255,255,0.2)" : "rgba(30,41,59,0.15)"} strokeWidth="2" />
        <line x1="50" y1="50" x2="50" y2="85" stroke={light ? "rgba(255,255,255,0.2)" : "rgba(30,41,59,0.15)"} strokeWidth="2" />

        {/* Dynamic Navigation Triangle Pointer */}
        <path 
          d="M 50,15 L 75,55 L 50,45 L 25,55 Z" 
          fill={light ? "url(#tealGradientLight)" : "url(#tealGradientDark)"} 
          className="transition-transform duration-300 hover:scale-105"
        />

        {/* Peripheral Connection Nodes */}
        <circle cx="18" cy="35" r="5" fill={light ? lightTeal : brandTeal} />
        <circle cx="82" cy="35" r="5" fill={light ? lightTeal : brandTeal} />
        <circle cx="50" cy="85" r="5" fill={light ? textColor : "#475569"} />
        
        {/* Center hub node */}
        <circle cx="50" cy="50" r="3" fill={light ? "#FFFFFF" : "#1E293B"} />

        {/* Gradients */}
        <defs>
          <linearGradient id="tealGradientLight" x1="50" y1="15" x2="50" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="tealGradientDark" x1="50" y1="15" x2="50" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>
      </svg>

      {/* Modern, bold typographer brand text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline leading-none">
          <span 
            className="font-sans font-black tracking-tight" 
            style={{ 
              color: textColor, 
              fontSize: "19px", 
              fontWeight: 800 
            }}
          >
            Connect
          </span>
          <span 
            className="font-sans font-black tracking-wider ml-0.5" 
            style={{ 
              color: light ? lightTeal : brandTeal, 
              fontSize: "19px", 
              fontWeight: 900 
            }}
          >
            NAV
          </span>
        </div>
        
        <span 
          className="font-mono uppercase tracking-[0.25em] mt-0.5" 
          style={{ 
            color: subTextColor, 
            fontSize: "8.5px", 
            fontWeight: 700 
          }}
        >
          L2C NAVIGATION
        </span>
      </div>
    </div>
  );
}
