import React, { useState } from "react";
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Building, 
  MapPin, 
  ClipboardCheck, 
  Network, 
  Server, 
  MessageSquare, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Zap, 
  Award, 
  BarChart3, 
  Layers, 
  FileSpreadsheet, 
  Check, 
  X,
  ChevronRight,
  Eye,
  Info
} from "lucide-react";

interface RoadmapVisionViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export default function RoadmapVisionView({ onNavigateTab }: RoadmapVisionViewProps) {
  const [activeScopeFilter, setActiveScopeFilter] = useState<"all" | "phase1" | "future">("all");
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const handlePrintPresentation = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const text = `ConnectIQ Strategic Roadmap & Vision:
Vision: Transition B2B Telecom from manual spreadsheets to automated digital lead-to-cash.
Priority Focus (Phase 1 MVP): 
1. Partner & Client Onboarding
2. Automated GIS Feasibility & Quoting
KPI Impact: Quote turnaround reduced from 7 days to < 3 minutes; 100% Margin Compliance (>35%).`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800" id="printable-roadmap">
      {/* 1. EXECUTIVE BANNER & VISION HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Executive Briefing & Roadmap
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ConnectIQ Digital Transformation <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                Vision, Roadmap & KPI Business Impact
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Replacing slow, manual spreadsheet workflows with an automated, intelligent B2B telecom platform. 
              <strong> Phase 1 prioritizes Partner Onboarding and Automated GIS Feasibility & Quoting</strong> to capture immediate revenue velocity.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
            <button
              onClick={handleShareSummary}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-600 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {copiedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied Briefing!
                </>
              ) : (
                <>
                  <ShareIcon className="w-4 h-4 text-teal-400" />
                  Copy Executive Summary
                </>
              )}
            </button>

            <button
              onClick={handlePrintPresentation}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-teal-900/40"
            >
              <Download className="w-4 h-4" />
              Print / Export Presentation PDF
            </button>
          </div>
        </div>

        {/* High Level Vision Stats Pill Bar */}
        <div className="mt-8 pt-6 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Primary Objective</span>
            <span className="text-teal-300 font-extrabold text-sm block mt-0.5">Automated Lead-to-Cash</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Phase 1 Priority</span>
            <span className="text-emerald-300 font-extrabold text-sm block mt-0.5">Onboarding + GIS Quote</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Target Quote Speed</span>
            <span className="text-teal-300 font-extrabold text-sm block mt-0.5">&lt; 3 Minutes (vs 7 Days)</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Margin Security</span>
            <span className="text-emerald-300 font-extrabold text-sm block mt-0.5">Strict &ge; 35% Floor</span>
          </div>
        </div>
      </div>

