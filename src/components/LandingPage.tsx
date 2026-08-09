import React, { useState } from "react";
import { 
  Wifi, 
  PhoneCall, 
  ShieldCheck, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Layers, 
  Zap, 
  Activity, 
  ChevronRight,
  BarChart3,
  Lock,
  Headphones,
  Sliders
} from "lucide-react";

interface LandingPageProps {
  onNavigateTab: (tabId: string) => void;
  activeLeadCompanyName?: string;
}

export default function LandingPage({ onNavigateTab, activeLeadCompanyName }: LandingPageProps) {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  const pillars = [
    {
      id: "connectivity",
      title: "Connectivity",
      icon: Wifi,
      badge: "Core Infrastructure",
      tagline: "High-speed enterprise fiber, fixed wireless & dedicated link aggregation.",
      description: "Aggregating multi-vendor fiber networks, P2P microwave links, and SD-WAN architectures with automated coverage feasibility.",
      stats: [
        { label: "Max Speed", value: "10 Gbps" },
        { label: "Target SLA", value: "99.95%" },
        { label: "Coverage Feasibility", value: "Instant" }
      ],
      features: [
        "Symmetric Enterprise Dedicated Fiber",
        "Redundant Fixed Wireless (AirLink)",
        "Automated Multi-Vendor Feasibility Engine",
        "Dynamic Bandwidth Scaling on Demand"
      ],
      targetTab: "onboarding",
      actionLabel: "Start Onboarding & Feasibility"
    },
    {
      id: "voice",
      title: "Voice Pabx & Voice Cloud",
      icon: PhoneCall,
      badge: "Unified Communications",
      tagline: "Next-gen Cloud PBX, SIP trunking & voice automation.",
      description: "Crystal-clear HD voice routing, scalable virtual extensions, AI voice agent integration, and enterprise PSTN connectivity.",
      stats: [
        { label: "Audio Quality", value: "HD Wideband" },
        { label: "Concurrence", value: "Unlimited" },
        { label: "Deployment", value: "Zero-Touch" }
      ],
      features: [
        "Hosted Virtual Cloud PBX Management",
        "Direct SIP Trunk Aggregation",
        "AI Interactive Voice Response (IVR)",
        "Unified Mobile & Desktop Softphones"
      ],
      targetTab: "support",
      actionLabel: "Explore Voice Solutions"
    },
    {
      id: "security",
      title: "Security",
      icon: ShieldCheck,
      badge: "Cyber Defense & Compliance",
      tagline: "Zero-Trust network access, SASE & regulatory compliance.",
      description: "Comprehensive perimeter protection, automated FICA/NCA audit compliance, threat detection, and encrypted site-to-site tunnels.",
      stats: [
        { label: "Compliance", value: "FICA & NCA" },
        { label: "Protection", value: "24/7 SASE" },
        { label: "Encryption", value: "AES-256 GCM" }
      ],
      features: [
        "Next-Generation Firewall (NGFW)",
        "Secure Access Service Edge (SASE)",
        "Automated FICA & Regulatory Compliance",
        "Real-Time Network Anomaly Detection"
      ],
      targetTab: "margin",
      actionLabel: "View Security & Compliance"
    },
    {
      id: "managed",
      title: "Managed Services",
      icon: Server,
      badge: "24/7 NOC & Field Engineering",
      tagline: "Proactive SLA management, field dispatch & remote engineering.",
      description: "End-to-end network operations center (NOC) monitoring, hardware staging, field civil engineering, and dedicated account support.",
      stats: [
        { label: "NOC Monitor", value: "24/7/365" },
        { label: "Field Dispatch", value: "< 4 Hours" },
        { label: "Resolution SLA", value: "Gold Tier" }
      ],
      features: [
        "24/7 Network Operations Center (NOC)",
        "Proactive Performance & SLA Alerting",
        "Field Civil & Optical Fiber Maintenance",
        "Dedicated Key Account Management (KAM)"
      ],
      targetTab: "engineering",
      actionLabel: "Go to Field & Engineering"
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn" id="connectiq-landing-page">
      {/* Hero Section matching the user mockup exact typography hierarchy */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Background Decorative Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>ConnectIQ Digital Marketplace</span>
          </div>

          {/* Headline 1: Reunert ConnectIQ */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
            Reunert <span className="text-teal-400 underline decoration-teal-500/40 underline-offset-8">ConnectIQ</span>
          </h1>

          {/* Headline 2: Businesses Connected Without Limits. */}
          <h2 className="text-xl sm:text-3xl font-bold text-slate-200 tracking-tight">
            Businesses Connected Without Limits.
          </h2>

          {/* Subtitle / Line 3: Feasibility. Communications. Smart Networking. One Marketplace. */}
          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
            Feasibility. Communications. Smart Networking. One Marketplace.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigateTab("onboarding")}
              className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg hover:shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Lead-to-Cash Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab("feasibility")}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-teal-400" />
              <span>Instant Coverage Lookup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Core Pillars (Matching the exact 4 boxes from mockup) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-sans">Core Service Categories</h3>
            <p className="text-xs text-slate-500">Select any module to inspect features or jump straight into execution.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            4 Integrated Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            const isSelected = selectedPillar === pillar.id;

            return (
              <div
                key={pillar.id}
                className={`group relative bg-white rounded-2xl p-7 border-2 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isSelected 
                    ? "border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/10" 
                    : "border-slate-800 hover:border-teal-600"
                }`}
              >
                <div>
                  {/* Card Header with Icon & Title */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center shrink-0 border border-slate-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {pillar.badge}
                        </span>
                        <h4 className="text-xl font-black text-slate-900 font-sans mt-0.5">
                          {pillar.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    {pillar.tagline}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Capabilities:
                    </span>
                    {pillar.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 mb-6 text-center">
                    {pillar.stats.map((st, i) => (
                      <div key={i} className="bg-slate-50/80 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 block font-medium">{st.label}</span>
                        <span className="text-xs font-bold text-slate-800">{st.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedPillar(isSelected ? null : pillar.id)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isSelected ? "Hide Specs" : "View Details"}</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab(pillar.targetTab)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{pillar.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Lead-to-Cash Overview Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-extrabold text-slate-900">Seamless End-to-End Orchestration</h4>
          </div>
          <p className="text-xs text-slate-500">
            From initial customer onboarding through feasibility, margin check, civil installation, and SLA support.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab("analytics")}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Executive Visibility</span>
          </button>

          <button
            onClick={() => onNavigateTab("onboarding")}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Begin Phase 1 Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
