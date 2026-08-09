import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean; // If true, white/teal text for dark header background; if false, dark navy/teal text
  showSubtitle?: boolean;
}

export default function ConnectNavLogo({ className = "", light = true, showSubtitle = true }: LogoProps) {
  // Brand color palette strictly matching the official Reunert Connect corporate logo
  const navyColor = light ? "#FFFFFF" : "#282E43"; // Dark navy slate or pure white for dark header
  const tealColor = light ? "#2DD4BF" : "#008585"; // Brand Teal (#008585)
  const mutedColor = light ? "#94A3B8" : "#282E43"; // Muted text color for "a" and "company"

  return (
    <div className={`inline-flex items-center select-none ${className}`} id="reunert-connect-logo">
      <svg
        viewBox="0 0 360 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-auto"
        aria-label="Reunert ConnectIQ - a Reunert company"
      >
        {/* LINE 1: Reunert */}
        <g id="Reunert-Wordmark">
          {/* "Reu" */}
          <text
            x="0"
            y="44"
            fill={navyColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="52"
            fontWeight="800"
            letterSpacing="-1.8px"
          >
            Reu
          </text>

          {/* "n" with signature Teal Swoosh */}
          <g transform="translate(98, 0)">
            <text
              x="0"
              y="44"
              fill={navyColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="52"
              fontWeight="800"
              letterSpacing="-1.8px"
            >
              n
            </text>
            
            {/* Signature Teal Swoosh on the left shoulder of 'n' */}
            <path
              d="M 1 23 C 1 12, 5 3, 13 0 L 13 9 C 8 12, 4 16, 3.5 23 Z"
              fill={tealColor}
            />
          </g>

          {/* "ert" */}
          <text
            x="129"
            y="44"
            fill={navyColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="52"
            fontWeight="800"
            letterSpacing="-1.8px"
          >
            ert
          </text>
        </g>

        {/* LINE 2: ConnectIQ (aligned under 'u'/'n') */}
        <g id="Connect-Wordmark">
          <text
            x="104"
            y="82"
            fill={tealColor}
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="40"
            fontWeight="700"
            letterSpacing="-1px"
          >
            Connect<tspan fill={navyColor} fontWeight="800">IQ</tspan>
          </text>
        </g>

        {/* LINE 3: a Reunert company */}
        {showSubtitle && (
          <g id="Subtitle" transform="translate(70, 106)">
            <text
              x="0"
              y="0"
              fill={mutedColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="400"
            >
              a
            </text>
            <text
              x="14"
              y="0"
              fill={navyColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              Reu
            </text>
            <text
              x="43"
              y="0"
              fill={navyColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              n
            </text>
            {/* Mini teal swoosh on 'n' in subtitle */}
            <path
              d="M 43.2 -6 C 43.2 -9, 44.5 -11, 46.5 -12 L 46.5 -9.5 C 45.5 -8.5 44.5 -7, 44 -5 Z"
              fill={tealColor}
            />
            <text
              x="51"
              y="0"
              fill={navyColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              ert
            </text>
            <text
              x="73"
              y="0"
              fill={mutedColor}
              fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="400"
            >
              company
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
