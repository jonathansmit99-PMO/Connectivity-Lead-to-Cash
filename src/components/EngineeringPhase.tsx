import React, { useState, useEffect } from "react";
import { Lead, ProjectCase, Quotation } from "../types";
import { 
  Server, 
  MapPin, 
  Phone, 
  PhoneCall,
  PhoneOff,
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
  AlertCircle,
  Truck,
  PackageCheck,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  Play,
  Timer,
  Sparkles,
  RefreshCw,
  Radio,
  UserCheck
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

  // Project Manager - Router Configuration Engineer Booking states
  const [pmEngineerName, setPmEngineerName] = useState(activeCase?.pmRouterEngineerName || "Sipho Dlamini - Lead Core Network Specialist");
  const [pmEngineerRole, setPmEngineerRole] = useState(activeCase?.pmRouterEngineerRole || "Core WAN & BGP SFP Router Specialist");
  const [pmEngineerDate, setPmEngineerDate] = useState(activeCase?.pmRouterEngineerDate || "2026-07-09T14:00");
  const [pmEngineerNotes, setPmEngineerNotes] = useState(activeCase?.pmRouterEngineerNotes || "Pre-configure Dual SFP+ WAN redundancy, static IP allocations, and QoS voice prior to field dispatch.");
  const [isPmEngineerBooked, setIsPmEngineerBooked] = useState(!!activeCase?.pmRouterEngineerBooked);

  // Field Service Engineer Portal - Detailed Time Tracking States
  const [equipmentCollectedAt, setEquipmentCollectedAt] = useState(activeCase?.fieldEquipmentCollectedAt || "");
  const [travelStartedAt, setTravelStartedAt] = useState(activeCase?.fieldTravelStartedAt || "");
  const [travelArrivedAt, setTravelArrivedAt] = useState(activeCase?.fieldTravelArrivedAt || activeCase?.fieldArrivedAt || "");
  const [travelMins, setTravelMins] = useState<number | undefined>(activeCase?.fieldTravelDurationMins || (activeCase?.fieldArrivedAt ? 35 : undefined));
  
  const [activationStartedAt, setActivationStartedAt] = useState(activeCase?.fieldActivationStartedAt || "");
  const [activationCompletedAt, setActivationCompletedAt] = useState(activeCase?.fieldActivationCompletedAt || activeCase?.fieldDoneAt || "");
  const [activationMins, setActivationMins] = useState<number | undefined>(activeCase?.fieldActivationDurationMins || (activeCase?.fieldDoneAt ? 42 : undefined));

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

  // Field <-> Remote Communication Hub States (Chat & Voice Call)
  const [commTab, setCommTab] = useState<"chat" | "call">("chat");
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'field' | 'remote'; text: string; timestamp: string }>>(
    activeCase?.fieldChatMessages || [
      {
        id: "m1",
        sender: "remote",
        text: `Hello Field Engineer! Sipho here from NOC Remote Eng. I have pre-allocated VLAN ${activeCase?.remoteVlanId || 1042} for ${activeLead?.companyName}. Please log equipment collection and notify me when you arrive onsite.`,
        timestamp: "08:10 AM"
      }
    ]
  );
  const [chatInput, setChatInput] = useState("");
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);

  // Voice Call States
  const [isCallActive, setIsCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [transcripts, setTranscripts] = useState<Array<{ speaker: string; text: string; time: string }>>([
    { speaker: "NOC Remote Eng (Sipho)", text: "Radio voice bridge active on NOC SIP Channel #402.", time: "00:02" },
    { speaker: "Field Technician", text: "Connected SFP+ transceiver to primary fiber patch. Light levels look stable.", time: "00:15" },
    { speaker: "NOC Remote Eng (Sipho)", text: "Pinging core gateway interface now. Subnet route /29 bound.", time: "00:28" }
  ]);

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

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

  const handleSavePmEngineerBooking = (e: React.FormEvent) => {
    e.preventDefault();
    updateCase({
      pmRouterEngineerBooked: true,
      pmRouterEngineerName: pmEngineerName,
      pmRouterEngineerRole: pmEngineerRole,
      pmRouterEngineerDate: pmEngineerDate,
      pmRouterEngineerNotes: pmEngineerNotes
    });
    setIsPmEngineerBooked(true);
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

  const handleLogEquipmentCollection = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setEquipmentCollectedAt(timestamp);
    updateCase({ fieldEquipmentCollectedAt: timestamp });
  };

  const handleStartTravel = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTravelStartedAt(timestamp);
    updateCase({ fieldTravelStartedAt: timestamp });
  };

  const handleArriveSite = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setTravelArrivedAt(timestamp);
    setArrivalTime(timestamp);
    const mins = 35;
    setTravelMins(mins);
    updateCase({ 
      fieldTravelArrivedAt: timestamp, 
      fieldArrivedAt: timestamp,
      fieldTravelDurationMins: mins 
    });
  };

  const handleStartActivation = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActivationStartedAt(timestamp);
    updateCase({ fieldActivationStartedAt: timestamp });
  };

  const handleCompleteActivation = () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setActivationCompletedAt(timestamp);
    setDoneTime(timestamp);
    const mins = 42;
    setActivationMins(mins);
    updateCase({ 
      fieldActivationCompletedAt: timestamp, 
      fieldDoneAt: timestamp,
      fieldActivationDurationMins: mins 
    });
  };

  const handleSendChatMessage = (presetText?: string) => {
    const text = presetText || chatInput;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "field" as const,
      text: text.trim(),
      timestamp: timeStr
    };

    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    if (!presetText) setChatInput("");
    setIsRemoteTyping(true);

    setTimeout(() => {
      let replyText = `NOC Eng (Sipho): Acknowledged. Core router parameters updated. VLAN ${dataCentreVlan} reporting 0% packet loss.`;
      const lower = text.toLowerCase();
      if (lower.includes("light") || lower.includes("optical") || lower.includes("power")) {
        replyText = `NOC Eng (Sipho): Optical RX power verified at -18.4 dBm (Optimal). Primary SFP transceiver link state: UP!`;
      } else if (lower.includes("bgp") || lower.includes("ping") || lower.includes("route")) {
        replyText = `NOC Eng (Sipho): BGP Neighbor 196.15.52.1 ESTABLISHED. Subnet route /29 bound successfully.`;
      } else if (lower.includes("speed") || lower.includes("bandwidth")) {
        replyText = `NOC Eng (Sipho): Unlocked line speed profile to full ${speedMetric}. Go ahead and complete speed test verification.`;
      } else if (lower.includes("firmware") || lower.includes("vlan") || lower.includes("config")) {
        replyText = `NOC Eng (Sipho): Config pushed! Router ${selectedEquipment} flashed with production firmware v5.12.`;
      }

      const remoteMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "remote" as const,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => {
        const finalMsgs = [...prev, remoteMsg];
        updateCase({ fieldChatMessages: finalMsgs });
        return finalMsgs;
      });
      setIsRemoteTyping(false);
    }, 1000);
  };

  const handleRecordArrival = () => {
    handleArriveSite();
  };

  const handleRecordDone = () => {
    handleCompleteActivation();
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

      {/* SECTION 1: Project Manager Router Configuration Engineer Booking */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="pm-router-booking-section">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
                1. Router Configuration Engineer Booking
                <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                  Project Manager Role
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The Project Manager books a lead engineer to pre-configure and flash customer premises router firmware &amp; routing protocols prior to field dispatch.
              </p>
            </div>
          </div>
          {isPmEngineerBooked && (
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Engineer Booked ✓
            </span>
          )}
        </div>

        {isPmEngineerBooked ? (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-indigo-950">
                <CheckCircle className="w-4 h-4 text-indigo-600" />
                Router Configuration Engineer Allocated
              </div>
              <button 
                onClick={() => setIsPmEngineerBooked(false)}
                className="text-[10px] text-indigo-700 hover:text-indigo-950 font-bold hover:underline cursor-pointer"
              >
                Modify Engineer Booking
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-indigo-100 text-[11px]">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Assigned Engineer:</span>
                <p className="font-bold text-indigo-950 mt-0.5">{pmEngineerName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Configuration Specialty:</span>
                <p className="font-bold text-slate-800 mt-0.5">{pmEngineerRole}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Scheduled Config Date:</span>
                <p className="font-bold text-slate-800 mt-0.5">{new Date(pmEngineerDate).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Target Equipment:</span>
                <p className="font-mono font-bold text-indigo-900 mt-0.5">{selectedEquipment}</p>
              </div>
            </div>

            {pmEngineerNotes && (
              <div className="pt-2 border-t border-indigo-100/60 text-[11px]">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Configuration Scope / Instructions:</span>
                <p className="text-slate-700 font-medium italic mt-0.5 bg-white/70 p-2 rounded border border-indigo-100">{pmEngineerNotes}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSavePmEngineerBooking} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Assigned Router Configuration Engineer *</label>
              <select
                value={pmEngineerName}
                onChange={(e) => setPmEngineerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Sipho Dlamini - Lead Core Network Specialist">Sipho Dlamini - Lead Core Network Specialist</option>
                <option value="Jonathan Vance - Senior Router Systems Engineer">Jonathan Vance - Senior Router Systems Engineer</option>
                <option value="Thabo Mokoena - Enterprise Hardware Specialist">Thabo Mokoena - Enterprise Hardware Specialist</option>
                <option value="Nandi Ndlovu - Tier 3 Technical Specialist">Nandi Ndlovu - Tier 3 Technical Specialist</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Configuration Specialty / Role *</label>
              <input
                type="text"
                required
                value={pmEngineerRole}
                onChange={(e) => setPmEngineerRole(e.target.value)}
                placeholder="e.g. Core WAN & BGP SFP Router Specialist"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Config Booking Date &amp; Time *</label>
              <input
                type="datetime-local"
                required
                value={pmEngineerDate}
                onChange={(e) => setPmEngineerDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Target Equipment to Pre-Configure *</label>
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Reunert Enterprise Core RT-500">Reunert Enterprise Core RT-500 (Dual Wan SFP+)</option>
                <option value="Cisco Catalyst 9300 Edge">Cisco Catalyst 9300 Edge Router (Multi-Gig)</option>
                <option value="Huawei NetEngine AR6120">Huawei NetEngine AR6120 Enterprise Gateway</option>
                <option value="MikroTik CCR2004 Core">MikroTik CCR2004 Core Router (Ultra Latency)</option>
              </select>
            </div>

            <div className="space-y-1.5 md:col-span-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Configuration Scope &amp; Special Instructions</label>
              <input
                type="text"
                value={pmEngineerNotes}
                onChange={(e) => setPmEngineerNotes(e.target.value)}
                placeholder="e.g. Flash latest firmware v5.12, static IP routing table, and QoS prioritization"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Confirm PM Booking: Allocate Router Configuration Engineer
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: Field Engineer Service Dispatch Booking */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4" id="service-booking-section">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-teal-600" />
          <h3 className="font-sans font-bold text-slate-800 text-sm">2. Field Engineer Service Dispatch Booking</h3>
        </div>

        {isBookingSaved ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-700">✓ Field Technician Scheduled &amp; Confirmed</span>
              <button 
                onClick={() => setIsBookingSaved(false)}
                className="text-[10px] text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Dispatch Date &amp; Time *</label>
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Confirm Dispatch Schedule &amp; Allocate Router
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Split Dual Workspaces: Left = Onsite Field Engineer, Right = Remote Core Engineer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="split-engineering-workspace">
             {/* LEFT COLUMN: FIELD ENGINEER WORKSPACE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6" id="field-engineer-column">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-black tracking-wider uppercase">
                ONSITE PORTAL
              </span>
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">Field Service Engineer Portal</h3>
                <p className="text-[10px] text-slate-400">Assigned Tech: <strong className="text-slate-700">{pmEngineerName.split(' - ')[0]}</strong> | Ticket #FE-{activeCase.id.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Field Active
            </div>
          </div>

          {!isBookingSaved ? (
            <p className="text-xs text-slate-400 italic">Please schedule the Service Dispatch booking first to initialize the Field Engineer portal.</p>
          ) : (
            <div className="space-y-6">

              {/* SECTION 1: Service Lifecycle SLA Time Tracker */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-4 shadow-md border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Service Dispatch Time Tracking</h4>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    SLA Tracker
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Step A: Equipment Collection */}
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-300 flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5" /> 1. Equipment
                      </span>
                      {equipmentCollectedAt && (
                        <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                          {equipmentCollectedAt}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">Collect router &amp; SFP transceivers from warehouse.</p>
                    {!equipmentCollectedAt ? (
                      <button
                        type="button"
                        onClick={handleLogEquipmentCollection}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Log Collection Time
                      </button>
                    ) : (
                      <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Equipment Secured
                      </div>
                    )}
                  </div>

                  {/* Step B: Travel to Site */}
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-sky-300 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" /> 2. Site Travel
                      </span>
                      {travelMins && (
                        <span className="text-[9px] font-mono font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">
                          {travelMins} mins
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      {travelStartedAt && <div>En route: <span className="text-slate-200 font-mono">{travelStartedAt}</span></div>}
                      {travelArrivedAt && <div>Arrived: <span className="text-slate-200 font-mono">{travelArrivedAt}</span></div>}
                    </div>

                    {!travelStartedAt ? (
                      <button
                        type="button"
                        onClick={handleStartTravel}
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Start Travel En Route
                      </button>
                    ) : !travelArrivedAt ? (
                      <button
                        type="button"
                        onClick={handleArriveSite}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Log Arrival Onsite
                      </button>
                    ) : (
                      <div className="text-[10px] text-sky-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Arrived Onsite ({travelMins}m travel)
                      </div>
                    )}
                  </div>

                  {/* Step C: Service Activation Duration */}
                  <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-teal-300 flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" /> 3. Activation
                      </span>
                      {activationMins && (
                        <span className="text-[9px] font-mono font-bold bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">
                          {activationMins} mins
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      {activationStartedAt && <div>Start: <span className="text-slate-200 font-mono">{activationStartedAt}</span></div>}
                      {activationCompletedAt && <div>Done: <span className="text-slate-200 font-mono">{activationCompletedAt}</span></div>}
                    </div>

                    {!activationStartedAt ? (
                      <button
                        type="button"
                        onClick={handleStartActivation}
                        disabled={!travelArrivedAt}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
                      >
                        Start Service Activation
                      </button>
                    ) : !activationCompletedAt ? (
                      <button
                        type="button"
                        onClick={handleCompleteActivation}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Complete Service Activation
                      </button>
                    ) : (
                      <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Activated ({activationMins}m duration)
                      </div>
                    )}
                  </div>

                </div>

                {/* KPI Summary Strip */}
                {(travelMins || activationMins) && (
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-3 text-center text-[10px] text-slate-300 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">TRAVEL TIME</span>
                      <strong className="text-sky-400">{travelMins || 0} mins</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">ACTIVATION DURATION</span>
                      <strong className="text-teal-400">{activationMins || 0} mins</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">TOTAL FIELD SLA TIME</span>
                      <strong className="text-amber-300">{(travelMins || 0) + (activationMins || 0)} mins</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Communication Hub with Remote NOC Engineer */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
                    <h4 className="text-xs font-bold text-slate-800">Remote Network Engineer Direct Bridge</h4>
                  </div>

                  <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setCommTab("chat")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${commTab === "chat" ? "bg-white text-indigo-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <MessageSquare className="w-3 h-3 inline mr-1" />
                      Live Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommTab("call")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${commTab === "call" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                    >
                      <PhoneCall className="w-3 h-3 inline mr-1" />
                      Voice Call {isCallActive && `(${Math.floor(callTimer / 60)}:${(callTimer % 60).toString().padStart(2, '0')})`}
                    </button>
                  </div>
                </div>

                {commTab === "chat" ? (
                  /* LIVE CHAT INTERFACE */
                  <div className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-3 h-48 overflow-y-auto space-y-2.5 text-xs">
                      {chatMessages.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === "field" ? "items-end" : "items-start"}`}
                        >
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5">
                            <span className="font-bold text-slate-600">{msg.sender === "field" ? "Field Technician (Onsite)" : "Remote NOC Eng (Sipho)"}</span>
                            <span>• {msg.timestamp}</span>
                          </div>
                          <div 
                            className={`max-w-[85%] p-2.5 rounded-xl text-[11px] leading-relaxed ${
                              msg.sender === "field" 
                                ? "bg-indigo-600 text-white rounded-tr-none" 
                                : "bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {isRemoteTyping && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] italic pt-1">
                          <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                          Remote NOC Engineer is typing diagnostics...
                        </div>
                      )}
                    </div>

                    {/* Quick Preset Action Prompts */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                      <span className="text-slate-400 font-bold shrink-0">Quick Prompts:</span>
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage("Check optical light power levels on SFP port 1")}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 px-2 py-1 rounded-lg shrink-0 cursor-pointer font-medium"
                      >
                        ⚡ Light Levels
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage("Please verify BGP peer route handshake status")}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 px-2 py-1 rounded-lg shrink-0 cursor-pointer font-medium"
                      >
                        🛰️ BGP Sync
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage("Push latest router firmware v5.12 configuration")}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 px-2 py-1 rounded-lg shrink-0 cursor-pointer font-medium"
                      >
                        🔑 Push Config
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage("Unlock bandwidth profile for speed testing")}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 px-2 py-1 rounded-lg shrink-0 cursor-pointer font-medium"
                      >
                        🚀 Speed Unlock
                      </button>
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder="Message Remote Core Engineer (Sipho Dlamini)..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VOICE CALL INTERFACE */
                  <div className="bg-slate-900 text-white rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-full ${isCallActive ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-slate-800 text-slate-400"}`}>
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs">VoIP SIP Line #402 — NOC Engineering Desk</h5>
                          <p className="text-[10px] text-slate-400">Connected to: Sipho Dlamini (Senior Core Engineer)</p>
                        </div>
                      </div>

                      {isCallActive && (
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                            {Math.floor(callTimer / 60).toString().padStart(2, '0')}:{(callTimer % 60).toString().padStart(2, '0')}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest text-slate-400">Encrypted HD Voice</span>
                        </div>
                      )}
                    </div>

                    {/* Audio Equalizer Waveform simulation when call active */}
                    {isCallActive && (
                      <div className="flex items-center justify-center gap-1 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" />
                        <span className="w-1 h-6 bg-teal-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-8 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        <span className="w-1 h-5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                        <span className="text-xs text-slate-300 font-mono ml-2">HD Voice Active • 24kbps Opus Codec</span>
                      </div>
                    )}

                    {/* Live Transcript Stream */}
                    <div className="bg-slate-950/80 rounded-xl p-3 max-h-32 overflow-y-auto space-y-1.5 text-[10px]">
                      <span className="text-slate-500 uppercase tracking-wider font-bold block text-[9px]">Live Voice Transcript Stream</span>
                      {transcripts.map((t, idx) => (
                        <div key={idx} className="flex gap-1.5 leading-tight">
                          <span className="text-indigo-400 font-bold shrink-0">{t.speaker} [{t.time}]:</span>
                          <span className="text-slate-300">{t.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Call Control Buttons */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      {!isCallActive ? (
                        <button
                          type="button"
                          onClick={() => setIsCallActive(true)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4" /> Start Direct Voice Call
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isMuted ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-slate-800 text-slate-300 border-slate-700"}`}
                          >
                            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isSpeakerOn ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" : "bg-slate-800 text-slate-300 border-slate-700"}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCallActive(false)}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <PhoneOff className="w-4 h-4" /> End Call
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Physical Checklists */}
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

              {/* Client Signoff */}
              <div className="p-4 border border-slate-150 rounded-2xl space-y-4">
                <div className="flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-slate-700">Digital Client Service Sign-off</h4>
                </div>

                {isFieldSigned ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium">
                    ✓ Confirmed &amp; signed off by client <strong>{activeCase.fieldClientSignName}</strong> on {activeCase.fieldClientSignDate || new Date().toLocaleDateString()}.
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
                      disabled={!activationCompletedAt || !signName}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold"
                  >
                    {["10 Mbps", "20 Mbps", "50 Mbps", "100 Mbps", "200 Mbps", "300 Mbps", "400 Mbps", "500 Mbps", "600 Mbps", "700 Mbps", "800 Mbps", "900 Mbps", "1000 Mbps"].map(speed => (
                      <option key={speed} value={speed}>{speed}</option>
                    ))}
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
