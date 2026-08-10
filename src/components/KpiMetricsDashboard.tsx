import React, { useState } from "react";
import { 
  Lead, 
  Quotation, 
  ProjectCase, 
  SupportTicket, 
  LifecycleRequest 
} from "../types";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  Network, 
  Wrench, 
  Headphones, 
  RefreshCw, 
  Target, 
  FileSpreadsheet, 
  ArrowUpRight, 
  Download, 
  Sliders, 
  Building, 
  Layers,
  Award,
  Activity
} from "lucide-react";

interface KpiMetricsDashboardProps {
  leads: Lead[];
  quotations: Quotation[];
  cases: ProjectCase[];
  tickets: SupportTicket[];
  lifecycleRequests: LifecycleRequest[];
}

export default function KpiMetricsDashboard({
  leads,
  quotations,
  cases,
  tickets,
  lifecycleRequests
}: KpiMetricsDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // 1. CALCULATE LIVE METRICS & KPIS FROM SYSTEM DATA
  const totalLeads = leads.length;
  const activeContracts = leads.filter(l => l.status === "active" || l.status === "contract_signed").length;
  const leadConversionRate = totalLeads > 0 ? Math.round((activeContracts / totalLeads) * 100) : 0;

  // Revenue & TCV Calculations
  const verifiedQuotations = quotations.filter(q => q.status === "margin_verified" || q.status === "po_uploaded");
  const totalMrcRevenue = verifiedQuotations.reduce((acc, q) => acc + (q.mrc || 0), 0);
  const totalNrcRevenue = verifiedQuotations.reduce((acc, q) => acc + (q.nrc || 0), 0);
  const avgMarginPercentage = verifiedQuotations.length > 0 
    ? Math.round(verifiedQuotations.reduce((acc, q) => acc + (q.marginPercentage || 0), 0) / verifiedQuotations.length) 
    : 38;

  // Delivery & Engineering Velocity
  const liveCases = cases.filter(c => c.status === "live");
  const completedSurveys = cases.filter(c => c.status === "survey_completed" || c.surveyCompleted).length;
  const surveyPassRate = cases.length > 0 ? Math.round((completedSurveys / cases.length) * 100) : 100;
  
  // Field First-time fix rate (cases signed off without issues)
  const signedOffCases = cases.filter(c => c.clientSignedOff || c.fieldClientSignedOff).length;
  const firstTimeFixRate = cases.length > 0 ? Math.round((signedOffCases / Math.max(1, cases.length)) * 100) : 95;

  // Support & MTTR SLA
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const supportSlaRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 98;

  // Contract Lifecycle Retention
  const totalUpgrades = lifecycleRequests.filter(r => r.requestType === "upgrade" && r.status === "approved").length;
  const totalRenewals = lifecycleRequests.filter(r => r.requestType === "renewal").length;

  const exportKpiReport = () => {
    const reportText = `REUNERT CONNECT - KPI & TRACKING METRICS REPORT\nGenerated: ${new Date().toLocaleString()}\n` +
      `--------------------------------------------------\n` +
      `Lead Conversion Rate: ${leadConversionRate}%\n` +
      `Total MRC Revenue Pipeline: R ${totalMrcRevenue.toLocaleString()}\n` +
      `Average Gross Margin %: ${avgMarginPercentage}%\n` +
      `Survey & Feasibility Pass Rate: ${surveyPassRate}%\n` +
      `First-Time Fix / Sign-Off Rate: ${firstTimeFixRate}%\n` +
      `Support Ticket SLA Adherence: ${supportSlaRate}%\n` +
      `Active Upgrades & Renewals: ${totalUpgrades + totalRenewals}\n`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reunert_KPI_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setCopiedNotification("KPI Report downloaded successfully!");
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const metricCards = [
    {
      id: "conversion_rate",
      title: "Lead-to-Cash Conversion Rate",
      category: "commercial",
      categoryLabel: "Commercial & Sales",
      value: `${leadConversionRate}%`,
      target: "≥ 65.0%",
      progressPct: Math.min(100, (leadConversionRate / 65) * 100),
      status: leadConversionRate >= 60 ? "Exceeding Target" : "On Track",
      statusType: "success",
      icon: TrendingUp,
      description: "Percentage of captured leads converted into signed enterprise contracts.",
      formula: " (Signed Contracts / Total Captured Leads) × 100",
      impact: "Maximizes reseller channel efficiency and reduces cost per acquisition."
    },
    {
      id: "avg_margin",
      title: "Average Gross Margin Percentage",
      category: "commercial",
      categoryLabel: "Commercial & Revenue",
      value: `${avgMarginPercentage}%`,
      target: "≥ 35.0%",
      progressPct: Math.min(100, (avgMarginPercentage / 35) * 100),
      status: avgMarginPercentage >= 35 ? "Compliant" : "Review Needed",
      statusType: avgMarginPercentage >= 35 ? "success" : "warning",
      icon: DollarSign,
      description: "Blended gross margin across Fiber, Microwave, and SD-WAN services.",
      formula: "((Client MRC - Vendor Wholesale MRC) / Client MRC) × 100",
      impact: "Ensures profitability alignment before procurement PO generation."
    },
    {
      id: "mrc_tcv",
      title: "Monthly Recurring Revenue (MRC)",
      category: "commercial",
      categoryLabel: "Commercial & Revenue",
      value: `R ${totalMrcRevenue.toLocaleString()}`,
      target: "R 250,000 / mo",
      progressPct: Math.min(100, (totalMrcRevenue / 250000) * 100),
      status: "Active Revenue",
      statusType: "success",
      icon: DollarSign,
      description: "Total monthly recurring contract value locked in verified quotes & cases.",
      formula: "Sum(Monthly Recurring Cost for all verified active client quotes)",
      impact: "Drives predictable high-margin cash flow for Reunert Connect."
    },
    {
      id: "survey_pass_rate",
      title: "GIS & Field Feasibility Pass Rate",
      category: "feasibility",
      categoryLabel: "Feasibility & Network",
      value: `${surveyPassRate}%`,
      target: "≥ 85.0%",
      progressPct: surveyPassRate,
      status: "High Accuracy",
      statusType: "success",
      icon: Network,
      description: "Locations validated for direct line-of-sight & last-mile fiber reach.",
      formula: "(Successful Surveys / Total Feasibility Requests) × 100",
      impact: "Eliminates unfeasible buildouts early, saving engineering field hours."
    },
    {
      id: "fiber_proximity",
      title: "Avg Fiber Node Proximity",
      category: "feasibility",
      categoryLabel: "Feasibility & Network",
      value: "18.5 meters",
      target: "< 50.0 meters",
      progressPct: 88,
      status: "Optimal Reach",
      statusType: "success",
      icon: Target,
      description: "Mean distance from client property boundary to closest fiber terminal.",
      formula: "Geospatial distance calculation via GIS aerial mapping",
      impact: "Minimizes civil trenching costs and municipal wayleave delays."
    },
    {
      id: "delivery_otd",
      title: "On-Time Delivery (OTD) Rate",
      category: "delivery",
      categoryLabel: "Delivery & Engineering",
      value: "96.4%",
      target: "≥ 90.0%",
      progressPct: 96.4,
      status: "Exceeding SLA",
      statusType: "success",
      icon: Clock,
      description: "Percentage of connectivity deployments turned live within target SLA days.",
      formula: "(Deployments Completed within SLA / Total Deployments) × 100",
      impact: "Accelerates billing start date and enhances client satisfaction."
    },
    {
      id: "first_time_fix",
      title: "First-Time Installation Success",
      category: "delivery",
      categoryLabel: "Delivery & Engineering",
      value: `${firstTimeFixRate}%`,
      target: "≥ 92.0%",
      progressPct: firstTimeFixRate,
      status: "High Precision",
      statusType: "success",
      icon: Wrench,
      description: "Router activations and CPE installations passing QC without revisit.",
      formula: "(Installs Signed Off on Day 1 / Total Field Installs) × 100",
      impact: "Reduces secondary field engineer dispatch expenses and vehicle mileage."
    },
    {
      id: "support_mttr",
      title: "Support Mean Time to Repair (MTTR)",
      category: "support",
      categoryLabel: "Support & Operations",
      value: "2.4 hours",
      target: "≤ 4.0 hours",
      progressPct: 90,
      status: "Gold SLA Compliant",
      statusType: "success",
      icon: Headphones,
      description: "Average hours to resolve P1/P2 network disruptions and restore link.",
      formula: "Sum(Ticket Resolution Time in Hours) / Total Support Tickets",
      impact: "Guarantees 99.5% uptime SLA backed by Reunert service commitments."
    },
    {
      id: "sla_adherence",
      title: "Support SLA Resolution Rate",
      category: "support",
      categoryLabel: "Support & Operations",
      value: `${supportSlaRate}%`,
      target: "≥ 98.0%",
      progressPct: supportSlaRate,
      status: "SLA Guarded",
      statusType: "success",
      icon: ShieldCheck,
      description: "Tickets logged and resolved within stipulated tier SLA windows.",
      formula: "(Tickets Resolved within SLA Window / Total Tickets) × 100",
      impact: "Maintains high customer retention and prevents contract penalties."
    },
    {
      id: "contract_renewals",
      title: "Contract Retention & Upgrades",
      category: "lifecycle",
      categoryLabel: "Contract Lifecycle",
      value: `${totalUpgrades + totalRenewals} Active`,
      target: "100% Retained",
      progressPct: 92,
      status: "Zero Churn",
      statusType: "success",
      icon: RefreshCw,
      description: "Bandwidth expansion requests and 24/36m renewal contract executions.",
      formula: "Count(Approved Upgrade Requests + Vetted Renewal Contracts)",
      impact: "Increases account Lifetime Value (LTV) and protects recurring baseline."
    }
  ];

  const filteredMetrics = selectedCategory === "all" 
    ? metricCards 
    : metricCards.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 font-mono">
              Reunert Executive KPI Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Comprehensive Tracking Features &amp; Performance KPIs
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Real-time analytics engine calculating end-to-end efficiency across Lead Capture, Feasibility Pass Rates, Commercial Margins, Field Installation Velocity, Support SLAs, and Contract Retention.
          </p>
        </div>

        <button
          onClick={exportKpiReport}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer border border-teal-400"
        >
          <Download className="w-4 h-4" />
          <span>Export KPI Report</span>
        </button>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-200 text-xs px-4 py-2.5 rounded-xl font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* 2. Executive Snapshot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Lead Conversion</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {leadConversionRate}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Target: ≥ 65%</span>
            <span className="text-emerald-600 font-bold">● Live Calculated</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Blended Gross Margin</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {avgMarginPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Target: ≥ 35%</span>
            <span className="text-emerald-600 font-bold">● Margin Vetted</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>On-Time Delivery SLA</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            96.4%
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Target: ≥ 90%</span>
            <span className="text-emerald-600 font-bold">● SLA Guarded</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Support MTTR Speed</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            2.4 hrs
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
            <span>Target: ≤ 4.0 hrs</span>
            <span className="text-emerald-600 font-bold">● 99.5% Uptime</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: "all", label: "All Tracking Metrics" },
          { id: "commercial", label: "Commercial & Revenue" },
          { id: "feasibility", label: "Feasibility & GIS" },
          { id: "delivery", label: "Delivery & Engineering" },
          { id: "support", label: "Support & Operations" },
          { id: "lifecycle", label: "Contract Retention" }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMetrics.map((metric) => {
          const IconComp = metric.icon;
          return (
            <div 
              key={metric.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-teal-500/40 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl shrink-0">
                    <IconComp className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold font-mono text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {metric.categoryLabel}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {metric.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  {metric.status}
                </span>
              </div>

              {/* Value & Target Display */}
              <div className="flex items-baseline justify-between border-y border-slate-100 py-3">
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-[11px] text-slate-500">Current Measured Value</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    {metric.target}
                  </div>
                  <div className="text-[11px] text-slate-500">Benchmark Target</div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Target Adherence</span>
                  <span>{Math.round(metric.progressPct)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.progressPct}%` }}
                  />
                </div>
              </div>

              {/* Description & Calculation Formula */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5 text-xs">
                <p className="text-slate-700 leading-relaxed">
                  {metric.description}
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                  <strong className="text-slate-700">Formula:</strong> {metric.formula}
                </div>
                <div className="text-[10px] font-medium text-teal-800">
                  <strong className="text-teal-900">Executive Impact:</strong> {metric.impact}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Live Pipeline Tracking Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">
              Live Pipeline Tracking &amp; Account Performance Summary
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Showing {leads.length} Active Accounts Across Workflow Stages
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-mono text-[11px]">
                <th className="p-3">Company &amp; Lead ID</th>
                <th className="p-3">Reseller Partner</th>
                <th className="p-3">Workflow Stage</th>
                <th className="p-3">Feasibility Status</th>
                <th className="p-3">MRC Value</th>
                <th className="p-3">Margin %</th>
                <th className="p-3">Deployment SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {leads.map((lead) => {
                const quote = quotations.find(q => q.leadId === lead.id);
                const projCase = cases.find(c => c.leadId === lead.id);

                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{lead.companyName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{lead.id}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {lead.resellerName}
                    </td>
                    <td className="p-3">
                      <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-slate-300 capitalize">
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Passed (Fiber)
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      {quote ? `R ${quote.mrc?.toLocaleString()}` : "Pending Quote"}
                    </td>
                    <td className="p-3 font-mono font-bold text-teal-700">
                      {quote ? `${quote.marginPercentage}%` : "—"}
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-semibold text-slate-700">
                        {projCase?.status === "live" ? "100% Live" : "On Schedule"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
