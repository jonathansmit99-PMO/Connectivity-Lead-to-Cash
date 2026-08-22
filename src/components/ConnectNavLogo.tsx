import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean;
  showTagline?: boolean;
  withBadge?: boolean;
}

export default function ConnectNavLogo({
  className = "",
  light = true,
  showTagline = true,
  withBadge = false
}: LogoProps) {
  // Official Brand Guidelines:
  // Deep Navy (The Foundation / Midnight): #0f1e41
  const deepNavy = "#0f1e41";
  // Teal Green (The Connection): #0d8e91
  const tealGreen = "#0d8e91";
  // Light Teal: #43a9ac
  const lightTeal = "#43a9ac";
  // Primary text: White (#FFFFFF) when on dark/navy, or Deep Navy (#0f1e41) on light
  const primaryColor = light ? "#FFFFFF" : deepNavy;
  // Subtitle/tagline text color
  const subtextColor = light ? "#CBD5E1" : "#5A6B82";

  return (
    <div 
      className={`inline-flex items-center select-none ${className}`} 
      id="reunert-connect-official-logo"
    >
      <svg
        viewBox="0 0 250 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 sm:h-12 w-auto"
        aria-label="Reunert Connect - a Reunert company"
      >
        <defs>
          <linearGradient id="reunertTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lightTeal} />
            <stop offset="100%" stopColor={tealGreen} />
          </linearGradient>
          <clipPath id="badgeClip">
            <rect width="250" height="115" rx="16" />
          </clipPath>
        </defs>

        {/* Optional or Integrated Navy Badge Background */}
        {withBadge && (
          <rect 
            width="250" 
            height="115" 
            rx="16" 
            fill={deepNavy} 
          />
        )}

        <g id="Reunert-Connect-Group" transform="translate(10, 8)">
          {/* Top Line: "Reu" */}
          <text
            x="8"
            y="48"
            fill={withBadge ? "#FFFFFF" : primaryColor}
            fontFamily="'Haas Grotesk', 'Neue Haas Grotesk', 'Manrope', system-ui, sans-serif"
            fontSize="46"
            fontWeight="900"
            letterSpacing="-1.2px"
          >
            Reu
          </text>

          {/* Letter "n" */}
          <text
            x="88"
            y="48"
            fill={withBadge ? "#FFFFFF" : primaryColor}
            fontFamily="'Haas Grotesk', 'Neue Haas Grotesk', 'Manrope', system-ui, sans-serif"
            fontSize="46"
            fontWeight="900"
            letterSpacing="-1.2px"
          >
            n
          </text>

          {/* Signature Teal Arc accent inside the 'n' */}
          <path
            d="M89.5 28.5 C89.5 20.5 94.5 15.5 101.5 14.5 L99.5 20.5 C95.5 21.5 91.5 24.5 90.5 28.5 Z"
            fill="url(#reunertTealGrad)"
          />
          <path
            d="M90 28.5 C91 19.5 96.5 15.5 101.5 14.5 L99.5 20 C95.5 21 92 24 91 28.5 Z"
            fill={tealGreen}
          />

          {/* "ert" */}
          <text
            x="117"
            y="48"
            fill={withBadge ? "#FFFFFF" : primaryColor}
            fontFamily="'Haas Grotesk', 'Neue Haas Grotesk', 'Manrope', system-ui, sans-serif"
            fontSize="46"
            fontWeight="900"
            letterSpacing="-1.2px"
          >
            ert
          </text>

          {/* Second Line: "Connect" (aligned under the 'nert' section) */}
          <text
            x="92"
            y="82"
            fill={tealGreen}
            fontFamily="'Haas Grotesk', 'Neue Haas Grotesk', 'Manrope', system-ui, sans-serif"
            fontSize="38"
            fontWeight="800"
            letterSpacing="-0.6px"
          >
            Connect
          </text>

          {/* Third Line Tagline: "a Reunert company" */}
          {showTagline && (
            <g id="Reunert-Tagline" transform="translate(0, 0)">
              <text
                x="64"
                y="101"
                fill={withBadge ? "#CBD5E1" : subtextColor}
                fontFamily="'Manrope', system-ui, sans-serif"
                fontSize="12.5"
                fontWeight="400"
                letterSpacing="0.1px"
              >
                a{" "}
                <tspan fill={withBadge ? "#FFFFFF" : primaryColor} fontWeight="800">
                  Reu
                </tspan>
                <tspan fill={withBadge ? "#FFFFFF" : primaryColor} fontWeight="800">
                  n
                </tspan>
                <tspan fill={withBadge ? "#FFFFFF" : primaryColor} fontWeight="800">
                  ert
                </tspan>
                {" "}company
              </text>

              {/* Mini Teal Arc accent on tagline Reunert 'n' */}
              <path
                d="M98 94.2 C99.2 92 101.2 90.8 103.2 90.5 L102.6 92 C101.2 92.2 99.8 93.2 99 94.2 Z"
                fill={tealGreen}
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
