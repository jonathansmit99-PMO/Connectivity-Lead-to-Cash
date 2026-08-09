import React, { useState, useEffect } from "react";
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
  FileText, 
  Activity,
  ArrowRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Edit2,
  CalendarDays,
  FileSignature,
  AlertTriangle,
  Send,
  Users,
  RefreshCw,
  Building2,
  BellRing,
  XCircle,
  ArrowRightLeft
} from "lucide-react";

interface DeliveryServicesProps {
  leads: Lead[];
  cases: ProjectCase[];
  setCases: React.Dispatch<React.SetStateAction<ProjectCase[]>>;
  quotations: Quotation[];
  setQuotations?: React.Dispatch<React.SetStateAction<Quotation[]>>;
  activePersona: string;
  selectedLeadId: string;
}

export default function DeliveryServices({
  leads,
  cases,
  setCases,
  quotations,
  setQuotations,
  activePersona,
  selectedLeadId
}: DeliveryServicesProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id);
  const activeQuote = quotations.find(q => q.leadId === activeLead?.id);

  // Local interaction states for inputs and files
  const [localSurveyDate, setLocalSurveyDate] = useState("");
  const [localSurveyEngineer, setLocalSurveyEngineer] = useState("Thabo Baloyi");
  const [surveyNotes, setSurveyNotes] = useState("Line pathway and floor entries inspected. Basement server room rack slot 12B allocated.");
  const [isUploadingPlanning, setIsUploadingPlanning] = useState(false);
  const [isUploadingHandover, setIsUploadingHandover] = useState(false);
  
  const [signeeName, setSigneeName] = useState("");
  const [signeeTitle, setSigneeTitle] = useState("Property Site Manager");
  const [drawMode, setDrawMode] = useState<"type" | "draw">("type");
  const [typedSignature, setTypedSignature] = useState("");
  const [buildStart, setBuildStart] = useState("");
  const [buildEnd, setBuildEnd] = useState("");

  // Vendor Feasibility & Department Notification States
  const [unfeasibleReason, setUnfeasibleReason] = useState("Wayleave / Landlord Permit Refused");
  const [customUnfeasibleNote, setCustomUnfeasibleNote] = useState("");
  const [notifySales, setNotifySales] = useState(true);
  const [notifyLines, setNotifyLines] = useState(true);
  const [isNotifyingDepartments, setIsNotifyingDepartments] = useState(false);
  const [notificationSentSuccess, setNotificationSentSuccess] = useState(false);
  const [selectedNewVendorInDelivery, setSelectedNewVendorInDelivery] = useState("Openserve");
  const [showUnfeasibleForm, setShowUnfeasibleForm] = useState(false);

  // Sync state variables whenever active case changes
  useEffect(() => {
    if (activeCase) {
      setLocalSurveyDate(activeCase.surveyDate || "");
      setLocalSurveyEngineer(activeCase.surveyEngineer || "Thabo Baloyi");
      setSigneeName(activeCase.planningDocSignedBy || activeLead?.primaryBillingContact?.name || "");
      setSigneeTitle(activeCase.planningDocSignedTitle || "Property Site Manager");
      setTypedSignature(activeCase.planningDocSignedBy || activeLead?.primaryBillingContact?.name || "");
      setBuildStart(activeCase.buildStartDate || "");
      setBuildEnd(activeCase.buildEndDate || "");
    }
  }, [activeCase, activeLead]);

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
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-xs" id="phase4-no-case">
        <Network className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="font-sans font-bold text-xl text-slate-800">Project Case Not Yet Triggered</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6">
          Once the client's corporate details are cleared by compliance and the Procurement Team issues the vendor purchase order (PO), the system will generate an active engineering delivery project case.
        </p>
        <div className="mb-6">
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-4 py-2 rounded-xl font-bold font-mono">
            Awaiting step: "Phase 3: Margin & Handoff" PO placement.
          </span>
        </div>
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400 font-medium">Sandbox Bypass / Demo Mode:</p>
          <button
            onClick={handleQuickLaunchCase}
            className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Activity className="w-4 h-4" /> Initialize Phase 4 Engineering Case for {activeLead?.companyName}
          </button>
        </div>
      </div>
    );
  }

  // Helper to save case state to parent
  const updateCaseField = (fields: Partial<ProjectCase>) => {
    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return { ...c, ...fields };
      }
      return c;
    }));
  };

  // 1. Book Survey Date
  const handleBookSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSurveyDate) return;
    updateCaseField({
      surveyDate: localSurveyDate,
      surveyEngineer: localSurveyEngineer,
      status: "survey_scheduled"
    });
  };

  // 2. Survey Complete
  const handleCompleteSurvey = () => {
    updateCaseField({
      surveyCompleted: true,
      status: "survey_completed"
    });
  };

  // 3. Vendor Feasibility Handlers
  const handleConfirmVendorFeasible = () => {
    updateCaseField({
      vendorFeasibilityChecked: true,
      vendorIsFeasible: true,
      status: "vendor_feasibility_checked"
    });
    setNotificationSentSuccess(false);
  };

  const handleSendVendorUnfeasibleNotification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotifyingDepartments(true);
    const fullReason = customUnfeasibleNote 
      ? `${unfeasibleReason} - Note: ${customUnfeasibleNote}` 
      : unfeasibleReason;
      
    const depts: string[] = [];
    if (notifySales) depts.push("Sales");
    if (notifyLines) depts.push("Lines");

    setTimeout(() => {
      updateCaseField({
        vendorFeasibilityChecked: true,
        vendorIsFeasible: false,
        vendorUnfeasibleReason: fullReason,
        vendorUnfeasibleNotifiedDepartments: depts,
        vendorUnfeasibleNotificationSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "vendor_feasibility_checked"
      });
      setIsNotifyingDepartments(false);
      setNotificationSentSuccess(true);
    }, 800);
  };

  const handleSalesLinesChangeVendor = (newVendorName: string) => {
    if (setQuotations && activeQuote) {
      setQuotations(prev => prev.map(q => q.id === activeQuote.id ? { ...q, networkOperator: newVendorName } : q));
    }
    updateCaseField({
      vendorIsFeasible: true,
      vendorFeasibilityChecked: true,
      status: "vendor_feasibility_checked"
    });
    setNotificationSentSuccess(false);
    setShowUnfeasibleForm(false);
  };

  // 4. Load Planning Document
  const handleMockUploadPlanning = () => {
    setIsUploadingPlanning(true);
    setTimeout(() => {
      updateCaseField({
        planningDocName: "Reunert_Civil_Route_Planning_v2.pdf",
        planningDocUrl: "#",
        status: "planning_uploaded"
      });
      setIsUploadingPlanning(false);
    }, 1200);
  };

  // 5. Approve Planning Document
  const handleSignPlanningDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signeeName) return;
    updateCaseField({
      planningDocSigned: true,
      planningDocSignedBy: signeeName,
      planningDocSignedTitle: signeeTitle,
      planningDocSignedDate: new Date().toISOString().split("T")[0],
      status: "landlord_approved"
    });
  };

  // 6. Save Build Start Date
  const handleSaveBuildStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildStart) return;
    updateCaseField({
      buildStartDate: buildStart
    });
  };

  // 7. Save Build End Date
  const handleSaveBuildEnd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buildEnd) return;
    updateCaseField({
      buildEndDate: buildEnd,
      status: "installed"
    });
  };

  // 8. Upload Handover Certificate
  const handleMockUploadHandover = () => {
    setIsUploadingHandover(true);
    setTimeout(() => {
      updateCaseField({
        handoverDocName: "Reunert_Handover_SLA_Cleared_Final.pdf",
        handoverDocUrl: "#",
        status: "testing_and_handover"
      });
      setIsUploadingHandover(false);
    }, 1200);
  };

  // Define the 8 progress steps
  const stepsList = [
    { key: "book_survey", label: "Book Survey Date", done: !!activeCase.surveyDate },
    { key: "survey_complete", label: "Survey Date Complete", done: !!activeCase.surveyCompleted },
    { key: "vendor_feasibility", label: "Vendor Not Feasible / Feasibility", done: !!activeCase.vendorFeasibilityChecked },
    { key: "load_planning", label: "Load Planning Document", done: !!activeCase.planningDocName },
    { key: "approve_planning", label: "Approve Planning Document", done: !!activeCase.planningDocSigned },
    { key: "build_start", label: "Build Start Date", done: !!activeCase.buildStartDate },
    { key: "build_end", label: "Build End Date", done: !!activeCase.buildEndDate },
    { key: "upload_handover", label: "Upload Handover Certificate", done: !!activeCase.handoverDocName },
  ];

  // Helper to get step status (completed, active, locked)
  const getStepStatus = (index: number) => {
    const step = stepsList[index];
    if (step.done) return "completed";
    
    // An item is active if all preceding items are done
    const precedingDone = stepsList.slice(0, index).every(s => s.done);
    if (precedingDone) return "active";
    
    return "locked";
  };

  // Calculate building days if build dates are available
  const getBuildDuration = () => {
    if (!activeCase.buildStartDate || !activeCase.buildEndDate) return null;
    const start = new Date(activeCase.buildStartDate);
    const end = new Date(activeCase.buildEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const durationDays = getBuildDuration();

  // Reset helper for Phase 4 sandbox testing
  const handleResetPhase4 = () => {
    if (window.confirm("Do you want to reset Phase 4 delivery states to test the workflow from scratch?")) {
      updateCaseField({
        surveyDate: undefined,
        surveyCompleted: undefined,
        vendorFeasibilityChecked: undefined,
        vendorIsFeasible: undefined,
        vendorUnfeasibleReason: undefined,
        vendorUnfeasibleNotifiedDepartments: undefined,
        vendorUnfeasibleNotificationSentAt: undefined,
        planningDocName: undefined,
        planningDocUrl: undefined,
        planningDocSigned: undefined,
        planningDocSignedBy: undefined,
        planningDocSignedTitle: undefined,
        planningDocSignedDate: undefined,
        buildStartDate: undefined,
        buildEndDate: undefined,
        handoverDocName: undefined,
        handoverDocUrl: undefined,
        status: "case_created"
      });
      setLocalSurveyDate("");
      setBuildStart("");
      setBuildEnd("");
      setNotificationSentSuccess(false);
      setShowUnfeasibleForm(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="phase4-container">
      
      {/* LEFT COLUMN: Workspace 8-Step Sidebar Indicator */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
              <h3 className="font-sans font-black text-xs uppercase tracking-wider text-slate-300">Phase 4 Workflow</h3>
            </div>
            <button 
              onClick={handleResetPhase4}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
              title="Reset Phase 4 parameters to test again"
            >
              Reset Stage
            </button>
          </div>
          
          <div className="space-y-4 relative pl-1">
            {/* Visual connector line */}
            <div className="absolute left-3.5 top-2.5 bottom-2.5 w-[2px] bg-slate-800" />

            {stepsList.map((step, idx) => {
              const status = getStepStatus(idx);
              return (
                <div key={step.key} className="relative pl-7 flex items-start gap-2 text-xs">
                  {/* Step status node */}
                  <div className={`absolute left-1.5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black font-mono transition-all z-10 ${
                    status === "completed" 
                      ? "bg-emerald-500 text-slate-950 ring-4 ring-emerald-950/50" 
                      : status === "active"
                        ? "bg-teal-400 text-slate-900 ring-4 ring-teal-950/40 font-black animate-pulse"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}>
                    {status === "completed" ? "✓" : idx + 1}
                  </div>
                  
                  <div className="space-y-0.5">
                    <h4 className={`font-bold leading-tight ${
                      status === "completed" 
                        ? "text-emerald-400" 
                        : status === "active"
                          ? "text-teal-300"
                          : "text-slate-500"
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      {status === "completed" ? "Completed" : status === "active" ? "Active State" : "Awaiting pre-reqs"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p>Active Client: <strong className="text-white">{activeLead.companyName}</strong></p>
            <p>Assigned Operator: <strong className="text-teal-400">{activeQuote?.networkOperator || "Fibre Com Connect"}</strong></p>
          </div>
        </div>

        {/* Informative Tip Box */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            Connectivity Pipeline Notice
          </div>
          <p className="leading-relaxed text-[11px]">
            This pipeline establishes the physical layer. Civil micro-trenching, road reserves, and optical fiber loops require active landlord signature clearances logged to the state database prior to live splicing.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Connected Single-Workflow Workspace */}
      <div className="lg:col-span-9 space-y-6" id="phase4-workspace">
        
        {/* Header Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-mono bg-teal-50 text-teal-800 px-2 py-1 rounded-md font-extrabold uppercase tracking-wider border border-teal-100">
              One Unified Implementation Pipeline
            </span>
            <h2 className="font-sans font-bold text-xl text-slate-800 mt-2">Phase 4: Physical Connectivity Delivery</h2>
            <p className="text-xs text-slate-500 mt-1">
              Follow and complete the 8 chronological steps below to verify physical fiber routing, civil works, and engineering SLA handover.
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Current Workflow Status</p>
            <p className="text-xs font-mono font-black text-teal-700 mt-0.5 uppercase">
              {activeCase.status.replace("_", " ")}
            </p>
          </div>
        </div>

        {/* The Vertical Stepper Loop (8 Connected Steps) */}
        <div className="relative space-y-6">
          {/* Connector Line behind cards */}
          <div className="absolute left-8 top-10 bottom-10 w-[2px] bg-slate-100 hidden md:block" />

          {/* STAGE 1: Book Survey Date */}
          {(() => {
            const status = getStepStatus(0);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-60" : "opacity-100"}`}
                id="step-book-survey"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  1
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">1</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 1: Book Survey Date</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Schedule the formal physical walk-through with a civil structural engineer.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Survey Scheduled
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Pending Booking
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold">Survey Date & Time:</span>
                          <p className="font-mono font-bold text-slate-800 mt-0.5">{activeCase.surveyDate}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold">Allocated Surveyor:</span>
                          <p className="font-bold text-slate-800 mt-0.5">{activeCase.surveyEngineer || "Thabo Baloyi"}</p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleBookSurvey} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Survey Date *</label>
                          <input
                            type="date"
                            required
                            value={localSurveyDate}
                            onChange={(e) => setLocalSurveyDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Assigned Engineer *</label>
                          <input
                            type="text"
                            required
                            value={localSurveyEngineer}
                            onChange={(e) => setLocalSurveyEngineer(e.target.value)}
                            placeholder="e.g. Thabo Baloyi"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            disabled={!localSurveyDate}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <CalendarDays className="w-4 h-4" /> Book Survey Date
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 2: Survey Date Complete */}
          {(() => {
            const status = getStepStatus(1);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-survey-complete"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  2
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">2</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 2: Survey Date Complete</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Certify the survey has been physically conducted & civil constraints resolved.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Survey Executed
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Pending Onsite Verification
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                        <span className="text-slate-400 font-semibold">Survey Assessment Logs:</span>
                        <p className="text-slate-700 leading-relaxed font-mono text-[11px] bg-white p-2.5 rounded-lg border border-slate-100">
                          {surveyNotes}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Onsite civil constraints approved for cable-haul.</p>
                      </div>
                    ) : status === "active" ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Onsite Engineering Field Findings</label>
                          <textarea
                            value={surveyNotes}
                            onChange={(e) => setSurveyNotes(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleCompleteSurvey}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 px-6 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark Survey as Complete & Verified
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please book the survey date in Stage 1 first to unlock verification.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 3: Vendor Feasibility Check / Vendor Not Feasible */}
          {(() => {
            const status = getStepStatus(2);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-amber-500 ring-2 ring-amber-50/60" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-vendor-feasibility"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? activeCase.vendorIsFeasible === false
                      ? "bg-amber-500 border-amber-100 text-white"
                      : "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-amber-500 border-amber-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  3
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">3</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
                          Stage 3: Vendor Feasibility Check
                          <span className="text-[10px] font-normal text-slate-400 font-mono">
                            (Assigned: {activeQuote?.networkOperator || "Fibre Com Connect"})
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Confirm physical line feasibility or flag as unfeasible to send automated re-assignment alerts to Sales &amp; Lines teams.
                        </p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      activeCase.vendorIsFeasible === false ? (
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Vendor Unfeasible (Sales &amp; Lines Notified)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                          ✓ Vendor Feasible
                        </span>
                      )
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full animate-pulse">
                        Pending Onsite Feasibility Audit
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      activeCase.vendorIsFeasible === false ? (
                        <div className="space-y-4">
                          {/* Alert Banner */}
                          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-bold text-amber-950">
                                <BellRing className="w-4 h-4 text-amber-700 animate-bounce" />
                                Department Alert Active: Vendor Flagged as Unfeasible
                              </div>
                              <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                                Sent at {activeCase.vendorUnfeasibleNotificationSentAt || "Just now"}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100">
                                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Survey Feasibility Constraint:</span>
                                <p className="text-amber-950 font-medium mt-0.5">{activeCase.vendorUnfeasibleReason || "Wayleave / Landlord Permit Refused"}</p>
                              </div>
                              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-100">
                                <span className="text-slate-400 font-semibold block text-[10px] uppercase">Notified Departments:</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                  {activeCase.vendorUnfeasibleNotifiedDepartments?.map(dept => (
                                    <span key={dept} className="bg-indigo-100 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                      🏢 {dept} Team Notified ✓
                                    </span>
                                  )) || (
                                    <span className="text-indigo-900 font-bold">🏢 Sales &amp; Lines Departments Notified ✓</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action panel for Sales & Lines to change vendor */}
                          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ArrowRightLeft className="w-4 h-4 text-teal-400" />
                                <h4 className="font-sans font-bold text-xs text-slate-100">Sales &amp; Lines Action Hub: Change Operator / Vendor</h4>
                              </div>
                              <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-700 px-2 py-0.5 rounded font-mono">
                                Action Required: Sales &amp; Lines
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">
                              Select a replacement vendor operator (e.g. Openserve, DFA, Vumatel, Frogfoot, MetroFibre) to re-quote and proceed with civil route planning:
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <select
                                value={selectedNewVendorInDelivery}
                                onChange={(e) => setSelectedNewVendorInDelivery(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                              >
                                <option value="Openserve">Openserve (National Fiber)</option>
                                <option value="Dark Fibre Africa (DFA)">Dark Fibre Africa (DFA)</option>
                                <option value="Vumatel Commercial">Vumatel Commercial</option>
                                <option value="MetroFibre Networx">MetroFibre Networx</option>
                                <option value="Frogfoot Networks">Frogfoot Networks</option>
                                <option value="Liquid Intelligent Tech">Liquid Intelligent Tech</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleSalesLinesChangeVendor(selectedNewVendorInDelivery)}
                                className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> Re-assign to {selectedNewVendorInDelivery} &amp; Proceed
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2 text-emerald-900 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Initial vendor line pathway (<strong>{activeQuote?.networkOperator}</strong>) verified as <strong>Physically Feasible ✓</strong></span>
                          </div>
                          <button
                            onClick={() => updateCaseField({ vendorIsFeasible: false })}
                            className="text-[10px] text-amber-700 hover:underline font-bold"
                          >
                            Re-flag as Unfeasible
                          </button>
                        </div>
                      )
                    ) : status === "active" ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                          <p className="text-xs text-slate-700 font-medium">
                            Is the currently assigned vendor line pathway (<strong>{activeQuote?.networkOperator || "Fibre Com Connect"}</strong>) physically feasible following onsite survey findings?
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Option 1: Vendor Feasible */}
                            <button
                              type="button"
                              onClick={handleConfirmVendorFeasible}
                              className="p-3.5 bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
                            >
                              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                                <CheckCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                                Vendor Confirmed Feasible ✓
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">
                                Line route and wayleaves are clear. Advance to Stage 4 CAD route planning.
                              </p>
                            </button>

                            {/* Option 2: Vendor Not Feasible */}
                            <button
                              type="button"
                              onClick={() => setShowUnfeasibleForm(true)}
                              className={`p-3.5 bg-white hover:bg-amber-50/60 border ${showUnfeasibleForm ? "border-amber-500 ring-1 ring-amber-400 bg-amber-50/40" : "border-slate-200"} hover:border-amber-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs`}
                            >
                              <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                                <AlertTriangle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                                Vendor Not Feasible 🚨
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">
                                Dispatch automated notification to Sales &amp; Lines departments to change vendor.
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Expandable Notification Form when Vendor Not Feasible is chosen */}
                        {showUnfeasibleForm && (
                          <form onSubmit={handleSendVendorUnfeasibleNotification} className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-4 animate-fade-in">
                            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs pb-2 border-b border-amber-200/60">
                              <BellRing className="w-4 h-4 text-amber-700" />
                              Dispatch Notification to Sales &amp; Lines Departments
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Primary Constraint Reason *</label>
                                <select
                                  value={unfeasibleReason}
                                  onChange={(e) => setUnfeasibleReason(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                >
                                  <option value="Initial vendor wayleave / landlord permit rejected">Wayleave / Landlord Permit Refused</option>
                                  <option value="High civil trenching / build cost surcharge (&gt; R100k)">High Build / Trenching Surcharge (&gt; R100k)</option>
                                  <option value="No fiber port availability / POP exhaustion at site">No Port / POP Capacity at Building</option>
                                  <option value="Unacceptable installation lead time (&gt; 12 weeks)">Excessive SLA / Delivery Lead Time (&gt; 12 weeks)</option>
                                  <option value="Other feasibility constraint">Other Feasibility Constraint</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-600 uppercase">Target Recipient Departments</label>
                                <div className="flex items-center gap-4 pt-2 text-xs text-slate-800 font-medium">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={notifySales}
                                      onChange={(e) => setNotifySales(e.target.checked)}
                                      className="rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>🏢 Sales Dept</span>
                                  </label>
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={notifyLines}
                                      onChange={(e) => setNotifyLines(e.target.checked)}
                                      className="rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>🛠️ Lines Dept</span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-slate-600 uppercase">Additional Engineering Context / Notes</label>
                              <input
                                type="text"
                                value={customUnfeasibleNote}
                                onChange={(e) => setCustomUnfeasibleNote(e.target.value)}
                                placeholder="e.g. Building manager declined basement drilling; Sales requested to switch to Openserve fiber."
                                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/60">
                              <button
                                type="button"
                                onClick={() => setShowUnfeasibleForm(false)}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isNotifyingDepartments || (!notifySales && !notifyLines)}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 px-5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                {isNotifyingDepartments ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    Dispatching Alerts...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    Send Notification to Sales &amp; Lines
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please mark survey complete in Stage 2 first to enable feasibility verification.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 4: Load Planning Document */}
          {(() => {
            const status = getStepStatus(3);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-load-planning"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  4
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">4</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 4: Load Planning Document</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Upload the CAD design/PDF map showing route trenching layouts.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Plan Loaded
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Awaiting CAD Layout
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-emerald-50/30 border border-emerald-100/60 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-700">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{activeCase.planningDocName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Format: PDF Map | Size: 4.8 MB</p>
                          </div>
                        </div>
                        <a 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          className="text-xs text-teal-700 hover:text-teal-900 font-extrabold hover:underline"
                        >
                          Download Map Layout
                        </a>
                      </div>
                    ) : status === "active" ? (
                      <div 
                        onClick={handleMockUploadPlanning}
                        className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
                      >
                        {isUploadingPlanning ? (
                          <div className="space-y-2 text-slate-500">
                            <p className="text-xs animate-pulse font-bold">Parsing civil markers, compiling map coordinates...</p>
                            <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                              <div className="h-full bg-teal-600 animate-[shimmer_1.5s_infinite] w-2/3 rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">Drag &amp; Drop Civil PDF Route Map, or <span className="text-teal-600 underline">Browse files</span></p>
                            <p className="text-[10px] text-slate-400 font-mono">Accepts PDF, CAD formats up to 25MB</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please complete Stage 3 feasibility check first to enable document loading.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 5: Approve Planning Document */}
          {(() => {
            const status = getStepStatus(4);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-approve-planning"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  5
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">5</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 5: Approve Planning Document (Landlord Approval)</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Capture corporate &amp; landlord digital sign-offs for the civil build path.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Plan Approved
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Awaiting Landlord Signature
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-emerald-50/20 border border-emerald-150 rounded-xl space-y-2 text-xs text-slate-700">
                        <div className="flex items-center gap-2 font-bold text-emerald-900">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          Authenticated Electronic Approvals Logged
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1 pt-1.5 border-t border-emerald-100 text-[10px] text-slate-500 font-mono">
                          <div>Signee: <strong className="text-slate-800">{activeCase.planningDocSignedBy}</strong></div>
                          <div>Corporate Title: <strong className="text-slate-800">{activeCase.planningDocSignedTitle}</strong></div>
                          <div>Timestamp: <strong className="text-slate-800">{activeCase.planningDocSignedDate}</strong></div>
                        </div>
                      </div>
                    ) : status === "active" ? (
                      <form onSubmit={handleSignPlanningDoc} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Signatory Representative Name *</label>
                            <input
                              type="text"
                              required
                              value={signeeName}
                              onChange={(e) => {
                                setSigneeName(e.target.value);
                                setTypedSignature(e.target.value);
                              }}
                              placeholder="e.g. Dumisani Khumalo"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Representative Legal Title *</label>
                            <input
                              type="text"
                              required
                              value={signeeTitle}
                              onChange={(e) => setSigneeTitle(e.target.value)}
                              placeholder="e.g. Property Representative"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                        </div>

                        {/* Interactive Signature Area */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-bold">E-Signature Pad</span>
                            <div className="flex gap-2">
                              <button 
                                type="button" 
                                onClick={() => setDrawMode("type")}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${drawMode === "type" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"}`}
                              >
                                Keyboard Stylized
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setDrawMode("draw")}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${drawMode === "draw" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-500"}`}
                              >
                                Draw Manual
                              </button>
                            </div>
                          </div>

                          <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 h-20 flex items-center justify-center relative overflow-hidden">
                            {drawMode === "type" ? (
                              typedSignature ? (
                                <span className="font-serif italic text-2xl text-slate-800 tracking-wider font-bold select-none">
                                  {typedSignature}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">Signature renders as you type...</span>
                              )
                            ) : (
                              <div className="w-full h-full flex flex-col justify-center items-center">
                                <div className="w-full border-b border-dashed border-slate-300 max-w-xs h-0.5 mt-4" />
                                <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Use cursor/trackpad to sign</span>
                              </div>
                            )}
                            <div className="absolute right-3 bottom-1.5 text-[8px] text-slate-400 font-mono">
                              AUDIT ID: REUNERT-992-SECURE
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={!signeeName}
                          className="w-full bg-slate-800 hover:bg-slate-950 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          Authenticate Landlord &amp; Client Consent Approval
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please complete Route Planning upload in Stage 4 first.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 6: Build Start Date */}
          {(() => {
            const status = getStepStatus(5);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-build-start"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  6
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">6</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 6: Build Start Date</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Determine the start date for civil trenching and roadway works.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Build Commenced
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Awaiting Civil Start
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-400 font-semibold">Trenching Commencement Date:</span>
                        <p className="font-mono font-bold text-slate-800 mt-0.5">{activeCase.buildStartDate}</p>
                      </div>
                    ) : status === "active" ? (
                      <form onSubmit={handleSaveBuildStart} className="flex flex-wrap md:flex-nowrap gap-4">
                        <div className="w-full md:w-auto flex-1 space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Physical Civil Build Start Date *</label>
                          <input
                            type="date"
                            required
                            value={buildStart}
                            onChange={(e) => setBuildStart(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="w-full md:w-auto flex items-end">
                          <button
                            type="submit"
                            disabled={!buildStart}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                          >
                            Save Start Date
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please complete Stage 5 route approval first.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 7: Build End Date */}
          {(() => {
            const status = getStepStatus(6);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-build-end"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  7
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">7</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 7: Build End Date</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Define the planned final completion/splicing target date.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Build Concluded
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Awaiting Conclude Date
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="space-y-2">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <span className="text-slate-400 font-semibold">Trenching Conclude/Splicing Date:</span>
                          <p className="font-mono font-bold text-slate-800 mt-0.5">{activeCase.buildEndDate}</p>
                        </div>
                        {durationDays !== null && (
                          <p className="text-[11px] text-teal-800 bg-teal-50 border border-teal-100 p-2.5 rounded-xl font-medium">
                            ✓ Calculated Total Civil Window: <strong className="font-mono">{durationDays} Calendar Days</strong>.
                          </p>
                        )}
                      </div>
                    ) : status === "active" ? (
                      <form onSubmit={handleSaveBuildEnd} className="flex flex-wrap md:flex-nowrap gap-4">
                        <div className="w-full md:w-auto flex-1 space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Completion Date *</label>
                          <input
                            type="date"
                            required
                            min={activeCase.buildStartDate}
                            value={buildEnd}
                            onChange={(e) => setBuildEnd(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="w-full md:w-auto flex items-end">
                          <button
                            type="submit"
                            disabled={!buildEnd}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
                          >
                            Save End Date
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please complete Stage 6 build start date logging.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* STAGE 8: Upload Handover Certificate */}
          {(() => {
            const status = getStepStatus(7);
            return (
              <div 
                className={`relative bg-white border rounded-2xl shadow-xs transition-all duration-300 ${
                  status === "active" ? "border-teal-500 ring-2 ring-teal-50/50" : "border-slate-200"
                } ${status === "locked" ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                id="step-upload-handover"
              >
                {/* Visual Connector Node */}
                <div className={`absolute -left-10 top-6 w-5 h-5 rounded-full border-4 flex items-center justify-center font-bold text-[10px] hidden md:flex transition-all ${
                  status === "completed" 
                    ? "bg-emerald-500 border-emerald-150 text-white" 
                    : status === "active"
                      ? "bg-teal-500 border-teal-100 text-white animate-pulse"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  8
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="md:hidden flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">8</span>
                      <div>
                        <h3 className="font-sans font-bold text-slate-800 text-sm">Stage 8: Upload Handover Certificate</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Upload the final signed SLA engineering handover document to conclude Phase 4.</p>
                      </div>
                    </div>
                    {status === "completed" ? (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ✓ Handover Registered
                      </span>
                    ) : status === "locked" ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-full">
                        Awaiting Handover Document
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    {status === "completed" ? (
                      <div className="p-4 bg-emerald-50/30 border border-emerald-100/60 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2.5 rounded-lg text-emerald-700">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{activeCase.handoverDocName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Format: PDF Certificate | Size: 2.1 MB</p>
                          </div>
                        </div>
                        <a 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          className="text-xs text-teal-700 hover:text-teal-900 font-extrabold hover:underline"
                        >
                          View Handover PDF
                        </a>
                      </div>
                    ) : status === "active" ? (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500">
                          Please upload the signed Fiber Engineering Handover Certificate certifying decibel optical loss readings and baseline speed capabilities.
                        </p>
                        
                        <div 
                          onClick={handleMockUploadHandover}
                          className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50"
                        >
                          {isUploadingHandover ? (
                            <div className="space-y-2 text-slate-500">
                              <p className="text-xs animate-pulse font-bold">Verifying testing logs & uploading SLA certificate...</p>
                              <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                                <div className="h-full bg-teal-600 animate-[shimmer_1.5s_infinite] w-2/3 rounded-full" />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                              <p className="text-xs font-bold text-slate-700">Drag & Drop Handover Certificate, or <span className="text-teal-600 underline">Browse files</span></p>
                              <p className="text-[10px] text-slate-400 font-mono">Accepts PDF format up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Please complete Stage 7 to enable certificate upload.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Phase 4 Complete Success Banner */}
        {activeCase.handoverDocName && (
          <div className="p-5 bg-gradient-to-r from-teal-600 to-slate-800 text-white rounded-2xl shadow-md space-y-3 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div>
              <h4 className="font-sans font-bold text-sm">Phase 4 Connectivity Delivery Complete!</h4>
              <p className="text-[11px] text-teal-100 max-w-lg mt-0.5">
                All 8 stages of physical connectivity and civil works are signed and sealed. Proceed to the next tab **Phase 5: Field & Remote Engineering** to book field technicians and configure core router parameters.
              </p>
            </div>
            <span className="text-xs bg-white/10 border border-white/20 px-3 py-2 rounded-lg flex items-center gap-1 shrink-0 font-bold font-mono">
              Ready for Phase 5 <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
