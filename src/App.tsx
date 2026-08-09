import React, { useState, useEffect } from "react";
import { 
  Building, 
  Layers, 
  MapPin, 
  ClipboardCheck, 
  Network, 
  TrendingUp, 
  MessageSquare, 
  User, 
  Settings, 
  HelpCircle,
  TrendingDown,
  RefreshCw,
  Award,
  Server,
  Sparkles
} from "lucide-react";

// Types
import { Lead, FeasibilityStudy, Quotation, OccupancyDocument, ProjectCase, SupportTicket, LifecycleRequest } from "./types";

// Mock Data
import { 
  INITIAL_LEADS, 
  INITIAL_FEASIBILITIES, 
  INITIAL_QUOTATIONS, 
  INITIAL_OCCUPANCIES, 
  INITIAL_CASES, 
  INITIAL_TICKETS,
  INITIAL_LIFECYCLE_REQUESTS
} from "./data";

// Subcomponents
import LandingPage from "./components/LandingPage";
import ConnectNavLogo from "./components/ConnectNavLogo";
import LeadCapture from "./components/LeadCapture";
import FeasibilityProduct from "./components/FeasibilityProduct";
import ProcurementVerification from "./components/ProcurementVerification";
import DeliveryServices from "./components/DeliveryServices";
import EngineeringPhase from "./components/EngineeringPhase";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import CustomerSupport from "./components/CustomerSupport";
import OmniAgent from "./components/OmniAgent";
import ContractLifecycle from "./components/ContractLifecycle";

