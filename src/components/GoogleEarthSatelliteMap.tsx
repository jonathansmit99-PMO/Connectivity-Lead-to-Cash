import React, { useState, useRef, useEffect } from "react";
import satAerialImg from "../assets/images/satellite_aerial_view_1786341330158.jpg";
import { 
  MapPin, 
  Satellite, 
  Layers, 
  Compass, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Move, 
  Zap,
  Globe,
  CheckCircle2,
  Search,
  Building2,
  Navigation,
  Eye,
  Crosshair,
  Sliders
} from "lucide-react";

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
  const [mapMode, setMapMode] = useState<"hybrid" | "roadmap" | "terrain">("hybrid");
  const [showBuildings, setShowBuildings] = useState<boolean>(true);
  const [showFiberMesh, setShowFiberMesh] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(address || "");

  // Parse GPS
  const parseCoordinates = (gpsStr: string) => {
    const parts = gpsStr.split(",").map(p => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return { lat: -26.2041, lng: 28.0583 }; // Default Maboneng / Joburg CBD GPS
  };

  const currentCoords = parseCoordinates(gpsCoordinates);

  // Map Canvas Interaction State
  const [pinPos, setPinPos] = useState({ x: 50, y: 42 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(115);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fiberNodePos = { x: 38, y: 28 };
  const dx = pinPos.x - fiberNodePos.x;
  const dy = pinPos.y - fiberNodePos.y;
  const distanceToNodeMeters = Math.max(4, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.75));

  // Sync address search query when prop updates
  useEffect(() => {
    if (address) {
      setSearchQuery(address);
    }
  }, [address]);

  // Sync canvas pin position with coordinates
  useEffect(() => {
    const { lat, lng } = parseCoordinates(gpsCoordinates);
    const baseLat = -26.2041;
    const baseLng = 28.0583;
    const latDiff = lat - baseLat;
    const lngDiff = lng - baseLng;
    
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

    const pctX = Math.min(92, Math.max(8, (clickX / rect.width) * 100));
    const pctY = Math.min(92, Math.max(8, (clickY / rect.height) * 100));

    setPinPos({ x: pctX, y: pctY });

    const baseLat = -26.2041;
    const baseLng = 28.0583;
    const newLat = (baseLat - (pctY - 42) * 0.00008).toFixed(4);
    const newLng = (baseLng + (pctX - 50) * 0.00008).toFixed(4);

    onGpsChange(`${newLat}, ${newLng}`);
  };

  return (
    <div 
      className={`relative bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl transition-all duration-300 ${
        isFullScreen ? "fixed inset-2 z-50 h-[calc(100vh-1rem)] w-[calc(100vw-1rem)]" : "h-[440px] sm:h-[480px] w-full"
      }`}
      id="google-earth-satellite-canvas"
    >
      {/* 1. GOOGLE MAPS SEARCH BAR & LAYER TOGGLES HEADER */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Google Maps Search Bar */}
        <div className="pointer-events-auto bg-slate-900/95 border border-slate-700 rounded-xl p-1.5 shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-sm w-full">
          <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address or landmark..."
            className="bg-transparent text-xs font-semibold text-white outline-none w-full placeholder:text-slate-500"
          />
          <button 
            onClick={() => onGpsChange("-26.2041, 28.0583")}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
          >
            Locate
          </button>
        </div>

        {/* Map Type Switcher (Hybrid Satellite / Roadmap / Terrain) */}
        <div className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 rounded-xl p-1 backdrop-blur-md flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => setMapMode("hybrid")}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === "hybrid" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Satellite className="w-3 h-3" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setMapMode("roadmap")}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mapMode === "roadmap" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setShowBuildings(!showBuildings)}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 border ${
              showBuildings ? "bg-slate-800 text-teal-300 border-teal-500/40" : "text-slate-500 border-slate-800"
            }`}
            title="Toggle 3D Buildings & Rooftops"
          >
            <Building2 className="w-3 h-3" />
            <span>3D Roofs</span>
          </button>
        </div>
      </div>

      {/* 2. MAP CANVAS AREA */}
      <div 
        ref={containerRef}
        onMouseDown={(e) => { setIsDragging(true); updatePinFromMouseEvent(e); }}
        onMouseMove={(e) => { if (isDragging) updatePinFromMouseEvent(e); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className={`relative w-full h-full select-none overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-crosshair"
        }`}
      >
        {/* Map Background Layer: High-Res Generated Aerial View OR Vector Canvas */}
        {mapMode === "roadmap" ? (
          <div className="absolute inset-0 bg-slate-900">
            {/* Vector Roadmap Grid Styling */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
          </div>
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
            style={{
              backgroundImage: `url('${satAerialImg}')`,
              transform: `scale(${zoomLevel / 100})`,
              filter: mapMode === "hybrid" ? "brightness(0.95) contrast(1.1)" : "none"
            }}
          />
        )}

        {/* GIS BUILDING FOOTPRINTS & STREET VECTOR OVERLAY */}
        {showBuildings && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Main Road Arterials */}
            <path d="M 0 160 Q 400 180, 1000 150" stroke="#f59e0b" strokeWidth="8" fill="none" opacity="0.6" />
            <text x="120" y="152" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">Commissioners St (M2)</text>

            <path d="M 320 0 L 320 600" stroke="#94a3b8" strokeWidth="6" fill="none" opacity="0.5" />
            <text x="328" y="80" fill="#cbd5e1" fontSize="9" fontFamily="monospace">Fox Street</text>

            {/* Building 1: Main Commercial Tower */}
            <polygon points="120,80 280,80 280,180 120,180" fill="rgba(13, 148, 136, 0.25)" stroke="#14b8a6" strokeWidth="2" />
            <text x="130" y="110" fill="#5eead4" fontSize="10" fontWeight="bold">Reunert HQ Tower</text>

            {/* Building 2: Data Center Annex */}
            <polygon points="340,90 480,90 480,170 340,170" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="2" />
            <text x="350" y="120" fill="#93c5fd" fontSize="9" fontWeight="bold">Data Center Annex</text>

            {/* Building 3: Logistics Hub */}
            <polygon points="140,240 320,240 320,380 140,380" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
            <text x="150" y="270" fill="#fde68a" fontSize="10" fontWeight="bold">Logistics Hub & Depot</text>

            {/* Building 4: Customer Site Roof Boundary */}
            <polygon 
              points={`${pinPos.x * 6 - 40},${pinPos.y * 4 - 30} ${pinPos.x * 6 + 40},${pinPos.y * 4 - 30} ${pinPos.x * 6 + 40},${pinPos.y * 4 + 30} ${pinPos.x * 6 - 40},${pinPos.y * 4 + 30}`} 
              fill="rgba(239, 68, 68, 0.2)" 
              stroke="#ef4444" 
              strokeWidth="2.5" 
            />

            {/* Fiber Network Mesh & Line of Sight Vector */}
            {showFiberMesh && (
              <path 
                d={`M ${fiberNodePos.x}% ${fiberNodePos.y}% Q ${(fiberNodePos.x + pinPos.x)/2}% ${(fiberNodePos.y + pinPos.y)/2 + 4}%, ${pinPos.x}% ${pinPos.y}%`} 
                stroke="#10B981" 
                strokeWidth="3.5" 
                fill="none" 
                strokeDasharray="6 3"
                className="animate-pulse"
              />
            )}
          </svg>
        )}

        {/* Fiber Node POI Badge */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
          style={{ left: `${fiberNodePos.x}%`, top: `${fiberNodePos.y}%` }}
        >
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-2 py-1 rounded-lg text-[9px] font-mono font-bold shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Fiber Terminal #402</span>
          </div>
        </div>

        {/* Target Location Teardrop Pin */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-full z-30 transition-transform duration-75 pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
        >
          <div className="mb-1 bg-slate-900/95 text-white px-2.5 py-1.5 rounded-xl border border-orange-500/70 shadow-2xl backdrop-blur-md flex flex-col items-center min-w-[180px] pointer-events-none">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span>Selected Building Roof</span>
            </div>
            <div className="text-xs font-mono font-extrabold text-white mt-0.5">
              {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
            </div>
          </div>

          <div className="relative group flex flex-col items-center">
            <svg viewBox="0 0 38 54" className="w-10 h-14 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.6)]" fill="none">
              <ellipse cx="19" cy="51" rx="13" ry="4" fill="rgba(0,0,0,0.6)" />
              <path d="M 19 0 C 8.5 0, 0 8.5, 0 19 C 0 33, 19 52, 19 52 C 19 52, 38 33, 38 19 C 38 8.5, 29.5 0, 19 0 Z" fill="#EA4335" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="19" cy="18" r="7" fill="#FFFFFF" />
              <circle cx="19" cy="18" r="3.5" fill="#B91C1C" />
            </svg>
          </div>
        </div>

        {/* Google Maps Controls (Right Side Zoom & Compass) */}
        <div className="absolute bottom-12 right-3 z-30 flex flex-col items-center gap-1.5 bg-slate-900/95 border border-slate-700 rounded-xl p-1.5 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-sm font-bold"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-4 h-[1px] bg-slate-700"></div>
          <button
            onClick={() => setZoomLevel(prev => Math.max(80, prev - 15))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-sm font-bold"
            title="Zoom Out"
          >
            -
          </button>
          <div className="w-4 h-[1px] bg-slate-700"></div>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 text-white flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-extrabold tracking-wider">GPS MATCHED: {gpsCoordinates}</span>
        </div>

        <div className="text-[11px] text-slate-300 flex items-center gap-2">
          <span>Nearest Fiber Terminal: <strong className="text-white font-bold">{distanceToNodeMeters}m</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Point-to-Point Wireless Line-of-Sight Active
          </span>
        </div>
      </div>
    </div>
  );
}
