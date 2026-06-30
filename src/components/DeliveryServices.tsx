import React, { useState } from "react";
import { Lead, ProjectCase, Quotation } from "../types";
import { 
  Network, 
  MapPin, 
  Clipboard, 
  CheckCircle, 
  Calendar, 
  Upload, 
  Cpu, 
  FileCheck, 
  UserCheck, 
  Layers, 
  Tv, 
  Activity,
  ChevronRight,
  ShieldAlert,
  Loader2
} from "lucide-react";

interface DeliveryServicesProps {
  leads: Lead[];
  cases: ProjectCase[];
  setCases: React.Dispatch<React.SetStateAction<ProjectCase[]>>;
  quotations: Quotation[];
  activePersona: string;
  selectedLeadId: string;
}

export default function DeliveryServices({
  leads,
  cases,
  setCases,
  quotations,
  activePersona,
  selectedLeadId
}: DeliveryServicesProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id);
  const activeQuote = quotations.find(q => q.leadId === activeLead?.id);

  // Local state managers
  const [surveyDate, setSurveyDate] = useState("");
  const [planningDocUploaded, setPlanningDocUploaded] = useState(false);
  const [isSurveying, setIsSurveying] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [handoverForm, setHandoverForm] = useState({
    testResults: "Symmetric throughput tested at contract capacity, packet loss 0%, optical signal -14.5dBm",
    linkStatus: "Excellent" as "Excellent" | "Good" | "Fair",
    ipSubnet: "196.15.52.128/29",
    vlanId: 1042
  });

  if (!activeCase) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
        <Network className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-display font-semibold text-lg text-slate-700">Project Case Not Yet Triggered</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          Once the client's corporate details are cleared by compliance and the Procurement Team issues the vendor purchase order, the order will convert into an active engineering delivery project.
        </p>
        <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-md font-semibold font-mono">
          Awaiting step: "Phase 3: Margin & Handoff" Order placement.
        </span>
      </div>
    );
  }

  // Stepper logic
  const steps = [
    { key: "case_created", label: "Case Creation", desc: "Order converted to project case" },
    { key: "survey_scheduled", label: "Site Survey & Planning", desc: "Schedule survey & upload planning doc" },
    { key: "landlord_approved", label: "Landlord Approval", desc: "Obtain structural authorization" },
    { key: "installed", label: "Fiber Installation", desc: "Vendor physical link setup" },
    { key: "testing_and_handover", label: "Testing & Handover", desc: "Link tests, IP, & VLAN config" },
    { key: "live", label: "Router Live Activation", desc: "Live client traffic routed" }
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = [
      "case_created",
      "survey_scheduled",
      "survey_completed",
      "planning_uploaded",
      "landlord_approval_pending",
      "landlord_approved",
      "installation_scheduled",
      "installed",
      "testing_and_handover",
      "router_configured",
      "live"
    ];

    const currentIdx = statusOrder.indexOf(activeCase.status);
    
    // Custom logic to map group states
    if (stepKey === "case_created") return "completed";
    
    if (stepKey === "survey_scheduled") {
      if (currentIdx >= statusOrder.indexOf("planning_uploaded")) return "completed";
      if (currentIdx >= statusOrder.indexOf("survey_scheduled")) return "active";
      return "pending";
    }

    if (stepKey === "landlord_approved") {
      if (currentIdx >= statusOrder.indexOf("landlord_approved")) return "completed";
      if (currentIdx >= statusOrder.indexOf("landlord_approval_pending")) return "active";
      return "pending";
    }

    if (stepKey === "installed") {
      if (currentIdx >= statusOrder.indexOf("installed")) return "completed";
      if (currentIdx >= statusOrder.indexOf("installation_scheduled")) return "active";
      return "pending";
    }

    if (stepKey === "testing_and_handover") {
      if (currentIdx >= statusOrder.indexOf("testing_and_handover")) return "completed";
      if (currentIdx >= statusOrder.indexOf("testing_and_handover")) return "active";
      return "pending";
    }

    if (stepKey === "live") {
      if (activeCase.status === "live") return "completed";
      if (currentIdx >= statusOrder.indexOf("router_configured")) return "active";
      return "pending";
    }

    return "pending";
  };

  // Stepper handlers
  const handleScheduleSurvey = () => {
    if (!surveyDate) return;
    setIsSurveying(true);
    setTimeout(() => {
      setCases(prev => prev.map(c => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            status: "survey_completed",
            surveyDate: surveyDate
          };
        }
        return c;
      }));
      setIsSurveying(false);
    }, 1200);
  };

  const handleUploadPlanningDoc = () => {
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          status: "planning_uploaded",
          planningDocName: "Reunert_Sandton_Fiber_Route_v1.pdf",
          planningDocUrl: "#"
        };
      }
      return c;
    }));
    setPlanningDocUploaded(true);
  };

  const handleSendLandlordApproval = () => {
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          status: "landlord_approval_pending"
        };
      }
      return c;
    }));

    // Auto-approve after 3 seconds for mock demonstration
    setTimeout(() => {
      setCases(prev => prev.map(c => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            status: "landlord_approved"
          };
        }
        return c;
      }));
    }, 3000);
  };

  const handleScheduleInstallation = () => {
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          status: "installed"
        };
      }
      return c;
    }));
  };

  const handleSaveHandover = (e: React.FormEvent) => {
    e.preventDefault();
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          status: "testing_and_handover",
          handoverCertificate: {
            testResults: handoverForm.testResults,
            linkStatus: handoverForm.linkStatus,
            ipSubnet: handoverForm.ipSubnet,
            vlanId: handoverForm.vlanId,
            handoverDate: new Date().toISOString()
          }
        };
      }
      return c;
    }));
  };

  const handleLiveActivation = () => {
    setIsActivating(true);
    setTimeout(() => {
      setCases(prev => prev.map(c => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            status: "live",
            routerInstalled: true,
            finalTestingPassed: true,
            clientSignedOff: true,
            clientSignOffDate: new Date().toISOString()
          };
        }
        return c;
      }));
      setIsActivating(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="delivery-stepper-root">
      {/* Left Stepper Track */}
      <div className="xl:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100 mb-5 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
          Connectivity Activation Stepper
        </h3>

        <div className="space-y-6 relative pl-3 border-l border-slate-100">
          {steps.map((st, idx) => {
            const stepStatus = getStepStatus(st.key);
            return (
              <div key={st.key} className="relative">
                {/* Node pin */}
                <div className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 transition-all ${
                  stepStatus === "completed" 
                    ? "bg-emerald-500 border-white ring-4 ring-emerald-50" 
                    : stepStatus === "active"
                    ? "bg-teal-600 border-white ring-4 ring-teal-100 animate-pulse"
                    : "bg-white border-slate-300"
                }`} />

                <div className="pl-3.5">
                  <h4 className={`text-xs font-bold ${
                    stepStatus === "completed" 
                      ? "text-emerald-800 font-bold" 
                      : stepStatus === "active"
                      ? "text-teal-700 font-extrabold"
                      : "text-slate-500 font-medium"
                  }`}>{idx + 1}. {st.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100/60 text-xs text-slate-500 font-medium">
          Current Order Status: <span className="font-mono font-bold text-slate-700 bg-slate-200/60 px-1.5 py-0.5 rounded text-[10px] uppercase">{activeCase.status}</span>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="xl:col-span-2 space-y-6">
        {/* Survey & Planning Details */}
        {(activeCase.status === "case_created" || activeCase.status === "survey_scheduled" || activeCase.status === "survey_completed" || activeCase.status === "planning_uploaded" || activeCase.status === "landlord_approval_pending") && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-display font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Site Survey, Engineering Route Mapping & Landlord Approval
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase">1. Schedule Civil Site Survey</h4>
                <p className="text-xs text-slate-400">Project managers coordinate with physical engineering teams to inspect corporate campuses for route clearance.</p>
                
                {activeCase.surveyDate ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold">
                    ✓ Survey Completed on {activeCase.surveyDate}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={surveyDate}
                      onChange={(e) => setSurveyDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      onClick={handleScheduleSurvey}
                      disabled={isSurveying || !surveyDate}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      {isSurveying ? <Loader2 className="w-3 animate-spin" /> : "Verify Survey Completed"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase">2. Route Planning Documentation</h4>
                <p className="text-xs text-slate-400">Engineering teams upload civil planning maps detailing trench routes, pole installations, and building entry points.</p>

                {activeCase.planningDocName ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-semibold flex justify-between items-center">
                    <span>File: {activeCase.planningDocName}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Uploaded</span>
                  </div>
                ) : (
                  <button
                    disabled={!activeCase.surveyDate}
                    onClick={handleUploadPlanningDoc}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Upload Survey Civil Planning Map
                  </button>
                )}
              </div>
            </div>

            {/* Landlord Approval trigger */}
            {activeCase.planningDocName && (
              <div className="pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 rounded-b-xl space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">Submit for Electronic Landlord Structural Approval</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">The platform auto-emails the uploaded PDF route map to landlord contacts. Landlords must digitally approve civil fiber works.</p>
                  </div>
                </div>

                {activeCase.status === "landlord_approval_pending" ? (
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-between text-xs text-teal-800">
                    <span className="flex items-center gap-1.5 font-semibold font-mono uppercase tracking-wider">
                      <Loader2 className="w-4 h-4 animate-spin" /> Landlord Approval Dispatch Pending...
                    </span>
                    <span className="text-[10px] text-teal-500">Auto-approves in 3s</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSendLandlordApproval}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-xs font-bold transition-all"
                  >
                    Send Planning Map for Landlord Signature Approval
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Physical Installation & Landlord Approved state */}
        {(activeCase.status === "landlord_approved" || activeCase.status === "installation_scheduled") && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-display font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              Landlord Approval Signed & Civil Installation Scheduled
            </h3>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="text-xs text-emerald-800">
                <p className="font-bold">Landlord Structural Consent Granted Digitally</p>
                <p className="mt-1">Structural civil work permits generated. Road trenching and building entry approvals cleared under municipal by-laws.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase">3. Deploy Fiber/Wireless Installation Teams</h4>
              <p className="text-xs text-slate-400">Scheduled vendor installation crews will perform site fiber splice, termination, and optical line verification.</p>

              {(activePersona === "Project Manager" || activePersona === "Admin") ? (
                <button
                  onClick={handleScheduleInstallation}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs"
                >
                  Confirm Physical Splice & Line Installation Complete
                </button>
              ) : (
                <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 text-center rounded-lg text-xs font-semibold">
                  Switch to "Project Manager" persona to log splice/installation completion status.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testing, Handover & IP Configuration */}
        {(activeCase.status === "installed" || activeCase.status === "testing_and_handover" || activeCase.status === "router_configured") && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-display font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600" />
              4. Link Testing & Engineering Handover Certificate
            </h3>

            {activeCase.handoverCertificate ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-800 uppercase">
                  <span>Handover Certificate Cleared</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 rounded-full font-mono">Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <div><span className="text-slate-400">Test Metrics:</span> <span className="font-semibold text-slate-800">{activeCase.handoverCertificate.testResults}</span></div>
                  <div><span className="text-slate-400">Optical Signal:</span> <span className="font-semibold text-emerald-700">{activeCase.handoverCertificate.linkStatus}</span></div>
                  <div><span className="text-slate-400">Assigned IP:</span> <span className="font-mono font-bold text-slate-800">{activeCase.handoverCertificate.ipSubnet}</span></div>
                  <div><span className="text-slate-400">802.1Q VLAN:</span> <span className="font-mono font-bold text-slate-800">VLAN {activeCase.handoverCertificate.vlanId}</span></div>
                </div>

                {true && (
                  <div className="pt-3 border-t border-slate-200">
                    <h4 className="text-[11px] font-bold text-slate-600 uppercase mb-2">5. Router Configuration & Service Activation</h4>
                    <p className="text-[11px] text-slate-500 mb-3">Engineering team configures edge routers using VLAN {activeCase.handoverCertificate.vlanId} and IP credentials to set service active.</p>

                    {(activePersona === "Project Manager" || activePersona === "Admin") ? (
                      <button
                        disabled={isActivating}
                        onClick={handleLiveActivation}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5"
                      >
                        {isActivating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Pinging edge nodes, verifying SLA thresholds & setting Live...
                          </>
                        ) : (
                          <>
                            <Tv className="w-4 h-4" />
                            Provision Router & Set Service LIVE
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 text-center rounded-lg text-xs font-semibold">
                        Switch persona to "Project Manager" to provision router & trigger LIVE service.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveHandover} className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Input optical signal levels and routing configurations to issue the commercial engineering handover certificate. This triggers router installation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Optical/Wireless Test Results *</label>
                    <input
                      type="text"
                      required
                      value={handoverForm.testResults}
                      onChange={(e) => setHandoverForm(prev => ({ ...prev, testResults: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Signal Status</label>
                    <select
                      value={handoverForm.linkStatus}
                      onChange={(e) => setHandoverForm(prev => ({ ...prev, linkStatus: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800"
                    >
                      <option value="Excellent">Excellent (-12dBm to -18dBm)</option>
                      <option value="Good">Good (-19dBm to -22dBm)</option>
                      <option value="Fair">Fair (-23dBm to -26dBm)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Allocated Public IP Subnet *</label>
                    <input
                      type="text"
                      required
                      value={handoverForm.ipSubnet}
                      onChange={(e) => setHandoverForm(prev => ({ ...prev, ipSubnet: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">802.1Q Tagged VLAN ID *</label>
                    <input
                      type="number"
                      required
                      value={handoverForm.vlanId}
                      onChange={(e) => setHandoverForm(prev => ({ ...prev, vlanId: parseInt(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg text-xs"
                >
                  Generate & Store Handover Certificate
                </button>
              </form>
            )}
          </div>
        )}

        {/* Fully Active / Live State */}
        {activeCase.status === "live" && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white/10 p-2.5 rounded-lg shrink-0">
                <CheckCircle className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">System Live & Fully Operational!</h3>
                <p className="text-xs text-teal-100 leading-relaxed mt-0.5">
                  The client has successfully signed off on handovers. Symmetrical bandwidth routing is active, real-time performance is synchronized with active SLA monitors, and the commercial billing engine has triggered revenue recognition.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/10 rounded-lg border border-white/10 text-xs space-y-1.5">
              <p className="font-bold">Active SLA Parameters:</p>
              <p>• Uptime: <span className="font-bold text-emerald-300">99.5% Gold standard</span> | MTTR: <span className="font-bold text-emerald-300">4 Hours</span></p>
              <p>• Assigned Subnets: <span className="font-mono font-bold text-slate-100">{activeCase.handoverCertificate?.ipSubnet}</span> | VLAN: <span className="font-mono font-bold text-slate-100">VLAN {activeCase.handoverCertificate?.vlanId}</span></p>
              <p>• Signed Sign-off certificate: <span className="italic">Digitally verified by client {activeLead.clientName}</span> on {activeCase.clientSignOffDate ? new Date(activeCase.clientSignOffDate).toLocaleDateString() : ""}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
