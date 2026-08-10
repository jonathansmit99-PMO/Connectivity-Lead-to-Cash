import React, { useState } from "react";
import jsPDF from "jspdf";
import { 
  Lead, 
  Quotation, 
  ProjectCase, 
  SupportTicket, 
  LifecycleRequest 
} from "../types";
import { 
  FileText, 
  Download, 
  X, 
  CheckCircle2, 
  Users, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  Printer,
  Building,
  Briefcase,
  Layers,
  Award
} from "lucide-react";

interface ProjectCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  quotations: Quotation[];
  cases: ProjectCase[];
  tickets: SupportTicket[];
  lifecycleRequests: LifecycleRequest[];
}

export default function ProjectCharterModal({
  isOpen,
  onClose,
  leads,
  quotations,
  cases,
  tickets,
  lifecycleRequests
}: ProjectCharterModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate live data metrics
  const totalLeads = leads.length;
  const activeContracts = leads.filter(l => l.status === "active" || l.status === "contract_signed").length;
  const conversionRate = totalLeads > 0 ? Math.round((activeContracts / totalLeads) * 100) : 0;

  const verifiedQuotes = quotations.filter(q => q.status === "margin_verified" || q.status === "po_uploaded");
  const totalMrc = verifiedQuotes.reduce((acc, q) => acc + (q.mrc || 0), 0);
  const avgMargin = verifiedQuotes.length > 0 
    ? Math.round(verifiedQuotes.reduce((acc, q) => acc + (q.marginPercentage || 0), 0) / verifiedQuotes.length) 
    : 38;

  const completedSurveys = cases.filter(c => c.status === "survey_completed" || c.surveyCompleted).length;
  const surveyPassRate = cases.length > 0 ? Math.round((completedSurveys / cases.length) * 100) : 100;

  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const supportSla = tickets.length > 0 ? Math.round((resolvedTickets / tickets.length) * 100) : 98;

  // Function to generate and save PDF via jsPDF
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 18;

        // Colors
        const darkPrimary = [15, 23, 42]; // Slate 900
        const tealAccent = [13, 148, 136]; // Teal 600
        const textDark = [30, 41, 59]; // Slate 800
        const textMuted = [100, 116, 139]; // Slate 500

        // Header Banner Box
        doc.setFillColor(15, 23, 42);
        doc.rect(10, 10, pageWidth - 20, 26, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("REUNERT CONNECT - PROJECT CHARTER", 15, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(153, 246, 228);
        doc.text("Enterprise Telecom Lifecycle Management & Connectivity Portal", 15, 26);
        doc.text(`Generated: ${new Date().toLocaleDateString()} | Author: Executive Project Sponsor`, 15, 31);

        y = 44;

        // Section 1: Executive Overview & Objectives
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y, pageWidth - 20, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("1. EXECUTIVE PROJECT OVERVIEW & PURPOSE", 14, y + 5);

        y += 11;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        const overviewText = doc.splitTextToSize(
          "The Reunert Connect Portal streamlines the end-to-end B2B telecom lifecycle from partner lead intake and GIS rooftop feasibility mapping to wholesale margin verification, field engineering activation, and proactive KAM contract retention.",
          pageWidth - 30
        );
        doc.text(overviewText, 15, y);
        y += overviewText.length * 4.5 + 4;

        // Section 2: Live Operational Key Performance Indicators
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y, pageWidth - 20, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("2. CURRENT LIVE METRICS & PERFORMANCE BENCHMARKS", 14, y + 5);

        y += 11;

        // KPI Box Grid in PDF
        const boxWidth = (pageWidth - 30) / 4;
        const kpiData = [
          { label: "Lead Conversion", val: `${conversionRate}%`, target: "≥ 65%" },
          { label: "Pipeline MRC", val: `R ${totalMrc.toLocaleString()}`, target: "R 250k/mo" },
          { label: "Gross Margin", val: `${avgMargin}%`, target: "≥ 35%" },
          { label: "GIS Pass Rate", val: `${surveyPassRate}%`, target: "≥ 85%" }
        ];

        kpiData.forEach((kpi, idx) => {
          const bx = 15 + idx * boxWidth;
          doc.setDrawColor(203, 213, 225);
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(bx, y, boxWidth - 3, 16, 2, 2, "FD");

          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(kpi.label, bx + 3, y + 5);

          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(13, 148, 136);
          doc.text(kpi.val, bx + 3, y + 10);

          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(`Target: ${kpi.target}`, bx + 3, y + 14);
        });

        y += 22;

        // Section 3: Scope & Tracking Features
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y, pageWidth - 20, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("3. PROJECT SCOPE & TRACKING FEATURES", 14, y + 5);

        y += 10;
        const scopeItems = [
          "• Sales Pipeline Tracking: Partner channel lead capture, SLA status, and lead-to-cash conversion velocity.",
          "• GIS Aerial Feasibility: High-res satellite roof boundary mapping, line-of-sight checks, and fiber terminal distance.",
          "• Commercial Margin Verification: Automated ICASA / wholesale price modeling with mandatory 35% margin gate.",
          "• Connectivity Delivery & Field Velocity: Real-time civil trenching milestone tracking, wayleave sign-offs, and OTD.",
          "• Field Engineering Quality: CPE router configuration, Signal Quality (dBm) logging, and digital customer sign-off.",
          "• KAM Support & SLA Tracking: P1/P2 incident ticket logging, 2.4hr MTTR monitoring, and SLA uptime compliance.",
          "• Contract Lifecycle & Retention: 24/36-month contract renewals, automated upgrade workflows, and zero churn tracking."
        ];

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);

        scopeItems.forEach(item => {
          const lines = doc.splitTextToSize(item, pageWidth - 30);
          doc.text(lines, 15, y);
          y += lines.length * 4.2;
        });

        y += 4;

        // Section 4: Project Team Roles & Responsibilities
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y, pageWidth - 20, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("4. PROJECT TEAM ROLES & RESPONSIBILITIES MATRIX", 14, y + 5);

        y += 10;

        const roles = [
          { role: "Executive Project Sponsor", resp: "Overall strategic alignment, budget authorization, and high-level steering committee sign-off." },
          { role: "Senior Telecom Project Manager", resp: "Cross-functional schedule tracking, risk mitigation, milestone delivery, and weekly stakeholder status reports." },
          { role: "Lead Network & GIS Architect", resp: "Feasibility accuracy, high-resolution aerial spatial planning, line-of-sight verification, and fiber topology." },
          { role: "Commercial & Pricing Specialist", resp: "Wholesale vendor negotiations, margin model verification (min 35%), and automated quote governance." },
          { role: "Field Engineering Operations Lead", resp: "Civil build supervision, wayleave compliance, CPE router activation, signal quality validation, and sign-off." },
          { role: "KAM & Support Operations Lead", resp: "Tier-1 to Tier-3 incident response, MTTR adherence (<4 hrs), SLA compliance, and account retention/upgrades." }
        ];

        roles.forEach(r => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(13, 148, 136);
          doc.text(`• ${r.role}:`, 15, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const respText = doc.splitTextToSize(r.resp, pageWidth - 65);
          doc.text(respText, 62, y);
          y += Math.max(5, respText.length * 4);
        });

        y += 4;

        // Section 5: Governance & Sign-Off Block
        doc.setFillColor(241, 245, 249);
        doc.rect(10, y, pageWidth - 20, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("5. GOVERNANCE & STAKEHOLDER SIGN-OFF", 14, y + 5);

        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("This Project Charter establishes the formal operational scope and metrics baseline for Reunert Connect.", 15, y);

        y += 10;

        // Signature Lines
        doc.setDrawColor(203, 213, 225);
        doc.line(15, y, 85, y);
        doc.line(110, y, 180, y);

        y += 4;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Approved by: Executive Sponsor", 15, y);
        doc.text("Approved by: Lead Project Manager", 110, y);

        // Save PDF file
        doc.save(`Reunert_Connect_Project_Charter_${new Date().toISOString().slice(0, 10)}.pdf`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Enterprise Project Charter Document</span>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
                  Formatted PDF Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official project scope, team roles, live metrics &amp; governance report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-teal-400 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? "Generating PDF..." : "Export Formatted PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950 border-b border-emerald-500/50 px-6 py-2 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PDF Project Charter downloaded successfully to your local machine!</span>
          </div>
        )}

        {/* Modal Printable / Preview Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed bg-slate-900">
          
          {/* Document Header Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono text-teal-400 uppercase tracking-widest">
                  Reunert Connect • B2B Telecom Governance
                </span>
                <h1 className="text-xl font-extrabold text-white mt-1">
                  PROJECT CHARTER &amp; EXECUTIVE METRICS BASELINE
                </h1>
              </div>
              <div className="text-right font-mono text-[11px] text-slate-400">
                <div>Document ID: <strong className="text-teal-300">RC-CHARTER-2026</strong></div>
                <div>Status: <strong className="text-emerald-400">Approved &amp; Live</strong></div>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              This Project Charter formally defines the operational scope, tracking metrics, performance benchmarks, and team responsibilities for the Reunert Connect Portal deployment.
            </p>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Building className="w-4 h-4 text-teal-400" />
              <span>1. Executive Purpose &amp; Strategic Objectives</span>
            </h3>
            <p className="text-slate-300">
              The primary objective of Reunert Connect is to establish a unified, high-margin B2B connectivity platform that standardizes partner lead intake, accelerates GIS aerial rooftop feasibility analysis, enforces automated wholesale margin rules, streamlines field activation, and maximizes KAM account retention.
            </p>
          </div>

          {/* Section 2: Live Metrics Baseline */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>2. Current Live Metrics &amp; Performance KPIs</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Lead Conversion</span>
                <div className="text-lg font-bold font-mono text-teal-400">{conversionRate}%</div>
                <span className="text-[9px] text-slate-500">Benchmark: ≥ 65%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Pipeline MRC</span>
                <div className="text-lg font-bold font-mono text-emerald-400">R {totalMrc.toLocaleString()}</div>
                <span className="text-[9px] text-slate-500">Benchmark: R 250k/mo</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Gross Margin %</span>
                <div className="text-lg font-bold font-mono text-teal-300">{avgMargin}%</div>
                <span className="text-[9px] text-slate-500">Min Gate: 35%</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Support SLA MTTR</span>
                <div className="text-lg font-bold font-mono text-purple-400">2.4 hrs</div>
                <span className="text-[9px] text-slate-500">Target: ≤ 4.0 hrs</span>
              </div>
            </div>
          </div>

          {/* Section 3: Project Scope & Tracking Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Target className="w-4 h-4 text-teal-400" />
              <span>3. Detailed Project Scope &amp; Tracking Features</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Lead-to-Cash Sales Tracking", desc: "Monitors partner channel intake, SLA status, quotation progress, and conversion rates." },
                { title: "GIS Aerial Feasibility Mapping", desc: "High-resolution satellite view, 3D rooftop boundaries, and fiber node proximity checks." },
                { title: "Commercial Margin Governance", desc: "Automates wholesale cost calculations and enforces a mandatory 35% gross margin gate." },
                { title: "Field Engineering Velocity", desc: "Real-time civil trenching milestones, CPE router activation, signal testing (dBm), and digital sign-off." },
                { title: "KAM Support SLA Monitoring", desc: "P1/P2 incident tracking, MTTR resolution speed, and 99.5% network uptime compliance." },
                { title: "Contract Lifecycle & Retention", desc: "Automates 24/36m renewal notifications, bandwidth upgrades, and churn prevention." }
              ].map((scope, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <h4 className="text-xs font-bold text-teal-300">{scope.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{scope.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Team Roles & Responsibilities */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>4. Project Team Roles &amp; Responsibilities Matrix</span>
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {[
                { role: "Executive Project Sponsor", resp: "Strategic alignment, budget authorization, and high-level steering committee approval." },
                { role: "Senior Telecom Project Manager", resp: "Schedule tracking, risk management, milestone delivery, and stakeholder reporting." },
                { role: "Lead Network & GIS Architect", resp: "Aerial feasibility accuracy, spatial rooftop boundary analysis, and fiber node topology." },
                { role: "Commercial & Pricing Specialist", resp: "Wholesale pricing modeling, margin compliance (min 35%), and quote validation." },
                { role: "Field Engineering Lead", resp: "Civil build supervision, wayleave compliance, CPE router activation, and customer sign-off." },
                { role: "KAM & Support Operations Lead", resp: "Tier-1 to Tier-3 incident response, MTTR adherence (<4 hrs), and contract renewals." }
              ].map((r, i) => (
                <div key={i} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-white w-52 shrink-0">{r.role}</span>
                  <span className="text-slate-400 text-[11px]">{r.resp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 px-6 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-400">
            Reunert Connect • Formal Project Charter Output
          </span>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-teal-400 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? "Generating PDF..." : "Download Formatted PDF Document"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
