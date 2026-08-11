import React, { useState } from "react";
import {
  Megaphone,
  Target,
  Sparkles,
  Users,
  Compass,
  Building2,
  TrendingUp,
  Award,
  BarChart3,
  CheckCircle2,
  Share2,
  Printer,
  Download,
  Zap,
  Layers,
  ArrowRight,
  Search,
  Globe,
  Mail,
  PieChart,
  DollarSign,
  ChevronRight,
  FileText,
  BadgePercent,
  Check,
  MousePointerClick,
  Sliders,
  Send,
  Building,
  ShieldCheck
} from "lucide-react";

interface GtmMarketingPlanViewProps {
  onNavigateTab?: (tabId: string) => void;
}

export default function GtmMarketingPlanView({ onNavigateTab }: GtmMarketingPlanViewProps) {
  const [activePillarTab, setActivePillarTab] = useState<number>(1);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("resellers");

  // Interactive ROI Budget Estimator state
  const [monthlyMarketingSpend, setMonthlyMarketingSpend] = useState<number>(150000); // ZAR
  const [targetPartnerCount, setTargetPartnerCount] = useState<number>(25);

  // Derived Marketing Projections
  const estimatedLeadsGenerated = Math.round((monthlyMarketingSpend / 1500) * (targetPartnerCount / 10));
  const estimatedQuotesGenerated = Math.round(estimatedLeadsGenerated * 0.75);
  const estimatedClosedDeals = Math.round(estimatedQuotesGenerated * 0.35);
  const estimatedMonthlyMrcRevenue = estimatedClosedDeals * 11500; // Average R11,500/pm MRC
  const estimatedTcvLocked = estimatedMonthlyMrcRevenue * 24; // 24-month avg term

  const handleShareSummary = () => {
    const text = `ConnectIQ Go-To-Market & Marketing Strategy Overview:
• Core Positioning: "From 7 Days to 3 Minutes: The Speed of Modern B2B Telecom."
• 4 Pillars: 
  1. Partner-First Channel Enablement (Reseller Portals & 10% Commissions)
  2. Precinct ABM (High-Density Business Parks & GIS Rooftop Audits)
  3. Product-Led Growth (Embeddable Self-Service Quoting Widgets)
  4. Search & Social (Google Intent Ads & LinkedIn Thought Leadership)
• Target ROI: R150k monthly budget yields ~R${(estimatedTcvLocked / 1000000).toFixed(2)}M in 24-Month TCV Pipeline!`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800" id="printable-gtm-plan">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-teal-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
              <Megaphone className="w-3.5 h-3.5 text-teal-300" />
              Go-To-Market (GTM) & Channel Marketing Strategy
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ConnectIQ Go-To-Market Plan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-100">
                Positioning, Acquisition Pillars & Growth Engine
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A targeted multi-channel strategy designed to convert ICT resellers, enterprise IT buyers, and commercial landlords by showcasing instant 3-minute GIS quoting and 100% margin compliance.
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
                  Copied GTM Summary!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-teal-400" />
                  Copy Strategy Brief
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-teal-950/40"
            >
              <Printer className="w-4 h-4" />
              Print / PDF Presentation
            </button>
          </div>
        </div>

        {/* Strategic Headlines Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Primary Hero Campaign</span>
            <span className="text-teal-300 font-extrabold text-sm block mt-0.5">"From 7 Days to 3 Minutes"</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Primary Channel</span>
            <span className="text-emerald-300 font-extrabold text-sm block mt-0.5">ICT Resellers & MSPs</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Key Hook</span>
            <span className="text-teal-300 font-extrabold text-sm block mt-0.5">Instant GIS Feasibility Audit</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Target Conversion</span>
            <span className="text-emerald-300 font-extrabold text-sm block mt-0.5">&gt; 40% Quote-to-PO Rate</span>
          </div>
        </div>
      </div>

      {/* 2. CORE VALUE POSITIONING STATEMENT */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          Brand Positioning & Value Proposition
        </div>

        <div className="p-6 bg-gradient-to-r from-teal-50 via-emerald-50 to-slate-50 rounded-2xl border border-teal-200/80 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">
            "The Quoting Platform Built to Make Telecom Sales Reps & Resellers Win First."
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong>For ICT resellers, telecom agents, and enterprise IT leaders</strong> who are frustrated by slow 7-day vendor quote turnaround times and manual spreadsheet pricing errors, <strong>ConnectIQ</strong> is the automated B2B telecom platform that provides instant GIS spatial feasibility, guaranteed gross margin compliance (&ge;35%), and co-branded PDF quote delivery in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-wider block">Tagline Option 1</span>
            <p className="text-xs font-bold text-slate-900">"From 7 Days to 3 Minutes: The Speed of Modern B2B Telecom."</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider block">Tagline Option 2</span>
            <p className="text-xs font-bold text-slate-900">"Instant GIS Feasibility. Guaranteed Margins. Zero Delay."</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-teal-700 font-extrabold uppercase tracking-wider block">Tagline Option 3</span>
            <p className="text-xs font-bold text-slate-900">"ConnectIQ: Where B2B Telecom Deals Get Closed First."</p>
          </div>
        </div>
      </div>

      {/* 3. FOUR STRATEGIC GTM PILLARS (INTERACTIVE DEEP-DIVE) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                The 4 Pillars of the ConnectIQ Growth Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on a pillar below to inspect the campaign mechanics, channels, and conversion hooks.
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full uppercase">
            Omni-Channel Execution
          </span>
        </div>

        {/* Pillar Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 print:hidden">
          {[
            { id: 1, title: "1. Partner-First Channel", sub: "Resellers & MSP Enablement", icon: Users },
            { id: 2, title: "2. Precinct ABM", sub: "High-Density Business Parks", icon: Building2 },
            { id: 3, title: "3. Product-Led Growth", sub: "Embeddable Quoting Widgets", icon: Zap },
            { id: 4, title: "4. Search & Social Ads", sub: "High-Intent Lead Gen", icon: Search }
          ].map(p => {
            const Icon = p.icon;
            const isSelected = activePillarTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillarTab(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/50"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-teal-400" : "text-teal-600"}`} />
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <h3 className="text-xs font-black tracking-tight">{p.title}</h3>
                <p className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>{p.sub}</p>
              </button>
            );
          })}
        </div>

        {/* Pillar Details Content Cards */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-6">
          {activePillarTab === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">1</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Pillar 1: Partner-First Channel Enablement ("Sell Faster, Earn Sooner")</h3>
                    <p className="text-xs text-teal-700 font-bold">Primary Target: ICT Resellers, Managed Service Providers (MSPs), Telecom Brokers</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">Weight: 40% Budget</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Co-Branded Quoting Portal</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Provide resellers with custom-branded quoting dashboards and instant co-branded PDF quote downloads containing their own logo and partner ID.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Accelerated Commission Payouts</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Offer immediate 10% reseller channel commission payouts upon PO upload and margin verification, shortening partner cash flow loops.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs font-mono">"3-Minute Demo" Partner Roadshows</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Quarterly lunch-and-learn roadshows showing reseller sales teams how to quote enterprise fiber live in front of clients during initial sales pitches.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePillarTab === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Pillar 2: Account-Based Marketing (ABM) for Top Business Precincts</h3>
                    <p className="text-xs text-emerald-700 font-bold">Primary Target: Sandton, Rosebank, Midrand, Umhlanga & Century City Business Parks</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">Weight: 25% Budget</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Pre-Vetted GIS Precinct Campaigns</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Target IT Directors in specific business parks where fiber line-of-sight and wholesale fiber POP proximity are already 100% verified.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Executive Direct Mailer Boxes</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Send key CTOs a physical "Instant Connectivity Audit" box with a personalized QR code linking directly to their building's GIS feasibility map.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Landlord Fiber-Ready Certification</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Partner with commercial property developers to badge buildings as "ConnectIQ Fiber Ready", accelerating tenant onboarding.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePillarTab === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs">3</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Pillar 3: Product-Led Growth (PLG) & Free Instant GIS Audits</h3>
                    <p className="text-xs text-teal-700 font-bold">Primary Target: Self-Serve Inbound Web Traffic & Partner Embeds</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">Weight: 20% Budget</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Embeddable Partner Feasibility Widget</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Provide a lightweight JS widget allowing partner websites to embed instant address feasibility checks, capturing inbound leads automatically.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Free Instant GIS Audit Tool</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Allow IT managers to type in an address and instantly view 10 - 1000 Mbps bandwidth options without needing to log in or wait for a callback.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Annual Telecom Feasibility Report</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Publish an authoritative annual benchmark report titled *"The Cost of Delayed Quoting in Enterprise Telecoms"* to build organic domain authority.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activePillarTab === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">4</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Pillar 4: High-Intent Digital Search & LinkedIn Thought Leadership</h3>
                    <p className="text-xs text-slate-700 font-bold">Primary Target: High-Intent B2B Search Terms & Executive LinkedIn Feeds</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">Weight: 15% Budget</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Google High-Intent Search Ads</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Capture active buyers searching for keywords like *"Enterprise Fiber Sandton"*, *"Business Uncapped Wireless"*, and *"Fastest B2B Telecom Quote"*.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">LinkedIn Executive Thought Leadership</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Promote executive opinion pieces dissecting why legacy telecom providers take 10 days to quote and how automated GIS changes the industry.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-extrabold text-slate-800 block text-xs">Retargeting & Case Study Ads</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Retarget visitors who viewed quotes with customer case studies demonstrating 100% margin compliance and rapid 14-day installation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BUYER PERSONAS & VALUE HOOKS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Target Buyer Personas & Messaging Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tailored value propositions designed for each key decision-maker segment.
            </p>
          </div>

          {/* Persona selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold print:hidden">
            <button
              onClick={() => setSelectedPersona("resellers")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPersona === "resellers" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ICT Resellers / MSPs
            </button>
            <button
              onClick={() => setSelectedPersona("enterprise")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPersona === "enterprise" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Enterprise IT Directors
            </button>
            <button
              onClick={() => setSelectedPersona("landlords")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPersona === "landlords" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Property Landlords
            </button>
          </div>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Persona 1 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            selectedPersona === "resellers" ? "bg-teal-50/60 border-teal-300 ring-2 ring-teal-500/20" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">1. ICT Resellers & MSP Partners</h3>
              <span className="inline-block text-[10px] bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold">Primary Revenue Driver</span>

              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Core Pain Point</span>
                  <p className="text-slate-700">Losing deals because vendor quotes take 5–10 days while clients look elsewhere.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ConnectIQ Solution</span>
                  <p className="text-slate-900 font-bold">Instant 3-minute GIS quotes + co-branded PDF + guaranteed 10% commission payout.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Call to Action Hook</span>
                  <p className="text-teal-700 font-extrabold text-[11px]">"Quote enterprise fiber live during your client meetings."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Persona 2 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            selectedPersona === "enterprise" ? "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">2. Enterprise CTOs & IT Heads</h3>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">End-User Buyer</span>

              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Core Pain Point</span>
                  <p className="text-slate-700">Unclear SLA guarantees, hidden installation costs, and uncoordinated fiber civil works.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ConnectIQ Solution</span>
                  <p className="text-slate-900 font-bold">Transparent MRC/NRC, live trenching tracking, and 2.4-hour MTTR SLA guarantees.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Call to Action Hook</span>
                  <p className="text-emerald-700 font-extrabold text-[11px]">"Audit your office building's fiber capacity instantly."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Persona 3 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            selectedPersona === "landlords" ? "bg-slate-100 border-slate-300 ring-2 ring-slate-400/20" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">3. Commercial Property Landlords</h3>
              <span className="inline-block text-[10px] bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full font-bold">Strategic Alliance</span>

              <div className="space-y-2 pt-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Core Pain Point</span>
                  <p className="text-slate-700">New commercial tenants demanding immediate connectivity before signing office leases.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ConnectIQ Solution</span>
                  <p className="text-slate-900 font-bold">Pre-vetted Fiber-Ready precinct certification for commercial business parks.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Call to Action Hook</span>
                  <p className="text-slate-800 font-extrabold text-[11px]">"Make your commercial property 100% fiber-ready today."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE MARKETING ROI BUDGET & PIPELINE CALCULATOR */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Interactive GTM Marketing Budget & Pipeline ROI Estimator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate monthly marketing expenditure to project lead volume, quote conversions, and total 24-month contract value (TCV).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            Interactive ROI Simulation
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Controls Sliders */}
          <div className="space-y-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
            {/* Slider 1: Monthly Marketing Budget */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-slate-200 uppercase tracking-wider">
                  Monthly Marketing Budget (ZAR):
                </label>
                <span className="font-mono font-black text-teal-300 text-sm">
                  R {monthlyMarketingSpend.toLocaleString()} / pm
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="25000"
                value={monthlyMarketingSpend}
                onChange={(e) => setMonthlyMarketingSpend(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>R 50k</span>
                <span>R 250k</span>
                <span>R 500k</span>
              </div>
            </div>

            {/* Slider 2: Target Active Resellers */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-extrabold text-slate-200 uppercase tracking-wider">
                  Target Active Quoting Resellers:
                </label>
                <span className="font-mono font-black text-emerald-300 text-sm">
                  {targetPartnerCount} Partners
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={targetPartnerCount}
                onChange={(e) => setTargetPartnerCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5 Partners</span>
                <span>50 Partners</span>
                <span>100 Partners</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <span className="text-teal-400 font-extrabold block">Channel Allocation Breakdown:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10px]">
                <li>40% Partner Roadshows & Co-Branded Portal Development</li>
                <li>25% Precinct ABM Direct Mailer Boxes (Sandton/Rosebank)</li>
                <li>20% Product-Led Quoting Widget Distribution</li>
                <li>15% Google High-Intent Search & LinkedIn Ads</li>
              </ul>
            </div>
          </div>

          {/* Projected Outcomes Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Inbound Leads</span>
              <div className="text-2xl font-black font-mono text-white">{estimatedLeadsGenerated}</div>
              <p className="text-[10px] text-slate-400">Leads captured via GIS audit widget & ABM</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Est. Quotes Generated</span>
              <div className="text-2xl font-black font-mono text-teal-300">{estimatedQuotesGenerated}</div>
              <p className="text-[10px] text-slate-400">75% lead-to-instant-quote rate</p>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Est. Closed POs</span>
              <div className="text-2xl font-black font-mono text-emerald-300">{estimatedClosedDeals}</div>
              <p className="text-[10px] text-slate-400">35% quote-to-PO win rate</p>
            </div>

            <div className="bg-gradient-to-br from-teal-900 to-emerald-950 p-4 rounded-2xl border border-teal-500/50 space-y-1 shadow-lg">
              <span className="text-[10px] text-teal-300 font-extrabold uppercase tracking-wider block">24-Mo Pipeline TCV</span>
              <div className="text-2xl font-black font-mono text-white">
                R {(estimatedTcvLocked / 1000000).toFixed(2)} M
              </div>
              <p className="text-[10px] text-teal-200/80">Locked 24-month contract value</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. QUARTERLY GTM ROLLOUT TIMELINE (Q1 - Q4) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Quarterly Execution & Launch Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Phased 12-month marketing rollout strategy aligned with platform releases.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            4-Quarter Roadmap
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Q1 */}
          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-teal-800 text-xs uppercase">Q1: Launch & Partner Beta</span>
              <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded">Active</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>Launch Partner Onboarding & GIS Quoting MVP</li>
              <li>Recruit Top 15 ICT Reseller Beta Partners</li>
              <li>Deploy Sandton Precinct GIS Feasibility Database</li>
            </ul>
          </div>

          {/* Q2 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-xs uppercase">Q2: Precinct ABM Expansion</span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Planned</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>Roll out Executive Direct Mailer Boxes to Rosebank & Midrand</li>
              <li>Launch Embeddable Partner Quoting JS Widget</li>
              <li>Initiate Google High-Intent B2B Search Ad Campaigns</li>
            </ul>
          </div>

          {/* Q3 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-xs uppercase">Q3: National Scale & Media</span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Planned</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>Expand GIS feasibility to Cape Town & Durban Precincts</li>
              <li>Publish Annual Telecom Feasibility Benchmark Report</li>
              <li>Host National Partner Roadshow & Incentive Summit</li>
            </ul>
          </div>

          {/* Q4 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-xs uppercase">Q4: Enterprise Retargeting</span>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">Planned</span>
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
              <li>Deploy automated 12/24/36-mo contract renewal alerts</li>
              <li>Launch Landlord "Fiber-Ready" Precinct Badging</li>
              <li>Optimize Quote-to-PO conversion funnels to &gt;45%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM NAVIGATION / CALL TO ACTION */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl text-white border border-teal-800/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            Validate the Live ConnectIQ Engine Now
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Test the live <strong>Onboarding Portal</strong> and <strong>GIS Feasibility & Quoting Engine</strong> directly inside the application prototype tabs.
          </p>
        </div>

        {onNavigateTab && (
          <div className="flex items-center gap-3 shrink-0 print:hidden">
            <button
              onClick={() => onNavigateTab("onboarding")}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Partner Onboarding
            </button>
            <button
              onClick={() => onNavigateTab("feasibility")}
              className="px-4 py-2.5 bg-teal-500 text-slate-950 hover:bg-teal-400 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
            >
              Instant GIS Quoting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
