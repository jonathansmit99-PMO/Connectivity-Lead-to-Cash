import React from "react";

interface ReunertLogoProps {
  className?: string;
  light?: boolean; // If true, colors are optimized for a dark background
}

export default function ReunertLogo({ className = "", light = false }: ReunertLogoProps) {
  // Deep corporate slate/navy and bright signature teal
  const textColor = light ? "#FFFFFF" : "#2F3B50";
  const tealColor = "#00888F";
  const subTextColor = light ? "#94A3B8" : "#4B5563";
  const inlineBrandColor = light ? "#CBD5E1" : "#1F2937";

  return (
    <div className={`flex items-center select-none ${className}`} style={{ height: "48px" }}>
      <svg 
        viewBox="0 0 460 230" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <defs>
          <mask id="reunert-n-mask">
            {/* Keep everything white, mask out the black area */}
            <rect x="0" y="0" width="460" height="230" fill="white" />
            {/* Cut out the top-left section of the n's left stem with a diagonal slash */}
            <polygon points="170,75 195,50 195,10 170,10" fill="black" />
          </mask>
        </defs>

        {/* REUNERT WORDMARK */}
        <g id="Reunert-Wordmark">
          {/* Letter R */}
          <path 
            d="M 10,20 h 26 c 13,0 20,6 20,19 c 0,10 -6,16 -16,18 L 56,100 H 42 L 28,58 H 22 v 42 H 10 V 20 Z M 22,46 h 12 c 6,0 9,-2.5 9,-7 c 0,-4.5 -3,-7 -9,-7 H 22 V 46 Z" 
            fill={textColor} 
          />
          
          {/* Letter e */}
          <path 
            d="M 122,71 c 0,-17 -12,-29 -29,-29 c -17,0 -29,12 -29,29 c 0,17 12,29 29,29 c 12,0 22,-6 26,-16 h -13 c -3,4 -7,6 -13,6 c -10,0 -16,-6 -16,-15 h 42 v -4 z M 77,63 c 1,-8 7,-13 16,-13 c 9,0 15,5 16,13 H 77 z" 
            fill={textColor} 
          />
          
          {/* Letter u */}
          <path 
            d="M 130,42 h 11 v 35 c 0,8 4,13 11,13 c 7,0 11,-5 11,-13 v -35 h 11 v 58 h -11 v -7 c -3,5 -8,8 -14,8 c -12,0 -19,-7 -19,-19 V 42 Z" 
            fill={textColor} 
          />
          
          {/* Sliced Teal Cap for n (placed above the gap) */}
          <path 
            d="M 184,42 H 195 V 44 L 184,55 Z" 
            fill={tealColor} 
          />
          
          {/* Letter n with precise diagonal mask */}
          <g mask="url(#reunert-n-mask)">
            {/* Left stem of n */}
            <path 
              d="M 184,42 h 11 v 58 h -11 Z" 
              fill={textColor} 
            />
            {/* Arch and right leg of n */}
            <path 
              d="M 189,55 c 4,-8 11,-13 19,-13 c 11,0 17,7 17,18 v 40 h -11 V 60 c 0,-6 -3,-10 -8,-10 c -5,0 -9,4 -9,10 V 55 Z" 
              fill={textColor} 
            />
          </g>
          
          {/* Letter e */}
          <path 
            d="M 291,71 c 0,-17 -12,-29 -29,-29 c -17,0 -29,12 -29,29 c 0,17 12,29 29,29 c 12,0 22,-6 26,-16 h -13 c -3,4 -7,6 -13,6 c -10,0 -16,-6 -16,-15 h 42 v -4 z M 246,63 c 1,-8 7,-13 16,-13 c 9,0 15,5 16,13 H 246 z" 
            fill={textColor} 
          />
          
          {/* Letter r */}
          <path 
            d="M 299,42 h 11 v 9 c 3,-6 8,-9 14,-9 v 11 c -7,-1 -14,2 -14,11 v 36 h -11 V 42 Z" 
            fill={textColor} 
          />
          
          {/* Letter t */}
          <path 
            d="M 353,24 v 18 h 11 v 9 h -11 v 33 c 0,5 2,7 6,7 c 3,0 5,-0.5 7,-1.5 v 9 c -3,1.5 -7,2 -10,2 c -9,0 -14,-5 -14,-14 V 51 h -7 v -9 h 7 V 24 Z" 
            fill={textColor} 
          />
        </g>

        {/* CONNECT WORDMARK */}
        <g id="Connect-Wordmark">
          {/* Letter C */}
          <path 
            d="M 196,132 c -3.5,-5.5 -10,-9.5 -18,-9.5 c -14.5,0 -24,10.5 -24,27.5 c 0,17 9.5,27.5 24,27.5 c 8,0 14.5,-4 18,-11 h -11 c -2,2.5 -4.5,4 -7,4 c -8,0 -12.5,-6 -12.5,-20.5 c 0,-14.5 4.5,-20.5 12.5,-20.5 c 2.5,0 5,1.5 7,4 Z" 
            fill={tealColor} 
          />
          
          {/* Letter o */}
          <path 
            d="M 240,159 c 0,-12.5 -8.5,-21 -20,-21 c -11.5,0 -20,8.5 -20,21 c 0,12.5 8.5,21 20,21 c 11.5,0 20,-8.5 20,-21 Z M 211,159 c 0,-7 4.5,-12 9,-12 c 4.5,0 9,5 9,12 c 0,7 -4.5,12 -9,12 c -4.5,0 -9,-5 -9,-12 Z" 
            fill={tealColor} 
          />
          
          {/* Letter n */}
          <path 
            d="M 246,138 h 10.5 v 6.5 c 3,-5 7.5,-7.5 12.5,-7.5 c 9,0 13,5.5 13,13.5 v 29.5 h -11 v -27.5 c 0,-4.5 -2,-6.5 -5,-6.5 c -4,0 -7,3 -7,8.5 v 25.5 H 246 Z" 
            fill={tealColor} 
          />
          
          {/* Letter n */}
          <path 
            d="M 288,138 h 10.5 v 6.5 c 3,-5 7.5,-7.5 12.5,-7.5 c 9,0 13,5.5 13,13.5 v 29.5 h -11 v -27.5 c 0,-4.5 -2,-6.5 -5,-6.5 c -4,0 -7,3 -7,8.5 v 25.5 H 288 Z" 
            fill={tealColor} 
          />
          
          {/* Letter e */}
          <path 
            d="M 367,159 c 0,-12 -8.5,-21 -18.5,-21 c -10,0 -18.5,8.5 -18.5,21 c 0,12 8.5,21 19,21 c 8,0 14.5,-4 17,-11 h -11 c -1.5,2 -3.5,3 -6,3 c -5,0 -8,-3.5 -8.5,-8 h 27 v -3 z M 341,153.5 c 0.5,-5 4,-8.5 8.5,-8.5 c 4.5,0 7.5,3.5 8,8.5 H 341 Z" 
            fill={tealColor} 
          />
          
          {/* Letter c */}
          <path 
            d="M 408.5,159 c 0,-12.5 -8,-21 -18,-21 c -10,0 -17.5,8.5 -17.5,21 c 0,12.5 7.5,21 18,21 c 8,0 13.5,-4.5 15,-11.5 h -11 c -1,2.5 -3,4 -4,4 c -5,0 -7.5,-4 -7.5,-13.5 c 0,-9.5 2.5,-13.5 7.5,-13.5 c 2,0 3.5,1.5 4,4 Z" 
            fill={tealColor} 
          />
          
          {/* Letter t */}
          <path 
            d="M 419.5,125 v 13 h 8 v 5 h -8 v 25 c 0,3.5 1,4.5 3.5,4.5 c 1.5,0 2.5,-0.5 3.5,-1 v 5 c -2,1 -4,1.5 -6,1.2 c -5,-0.5 -7,-3 -7,-8.5 v -26.2 h -5 v -5 h 5 v -13 Z" 
            fill={tealColor} 
          />
        </g>

        {/* SUBTITLE: a Reunert company */}
        <g id="Subtitle">
          <text 
            x="154" 
            y="218" 
            fill={subTextColor} 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="14" 
            fontWeight="400" 
            letterSpacing="2"
          >
            a <tspan fill={textColor} fontWeight="800">Reu</tspan><tspan fill={tealColor} fontWeight="800">n</tspan><tspan fill={textColor} fontWeight="800">ert</tspan> company
          </text>
        </g>
      </svg>
    </div>
  );
}
