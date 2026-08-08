import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean; // If true, white/teal text for dark header background; if false, dark navy/teal text
  showSubtitle?: boolean;
}

export default function ConnectNavLogo({ className = "", light = true, showSubtitle = true }: LogoProps) {
  // Brand color palette strictly matching the official Reunert Connect corporate logo
  const navyColor = light ? "#FFFFFF" : "#2A3249"; // Dark navy slate or pure white for dark header
  const tealColor = light ? "#2DD4BF" : "#008A83"; // Brand Teal (#008A83)
  const mutedColor = light ? "#CBD5E1" : "#2A3249"; // Muted text color for "a" and "company"

  return (
    <div className={`inline-flex items-center select-none ${className}`} id="reunert-connect-logo">
      <svg
        viewBox="0 0 310 106"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-auto"
        aria-label="Reunert Connect - a Reunert company"
      >
        {/* LINE 1: Reunert */}
        <g id="Reunert-Wordmark">
          {/* Reu */}
          <text
            x="0"
            y="42"
            fill={navyColor}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            fontSize="48"
            fontWeight="800"
            letterSpacing="-1.5px"
          >
            Reu
          </text>

          {/* 'n' with signature Teal Swoosh */}
          <g transform="translate(91, 0)">
            <text
              x="0"
              y="42"
              fill={navyColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
              fontSize="48"
              fontWeight="800"
              letterSpacing="-1.5px"
            >
              n
            </text>
            
            {/* Signature Teal Swoosh cutting the top-left shoulder of 'n' */}
            <path
              d="M 0.5 21 C 0.5 11, 4.5 4, 11.5 0 L 11.5 8.5 C 8 11.5 5 15.5 3.5 21.5 Z"
              fill={tealColor}
            />
          </g>

          {/* ert */}
          <text
            x="119"
            y="42"
            fill={navyColor}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            fontSize="48"
            fontWeight="800"
            letterSpacing="-1.5px"
          >
            ert
          </text>
        </g>

        {/* LINE 2: Connect (indented beneath 'u'/'n') */}
        <g id="Connect-Wordmark">
          <text
            x="96"
            y="76"
            fill={tealColor}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
            fontSize="36"
            fontWeight="700"
            letterSpacing="-0.8px"
          >
            Connect
          </text>
        </g>

        {/* LINE 3: a Reunert company */}
        {showSubtitle && (
          <g id="Subtitle" transform="translate(64, 98)">
            <text
              x="0"
              y="0"
              fill={mutedColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="400"
            >
              a
            </text>
            <text
              x="14"
              y="0"
              fill={navyColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              Reu
            </text>
            <text
              x="42"
              y="0"
              fill={navyColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              n
            </text>
            {/* Mini teal swoosh on mini 'n' */}
            <path
              d="M 42.2 -6 C 42.2 -9, 43.5 -11, 45.5 -12 L 45.5 -9.5 C 44.5 -8.5 43.5 -7, 43 -5 Z"
              fill={tealColor}
            />
            <text
              x="50"
              y="0"
              fill={navyColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="13"
              fontWeight="800"
            >
              ert
            </text>
            <text
              x="72"
              y="0"
              fill={mutedColor}
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
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
