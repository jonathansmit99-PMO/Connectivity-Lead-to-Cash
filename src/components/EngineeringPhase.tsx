import React, { useState } from "react";
import { Lead, ProjectCase, Quotation } from "../types";
import { 
  Server, 
  MapPin, 
  Phone, 
  Cpu, 
  Activity, 
  Wifi, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  PenTool, 
  Globe, 
  Database, 
  Sliders, 
  FileCheck, 
  Send,
  Loader2,
  AlertCircle
} from "lucide-react";

interface EngineeringPhaseProps {
  leads: Lead[];
  cases: ProjectCase[];
  setCases: React.Dispatch<React.SetStateAction<ProjectCase[]>>;
  quotations: Quotation[];
  activePersona: string;
  selectedLeadId: string;
}

export default function EngineeringPhase({
  leads,
  cases,
  setCases,
  quotations,
  activePersona,
  selectedLeadId
}: EngineeringPhaseProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id);
  const activeQuote = quotations.find(q => q.leadId === activeLead?.id);

  // Field engineer local booking form states (preloaded with quotation details where applicable)
  const [address, setAddress] = useState(activeCase?.bookingAddress || activeQuote?.address || "");
  const [gps, setGps] = useState(activeCase?.bookingGps || activeQuote?.gpsCoordinates || "");
  const [contactName, setContactName] = useState(activeCase?.bookingContactName || activeLead?.primaryBillingContact.name || "");
  const [contactPhone, setContactPhone] = useState(activeCase?.bookingContactPhone || activeLead?.phone || "");
  const [contactEmail, setContactEmail] = useState(activeCase?.bookingContactEmail || activeLead?.email || "");
  const [dateTime, setDateTime] = useState(activeCase?.bookingDateTime || "2026-07-10T09:00");
  const [selectedEquipment, setSelectedEquipment] = useState(activeCase?.bookingEquipment || "Reunert Enterprise Core RT-500");

  const [isBookingSaved, setIsBookingSaved] = useState(!!activeCase?.bookingAddress);

  // Field Service Engineer Action states
  const [arrivalTime, setArrivalTime] = useState(activeCase?.fieldArrivedAt || "");
  const [doneTime, setDoneTime] = useState(activeCase?.fieldDoneAt || "");
  const [isLinkUp, setIsLinkUp] = useState(activeCase?.fieldLinkUp || false);
  const [isGettingSpeed, setIsGettingSpeed] = useState(activeCase?.fieldClientGettingSpeed || false);
  const [speedMetric, setSpeedMetric] = useState(activeCase?.fieldClientSpeedMetric || activeQuote?.bandwidth || "500 Mbps");
  const [voiceService, setVoiceService] = useState(activeCase?.fieldVoiceActive || false);
  const [cloudService, setCloudService] = useState(activeCase?.fieldCloudActive || false);
  const [securityService, setSecurityService] = useState(activeCase?.fieldSecurityActive || false);
  
  // Client sign-off states
  const [signName, setSignName] = useState(activeCase?.fieldClientSignName || "");
  const [isFieldSigned, setIsFieldSigned] = useState(activeCase?.fieldClientSignedOff || false);

  // Remote Network Engineer States
  const [dataCentreVlan, setDataCentreVlan] = useState(activeCase?.remoteVlanId || 1042);
  const [routerIp, setRouterIp] = useState(activeCase?.remoteIpAddress || "196.15.52.129");
  const [subnetAllocation, setSubnetAllocation] = useState<"/30" | "/29" | "/31">(activeCase?.remoteSubnetAllocation || "/29");
  const [bandwidthSelection, setBandwidthSelection] = useState(activeCase?.remoteBandwidth || activeQuote?.bandwidth || "500 Mbps");
  const [isVoiceConfigured, setIsVoiceConfigured] = useState(activeCase?.remoteVoiceConfigured || false);
  const [additionalVlans, setAdditionalVlans] = useState(activeCase?.remoteAdditionalVlans || "");
  const [ipSecTunnels, setIpSecTunnels] = useState(activeCase?.remoteIpSecTunnels || "");

  const [testingConnectivity, setTestingConnectivity] = useState(false);
  const [testResultLogs, setTestResultLogs] = useState<string[]>(activeCase?.remoteConnectivityLog ? [activeCase.remoteConnectivityLog] : []);
  const [isConnectionVerified, setIsConnectionVerified] = useState(activeCase?.remoteConnectivityTested || false);

  const handleQuickLaunchCase = () => {
    const newCase: ProjectCase = {
      id: `case-${Date.now().toString().slice(-3)}`,
      leadId: activeLead.id,
      quotationId: activeQuote?.id || "quote-001",
      status: "case_created",
      routerInstalled: false,
      finalTestingPassed: false,
      clientSignedOff: false,
      slaTerms: activeQuote?.networkType === "Fiber" 
        ? "99.5% Premium Fiber SLA, 4-hour Mean Time To Resolve (MTTR)" 
        : "99.0% High-Availability Wireless SLA, 8-hour MTTR"
    };
    setCases(prev => [newCase, ...prev.filter(c => c.leadId !== activeLead.id)]);
  };

  if (!activeCase) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs" id="phase5-no-case">
        <Server className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-sans font-bold text-xl text-slate-800">Project Case Not Yet Triggered</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
          Once the fiber delivery (Phase 4) has finished uploading handover credentials, the field and remote core configurations will activate.
        </p>
        <div className="mb-6">
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl font-bold font-mono">
            Awaiting step: "Phase 4: Connectivity Delivery" Handover Document.
          </span>
        </div>
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 font-medium">Sandbox Bypass / Demo Mode:</p>
          <button
            onClick={handleQuickLaunchCase}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Activity className="w-4 h-4" /> Initialize Phase 5 Engineering Case for {activeLead?.companyName}
          </button>
        </div>
      </div>
    );
  }

  // Update cases in state and localStorage
  const updateCase = (fields: Partial<ProjectCase>) => {
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return { ...c, ...fields };
      }
      return c;
    }));
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    updateCase({
      bookingAddress: address,
      bookingGps: gps,
      bookingContactName: contactName,
      bookingContactPhone: contactPhone,
      bookingContactEmail: contactEmail,
      bookingDateTime: dateTime,
      bookingEquipment: selectedEquipment
    });
    setIsBookingSaved(true);
  };

  const handleRecordArrival = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setArrivalTime(timestamp);
    updateCase({ fieldArrivedAt: timestamp });
  };

  const handleRecordDone = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setDoneTime(timestamp);
    updateCase({ fieldDoneAt: timestamp });
  };

  const handleFieldSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signName) return;
    updateCase({
      fieldClientSignedOff: true,
      fieldClientSignName: signName,
      fieldClientSignDate: new Date().toLocaleDateString(),
      // Sync field changes
      fieldLinkUp: isLinkUp,
      fieldClientGettingSpeed: isGettingSpeed,
      fieldClientSpeedMetric: speedMetric,
      fieldVoiceActive: voiceService,
      fieldCloudActive: cloudService,
      fieldSecurityActive: securityService
    });
    setIsFieldSigned(true);
  };

  const handleTestConnectivity = () => {
    setTestingConnectivity(true);
    setTestResultLogs([]);
    
    setTimeout(() => {
      setTestResultLogs(prev => [
        ...prev,
        `PING ${routerIp} (${routerIp}) 56(84) bytes of data.`,
      ]);
    }, 400);

    setTimeout(() => {
      setTestResultLogs(prev => [
        ...prev,
        `64 bytes from ${routerIp}: icmp_seq=1 ttl=64 time=4.12 ms`,
        `64 bytes from ${routerIp}: icmp_seq=2 ttl=64 time=3.85 ms`,
      ]);
    }, 1000);

    setTimeout(() => {
      const summaryLog = `--- ${routerIp} ping statistics --- \n2 packets transmitted, 2 received, 0% packet loss, time 1002ms \nrtt min/avg/max/mdev = 3.85/3.98/4.12/0.13 ms\nCONNECTION VERIFIED SUCCESSFUL`;
      setTestResultLogs(prev => [...prev, summaryLog]);
      setIsConnectionVerified(true);
      setTestingConnectivity(false);
      
      updateCase({
        remoteConnectivityTested: true,
        remoteConnectivityLog: "Ping statistics: 0% packet loss, RTT avg 3.98ms. Connectivity Active.",
        remoteVlanId: dataCentreVlan,
        remoteIpAddress: routerIp,
        remoteSubnetAllocation: subnetAllocation,
        remoteBandwidth: bandwidthSelection,
        remoteVoiceConfigured: isVoiceConfigured,
        remoteAdditionalVlans: additionalVlans,
        remoteIpSecTunnels: ipSecTunnels,
        status: "live" // Set status to LIVE when remote engineering is completed and tested
      });
    }, 1800);
  };

  return (
    <div className="space-y-8" id="phase5-root">
      
      {/* Upper context overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                Dual Workspace
              </span>
              <h2 className="font-sans font-bold text-lg">Phase 5: Collaborative Field & Remote Engineering</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Field Engineers deploy physical routers onsite while Remote Engineers configure core data centre routing. Both must complete their tasks in this phase to trigger full live commissioning.
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl px-4 py-2 border border-slate-700 text-center shrink-0">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Active Equipment</span>
            <p className="text-xs font-mono font-bold text-teal-300 mt-0.5">{selectedEquipment}</p>
          </div>
        </div>
      </div>

      {/* Booking and Dispatch Setup (Shared entry) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="service-booking-section">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-teal-600" />
          <h3 className="font-sans font-bold text-slate-800 text-sm">1. Field Engineer Service Dispatch Booking</h3>
        </div>

        {isBookingSaved ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-700">✓ Field Technician Scheduled & Confirmed</span>
              <button 
                onClick={() => setIsBookingSaved(false)}
                className="text-[10px] text-teal-700 hover:text-teal-900 font-bold hover:underline"
              >
                Modify Booking
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200/50">
              <div>
                <span className="text-slate-400 font-semibold">Install Address:</span>
                <p className="font-bold text-slate-800 mt-0.5">{address}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">GPS Coordinates:</span>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{gps}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Contact Info:</span>
                <p className="font-bold text-slate-800 mt-0.5">{contactName} ({contactPhone})</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Schedule Date/Time:</span>
                <p className="font-bold text-slate-800 mt-0.5">{new Date(dateTime).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveBooking} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Site Physical Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 150 Rivonia Road, Sandton"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">GPS Coordinates *</label>
              <input
                type="text"
                required
                value={gps}
                onChange={(e) => setGps(e.target.value)}
                placeholder="e.g. -26.1014, 28.0572"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Site Contact Person *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Contact Phone Number *</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Contact Email Address *</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Dispatch Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Select Collected Equipment / Router *</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Reunert Enterprise Core RT-500">Reunert Enterprise Core RT-500 (Dual Wan SFP+)</option>
                <option value="Cisco Catalyst 9300 Edge">Cisco Catalyst 9300 Edge Router (Multi-Gig)</option>
                <option value="Huawei NetEngine AR6120">Huawei NetEngine AR6120 Enterprise Gateway</option>
                <option value="MikroTik CCR2004 Core">MikroTik CCR2004 Core Router (Ultra Latency)</option>
              </select>
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Confirm Dispatch Schedule & Allocate Router
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Split Dual Workspaces: Left = Onsite Field Engineer, Right = Remote Core Engineer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="split-engineering-workspace">
        
        {/* LEFT COLUMN: FIELD ENGINEER WORKSPACE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6" id="field-engineer-column">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-black">ONSITE</span>
              <h3 className="font-sans font-bold text-slate-800 text-sm">Field Service Engineer Portal</h3>
            </div>
            <Wifi className="w-4 h-4 text-slate-400 animate-pulse" />
          </div>

          {!isBookingSaved ? (
            <p className="text-xs text-slate-400 italic">Please schedule the Service Dispatch booking first to initialize the Field Engineer portal.</p>
          ) : (
            <div className="space-y-6">
              
              {/* Timestamp arrive */}
              <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Technician Arrival Logging
                  </span>
                  {arrivalTime && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded">
                      Arrived: {arrivalTime}
                    </span>
                  )}
                </div>
                {!arrivalTime ? (
                  <button
                    type="button"
                    onClick={handleRecordArrival}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-xl transition-all"
                  >
                    Log Arrival Timestamp
                  </button>
                ) : (
                  <p className="text-[11px] text-slate-500 font-medium">Engineer arrived onsite. Physical rack mounts and power cables secured.</p>
                )}
              </div>

              {/* Physical Checklists */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Physical Line Test Checklist</h4>
                
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isLinkUp}
                      onChange={(e) => setIsLinkUp(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-bold text-slate-700">Is physical link up?</span>
                      <p className="text-[10px] text-slate-400">Verifying link lights are active on the primary fiber SFP+ port.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isGettingSpeed}
                      onChange={(e) => setIsGettingSpeed(e.target.checked)}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="font-bold text-slate-700">Is client getting contracted speed?</span>
                      <p className="text-[10px] text-slate-400">Run a speed check to confirm the full bandwidth allocation is active.</p>
                    </div>
                  </label>
                </div>

                {isGettingSpeed && (
                  <div className="space-y-1.5 pl-2.5 border-l-2 border-teal-500">
                    <label className="block text-[10px] font-bold text-slate-500">Measured Download Speed Speed (e.g. 500 Mbps) *</label>
                    <input
                      type="text"
                      value={speedMetric}
                      onChange={(e) => setSpeedMetric(e.target.value)}
                      className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Services Checked */}
              <div className="space-y-3.5">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service Verification Vetting</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={voiceService}
                      onChange={(e) => setVoiceService(e.target.checked)}
                      className="text-teal-600"
                    />
                    <span>Voice SIP / VoIP</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={cloudService}
                      onChange={(e) => setCloudService(e.target.checked)}
                      className="text-teal-600"
                    />
                    <span>Cloud Direct</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={securityService}
                      onChange={(e) => setSecurityService(e.target.checked)}
                      className="text-teal-600"
                    />
                    <span>Security/Firewall</span>
                  </label>
                </div>
              </div>

              {/* Completion Timestamp */}
              <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Task Completion Logs
                  </span>
                  {doneTime && (
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded">
                      Done At: {doneTime}
                    </span>
                  )}
                </div>
                {!doneTime ? (
                  <button
                    type="button"
                    onClick={handleRecordDone}
                    disabled={!arrivalTime}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-xl transition-all disabled:opacity-50"
                  >
                    Set Completion Timestamp
                  </button>
                ) : (
                  <p className="text-[11px] text-slate-500 font-medium">Engineering physical link-up and speed configuration completed.</p>
                )}
              </div>

              {/* Client Signoff */}
              <div className="p-4 border border-slate-150 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-slate-700">Digital Client Service Sign-off</h4>
                </div>

                {isFieldSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium">
                    ✓ Confirmed & signed off by client <strong>{activeCase.fieldClientSignName}</strong> on {activeCase.fieldClientSignDate || new Date().toLocaleDateString()}.
                    <p className="text-[10px] text-emerald-600 mt-1">"I hereby verify that all ordered services are fully functional, speeds are tested and validated within contracted scope."</p>
                  </div>
                ) : (
                  <form onSubmit={handleFieldSignOff} className="space-y-3">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Please collect the digital sign-off from the client representative confirming that speeds, voice services, and latency measurements align with SLA targets.
                    </p>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500">Representative Authorized Name *</label>
                      <input
                        type="text"
                        required
                        value={signName}
                        onChange={(e) => setSignName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!doneTime || !signName}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl transition-all disabled:opacity-50"
                    >
                      Authenticate Digital Sign-off
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REMOTE CORE ENGINEER WORKSPACE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6" id="remote-engineer-column">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-black">REMOTE CORE</span>
              <h3 className="font-sans font-bold text-slate-800 text-sm">Remote Network Engineering</h3>
            </div>
            <Globe className="w-4 h-4 text-teal-600 animate-spin" />
          </div>

          <div className="space-y-4">
            
            {/* Core configuration inputs */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subnet, VLAN & IP Core Allocation</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Core Data Centre VLAN ID *</label>
                  <input
                    type="number"
                    value={dataCentreVlan}
                    onChange={(e) => setDataCentreVlan(parseInt(e.target.value) || 1042)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Allocated Gateway IP Address *</label>
                  <input
                    type="text"
                    value={routerIp}
                    onChange={(e) => setRouterIp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">IP Address Subnet Allocation *</label>
                  <div className="flex gap-2">
                    {["/30", "/29", "/31"].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSubnetAllocation(sub as any)}
                        className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold border transition-all ${
                          subnetAllocation === sub 
                            ? "bg-teal-50 border-teal-300 text-teal-800" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Contracted Bandwidth *</label>
                  <select
                    value={bandwidthSelection}
                    onChange={(e) => setBandwidthSelection(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  >
                    <option value="10 Mbps">10 Mbps</option>
                    <option value="50 Mbps">50 Mbps</option>
                    <option value="100 Mbps">100 Mbps</option>
                    <option value="200 Mbps">200 Mbps</option>
                    <option value="500 Mbps">500 Mbps</option>
                    <option value="1 Gbps">1 Gbps (Core Fibre)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Configure Additional IP Core Services</h4>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-150 hover:bg-slate-50 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isVoiceConfigured}
                    onChange={(e) => setIsVoiceConfigured(e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700">Add SIP / VoIP Integration</span>
                    <p className="text-[9px] text-slate-400">Routes voice packets through isolated class-of-service SLA queue.</p>
                  </div>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">Additional VLAN IDs (Comma separated)</label>
                    <input
                      type="text"
                      value={additionalVlans}
                      onChange={(e) => setAdditionalVlans(e.target.value)}
                      placeholder="e.g. 101, 102, 105"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500">IP Sec VPN Tunnel Peer IP</label>
                    <input
                      type="text"
                      value={ipSecTunnels}
                      onChange={(e) => setIpSecTunnels(e.target.value)}
                      placeholder="e.g. 196.22.42.100"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Test Core Connectivity */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Core Network Pinging & Connectivity Test</span>
                {isConnectionVerified && (
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ✓ Connectivity Up
                  </span>
                )}
              </div>

              {testResultLogs.length > 0 && (
                <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[10px] whitespace-pre-wrap leading-relaxed h-32 overflow-y-auto">
                  {testResultLogs.map((log, i) => (
                    <div key={i} className={log.includes("VERIFIED") ? "text-emerald-400 font-black mt-1" : ""}>
                      {log}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={handleTestConnectivity}
                disabled={testingConnectivity || !routerIp}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {testingConnectivity ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    Executing ICMP ping check to allocated {routerIp}{subnetAllocation}...
                  </>
                ) : (
                  <>
                    <Sliders className="w-4 h-4 text-slate-400" />
                    Allocate IP address & Test core network link
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Dual signoff complete banner */}
      {isFieldSigned && isConnectionVerified && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-sans font-bold text-base">Engineering Execution Completed Successfully!</h3>
              <p className="text-xs text-teal-100 leading-relaxed mt-0.5">
                Onsite field router deployment is authenticated with client digital sign-offs, and remote data-centre subnetting and VLAN configurations have verified loopback connectivity (0% packet loss).
              </p>
              <div className="mt-3 bg-white/10 p-3 rounded-xl border border-white/10 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-white font-mono">
                <div>Field Router Installed: <strong>{selectedEquipment}</strong></div>
                <div>Configured Subnet: <strong>{routerIp}{subnetAllocation}</strong></div>
                <div>Allocated Bandwidth: <strong>{bandwidthSelection}</strong></div>
                <div>VLAN Tags: <strong>VLAN {dataCentreVlan} {additionalVlans ? `, ${additionalVlans}` : ""}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
