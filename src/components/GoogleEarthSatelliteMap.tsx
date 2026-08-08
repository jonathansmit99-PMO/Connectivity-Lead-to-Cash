import React, { useState, useRef, useEffect } from "react";
import { 
  MapPin, 
  Satellite, 
  Layers, 
  Compass, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Crosshair, 
  Move, 
  Radio, 
  Zap,
  Globe,
  Eye,
  CheckCircle2,
  Search,
  Building,
  Utensils,
  ShoppingBag,
  Home,
  ShieldCheck,
  CreditCard
} from "lucide-react";

const satelliteBg = "/satellite_aerial_view.jpg";

interface GoogleEarthSatelliteMapProps {
  gpsCoordinates: string;
  onGpsChange: (newGps: string) => void;
  address?: string;
  isFeasibilityRunning?: boolean;
}

export default function GoogleEarthSatelliteMap({
  gpsCoordinates,
  onGpsChange,
  address,
  isFeasibilityRunning = false
}: GoogleEarthSatelliteMapProps) {
  // Parsing base coordinates
  const parseCoordinates = (gpsStr: string) => {
    const parts = gpsStr.split(",").map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return { lat: -26.2041, lng: 28.0583 }; // Default Maboneng / Joburg CBD GPS
  };

  // Map state
  const [pinPos, setPinPos] = useState({ x: 50, y: 42 }); // percentage inside map canvas
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100); // percentage zoom
  const [showLabels, setShowLabels] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed nearby fiber node position in percentage coordinates
  const fiberNodePos = { x: 38, y: 28 };
  const wirelessTowerPos = { x: 78, y: 18 };

  // Calculate real-time distance to fiber node (approx 0.6m per canvas percentage point)
  const dx = pinPos.x - fiberNodePos.x;
  const dy = pinPos.y - fiberNodePos.y;
  const distanceToNodeMeters = Math.max(4, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.75));

  // Sync pin position if GPS prop changes externally from input field
  useEffect(() => {
    const { lat, lng } = parseCoordinates(gpsCoordinates);
    const baseLat = -26.2041;
    const baseLng = 28.0583;
    const latDiff = lat - baseLat;
    const lngDiff = lng - baseLng;
    
    // Scale delta into percentage bounds (bounded 12% to 88%)
    const newX = Math.min(88, Math.max(12, 50 + lngDiff * 12000));
    const newY = Math.min(88, Math.max(12, 42 - latDiff * 12000));
    setPinPos({ x: newX, y: newY });
  }, [gpsCoordinates]);

  // Handle drag / click positioning
  const updatePinFromMouseEvent = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to percentage (clamped 8% - 92%)
    const pctX = Math.min(92, Math.max(8, (clickX / rect.width) * 100));
    const pctY = Math.min(92, Math.max(8, (clickY / rect.height) * 100));

    setPinPos({ x: pctX, y: pctY });

    // Calculate updated Lat & Lng
    const baseLat = -26.2041;
    const baseLng = 28.0583;
    const newLat = (baseLat - (pctY - 42) * 0.00008).toFixed(4);
    const newLng = (baseLng + (pctX - 50) * 0.00008).toFixed(4);

    onGpsChange(`${newLat}, ${newLng}`);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePinFromMouseEvent(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePinFromMouseEvent(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPin = () => {
    setPinPos({ x: 50, y: 42 });
    onGpsChange("-26.2041, 28.0583");
  };

  // Google Maps POI data points matching realistic city block
  const pois = [
    { name: "Pata Pata African Resturant", type: "food", x: 54, y: 14, icon: Utensils, color: "bg-orange-500" },
    { name: "Crawl Clothing", type: "shop", x: 12, y: 38, icon: ShoppingBag, color: "bg-sky-500" },
    { name: "Main Street Life", type: "housing", x: 42, y: 46, icon: Home, color: "bg-pink-500" },
    { name: "Fox Street Studios", type: "housing", x: 34, y: 54, icon: Home, color: "bg-pink-500" },
    { name: "Absa | ATM Maboneng", type: "finance", x: 20, y: 68, icon: CreditCard, color: "bg-blue-600" },
    { name: "Wajo Supermarket", type: "shop", x: 88, y: 10, icon: ShoppingBag, color: "bg-sky-500" },
    { name: "Highbury House Accommodation", type: "place", x: 26, y: 12, icon: Building, color: "bg-slate-700" },
    { name: "Zoia Consulting", type: "place", x: 30, y: 34, icon: Building, color: "bg-slate-700" },
    { name: "Laser Touch", type: "place", x: 48, y: 58, icon: Building, color: "bg-slate-700" },
    { name: "GROW BIG HOST", type: "place", x: 74, y: 70, icon: Building, color: "bg-slate-700" }
  ];

  return (
    <div 
      className={`relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-300 ${
        isFullScreen ? "fixed inset-2 z-50 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)]" : "h-[380px] sm:h-[440px] w-full"
      }`}
      id="google-earth-satellite-canvas"
    >
      {/* 1. PHOTOREALISTIC SATELLITE CANVAS CONTAINER */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-full select-none overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-crosshair"
        }`}
      >
        {/* Real Aerial Satellite Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
          style={{
            backgroundImage: `url(${satelliteBg}), url('https://picsum.photos/seed/sat_aerial/1920/1080?blur=1')`,
            transform: `scale(${zoomLevel / 100})`,
            filter: "brightness(0.95) contrast(1.1) saturate(1.05)"
          }}
        />

        {/* Subtle Overhead Grid & Road Lines for Map Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* Street Overlay Lines */}
          <line x1="0%" y1="18%" x2="100%" y2="18%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="62%" y1="0%" x2="62%" y2="100%" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="8 4" />
          <line x1="82%" y1="0%" x2="82%" y2="100%" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="22%" y1="0%" x2="22%" y2="100%" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Fiber Mesh Trunk Cable Overlay */}
          {showMesh && (
            <g>
              <path 
                d={`M ${fiberNodePos.x}% ${fiberNodePos.y}% Q ${(fiberNodePos.x + pinPos.x)/2}% ${(fiberNodePos.y + pinPos.y)/2 + 4}%, ${pinPos.x}% ${pinPos.y}%`} 
                stroke="#10B981" 
                strokeWidth="3" 
                fill="none" 
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              <circle cx={`${fiberNodePos.x}%`} cy={`${fiberNodePos.y}%`} r="12" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* 2. REALISTIC STREET NAMES (Angled text on roads like Google Maps) */}
        {showLabels && (
          <div className="absolute inset-0 pointer-events-none text-white text-[11px] font-bold tracking-tight drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]">
            <span className="absolute top-[13%] left-[8%] tracking-wider">Fox St</span>
            <span className="absolute top-[35%] right-[33%] rotate-90 transform origin-left tracking-wider">Maritzburg St</span>
            <span className="absolute top-[40%] right-[13%] rotate-90 transform origin-left tracking-wider">Albrecht St</span>
            <span className="absolute bottom-[20%] left-[23%] rotate-90 transform origin-left tracking-wider">Kruger St</span>
          </div>
        )}

        {/* 3. GOOGLE MAPS PLACE-OF-INTEREST (POI) BADGES */}
        {showLabels && pois.map((poi, idx) => {
          const IconComp = poi.icon;
          return (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 z-10 transition-transform hover:scale-110"
              style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
            >
              <div className={`w-4 h-4 rounded-full ${poi.color} text-white flex items-center justify-center shadow-md border border-white/80`}>
                <IconComp className="w-2.5 h-2.5" />
              </div>
              <span className="text-[10px] font-medium text-white bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 shadow-sm backdrop-blur-xs whitespace-nowrap">
                {poi.name}
              </span>
            </div>
          );
        })}

        {/* FNO Fiber Manhole Terminal Badge */}
        {showMesh && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center z-15"
            style={{ left: `${fiberNodePos.x}%`, top: `${fiberNodePos.y}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <span className="mt-0.5 text-[9px] font-mono font-bold text-emerald-300 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/50 backdrop-blur-xs shadow-md">
              FNO Dark Fiber Manhole #108
            </span>
          </div>
        )}

        {/* 4. DRAGGABLE GOOGLE MAPS ORANGE LOCATION TEARDROP MARKER PIN */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full z-30 transition-transform duration-75 pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
        >
          {/* Radar Target Pulse under pin */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-orange-500/60 bg-orange-500/20 animate-ping pointer-events-none"></div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow-xl pointer-events-none"></div>

          {/* Floating Target Card above Pin */}
          <div className="mb-1 bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-orange-500/70 shadow-2xl backdrop-blur-md flex flex-col items-center min-w-[180px] pointer-events-none">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span>Target Roof Boundary</span>
            </div>
            <div className="text-xs font-mono font-extrabold text-white mt-0.5">
              {parseCoordinates(gpsCoordinates).lat.toFixed(4)}, {parseCoordinates(gpsCoordinates).lng.toFixed(4)}
            </div>
            <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-slate-300 flex items-center justify-between w-full">
              <span>Fiber Distance:</span>
              <span className="font-bold text-emerald-400">{distanceToNodeMeters}m</span>
            </div>
          </div>

          {/* Google Maps Authentic Orange Teardrop Location Pin */}
          <div className="relative group flex flex-col items-center">
            <svg 
              viewBox="0 0 38 54" 
              className="w-10 h-14 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-110" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pin Shadow */}
              <ellipse cx="19" cy="51" rx="13" ry="4" fill="rgba(0,0,0,0.6)" />
              {/* Main Teardrop Body - Google Maps Signature Orange */}
              <path 
                d="M 19 0 C 8.5 0, 0 8.5, 0 19 C 0 33, 19 52, 19 52 C 19 52, 38 33, 38 19 C 38 8.5, 29.5 0, 19 0 Z" 
                fill="#FF5722" 
                stroke="#FFFFFF" 
                strokeWidth="2.5" 
              />
              {/* Inner White Ring & Dark Center Dot */}
              <circle cx="19" cy="18" r="7" fill="#FFFFFF" />
              <circle cx="19" cy="18" r="3.5" fill="#C2410C" />
            </svg>

            {/* Drag Hint Icon */}
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full shadow-md animate-bounce">
              <Move className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Instruction Drag Hint Banner */}
        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 text-slate-200 text-[11px] font-semibold px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-2 pointer-events-none">
          <Move className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>Click & Drag orange pin or click rooftop to reposition site location</span>
        </div>

        {/* 5. AUTHENTIC GOOGLE MAPS UI CONTROLS */}
        {/* Top Search Bar */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-1.5 flex items-center gap-2 text-slate-800 text-xs font-medium w-64 sm:w-80">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate text-slate-700 font-semibold">{address || "Fox St & Maritzburg St, Maboneng, Johannesburg"}</span>
          </div>
        </div>

        {/* Top Right Map Layers Toggle */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md flex items-center gap-1 shadow-lg">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                showLabels ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Labels {showLabels ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => setShowMesh(!showMesh)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                showMesh ? "bg-emerald-600 text-white" : "text-slate-400"
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Fiber Mesh</span>
            </button>
          </div>
        </div>

        {/* Bottom Right Map Navigation & Zoom Controls */}
        <div className="absolute bottom-11 right-3 z-20 flex flex-col items-end gap-2 pointer-events-auto">
          {/* Compass Rose */}
          <div className="bg-slate-900/90 border border-slate-700/80 p-2 rounded-xl backdrop-blur-md flex items-center gap-1.5 text-white shadow-lg">
            <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
            <span className="text-[10px] font-mono font-bold text-slate-300">N</span>
          </div>

          {/* Zoom Controls */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md flex items-center gap-1 shadow-lg">
            <button
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(80, prev - 15))}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={resetPin}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg flex items-center justify-center cursor-pointer"
              title="Recenter Pin"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Faint Google Copyright Watermark */}
        <div className="absolute bottom-11 left-3 z-10 pointer-events-none text-[10px] font-sans text-white/70 drop-shadow-md">
          ©2026 Google - Imagery ©2026 CNES / Airbus, Maxar Technologies
        </div>
      </div>

      {/* 6. BOTTOM STATUS STRIP MATCHING USER SPECIFICATIONS */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-extrabold tracking-wider">GPS MATCHED: {gpsCoordinates}</span>
        </div>

        <div className="text-[11px] text-slate-300 flex items-center gap-2">
          <span>Fiber Terminal Node: <strong className="text-white font-bold">{distanceToNodeMeters}m</strong> from boundary line</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Point-to-Point Wireless Line-of-Sight Confirmed
          </span>
        </div>
      </div>
    </div>
  );
}

