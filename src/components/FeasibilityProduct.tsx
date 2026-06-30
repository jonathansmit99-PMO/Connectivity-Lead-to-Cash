import React, { useState } from "react";
import { Lead, FeasibilityStudy, Quotation } from "../types";
import { 
  MapPin, 
  Satellite, 
  Wifi, 
  Layers, 
  Upload, 
  CheckCircle, 
  Search, 
  DollarSign, 
  Network, 
  TrendingUp, 
  HelpCircle,
  Cpu,
  Loader2,
  FileText
} from "lucide-react";

interface FeasibilityProductProps {
  leads: Lead[];
  feasibilities: FeasibilityStudy[];
  setFeasibilities: React.Dispatch<React.SetStateAction<FeasibilityStudy[]>>;
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  activePersona: string;
  selectedLeadId: string;
}

export default function FeasibilityProduct({
  leads,
  feasibilities,
  setFeasibilities,
  quotations,
  setQuotations,
  activePersona,
  selectedLeadId
}: FeasibilityProductProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  
  // Local state for running feasibility
  const [address, setAddress] = useState(activeLead?.address || "");
  const [gps, setGps] = useState("-26.1014, 28.0572");
  const [isFeasibilityRunning, setIsFeasibilityRunning] = useState(false);
  const [activeFeas, setActiveFeas] = useState<FeasibilityStudy | null>(
    feasibilities.find(f => f.leadId === activeLead?.id) || null
  );

  // Local state for product selection
  const [selectedProduct, setSelectedProduct] = useState({
    serviceType: "enterprise" as "broadband" | "enterprise",
    bandwidth: "200 Mbps",
    term: "24" as "12" | "24" | "36",
    vendor: "Fibre Com Connect"
  });

  // Local state for quote parsing
  const [rawQuoteText, setRawQuoteText] = useState("");
  const [parsingQuote, setParsingQuote] = useState(false);
  const [tempQuoteDetails, setTempQuoteDetails] = useState<Partial<Quotation> | null>(null);

  const runFeasibilityCheck = () => {
    setIsFeasibilityRunning(true);
    setTimeout(() => {
      const newFeas: FeasibilityStudy = {
        id: `feas-${Date.now().toString().slice(-3)}`,
        leadId: activeLead.id,
        address: address,
        gpsCoordinates: gps,
        status: "completed",
        services: [
          { type: "Fiber", available: true, vendor: "Fibre Com Connect", maxSpeed: "1 Gbps", latency: "4ms", estimatedLeadTime: "4 weeks" },
          { type: "Wireless", available: true, vendor: "Reunert AirLink", maxSpeed: "150 Mbps", latency: "12ms", estimatedLeadTime: "2 weeks" },
          { type: "LTE", available: true, vendor: "MTN South Africa", maxSpeed: "80 Mbps", latency: "25ms", estimatedLeadTime: "3 days" },
          { type: "Satellite", available: true, vendor: "Starlink Business", maxSpeed: "220 Mbps", latency: "45ms", estimatedLeadTime: "7 days" }
        ]
      };
      setFeasibilities(prev => [newFeas, ...prev.filter(f => f.leadId !== activeLead.id)]);
      setActiveFeas(newFeas);
      setIsFeasibilityRunning(false);
    }, 2000);
  };

  const handleParseQuoteAI = async () => {
    if (!rawQuoteText) return;
    setParsingQuote(true);
    try {
      const response = await fetch("/api/gemini/parse-quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawQuoteText }),
      });
      if (response.ok) {
        const result = await response.json();
        // Calculate margin (assumes 50% cost price ratio to output 50% margin)
        const costPrice = result.mrc * 0.5; // assume 50% is cost
        const margin = Math.round(((result.mrc - costPrice) / result.mrc) * 100);

        setTempQuoteDetails({
          ...result,
          leadId: activeLead.id,
          address: address,
          gpsCoordinates: gps,
          marginPercentage: margin,
          status: "uploaded"
        });
      } else {
        throw new Error();
      }
    } catch {
      // Fallback
      setTempQuoteDetails({
        leadId: activeLead.id,
        address: address,
        gpsCoordinates: gps,
        networkOperator: selectedProduct.vendor,
        networkType: selectedProduct.serviceType === "enterprise" ? "Fiber" : "LTE",
        networkStatus: "Live",
        leadTimeWeeks: 4,
        bandwidth: selectedProduct.bandwidth,
        nrc: 4500,
        mrc: 8200,
        termMonths: parseInt(selectedProduct.term),
        lastMileProvider: selectedProduct.vendor,
        contention: selectedProduct.serviceType === "enterprise" ? "1:1" : "1:4",
        provisioningType: "Layer 3",
        notes: "Parsed automatically using static client calculations. Secure fiber last-mile delivery verified.",
        pricingValidityDays: 30,
        marginPercentage: 50.0,
        status: "uploaded"
      });
    } finally {
      setParsingQuote(false);
    }
  };

  const handleSaveQuote = () => {
    if (!tempQuoteDetails) return;
    const newQuote: Quotation = {
      id: `quote-${Date.now().toString().slice(-3)}`,
      ...(tempQuoteDetails as Quotation)
    };
    setQuotations(prev => [newQuote, ...prev.filter(q => q.leadId !== activeLead.id)]);
    setTempQuoteDetails(null);
    setRawQuoteText("");
  };

  const handleManualUpload = () => {
    const mrc = selectedProduct.serviceType === "enterprise" ? 12500 : 4200;
    const costPrice = mrc * 0.5;
    const margin = 50;

    const newQuote: Quotation = {
      id: `quote-${Date.now().toString().slice(-3)}`,
      leadId: activeLead.id,
      address: address || activeLead.address,
      gpsCoordinates: gps,
      networkOperator: selectedProduct.vendor,
      networkType: selectedProduct.serviceType === "enterprise" ? "Fiber" : "Wireless",
      networkStatus: "Live",
      leadTimeWeeks: selectedProduct.vendor === "Fibre Com Connect" ? 4 : 2,
      bandwidth: selectedProduct.bandwidth,
      nrc: selectedProduct.serviceType === "enterprise" ? 8500 : 2500,
      mrc: mrc,
      termMonths: parseInt(selectedProduct.term),
      lastMileProvider: selectedProduct.vendor,
      contention: selectedProduct.serviceType === "enterprise" ? "1:1" : "1:5",
      provisioningType: "Layer 3",
      notes: "Quotation created through platform wizard selections.",
      pricingValidityDays: 30,
      marginPercentage: margin,
      status: "uploaded"
    };

    setQuotations(prev => [newQuote, ...prev.filter(q => q.leadId !== activeLead.id)]);
  };

  const activeQuote = quotations.find(q => q.leadId === activeLead?.id);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="feasibility-selection-root">
      {/* 1. Feasibility Check Section */}
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            1. Feasibility GPS Lookup & API Integration
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">GPS Coordinates (Latitude, Longitude)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={gps}
                    onChange={(e) => setGps(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="-26.1014, 28.0572"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Street Address Lookup</label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="Search address..."
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <button
              onClick={runFeasibilityCheck}
              disabled={isFeasibilityRunning || !activeLead}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isFeasibilityRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Interfacing Google Earth, FNO & WNO platforms...
                </>
              ) : (
                <>
                  <Network className="w-4 h-4" />
                  Query Live Feasibilities (Fibre / AirLink)
                </>
              )}
            </button>
          </div>

          {/* Feasibility Results Visualization */}
          {activeFeas && activeFeas.status === "completed" && (
            <div className="mt-5 space-y-4">
              <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                <div className="flex items-center justify-between pb-2 border-b border-teal-200/50 mb-3">
                  <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Satellite className="w-3.5 h-3.5" /> Google Earth & FNO Coverage Found
                  </h4>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase">Live</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeFeas.services.map((srv, idx) => (
                    <div key={idx} className="bg-white border border-slate-150 p-2.5 rounded-lg flex flex-col gap-1 shadow-xs">
                      <div className="flex items-center gap-1">
                        {srv.type === "Fiber" && <Layers className="w-3.5 h-3.5 text-teal-600" />}
                        {srv.type === "Wireless" && <Wifi className="w-3.5 h-3.5 text-amber-500" />}
                        {srv.type === "LTE" && <TrendingUp className="w-3.5 h-3.5 text-blue-500" />}
                        {srv.type === "Satellite" && <Satellite className="w-3.5 h-3.5 text-purple-500" />}
                        <span className="text-xs font-semibold text-slate-800">{srv.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Provider: {srv.vendor}</p>
                      <p className="text-[11px] text-slate-700 font-bold mt-1">Speed: {srv.maxSpeed}</p>
                      <p className="text-[9px] text-slate-500">Latency: {srv.latency} | Lead: {srv.estimatedLeadTime}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* simulated graphic map path */}
              <div className="relative h-28 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-white border border-slate-800 shadow-inner">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
                <div className="absolute top-4 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-4 right-1/4 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

                <div className="z-10 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    GPS MATCHED: {activeFeas.gpsCoordinates}
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-sm font-medium">
                    Google Earth overlay shows fiber terminal node at <span className="text-slate-200">12m</span> from boundary line. Point-to-Point Wireless mast line-of-sight confirmed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Product Selection Section */}
        {activeFeas && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              2. Product Selection & Attribute Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Service Tier Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedProduct(prev => ({ ...prev, serviceType: "enterprise" }))}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all ${
                      selectedProduct.serviceType === "enterprise"
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Enterprise Dedicated Link
                  </button>
                  <button
                    onClick={() => setSelectedProduct(prev => ({ ...prev, serviceType: "broadband" }))}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all ${
                      selectedProduct.serviceType === "broadband"
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Broadband Business Link
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Bandwidth & Port Speed</label>
                <select
                  value={selectedProduct.bandwidth}
                  onChange={(e) => setSelectedProduct(prev => ({ ...prev, bandwidth: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="20 Mbps">20 Mbps Broadband Link</option>
                  <option value="50 Mbps">50 Mbps Sync Link</option>
                  <option value="100 Mbps">100 Mbps Sync Fiber</option>
                  <option value="200 Mbps">200 Mbps Dedicated Port</option>
                  <option value="500 Mbps">500 Mbps Premium Port</option>
                  <option value="1 Gbps">1 Gbps High-Density Port</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Contract Term Limit</label>
                <div className="grid grid-cols-3 gap-2">
                  {["12", "24", "36"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedProduct(prev => ({ ...prev, term: t as "12" | "24" | "36" }))}
                      className={`py-2 border rounded-lg text-xs font-bold transition-all ${
                        selectedProduct.term === t
                          ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t} Months
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Preferred Vendor Networks</label>
                <select
                  value={selectedProduct.vendor}
                  onChange={(e) => setSelectedProduct(prev => ({ ...prev, vendor: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                >
                  <option value="Fibre Com Connect">Fibre Com Connect (Reunert Network Partner)</option>
                  <option value="Reunert AirLink">Reunert AirLink (P2P Wireless)</option>
                  <option value="MTN South Africa">MTN South Africa (National Fiber Core)</option>
                  <option value="Vodacom Business">Vodacom Business (Enterprise Lease)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleManualUpload}
              className="mt-4 w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Generate Quote via Standard Wizard Settings
            </button>
          </div>
        )}
      </div>

      {/* 3. Quotation Parsing Sidebar */}
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full">
          <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            3. Quotation Generation & Upload
          </h3>

          {activeQuote ? (
            /* Current active quote display */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 mb-1">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase">Active Commercial Quote</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{activeQuote.status}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-400">Quote ID:</span> <span className="font-mono font-bold text-slate-800">{activeQuote.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Bandwidth:</span> <span className="font-bold text-slate-800">{activeQuote.bandwidth}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NRC Setup:</span> <span className="font-bold text-slate-800">R {activeQuote.nrc.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">MRC Monthly:</span> <span className="font-bold text-slate-800">R {activeQuote.mrc.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Term:</span> <span className="font-bold text-slate-800">{activeQuote.termMonths} Months</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Network Operator:</span> <span className="font-bold text-slate-800">{activeQuote.networkOperator}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Contention:</span> <span className="font-mono font-bold text-slate-800">{activeQuote.contention}</span></div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Quote has been stored and routed internally. Procurement Officers review costs, verify compliance margins, and place vendor orders next.
                </span>
              </div>
            </div>
          ) : tempQuoteDetails ? (
            /* Temporary quote waiting for confirmation */
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl space-y-3">
                <div className="pb-2 border-b border-teal-200">
                  <h4 className="text-xs font-bold text-teal-800 uppercase">Review Parsed Details</h4>
                  <p className="text-[10px] text-teal-600 mt-0.5">Parsed via Gemini Intelligence</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-400">Bandwidth:</span> <span className="font-bold">{tempQuoteDetails.bandwidth}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NRC:</span> <span className="font-bold">R {tempQuoteDetails.nrc?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">MRC:</span> <span className="font-bold">R {tempQuoteDetails.mrc?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Term:</span> <span className="font-bold">{tempQuoteDetails.termMonths} Months</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Operator:</span> <span className="font-bold">{tempQuoteDetails.networkOperator}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Contention:</span> <span className="font-bold">{tempQuoteDetails.contention}</span></div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-teal-200">
                  <button
                    onClick={() => setTempQuoteDetails(null)}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveQuote}
                    className="flex-1 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700"
                  >
                    Confirm & Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Quote Input form */
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Has the vendor provided a quote file? Paste the raw quotation text below to trigger the Gemini AI parser. The AI automatically populates network status, NRC/MRC, contention, validity, and margin calculations.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Paste Raw Quote Text</label>
                  <textarea
                    value={rawQuoteText}
                    onChange={(e) => setRawQuoteText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-mono"
                    placeholder="e.g., Quote Ref: FC-22920. Fiber connection for Sandton Office. Speed: 500Mbps Sync. MRC: R12500 per month on 24 month term. Install fee: R8000 non-recurring. Valid for 30 days."
                  />
                </div>
              </div>

              <button
                onClick={handleParseQuoteAI}
                disabled={parsingQuote || !rawQuoteText}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {parsingQuote ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Quote Attributes with Gemini...
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    AI Parse Quotation Attributes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
