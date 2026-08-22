import React, { useState } from "react";
import ConnectNavLogo from "./ConnectNavLogo";
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
        "Premium & Broadband Business Links",
        "Secured Connectivity (Embedded UTM & SASE)",
        "Automated Multi-Vendor Feasibility Engine"
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
      {/* Hero Section matching the exact brand guidelines */}
      <div className="bg-[#0f1e41] rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-[#1b2f5b] relative overflow-hidden">
        {/* Background Decorative Glow Effect with brand teal */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0d8e91]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#43a9ac]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top Tagline and Brand Logo */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-[#091530]/80 border border-[#233866] rounded-2xl px-4 py-2 backdrop-blur-sm shadow-inner">
              <ConnectNavLogo light={true} className="text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d8e91]/20 border border-[#43a9ac]/40 text-[#43a9ac] text-xs font-bold tracking-wide font-display">
              <Sparkles className="w-3.5 h-3.5 text-[#43a9ac]" />
              <span>Digital Telecom Marketplace</span>
            </div>
          </div>

          {/* Headline 1 */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-tight">
            <span className="text-[#43a9ac]">Reunert Connect</span>
          </h1>

          {/* Headline 2: Businesses Connected Without Limits. */}
          <h2 className="text-xl sm:text-3xl font-bold text-slate-100 tracking-tight font-display">
            Businesses Connected Without Limits.
          </h2>

          {/* Subtitle / Line 3: Feasibility. Communications. Smart Networking. One Marketplace. */}
          <p className="text-base sm:text-lg text-slate-200 font-normal max-w-2xl leading-relaxed font-sans">
            Feasibility. Communications. Smart Networking. One Marketplace.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigateTab("onboarding")}
              className="px-6 py-3.5 rounded-xl bg-[#0d8e91] hover:bg-[#0b7a7c] text-white font-extrabold text-sm transition-all shadow-lg hover:shadow-[#0d8e91]/30 flex items-center gap-2 cursor-pointer font-display"
            >
              <span>Launch Lead-to-Cash Workflow</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => onNavigateTab("feasibility")}
              className="px-6 py-3.5 rounded-xl bg-[#16274e] hover:bg-[#1f3466] text-slate-100 border border-[#2e4577] font-bold text-sm transition-all flex items-center gap-2 cursor-pointer font-display"
            >
              <Globe className="w-4 h-4 text-[#43a9ac]" />
              <span>Instant Coverage Lookup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Core Pillars (Matching the exact 4 boxes from mockup) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0f1e41] font-display">Core Service Categories</h3>
            <p className="text-xs text-slate-500 font-sans">Select any module to inspect features or jump straight into execution.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0d8e91] bg-[#e6f4f4] px-3 py-1 rounded-full border border-[#b2e2e3]">
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
                    ? "border-[#0d8e91] ring-2 ring-[#0d8e91]/20 bg-[#F4F7F9]" 
                    : "border-[#0f1e41]/20 hover:border-[#0d8e91]"
                }`}
              >
                <div>
                  {/* Card Header with Monolinear Teal Icon & Title */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0f1e41] text-[#43a9ac] flex items-center justify-center shrink-0 border border-[#1b2f5b] group-hover:bg-[#0d8e91] group-hover:text-white transition-colors">
                        <IconComponent className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d8e91] bg-[#e6f4f4] px-2 py-0.5 rounded border border-[#b2e2e3] font-display">
                          {pillar.badge}
                        </span>
                        <h4 className="text-xl font-bold text-[#0f1e41] font-display mt-0.5">
                          {pillar.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-sm font-semibold text-[#0f1e41] mb-2 font-display">
                    {pillar.tagline}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-sans">
                    {pillar.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 mb-6 bg-[#F4F7F9] p-4 rounded-xl border border-slate-200/80 font-sans">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f1e41]/60 block mb-1 font-display">
                      Key Capabilities:
                    </span>
                    {pillar.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#0f1e41]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0d8e91] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 mb-6 text-center font-sans">
                    {pillar.stats.map((st, i) => (
                      <div key={i} className="bg-[#F4F7F9] p-2 rounded-lg border border-slate-200/50">
                        <span className="text-[10px] text-slate-500 block font-medium">{st.label}</span>
                        <span className="text-xs font-bold text-[#0f1e41] font-display">{st.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedPillar(isSelected ? null : pillar.id)}
                    className="text-xs text-slate-600 hover:text-[#0f1e41] font-semibold flex items-center gap-1 cursor-pointer font-display"
                  >
                    <span>{isSelected ? "Hide Specs" : "View Details"}</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab(pillar.targetTab)}
                    className="px-4 py-2.5 rounded-xl bg-[#0f1e41] hover:bg-[#0d8e91] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs font-display"
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
            <Zap className="w-4 h-4 text-[#0d8e91]" />
            <h4 className="text-sm font-extrabold text-[#0f1e41] font-display">Seamless End-to-End Orchestration</h4>
          </div>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            From initial customer onboarding through feasibility, margin check, civil installation, and SLA support.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab("analytics")}
            className="px-4 py-2.5 rounded-xl bg-[#F4F7F9] hover:bg-slate-200 text-[#0f1e41] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer font-display border border-slate-200"
          >
            <BarChart3 className="w-4 h-4 text-[#0d8e91]" />
            <span>Executive Visibility</span>
          </button>

          <button
            onClick={() => onNavigateTab("onboarding")}
            className="px-5 py-2.5 rounded-xl bg-[#0d8e91] hover:bg-[#0b7a7c] text-white font-extrabold text-xs transition-colors shadow-xs flex items-center gap-2 cursor-pointer font-display"
          >
            <span>Begin Phase 1 Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
