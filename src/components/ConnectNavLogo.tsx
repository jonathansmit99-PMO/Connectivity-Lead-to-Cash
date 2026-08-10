import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean; // If true, white/teal text for dark header background; if false, dark navy/teal text
  showSubtitle?: boolean;
}

export default function ConnectNavLogo({ className = "", light = true }: LogoProps) {
  // Brand color palette matching ConnectIQ
  const navyColor = light ? "#FFFFFF" : "#1E293B"; // Pure white for dark header or dark slate
  const tealColor = light ? "#2DD4BF" : "#0D9488"; // Brand Teal (#2DD4BF / #0D9488)

  return (
    <div className={`inline-flex items-center select-none ${className}`} id="connect-iq-logo">
      <svg
        viewBox="0 0 230 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-auto"
        aria-label="ConnectIQ"
      >
        <g id="ConnectIQ-Wordmark">
          {/* Main "ConnectIQ" Wordmark */}
          <text
            x="0"
            y="38"
            fill={tealColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="40"
            fontWeight="800"
            letterSpacing="-1.2px"
          >
            Connect<tspan fill={navyColor} fontWeight="900">IQ</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}

