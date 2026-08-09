import React, { useState, useRef, useEffect } from "react";
import { Lead, FeasibilityStudy, Quotation, OccupancyDocument } from "../types";
import GoogleEarthSatelliteMap from "./GoogleEarthSatelliteMap";
import { 
  MapPin, 
  Satellite, 
  Wifi, 
  Layers, 
  Upload, 
  Download,
  FileUp,
  FileText,
  Paperclip,
  CheckCircle, 
  Search, 
  DollarSign, 
  Network, 
  TrendingUp, 
  HelpCircle,
  Cpu,
  Loader2,
  RefreshCw,
  Building,
  Edit2,
  Edit3,
  Phone,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface FeasibilityProductProps {
  leads: Lead[];
  feasibilities: FeasibilityStudy[];
  setFeasibilities: React.Dispatch<React.SetStateAction<FeasibilityStudy[]>>;
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  occupancies?: OccupancyDocument[];
  setOccupancies?: React.Dispatch<React.SetStateAction<OccupancyDocument[]>>;
  activePersona: string;
  selectedLeadId: string;
}

export default function FeasibilityProduct({
  leads,
  feasibilities,
  setFeasibilities,
  quotations,
  setQuotations,
  occupancies = [],
  setOccupancies,
  activePersona,
  selectedLeadId
}: FeasibilityProductProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeOcc = occupancies.find(o => o.leadId === activeLead?.id);
  
  // Local state for running feasibility
  const [address, setAddress] = useState(activeLead?.address || "");
  const [gps, setGps] = useState("-26.1014, 28.0572");
  const [isFeasibilityRunning, setIsFeasibilityRunning] = useState(false);
  const [activeFeas, setActiveFeas] = useState<FeasibilityStudy | null>(
    feasibilities.find(f => f.leadId === activeLead?.id) || null
  );

  // Local state for RFO form fields
  const [occupancyForm, setOccupancyForm] = useState({
    buildingName: activeOcc?.buildingName || (activeLead?.companyName ? `${activeLead.companyName} Sandton Campus` : "Rivonia Heights Block C"),
    onsiteContactName: activeOcc?.onsiteContactName || activeLead?.clientName || "Lebo Nkosi",
    onsiteContactPhone: activeOcc?.onsiteContactPhone || activeLead?.phone || "+27 82 455 1200",
    onsiteContactEmail: activeOcc?.onsiteContactEmail || activeLead?.email || "site.manager@company.co.za",
    landlordName: activeOcc?.landlordName || "Redefine Properties",
    landlordPhone: activeOcc?.landlordPhone || "+27 11 500 8000",
    landlordEmail: activeOcc?.landlordEmail || "info@redefine.co.za",
    termsAgreed: activeOcc?.termsAgreed ?? true
  });

  const [isEditingRfo, setIsEditingRfo] = useState(!activeOcc);
  const [rfoValidationStatus, setRfoValidationStatus] = useState<"none" | "checking" | "validated">(
    activeOcc?.gpsValidated ? "validated" : "none"
  );

  // Sync RFO form when active lead or activeOcc changes
  useEffect(() => {
    if (activeOcc) {
      setOccupancyForm({
        buildingName: activeOcc.buildingName,
        onsiteContactName: activeOcc.onsiteContactName,
        onsiteContactPhone: activeOcc.onsiteContactPhone,
        onsiteContactEmail: activeOcc.onsiteContactEmail || activeLead?.email || "",
        landlordName: activeOcc.landlordName,
        landlordPhone: activeOcc.landlordPhone || "",
        landlordEmail: activeOcc.landlordEmail,
        termsAgreed: activeOcc.termsAgreed
      });
      setIsEditingRfo(false);
      setRfoValidationStatus(activeOcc.gpsValidated ? "validated" : "none");
    } else {
      setOccupancyForm({
        buildingName: activeLead?.companyName ? `${activeLead.companyName} Sandton Campus` : "Rivonia Heights Block C",
        onsiteContactName: activeLead?.clientName || "Lebo Nkosi",
        onsiteContactPhone: activeLead?.phone || "+27 82 455 1200",
        onsiteContactEmail: activeLead?.email || "site.manager@company.co.za",
        landlordName: "Redefine Properties",
        landlordPhone: "+27 11 500 8000",
        landlordEmail: "info@redefine.co.za",
        termsAgreed: true
      });
      setIsEditingRfo(true);
      setRfoValidationStatus("none");
    }
  }, [selectedLeadId, activeOcc, activeLead]);

  // Local state for product selection
  const [selectedProduct, setSelectedProduct] = useState({
    serviceType: "enterprise" as "broadband" | "premium" | "enterprise",
    bandwidth: "200 Mbps",
    term: "24" as "12" | "24" | "36",
    vendor: "Reunert Fibre"
  });

  // Additional Products & Value-Added Bundles State
  const [selectedAddons, setSelectedAddons] = useState<{
    security: string[];
    voiceCloud: string[];
    pabx: string[];
    telephones: string[];
  }>({
    security: ["Next-Gen Enterprise Firewall (UTM)"],
    voiceCloud: ["SIP Trunk & Voice Channels"],
    pabx: [],
    telephones: ["Standard IP Office Desk Phone"]
  });

  const addonPrices: Record<string, number> = {
    "Next-Gen Enterprise Firewall (UTM)": 1800,
    "Anti-DDoS Scrubbing & Mitigation": 950,
    "Endpoint Threat Protection & EDR": 650,
    "Managed Cyber SOC & SIEM Logging": 2400,
    "SIP Trunk & Voice Channels": 450,
    "Cloud PBX Voice License": 180,
    "AI Auto-Attendant & Call Recording": 350,
    "Toll-Free 0800 Virtual Routing": 250,
    "Hybrid On-Premise PABX Server": 1200,
    "Cloud Multi-Tenant PABX Engine": 850,
    "Call Center Queue & IVR Engine": 1500,
    "Executive HD Touchscreen IP Phone": 320,
    "Standard IP Office Desk Phone": 150,
    "Cordless Long-Range DECT Handset": 180,
    "Conference Room 360° Speakerphone": 550
  };

  const toggleAddon = (category: 'security' | 'voiceCloud' | 'pabx' | 'telephones', item: string) => {
    setSelectedAddons(prev => {
      const current = prev[category];
      const exists = current.includes(item);
      return {
        ...prev,
        [category]: exists ? current.filter(i => i !== item) : [...current, item]
      };
    });
  };

  const calculateAddonsMrc = () => {
    const allSelected = [
      ...selectedAddons.security,
      ...selectedAddons.voiceCloud,
      ...selectedAddons.pabx,
      ...selectedAddons.telephones
    ];
    return allSelected.reduce((sum, item) => sum + (addonPrices[item] || 0), 0);
  };

  // Local state for quote parsing & upload/download
  const [rawQuoteText, setRawQuoteText] = useState("");
  const [parsingQuote, setParsingQuote] = useState(false);
  const [tempQuoteDetails, setTempQuoteDetails] = useState<Partial<Quotation> | null>(null);
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReplacingQuote, setIsReplacingQuote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadQuote = (quoteToDownload: Partial<Quotation>) => {
    const formattedDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    const content = `
===================================================================
                  REUNERT CONNECTIQ COMMERCIAL QUOTATION
===================================================================
Reference Number:   ${quoteToDownload.id || 'QUOTE-' + Math.floor(100 + Math.random() * 900)}
Date Issued:        ${formattedDate}
Pricing Validity:   ${quoteToDownload.pricingValidityDays || 30} Days

-------------------------------------------------------------------
CLIENT & SITE DETAILS
-------------------------------------------------------------------
Company Name:       ${activeLead?.companyName || "Client"}
Contact Person:     ${activeLead?.clientName || activeLead?.primaryBillingContact?.name || "Procurement Manager"}
Site Address:       ${quoteToDownload.address || address}
GPS Coordinates:    ${quoteToDownload.gpsCoordinates || gps}

-------------------------------------------------------------------
NETWORK & TECHNICAL SPECIFICATIONS
-------------------------------------------------------------------
Service Tier:       ${quoteToDownload.networkType || "Fiber Link"}
Bandwidth:          ${quoteToDownload.bandwidth || selectedProduct.bandwidth}
Contention Ratio:   ${quoteToDownload.contention || "1:1"}
Network Operator:   ${quoteToDownload.networkOperator || selectedProduct.vendor}
Last Mile Provider: ${quoteToDownload.lastMileProvider || selectedProduct.vendor}
Contract Term:      ${quoteToDownload.termMonths || selectedProduct.term} Months
Lead Time:          ${quoteToDownload.leadTimeWeeks || 4} Weeks

-------------------------------------------------------------------
COMMERCIAL FINANCIAL BREAKDOWN (ZAR)
-------------------------------------------------------------------
Non-Recurring Setup Fee (NRC):  R ${(quoteToDownload.nrc || 0).toLocaleString()}
Monthly Recurring Cost (MRC):  R ${(quoteToDownload.mrc || 0).toLocaleString()} / month

-------------------------------------------------------------------
TERMS & COMPLIANCE
-------------------------------------------------------------------
Status:             ${(quoteToDownload.status || "uploaded").toUpperCase()}
Notes:              ${quoteToDownload.notes || "Official quotation generated via ConnectIQ Platform."}

Reunert ConnectIQ Telecoms Operations
Contact: quotes@connectiq.reunert.co.za
===================================================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ConnectIQ_Quotation_${(activeLead?.companyName || "Client").replace(/[^a-zA-Z0-9]/g, '_')}_${quoteToDownload.id || 'Draft'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProcessFile = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string" && text.trim().length > 0) {
        setRawQuoteText(text);
      } else {
        setRawQuoteText(
          `Extracted Quotation Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nQuote Ref: FC-${Math.floor(10000 + Math.random() * 90000)}\nService: ${selectedProduct.bandwidth} (${selectedProduct.serviceType === "enterprise" ? "Enterprise Dedicated" : selectedProduct.serviceType === "premium" ? "Premium Business" : "Broadband"} Link)\nVendor: ${selectedProduct.vendor}\nMonthly Recurring: R ${selectedProduct.serviceType === "enterprise" ? "12500" : selectedProduct.serviceType === "premium" ? "7500" : "4200"}\nInstall Setup NRC: R ${selectedProduct.serviceType === "enterprise" ? "8500" : selectedProduct.serviceType === "premium" ? "4500" : "2500"}\nTerm: ${selectedProduct.term} Months`
        );
      }
    };
    if (file.type.includes("text") || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      setRawQuoteText(
        `Quotation File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)\nVendor: ${selectedProduct.vendor}\nBandwidth: ${selectedProduct.bandwidth}\nTerm: ${selectedProduct.term} Months\nQuote ID: QUOTE-${Math.floor(100 + Math.random() * 900)}`
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleValidateRfoGps = () => {
    setRfoValidationStatus("checking");
    setTimeout(() => {
      setRfoValidationStatus("validated");
    }, 800);
  };

  const handleSubmitOccupancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    const newOcc: OccupancyDocument = {
      id: activeOcc?.id || `occ-${Date.now().toString().slice(-3)}`,
      leadId: activeLead.id,
      buildingName: occupancyForm.buildingName,
      address: address || activeLead.address,
      gpsCoordinates: gps,
      onsiteContactName: occupancyForm.onsiteContactName,
      onsiteContactPhone: occupancyForm.onsiteContactPhone,
      onsiteContactEmail: occupancyForm.onsiteContactEmail,
      landlordName: occupancyForm.landlordName,
      landlordPhone: occupancyForm.landlordPhone,
      landlordEmail: occupancyForm.landlordEmail,
      gpsValidated: rfoValidationStatus === "validated",
      termsAgreed: occupancyForm.termsAgreed,
      status: "submitted"
    };

    if (setOccupancies) {
      setOccupancies(prev => [newOcc, ...prev.filter(o => o.leadId !== activeLead.id)]);
    }
    setIsEditingRfo(false);
  };

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
          { type: "Fiber", available: true, vendor: "Reunert Fibre", maxSpeed: "1 Gbps", latency: "4ms", estimatedLeadTime: "4 weeks" },
          { type: "Wireless", available: true, vendor: "Reunert Air Fibre", maxSpeed: "150 Mbps", latency: "12ms", estimatedLeadTime: "2 weeks" },
          { type: "LTE", available: true, vendor: "Reunert Unlimited LTE", maxSpeed: "100 Mbps", latency: "20ms", estimatedLeadTime: "2 days" },
          { type: "Satellite", available: true, vendor: "Reunert LEO", maxSpeed: "250 Mbps", latency: "35ms", estimatedLeadTime: "5 days" }
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
    const baseMrc = selectedProduct.serviceType === "enterprise" ? 12500 : selectedProduct.serviceType === "premium" ? 7500 : 4200;
    const addonsMrc = calculateAddonsMrc();
    const totalMrc = baseMrc + addonsMrc;
    const margin = 50;

    const allSelectedAddons = [
      ...selectedAddons.security,
      ...selectedAddons.voiceCloud,
      ...selectedAddons.pabx,
      ...selectedAddons.telephones
    ];

    const notesStr = allSelectedAddons.length > 0
      ? `Quotation created via platform wizard. Included Add-on Products: ${allSelectedAddons.join(", ")}.`
      : "Quotation created through platform wizard selections.";

    const newQuote: Quotation = {
      id: `quote-${Date.now().toString().slice(-3)}`,
      leadId: activeLead.id,
      address: address || activeLead.address,
      gpsCoordinates: gps,
      networkOperator: selectedProduct.vendor,
      networkType: selectedProduct.serviceType === "broadband" ? "Wireless" : "Fiber",
      networkStatus: "Live",
      leadTimeWeeks: selectedProduct.vendor === "Fibre Com Connect" ? 4 : 2,
      bandwidth: selectedProduct.bandwidth,
      nrc: selectedProduct.serviceType === "enterprise" ? 8500 : selectedProduct.serviceType === "premium" ? 4500 : 2500,
      mrc: totalMrc,
      termMonths: parseInt(selectedProduct.term),
      lastMileProvider: selectedProduct.vendor,
      contention: selectedProduct.serviceType === "enterprise" ? "1:1" : selectedProduct.serviceType === "premium" ? "1:2" : "1:5",
      provisioningType: "Layer 3",
      notes: notesStr,
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

            {/* Interactive Google Earth Satellite Map Canvas with Movable Pin */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Interactive Google Earth 3D Satellite Map & Pin Locator</span>
                <span className="text-[11px] text-teal-600 font-bold font-mono">Drag pin or click anywhere on map</span>
              </label>
              <GoogleEarthSatelliteMap
                gpsCoordinates={gps}
                onGpsChange={(newGps) => setGps(newGps)}
                address={address}
                isFeasibilityRunning={isFeasibilityRunning}
              />
            </div>

            <button
              onClick={runFeasibilityCheck}
              disabled={isFeasibilityRunning || !activeLead}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedProduct(prev => ({ ...prev, serviceType: "enterprise" }))}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedProduct.serviceType === "enterprise"
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Enterprise Dedicated Link
                  </button>
                  <button
                    onClick={() => setSelectedProduct(prev => ({ ...prev, serviceType: "premium" }))}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedProduct.serviceType === "premium"
                        ? "border-teal-500 bg-teal-50 text-teal-700 shadow-xs"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Premium Business Link
                  </button>
                  <button
                    onClick={() => setSelectedProduct(prev => ({ ...prev, serviceType: "broadband" }))}
                    className={`py-2 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                  <option value="Reunert Fibre">Reunert Fibre</option>
                  <option value="Reunert Air Fibre">Reunert Air Fibre</option>
                  <option value="Reunert LEO">Reunert LEO</option>
                  <option value="Amazon LEO">Amazon LEO</option>
                  <option value="Reunert Unlimited LTE">Reunert Unlimited LTE</option>
                  <option value="Reunert Fixed LTE">Reunert Fixed LTE</option>
                </select>
              </div>
            </div>

            {/* 2B. Additional Value-Added Products & Services */}
            <div className="pt-5 border-t border-slate-100 space-y-4" id="additional-products-block">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    3. Additional Products & Value-Add Services
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bundle integrated security services, Voice Cloud, PABX systems &amp; telephone endpoints with your quote.
                  </p>
                </div>
                
                <div className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 rounded-lg text-xs font-bold font-mono shrink-0 self-start sm:self-auto">
                  Add-ons: +R {calculateAddonsMrc().toLocaleString()} / mo
                </div>
              </div>

              {/* 4 Product Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Category 1: Security Services */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Security Services
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">UTM / SOC / DDoS</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: "Next-Gen Enterprise Firewall (UTM)", price: 1800, desc: "AI Threat Prevention & SSL Inspection" },
                      { name: "Anti-DDoS Scrubbing & Mitigation", price: 950, desc: "24/7 Volumetric DDoS Scrubbing" },
                      { name: "Endpoint Threat Protection & EDR", price: 650, desc: "Antivirus & Endpoint Detection" },
                      { name: "Managed Cyber SOC & SIEM Logging", price: 2400, desc: "Live SOC Incident Monitoring" }
                    ].map((item) => {
                      const active = selectedAddons.security.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleAddon('security', item.name)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-start justify-between cursor-pointer ${
                            active 
                              ? "bg-white border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500" 
                              : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
                          }`}
                        >
                          <div className="pr-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${active ? "bg-teal-600 text-white" : "border border-slate-300 text-transparent"}`}>✓</span>
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">{item.desc}</p>
                          </div>
                          <span className="font-mono font-bold text-teal-700 text-[11px] shrink-0">+R {item.price}/mo</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 2: Voice Cloud */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <Phone className="w-4 h-4 text-sky-600" />
                      Voice Cloud (SIP & Voice)
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">SIP / Cloud Voice</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: "SIP Trunk & Voice Channels", price: 450, desc: "Unlimited Concurrent SIP Calls" },
                      { name: "Cloud PBX Voice License", price: 180, desc: "Hosted Seat License & Softphone" },
                      { name: "AI Auto-Attendant & Call Recording", price: 350, desc: "Smart IVR & Cloud Audio Storage" },
                      { name: "Toll-Free 0800 Virtual Routing", price: 250, desc: "National Toll-Free Line Hosting" }
                    ].map((item) => {
                      const active = selectedAddons.voiceCloud.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleAddon('voiceCloud', item.name)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-start justify-between cursor-pointer ${
                            active 
                              ? "bg-white border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500" 
                              : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
                          }`}
                        >
                          <div className="pr-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${active ? "bg-teal-600 text-white" : "border border-slate-300 text-transparent"}`}>✓</span>
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">{item.desc}</p>
                          </div>
                          <span className="font-mono font-bold text-sky-700 text-[11px] shrink-0">+R {item.price}/mo</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 3: PABX Systems */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      PABX Systems
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">On-Prem / Multi-Tenant</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: "Hybrid On-Premise PABX Server", price: 1200, desc: "Rackmount Appliance with PSTN Ports" },
                      { name: "Cloud Multi-Tenant PABX Engine", price: 850, desc: "High Availability Multi-Tenant Engine" },
                      { name: "Call Center Queue & IVR Engine", price: 1500, desc: "Real-time Wallboards & Queues" }
                    ].map((item) => {
                      const active = selectedAddons.pabx.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleAddon('pabx', item.name)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-start justify-between cursor-pointer ${
                            active 
                              ? "bg-white border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500" 
                              : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
                          }`}
                        >
                          <div className="pr-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${active ? "bg-teal-600 text-white" : "border border-slate-300 text-transparent"}`}>✓</span>
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">{item.desc}</p>
                          </div>
                          <span className="font-mono font-bold text-indigo-700 text-[11px] shrink-0">+R {item.price}/mo</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 4: Telephones & Endpoints */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <Phone className="w-4 h-4 text-purple-600" />
                      Telephones &amp; Endpoints
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">IP Phones / DECT</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: "Executive HD Touchscreen IP Phone", price: 320, desc: "7-inch Color Touchscreen Gigabit IP Phone" },
                      { name: "Standard IP Office Desk Phone", price: 150, desc: "PoE Dual-Port Executive Desk Phone" },
                      { name: "Cordless Long-Range DECT Handset", price: 180, desc: "Ruggedized Wireless Handset" },
                      { name: "Conference Room 360° Speakerphone", price: 550, desc: "Smart Microphone Array Unit" }
                    ].map((item) => {
                      const active = selectedAddons.telephones.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => toggleAddon('telephones', item.name)}
                          className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-start justify-between cursor-pointer ${
                            active 
                              ? "bg-white border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500" 
                              : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white"
                          }`}
                        >
                          <div className="pr-2">
                            <div className="font-bold flex items-center gap-1.5">
                              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${active ? "bg-teal-600 text-white" : "border border-slate-300 text-transparent"}`}>✓</span>
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">{item.desc}</p>
                          </div>
                          <span className="font-mono font-bold text-purple-700 text-[11px] shrink-0">+R {item.price}/mo</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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

          {activeQuote && !isReplacingQuote ? (
            /* Current active quote display with Download & Upload Options */
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

              {/* Quotation Action Buttons: Download & Upload Replacement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadQuote(activeQuote)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-3 rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Quote
                </button>
                <button
                  onClick={() => setIsReplacingQuote(true)}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-600" />
                  Upload New Quote
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Quote is active. Download the official text/PDF format above or upload an updated vendor document.
                </span>
              </div>
            </div>
          ) : tempQuoteDetails ? (
            /* Temporary quote waiting for confirmation with Download Preview */
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl space-y-3">
                <div className="pb-2 border-b border-teal-200 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-teal-800 uppercase">Review Parsed Details</h4>
                    <p className="text-[10px] text-teal-600 mt-0.5">Parsed via Gemini Intelligence</p>
                  </div>
                  <button
                    onClick={() => handleDownloadQuote(tempQuoteDetails)}
                    className="p-1.5 bg-white hover:bg-teal-100 text-teal-700 border border-teal-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Download Quote Draft"
                  >
                    <Download className="w-3 h-3" />
                    Preview TXT
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-400">Bandwidth:</span> <span className="font-bold">{tempQuoteDetails.bandwidth}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">NRC Setup:</span> <span className="font-bold">R {tempQuoteDetails.nrc?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">MRC Monthly:</span> <span className="font-bold">R {tempQuoteDetails.mrc?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Term:</span> <span className="font-bold">{tempQuoteDetails.termMonths} Months</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Operator:</span> <span className="font-bold">{tempQuoteDetails.networkOperator}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Contention:</span> <span className="font-bold">{tempQuoteDetails.contention}</span></div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-teal-200">
                  <button
                    onClick={() => {
                      setTempQuoteDetails(null);
                      setIsReplacingQuote(false);
                    }}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    onClick={() => {
                      handleSaveQuote();
                      setIsReplacingQuote(false);
                    }}
                    className="flex-1 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 cursor-pointer shadow-xs"
                  >
                    Confirm & Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload / Parse Quotation Input Form */
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {isReplacingQuote && (
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg mb-2">
                    <span className="text-xs text-slate-600 font-semibold">Uploading new quote version</span>
                    <button
                      onClick={() => setIsReplacingQuote(false)}
                      className="text-[10px] text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      Cancel & Keep Existing
                    </button>
                  </div>
                )}

                {/* Upload Mode Switcher */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === "file"
                        ? "bg-white text-teal-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("text")}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      uploadMode === "text"
                        ? "bg-white text-teal-700 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Paste Raw Text
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  className="hidden"
                />

                {uploadMode === "file" ? (
                  /* Drag & Drop File Box */
                  <div className="space-y-3">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isDragging
                          ? "border-teal-500 bg-teal-50"
                          : uploadedFile
                          ? "border-emerald-300 bg-emerald-50/40"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300"
                      }`}
                    >
                      {uploadedFile ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{uploadedFile.name}</p>
                            <p className="text-[10px] text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB • Click or drop to replace</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">Click to select or drag quote file</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, TXT, or CSV vendor quotes</p>
                          </div>
                        </>
                      )}
                    </div>

                    {uploadedFile && (
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-600 font-medium">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Paperclip className="w-3 h-3 text-teal-600" />
                            Extracted File Content
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                              setRawQuoteText("");
                            }}
                            className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-3 font-mono bg-white p-1.5 rounded border border-slate-150">
                          {rawQuoteText}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Raw Text Textarea */
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Paste Raw Quote Text</label>
                    <textarea
                      value={rawQuoteText}
                      onChange={(e) => setRawQuoteText(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-mono"
                      placeholder="e.g., Quote Ref: FC-22920. Fiber connection for Sandton Office. Speed: 500Mbps Sync. MRC: R12500 per month on 24 month term. Install fee: R8000 non-recurring. Valid for 30 days."
                    />
                  </div>
                )}
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

      {/* Step 4: Request for Occupancy (RFO) Electronic Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100/80">
              <Building className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-slate-800">
                Phase 2: Request for Occupancy (RFO) Electronic Form
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                An occupancy document is prefilled with GPS coordinates from our study. Users can view, enter, and edit all required landlord and onsite technical details prior to submission.
              </p>
            </div>
          </div>
          {activeOcc && !isEditingRfo && (
            <button
              type="button"
              onClick={() => setIsEditingRfo(true)}
              className="self-start sm:self-auto bg-slate-50 hover:bg-slate-100 text-teal-700 border border-slate-200 hover:border-teal-300 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit / Add Information
            </button>
          )}
        </div>

        {activeOcc && !isEditingRfo ? (
          /* Submitted RFO Summary View with easy Edit toggle */
          <div className="p-5 bg-emerald-50/40 border border-emerald-200/80 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">RFO DOCUMENT SUBMITTED</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-3 py-0.5 rounded-full border border-emerald-200">
                Submitted
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-700">
              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Building & Site Location</p>
                <p className="font-bold text-slate-800 text-sm">{activeOcc.buildingName}</p>
                <p className="text-slate-500 text-xs">{activeOcc.address}</p>
                <div className="pt-1.5 flex items-center gap-1 text-[11px] font-mono text-emerald-700">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>GPS Status: <strong className="text-emerald-800">{activeOcc.gpsValidated ? "Validated Match ✓" : "Manual Match"}</strong></span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onsite Technical Contact</p>
                <p className="font-bold text-slate-800 text-sm">{activeOcc.onsiteContactName}</p>
                <p className="text-slate-600 text-xs flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" /> <span className="font-mono">{activeOcc.onsiteContactPhone}</span>
                </p>
                {activeOcc.onsiteContactEmail && (
                  <p className="text-slate-600 text-xs flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" /> {activeOcc.onsiteContactEmail}
                  </p>
                )}
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Landlord / Property Entity</p>
                <p className="font-bold text-slate-800 text-sm">{activeOcc.landlordName}</p>
                <p className="text-slate-600 text-xs flex items-center gap-1.5 pt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" /> {activeOcc.landlordEmail}
                </p>
                {activeOcc.landlordPhone && (
                  <p className="text-slate-600 text-xs flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" /> <span className="font-mono">{activeOcc.landlordPhone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 text-xs text-slate-500">
              <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official RFO record attached to Phase 2 Feasibility study.
              </span>
              <button
                type="button"
                onClick={() => setIsEditingRfo(true)}
                className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Fields & Update
              </button>
            </div>
          </div>
        ) : (
          /* Editable RFO Form */
          <form onSubmit={handleSubmitOccupancy} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200/80">
              <p className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Prefilled Study Data:</p>
              <div className="flex flex-wrap gap-4 text-slate-700">
                <p>GPS Coordinates: <span className="font-mono font-bold text-slate-800">{gps}</span></p>
                <p>Physical Address: <span className="font-bold text-slate-800">{address || activeLead?.address}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Building / Campus Name *</label>
                <input
                  type="text"
                  required
                  value={occupancyForm.buildingName}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, buildingName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  placeholder="e.g. Alpha Bank Sandton Campus / Rivonia Heights Block C"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Landlord / Property Entity *</label>
                <input
                  type="text"
                  required
                  value={occupancyForm.landlordName}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, landlordName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  placeholder="e.g. Redefine Properties / Growthpoint"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Onsite Tech Contact *</label>
                <input
                  type="text"
                  required
                  value={occupancyForm.onsiteContactName}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, onsiteContactName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  placeholder="e.g. Lebo Nkosi"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Onsite Phone *</label>
                <input
                  type="text"
                  required
                  value={occupancyForm.onsiteContactPhone}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, onsiteContactPhone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white font-mono"
                  placeholder="+27 82 455 1200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Onsite Contact Email</label>
                <input
                  type="email"
                  value={occupancyForm.onsiteContactEmail}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, onsiteContactEmail: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  placeholder="onsite@company.co.za"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Landlord Email *</label>
                <input
                  type="email"
                  required
                  value={occupancyForm.landlordEmail}
                  onChange={(e) => setOccupancyForm(prev => ({ ...prev, landlordEmail: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  placeholder="info@redefine.co.za"
                />
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleValidateRfoGps}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    rfoValidationStatus === "validated" 
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {rfoValidationStatus === "checking" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Verifying...
                    </>
                  ) : rfoValidationStatus === "validated" ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GPS Match Validated ✓
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-teal-600" /> Validate GPS Match
                    </>
                  )}
                </button>

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={occupancyForm.termsAgreed}
                    onChange={(e) => setOccupancyForm(prev => ({ ...prev, termsAgreed: e.target.checked }))}
                    className="accent-teal-600 w-3.5 h-3.5 rounded"
                  />
                  <span className="text-[11px] text-slate-600">I confirm site occupancy and landlord details accuracy</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                {activeOcc && (
                  <button
                    type="button"
                    onClick={() => setIsEditingRfo(false)}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {activeOcc ? "Update & Resubmit RFO Form" : "Submit RFO Electronic Form"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
