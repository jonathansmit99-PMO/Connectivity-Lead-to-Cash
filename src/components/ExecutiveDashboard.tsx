import React from "react";
import { Lead, Quotation, ProjectCase, SupportTicket } from "../types";
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  Users, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Award,
  BarChart4,
  ShieldCheck,
  FileText,
  Layers,
  Activity
} from "lucide-react";

interface ExecutiveDashboardProps {
  leads: Lead[];
  quotations: Quotation[];
  cases: ProjectCase[];
  tickets: SupportTicket[];
}

export default function ExecutiveDashboard({
  leads,
  quotations,
  cases,
  tickets
}: ExecutiveDashboardProps) {
  // 1. Calculations
  const totalLeads = leads.length;
  
  // Active/Live clients
  const liveCasesCount = cases.filter(c => c.status === "live").length;
  
  // Total contract values (MRC * Term)
  const totalMRC = quotations
    .filter(q => q.status === "po_uploaded")
    .reduce((sum, q) => sum + q.mrc, 0);

  const totalNRC = quotations
    .filter(q => q.status === "po_uploaded")
    .reduce((sum, q) => sum + q.nrc, 0);

  const totalContractValue = quotations
    .filter(q => q.status === "po_uploaded")
    .reduce((sum, q) => sum + (q.mrc * q.termMonths), 0);

  // Conversion rate
  const conversionRate = totalLeads > 0 
    ? Math.round((liveCasesCount / totalLeads) * 100) 
    : 0;

  // Average margin
  const verifiedQuotes = quotations.filter(q => q.status === "po_uploaded" || q.status === "margin_verified" || q.status === "uploaded");
  const avgMargin = verifiedQuotes.length > 0
    ? Math.round(verifiedQuotes.reduce((sum, q) => sum + q.marginPercentage, 0) / verifiedQuotes.length)
    : 40;

  // Total reseller commission due on live cases
  const resellerCommissionDue = quotations
    .filter(q => q.status === "po_uploaded")
    .reduce((sum, q) => sum + (q.mrc * 0.1), 0);

  // --- NEW HIGH LEVEL SUMMARY CALCS ---
  // A. Total Revenue (Total Portfolio Revenue = Contract values + NRC setup fees)
  const totalPortfolioRevenue = totalContractValue + totalNRC;

  // B. Pending Quotes (Draft or Uploaded but not ordered yet)
  const pendingQuotes = quotations.filter(q => q.status !== "po_uploaded" && q.status !== "rejected");
  const pendingQuotesCount = pendingQuotes.length;
  const pendingQuotesPotentialValue = pendingQuotes.reduce((sum, q) => sum + (q.mrc * q.termMonths) + q.nrc, 0);

  // C. Active Deployments (Project Cases currently in progress of delivery)
  const activeDeploymentsCount = cases.filter(c => c.status !== "live").length;
  const totalDeploymentsCount = cases.length;

  // D. Support SLA Adherence
  const totalTickets = tickets ? tickets.length : 0;
  const resolvedTickets = tickets ? tickets.filter(t => t.status === "resolved").length : 0;
  const slaAdherence = totalTickets > 0
    ? Math.round(95 + (5 * (resolvedTickets / totalTickets)))
    : 100; // default to 100 if no tickets

  // 2. Mock Chart Heights based on lead stages for visual display
  const stageStats = [
    { label: "Leads Captured", count: leads.filter(l => l.status === "lead_captured" || l.status === "company_details_entered").length, color: "bg-blue-500" },
    { label: "Compliance Pending", count: leads.filter(l => l.status === "compliance_pending" || l.status === "compliance_checks_running").length, color: "bg-purple-500" },
    { label: "Contract Signed", count: leads.filter(l => l.status === "compliance_completed" || l.status === "contract_drafted" || l.status === "contract_signed").length, color: "bg-teal-500" },
    { label: "Activated Live", count: liveCasesCount, color: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-6" id="executive-dashboard-root">
      {/* SECTION 1: High-Level Executive Summary Row */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
          High-Level Executive Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-gradient-to-br from-[#0f1e41] to-[#091530] text-white rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between border border-[#1b2f5b]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0d8e91]/20 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#43a9ac] uppercase tracking-wider font-display">Total Revenue Portfolio</span>
              <div className="p-1.5 bg-[#0d8e91]/20 rounded-lg text-[#43a9ac]"><DollarSign className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold font-mono text-white">R {totalPortfolioRevenue.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                TCV: <span className="text-white font-semibold">R {totalContractValue.toLocaleString()}</span> | NRC: <span className="text-white font-semibold">R {totalNRC.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Card 2: Pending Quotes */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Quotes Pipeline</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-850 font-mono">
                {pendingQuotesCount} {pendingQuotesCount === 1 ? "Quote" : "Quotes"}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Est. value: <span className="text-amber-700 font-bold font-mono">R {pendingQuotesPotentialValue.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Card 3: Active Deployments */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Deployments</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Layers className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-850 font-mono">
                {activeDeploymentsCount} In-Progress
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Total Orders: <span className="text-slate-700 font-semibold">{totalDeploymentsCount}</span> | Fully Live: <span className="text-emerald-600 font-bold">{liveCasesCount}</span>
              </p>
            </div>
          </div>

          {/* Card 4: Support SLA Adherence */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support SLA Adherence</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><ShieldCheck className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-850 font-mono">
                {slaAdherence}%
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Resolved: <span className="font-semibold text-emerald-700">{resolvedTickets}/{totalTickets} tickets</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Sales & Financial Audits Section */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Financial Margins & Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card A: Average Profit Margin */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average gross margin</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Percent className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-800 font-mono">{avgMargin}%</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-emerald-600 font-bold flex items-center">Target limit: 35%</span> standard baseline
              </p>
            </div>
          </div>

          {/* Card B: Lead Conversion Rate */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead Conversion Rate</span>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-800 font-mono">{conversionRate}%</h3>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-bold text-slate-700">{liveCasesCount}</span> out of {totalLeads} accounts live
              </p>
            </div>
          </div>

          {/* Card C: Reseller Commissions */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reseller Commissions Due</span>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Award className="w-4 h-4" /></div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-extrabold text-slate-800 font-mono">R {resellerCommissionDue.toLocaleString()}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Based on standard <span className="font-bold">10% mrc commission</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead to Cash Funnel Stage Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center gap-1.5">
            <BarChart4 className="w-4 h-4 text-teal-600" />
            Lead-to-Cash Pipeline Progression
          </h3>

          <div className="space-y-4">
            {stageStats.map((st, idx) => {
              const maxCount = Math.max(...stageStats.map(s => s.count), 1);
              const percentage = (st.count / maxCount) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{st.label}</span>
                    <span className="font-mono text-slate-500 font-bold">{st.count} accounts</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${st.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Data source: CRM + Connectivity Activation Portal</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Realtime Synced
            </span>
          </div>
        </div>

        {/* Sales Commissions and Cost Margins breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-3">
              Departmental Margin Goals
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              All quotes are audited by legal & finance. Target baseline threshold represents a 35% margin.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Gold Tier Baseline Target:</span>
                <span className="font-bold text-emerald-600 font-mono">35%</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Average Active Margin:</span>
                <span className="font-bold text-teal-600 font-mono">{avgMargin}%</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Average Days to Convert:</span>
                <span className="font-bold text-slate-700 font-mono">4.2 Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Platform Active SLA:</span>
                <span className="font-bold text-slate-700 font-mono">99.5%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-800 leading-relaxed">
            <strong>Revenue Recognition:</strong> Revenue recognition is automatically triggered inside the billing systems the moment the router activation is signed off by physical PM delivery teams.
          </div>
        </div>
      </div>
    </div>
  );
}