export default function App() {
  // Shared state synchronized with localStorage
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem("r_leads");
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [feasibilities, setFeasibilities] = useState<FeasibilityStudy[]>(() => {
    const saved = localStorage.getItem("r_feas");
    return saved ? JSON.parse(saved) : INITIAL_FEASIBILITIES;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem("r_quotes");
    return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
  });

  const [occupancies, setOccupancies] = useState<OccupancyDocument[]>(() => {
    const saved = localStorage.getItem("r_occupancies");
    return saved ? JSON.parse(saved) : INITIAL_OCCUPANCIES;
  });

  const [cases, setCases] = useState<ProjectCase[]>(() => {
    const saved = localStorage.getItem("r_cases");
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem("r_tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [lifecycleRequests, setLifecycleRequests] = useState<LifecycleRequest[]>(() => {
    const saved = localStorage.getItem("r_lifecycles");
    return saved ? JSON.parse(saved) : INITIAL_LIFECYCLE_REQUESTS;
  });

  // Selected active lead
  const [selectedLeadId, setSelectedLeadId] = useState<string>(() => {
    const saved = localStorage.getItem("r_sel_lead");
    return saved ? saved : INITIAL_LEADS[0].id;
  });

  // Role persona selector for prototype testing
  const [activePersona, setActivePersona] = useState<string>(() => {
    const saved = localStorage.getItem("r_sel_persona");
    return saved ? saved : "Admin";
  });

  // Active workflow phase tab
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Save state on any change
  useEffect(() => {
    localStorage.setItem("r_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("r_feas", JSON.stringify(feasibilities));
  }, [feasibilities]);

  useEffect(() => {
    localStorage.setItem("r_quotes", JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem("r_occupancies", JSON.stringify(occupancies));
  }, [occupancies]);

  useEffect(() => {
    localStorage.setItem("r_cases", JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem("r_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("r_lifecycles", JSON.stringify(lifecycleRequests));
  }, [lifecycleRequests]);

  useEffect(() => {
    localStorage.setItem("r_sel_lead", selectedLeadId);
  }, [selectedLeadId]);

  useEffect(() => {
    localStorage.setItem("r_sel_persona", activePersona);
  }, [activePersona]);

  // Reset helper
  const handleResetSystem = () => {
    if (window.confirm("Are you sure you want to reset the prototype to its default simulation state?")) {
      localStorage.clear();
      setLeads(INITIAL_LEADS);
      setFeasibilities(INITIAL_FEASIBILITIES);
      setQuotations(INITIAL_QUOTATIONS);
      setOccupancies(INITIAL_OCCUPANCIES);
      setCases(INITIAL_CASES);
      setTickets(INITIAL_TICKETS);
      setLifecycleRequests(INITIAL_LIFECYCLE_REQUESTS);
      setSelectedLeadId(INITIAL_LEADS[0].id);
      setActivePersona("Admin");
      setActiveTab("landing");
    }
  };

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-teal-100 selection:text-teal-900" id="app-root">
      {/* 1. Global Reunert Connect Brand Header */}
      <header className="bg-[#1c2836] text-white border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <ConnectNavLogo light={true} className="text-white" />
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">Lead to Cash Workflow Engine</span>
            </div>
          </div>

          {/* Persona selector bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider hidden lg:inline">Active Persona:</span>
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex flex-wrap gap-1">
              {[
                { name: "Sales / Reseller", role: "Sales Agent" },
                { name: "Client", role: "Client Signatory" },
                { name: "Legal / Compliance", role: "Legal Review" },
                { name: "Legal / Procurement", role: "Procurement" },
                { name: "Project Manager", role: "Delivery Team" },
                { name: "Admin", role: "Full View" }
              ].map(per => (
                <button
                  key={per.name}
                  onClick={() => setActivePersona(per.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activePersona === per.name
                      ? "bg-teal-600 text-white shadow-xs"
                      : "text-slate-350 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {per.role}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleResetSystem}
              title="Reset Database to default mock values"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Target Active Lead context display bar */}
      {activeLead && (
        <div className="bg-slate-900 text-slate-300 py-2.5 border-b border-slate-800 text-xs px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Active Project Context:</span>
              <span className="font-bold text-white text-xs">{activeLead.companyName}</span>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">ID: {activeLead.id}</span>
              <span className="text-[10px] bg-teal-900/40 text-teal-400 border border-teal-800/60 px-2 py-0.5 rounded-full font-semibold">Stage: {activeLead.status.replace("_", " ")}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Channel Reseller: <strong className="text-slate-200">{activeLead.resellerName}</strong></span>
              <span className="hidden md:inline">Onboarding Date: <strong className="text-slate-200">{new Date(activeLead.createdAt).toLocaleDateString()}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Primary Tab Section for Lead to Cash Phases */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200">
          {[
            { id: "landing", label: "Phase 1: ConnectIQ Landing", icon: Sparkles },
            { id: "onboarding", label: "Phase 1: Onboarding Flow", icon: Building },
            { id: "feasibility", label: "Phase 2: Feasibility & Quote", icon: MapPin },
            { id: "margin", label: "Phase 3: Margin & Handoff", icon: ClipboardCheck },
            { id: "delivery", label: "Phase 4: Connectivity Delivery", icon: Network },
            { id: "engineering", label: "Phase 5: Field & Remote Engineering", icon: Server },
            { id: "support", label: "Phase 6: Support & KAM Chat", icon: MessageSquare },
            { id: "lifecycle", label: "Phase 7: Contract Lifecycle", icon: RefreshCw },
            { id: "analytics", label: "Executive Visibility", icon: TrendingUp }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2 cursor-pointer ${
                  isTabActive
                    ? "bg-teal-600 border-teal-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? "text-teal-200" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4. Tab Panels */}
        <div className="flex-1 pb-10">
          {activeTab === "landing" && (
            <LandingPage
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              activeLeadCompanyName={activeLead?.companyName}
            />
          )}

          {activeTab === "onboarding" && (
            <LeadCapture
              leads={leads}
              setLeads={setLeads}
              activePersona={activePersona}
              onSelectLead={setSelectedLeadId}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "feasibility" && (
            <FeasibilityProduct
              leads={leads}
              feasibilities={feasibilities}
              setFeasibilities={setFeasibilities}
              quotations={quotations}
              setQuotations={setQuotations}
              occupancies={occupancies}
              setOccupancies={setOccupancies}
              activePersona={activePersona}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "margin" && (
            <ProcurementVerification
              leads={leads}
              quotations={quotations}
              setQuotations={setQuotations}
              cases={cases}
              setCases={setCases}
              occupancies={occupancies}
              setOccupancies={setOccupancies}
              activePersona={activePersona}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "delivery" && (
            <DeliveryServices
              leads={leads}
              cases={cases}
              setCases={setCases}
              quotations={quotations}
              setQuotations={setQuotations}
              activePersona={activePersona}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "engineering" && (
            <EngineeringPhase
              leads={leads}
              cases={cases}
              setCases={setCases}
              quotations={quotations}
              activePersona={activePersona}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "support" && (
            <CustomerSupport
              leads={leads}
              cases={cases}
              tickets={tickets}
              setTickets={setTickets}
              selectedLeadId={selectedLeadId}
            />
          )}

          {activeTab === "lifecycle" && (
            <ContractLifecycle
              leads={leads}
              cases={cases}
              quotations={quotations}
              lifecycleRequests={lifecycleRequests}
              setLifecycleRequests={setLifecycleRequests}
              activePersona={activePersona}
              selectedLeadId={selectedLeadId}
            />
          )}


          {activeTab === "analytics" && (
            <ExecutiveDashboard
              leads={leads}
              quotations={quotations}
              cases={cases}
              tickets={tickets}
            />
          )}
        </div>
      </div>

      {/* 5. humble footer (strictly obeying aesthetic pairs) */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-500 mt-auto text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ConnectNAV. All rights reserved. Platform optimized for enterprise compliance regulations.</p>
          <p className="font-mono text-[10px] text-slate-600">L2C-VERSION: 1.4.0-PROTOTYPE</p>
        </div>
      </footer>

      {/* Global Context-Aware AI Agent Widget */}
      <OmniAgent
        leads={leads}
        quotations={quotations}
        cases={cases}
        tickets={tickets}
        selectedLeadId={selectedLeadId}
        activePersona={activePersona}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