      {/* 2. THE CORE VISION & STRATEGIC OBJECTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vision Statement Box */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              The Strategic Vision
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              To establish <strong>ConnectIQ</strong> as Southern Africa's premier digital B2B telecom marketplace by digitizing manually intensive last-mile connectivity sales. 
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              By replacing legacy email back-and-forth and manual spreadsheets with an intelligent digital engine, ConnectIQ empowers sales reps and resellers to generate legally binding, margin-verified quotes in minutes.
            </p>
          </div>

          <div className="p-3.5 bg-teal-50/80 rounded-2xl border border-teal-200/80 text-xs text-teal-900 space-y-1">
            <span className="font-extrabold flex items-center gap-1.5 text-teal-800">
              <Award className="w-4 h-4 text-teal-600" /> Executive Mandate
            </span>
            <p className="text-[11px] text-teal-700 font-medium">
              "Deliver Phase 1 (Onboarding & GIS Feasibility/Quoting) as an operational MVP before expanding downstream civil delivery and engineering integrations."
            </p>
          </div>
        </div>

        {/* Strategic Objectives Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Core Strategic Objectives
            </h2>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">4 Pillars of Transformation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-extrabold text-xs text-slate-800">Dramatically Accelerate Speed-to-Quote</h3>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Reduce client quotation waiting time from <strong>5 to 10 business days</strong> down to <strong>under 3 minutes</strong> via satellite rooftop GIS lookup and instant pricing matrices.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-extrabold text-xs text-slate-800">Frictionless Channel & Partner Onboarding</h3>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Standardize digital client onboarding, reseller channel attribution, and FICA/occupational sign-off to eliminate intake errors and compliance delays.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-700 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-extrabold text-xs text-slate-800">Enforce Commercial Margin Governance</h3>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Implement automated wholesale cost checks ensuring a strict <strong>&ge; 35% gross margin floor</strong>, preventing unprofitable proposals from reaching enterprise clients.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-teal-300 transition-all space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="font-extrabold text-xs text-slate-800">End-to-End Operational Lifecycle</h3>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Provide real-time transparency across civil trenching, field engineering sign-offs, SLA support tickets, and 12/24/36-month contract renewals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PROJECT ROADMAP & PHASE PRIORITIZATION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Project Implementation Roadmap
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly prioritized delivery schedule highlighting Phase 1 MVP Scope vs Future Rollouts.
            </p>
          </div>

          {/* Filter toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold print:hidden">
            <button
              onClick={() => setActiveScopeFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeScopeFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Full 7-Phase Vision
            </button>
            <button
              onClick={() => setActiveScopeFilter("phase1")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeScopeFilter === "phase1" ? "bg-teal-600 text-white shadow-xs" : "text-teal-700 hover:text-teal-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Phase 1 Priority MVP
            </button>
            <button
              onClick={() => setActiveScopeFilter("future")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeScopeFilter === "future" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Phase 2 Deferred Scope
            </button>
          </div>
        </div>

        {/* ROADMAP TIMELINE TILES */}
        <div className="space-y-6">
          {/* PHASE 1 SECTION (ACTIVE & PRIORITIZED) */}
          {(activeScopeFilter === "all" || activeScopeFilter === "phase1") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-teal-900 to-slate-900 text-white p-3 rounded-2xl border border-teal-700 shadow-xs">
                <span className="bg-teal-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  Phase 1 — Immediate MVP Scope (Active Delivery Focus)
                </span>
                <span className="text-teal-200 text-xs font-medium hidden sm:inline">
                  &bull; Operational Focus: Client Onboarding + GIS Feasibility & Automated Quoting
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Module 1: Onboarding */}
                <div className="p-5 bg-teal-50/50 rounded-2xl border-2 border-teal-500/80 shadow-xs relative overflow-hidden space-y-3">
                  <div className="absolute top-3 right-3 bg-teal-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    PRIORITY #1
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">1. Partner & Enterprise Client Onboarding</h3>
                      <p className="text-[11px] text-teal-800 font-bold">Status: Active & Operational</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Digital lead capture portal with automated reseller channel attribution, instant FICA/occupational document uploads, and company registry validation.
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-teal-200/60 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Digital Reseller Attribution & Lead Registry</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Occupancy & Compliance Document Capture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Automated Lead Status Tracking Dashboard</span>
                    </div>
                  </div>

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab("onboarding")}
                      className="mt-2 text-xs text-teal-700 hover:text-teal-900 font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      Open Module 1 Onboarding <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Module 2: GIS Feasibility & Quoting */}
                <div className="p-5 bg-teal-50/50 rounded-2xl border-2 border-teal-500/80 shadow-xs relative overflow-hidden space-y-3">
                  <div className="absolute top-3 right-3 bg-teal-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    PRIORITY #2
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">2. Automated GIS Feasibility & Quoting Engine</h3>
                      <p className="text-[11px] text-teal-800 font-bold">Status: Active & Operational</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Satellite rooftop spatial mapping, line-of-sight analysis, instant vendor pricing lookup (MRC + NRC), 12/24/36-mo TCV calculations, and PDF quote generator.
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-teal-200/60 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Interactive Satellite GIS View</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant 10 - 1000 Mbps Bandwidth Tier Selector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>MRC, NRC, Term & TCV Calculation with Branded PDF</span>
                    </div>
                  </div>

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab("feasibility")}
                      className="mt-2 text-xs text-emerald-700 hover:text-emerald-900 font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      Open Module 2 GIS Feasibility <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PHASE 2 SECTION (DEFERRED FOR LATER ROLLOUT) */}
          {(activeScopeFilter === "all" || activeScopeFilter === "future") && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between bg-slate-100 text-slate-800 p-3 rounded-2xl border border-slate-200">
                <span className="bg-slate-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  Phase 2 — Future Expansion (Deferred Execution Scope)
                </span>
                <span className="text-slate-500 text-xs font-medium hidden sm:inline">
                  Will be deployed after Phase 1 Onboarding & GIS Quoting are stabilized
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Module 3 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">3</div>
                    <h4 className="text-xs font-bold text-slate-900">Wholesale Margin Governance</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Automated wholesale cost sheet parsing, vendor quote validation, and strict &ge; 35% margin verification gate.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Phase 2 Scope</span>
                </div>

                {/* Module 4 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">4</div>
                    <h4 className="text-xs font-bold text-slate-900">Civil Delivery & Wayleaves</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Municipal wayleave approvals, last-mile fiber trenching progress tracking, and site access milestone sign-off.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Phase 2 Scope</span>
                </div>

                {/* Module 5 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">5</div>
                    <h4 className="text-xs font-bold text-slate-900">Field Engineering & CPE</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    On-site CPE router configuration, light-level optical dBm power testing, and digital client acceptance signature.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Phase 2 Scope</span>
                </div>

                {/* Module 6 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">6</div>
                    <h4 className="text-xs font-bold text-slate-900">KAM Support & SLA Portal</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    24/7 ticket management, MTTR SLA performance monitoring (&lt; 4 hrs), and automated Key Account Manager chat.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Phase 2 Scope</span>
                </div>

                {/* Module 7 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">7</div>
                    <h4 className="text-xs font-bold text-slate-900">Contract Lifecycle & Renewal</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Automated 12/24/36-month contract expiration alerts, bandwidth upgrade requests, and proactive renewal workflows.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Phase 2 Scope</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. KPI BUSINESS IMPACT ANALYSIS (MANUAL VS AUTOMATED COMPARISON) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                KPI Business Impact & ROI Analysis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct comparison of current manual telecom operations versus ConnectIQ's automated digital platform.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            99.5% Operational Velocity Improvement
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5 w-1/4">Operational KPI Dimension</th>
                <th className="p-3.5 w-1/3 bg-rose-950/60 text-rose-300 border-x border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <X className="w-3.5 h-3.5 text-rose-400" />
                    Current Manual Process (Status Quo)
                  </span>
                </th>
                <th className="p-3.5 w-1/3 bg-teal-950/80 text-teal-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    ConnectIQ Automated Platform
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
              {/* Row 1: Speed to Quote */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Speed to Quote (Turnaround Time)
                  </div>
                </td>
                <td className="p-3.5 bg-rose-50/40 text-rose-900 border-x border-slate-200">
                  <strong className="block text-rose-800">5 – 10 Business Days</strong>
                  Manual desktop feasibility requests, email vendor queries, and manual spreadsheet drafting.
                </td>
                <td className="p-3.5 bg-teal-50/50 text-teal-950">
                  <strong className="block text-teal-800 text-sm font-extrabold">&lt; 3 Minutes (Instant)</strong>
                  Automated satellite GIS rooftop mapping & instant vendor rate card calculation.
                </td>
              </tr>

              {/* Row 2: Feasibility Precision */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Feasibility & Site Verification
                  </div>
                </td>
                <td className="p-3.5 bg-rose-50/40 text-rose-900 border-x border-slate-200">
                  <strong className="block text-rose-800">Manual & Delay-Prone</strong>
                  Requires preliminary physical site visits or slow manual fibre coverage map checks.
                </td>
                <td className="p-3.5 bg-teal-50/50 text-teal-950">
                  <strong className="block text-teal-800 text-sm font-extrabold">Instant GIS Results</strong>
                  High-res satellite view with LOS verification, GPS coordinates, and contention checks.
                </td>
              </tr>

              {/* Row 3: Commercial Margin Protection */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    Margin Compliance & Risk
                  </div>
                </td>
                <td className="p-3.5 bg-rose-50/40 text-rose-900 border-x border-slate-200">
                  <strong className="block text-rose-800">High Risk of Unverified Pricing</strong>
                  Sales reps manually editing Excel formulas; frequent loss-making or misquoted deals.
                </td>
                <td className="p-3.5 bg-teal-50/50 text-teal-950">
                  <strong className="block text-teal-800 text-sm font-extrabold">100% Margin Compliance (&ge; 35%)</strong>
                  Hard-coded governance rule blocks quote generation if wholesale margin falls below 35%.
                </td>
              </tr>

              {/* Row 4: Reseller & Client Experience */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    Reseller & Client Onboarding
                  </div>
                </td>
                <td className="p-3.5 bg-rose-50/40 text-rose-900 border-x border-slate-200">
                  <strong className="block text-rose-800">Unstructured & Fragmented</strong>
                  Scattered email threads, lost attachments, unverified occupancy agreements.
                </td>
                <td className="p-3.5 bg-teal-50/50 text-teal-950">
                  <strong className="block text-teal-800 text-sm font-extrabold">Centralized Digital Portal</strong>
                  Instant client creation, automated channel reseller attribution, and verified uploads.
                </td>
              </tr>

              {/* Row 5: Total Contract Value (TCV) Transparency */}
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-500" />
                    Executive TCV & Revenue Visibility
                  </div>
                </td>
                <td className="p-3.5 bg-rose-50/40 text-rose-900 border-x border-slate-200">
                  <strong className="block text-rose-800">End-of-Month Consolidation</strong>
                  Executive leadership lacks live visibility into sales pipeline values across 12/24/36-mo terms.
                </td>
                <td className="p-3.5 bg-teal-50/50 text-teal-950">
                  <strong className="block text-teal-800 text-sm font-extrabold">Real-Time Executive Dashboards</strong>
                  Instant TCV, MRC, NRC, and commission metrics visible on executive analytics views.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DETAILED KPI BENEFIT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider block">Time-to-Quote (TTQ)</span>
            <div className="text-2xl font-black font-mono text-white">&lt; 3 Mins</div>
            <p className="text-[11px] text-slate-400">Down from 7 days. Prevents lost sales due to delayed response times.</p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Lead Conversion Rate</span>
            <div className="text-2xl font-black font-mono text-white">45% Target</div>
            <p className="text-[11px] text-slate-400">Up from 12% in manual model. Reps close deals during initial client meeting.</p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-wider block">Gross Margin Floor</span>
            <div className="text-2xl font-black font-mono text-white">&ge; 35% Guaranteed</div>
            <p className="text-[11px] text-slate-400">System enforces profitable wholesale pricing across all enterprise bandwidths.</p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">Feasibility Site Costs</span>
            <div className="text-2xl font-black font-mono text-white">-85% Reduction</div>
            <p className="text-[11px] text-slate-400">Eliminates physical site call-outs for unverified or non-viable locations.</p>
          </div>
        </div>
      </div>

      {/* 5. SUMMARY STATEMENT & CALL TO ACTION */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white border border-teal-800/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            Ready to Experience Phase 1 Live?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Test the live <strong>Partner Onboarding</strong> flow and <strong>Automated GIS Feasibility & Quoting</strong> engine right now inside the prototype tabs.
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-3 shrink-0 print:hidden">
            <button
              onClick={() => onNavigateTab("onboarding")}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Test Onboarding (Phase 1)
            </button>
            <button
              onClick={() => onNavigateTab("feasibility")}
              className="px-4 py-2.5 bg-teal-500 text-slate-950 hover:bg-teal-400 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Test GIS Quote Engine (Phase 1)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.367 3 3 0 000 5.367zm0 10.734a3 3 0 110-5.367 3 3 0 010 5.367z"
      />
    </svg>
  );
}
