import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText, 
  TrendingUp, 
  Network, 
  ShieldCheck, 
  Clock,
  ChevronDown
} from "lucide-react";
import { Lead, ProjectCase, SupportTicket, ChatMessage, Quotation } from "../types";

interface OmniAgentProps {
  leads: Lead[];
  quotations: Quotation[];
  cases: ProjectCase[];
  tickets: SupportTicket[];
  selectedLeadId: string;
  activePersona: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Custom simple parser to safely format Markdown returned by Gemini 3.5 Flash
// It prevents using external packages that might conflict with React 19 peer dependencies
function formatMessageText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // 1. Headings
    if (line.startsWith("### ")) {
      return (
        <h4 key={i} className="text-xs font-bold text-slate-800 mt-3 mb-1.5 font-sans tracking-tight">
          {line.replace("### ", "")}
        </h4>
      );
    }
    if (line.startsWith("## ") || line.startsWith("# ")) {
      return (
        <h3 key={i} className="text-sm font-extrabold text-slate-900 mt-4 mb-2 font-sans tracking-tight">
          {line.replace(/^#+\s+/, "")}
        </h3>
      );
    }

    // 2. Bullet Lists
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const content = line.trim().replace(/^[\-\*]\s+/, "");
      return (
        <ul key={i} className="list-disc list-inside pl-2 text-slate-700 space-y-1 my-1">
          <li className="text-[11px] leading-relaxed">
            {renderInlineStyles(content)}
          </li>
        </ul>
      );
    }

    // 3. Numbered Lists
    if (/^\d+\.\s+/.test(line.trim())) {
      const content = line.trim().replace(/^\d+\.\s+/, "");
      return (
        <ol key={i} className="list-decimal list-inside pl-2 text-slate-700 space-y-1 my-1">
          <li className="text-[11px] leading-relaxed">
            {renderInlineStyles(content)}
          </li>
        </ol>
      );
    }

    // 4. Horizontal Rule
    if (line.trim() === "---") {
      return <hr key={i} className="border-slate-100 my-3" />;
    }

    // 5. Normal paragraphs
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    return (
      <p key={i} className="text-[11px] leading-relaxed text-slate-700 mb-1.5 font-sans">
        {renderInlineStyles(line)}
      </p>
    );
  });
}

// Helper to render inline **bold** and `code` tags
function renderInlineStyles(text: string): React.ReactNode[] {
  // Regex to split by bold asterisks or inline code backticks
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-teal-700 border border-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function OmniAgent({
  leads,
  quotations,
  cases,
  tickets,
  selectedLeadId,
  activePersona,
  activeTab,
  setActiveTab
}: OmniAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id);
  const activeQuotation = quotations.find(q => q.leadId === activeLead?.id);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting message
  useEffect(() => {
    const greetingText = `Hello! I am **ConnectNAV Assist**, your intelligent Lead-to-Cash (L2C) workspace companion. 

I have full access to your environment context:
- **Active Lead**: \`${activeLead?.companyName || "None"}\` (Stage: \`${activeLead?.status || "None"}\`)
- **Active Persona**: \`${activePersona}\`
- **Current Tab**: \`${activeTab}\`

Ask me anything about margins, SLA terms, CIPC / FICA compliance status, link delivery, support tickets, or help navigating through the workflow stages. How can I help you today?`;

    setChatMessages([
      {
        id: "omni-greet",
        sender: "ConnectNAV Assist",
        text: greetingText,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [selectedLeadId, activePersona]);

  // Handle unread counts
  useEffect(() => {
    if (!isOpen && chatMessages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [chatMessages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      // Soft delay scroll to make sure DOM is fully updated
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, chatMessages]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || userInput;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `omni-u-${Date.now()}`,
      sender: "Client",
      text: messageText,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setUserInput("");
    setIsTyping(true);

    try {
      // Setup payload matching backend endpoint expected formats
      const currentContext = {
        activeTab,
        activePersona,
        activeLead: activeLead ? {
          id: activeLead.id,
          companyName: activeLead.companyName,
          clientName: activeLead.clientName,
          registrationNumber: activeLead.registrationNumber,
          vatNumber: activeLead.vatNumber,
          industry: activeLead.industry,
          address: activeLead.address,
          status: activeLead.status,
          resellerName: activeLead.resellerName,
          complianceResults: activeLead.complianceResults
        } : null,
        quotationsForLead: activeQuotation ? {
          networkOperator: activeQuotation.networkOperator,
          bandwidth: activeQuotation.bandwidth,
          mrc: activeQuotation.mrc,
          nrc: activeQuotation.nrc,
          marginPercentage: activeQuotation.marginPercentage,
          status: activeQuotation.status,
          termMonths: activeQuotation.termMonths
        } : null,
        activeCase: activeCase ? {
          id: activeCase.id,
          status: activeCase.status,
          routerInstalled: activeCase.routerInstalled,
          finalTestingPassed: activeCase.finalTestingPassed,
          clientSignedOff: activeCase.clientSignedOff,
          slaTerms: activeCase.slaTerms
        } : null,
        ticketsCount: tickets.length,
        openTicketsForLead: tickets.filter(t => t.projectCaseId === activeCase?.id && t.status !== "resolved")
      };

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({
            id: m.id,
            sender: m.sender === "Client" ? "Client" : "KAM",
            text: m.text,
            timestamp: m.timestamp
          })),
          currentContext
        })
      });

      if (response.ok) {
        const result = await response.json();
        const agentMsg: ChatMessage = {
          id: `omni-a-${Date.now()}`,
          sender: "ConnectNAV Assist",
          text: result.text,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, agentMsg]);
      } else {
        throw new Error();
      }
    } catch (err) {
      // Fallback answers based on current mock data context
      setTimeout(() => {
        let text = "I am currently running in backup mode. How can I assist you with standard parameters?";
        const ltext = messageText.toLowerCase();

        if (ltext.includes("fica") || ltext.includes("compliance") || ltext.includes("document")) {
          text = `Based on current records, **${activeLead.companyName}** has onboarding status of \`${activeLead.status.replace("_", " ")}\`. Uploaded documents are: CIPC certificate, banking credentials, and representative IDs. If you need to verify, switch to **Phase 3: Margin & Handoff** to review compliance approvals.`;
        } else if (ltext.includes("margin") || ltext.includes("quote") || ltext.includes("pricing")) {
          if (activeQuotation) {
            text = `For **${activeLead.companyName}**, we have a quote from **${activeQuotation.networkOperator}** of **${activeQuotation.bandwidth}** at **R ${activeQuotation.mrc.toLocaleString()} pm**. The profit margin is evaluated at **${activeQuotation.marginPercentage}%**. This matches standard commercial policies.`;
          } else {
            text = "There is no registered commercial quotation for this company yet. Go to **Phase 2: Feasibility & Quote** to launch studies and build quotes.";
          }
        } else if (ltext.includes("delivery") || ltext.includes("deploy") || ltext.includes("live") || ltext.includes("install")) {
          if (activeCase) {
            text = `Delivery stage for **${activeLead.companyName}** is: \`${activeCase.status.replace("_", " ")}\`. Router installation: **${activeCase.routerInstalled ? "Completed" : "Pending"}**. Handover testing: **${activeCase.finalTestingPassed ? "Passed" : "In Progress"}**.`;
          } else {
            text = "No connectivity delivery pipeline exists. Leads must first complete credit/compliance signoff to generate delivery cases.";
          }
        } else if (ltext.includes("help") || ltext.includes("how to") || ltext.includes("stage")) {
          text = `ConnectNAV operates a 7-phase Lead-to-Cash (L2C) workflow:
1. **Phase 1: Onboarding Flow** - Capture clients and upload legal paperwork.
2. **Phase 2: Feasibility & Quote** - Perform fiber checks and design quotes.
3. **Phase 3: Margin & Handoff** - Verify gross margins (baseline 35%) and verify FICA documents.
4. **Phase 4: Connectivity Delivery** - Civil route planning, landlord approval, and handover documents.
5. **Phase 5: Field & Remote Engineering** - Book field technicians, deploy hardware, and remote core data centre configurations.
6. **Phase 6: Support & KAM Chat** - Log service incidents and handle live SLA tickets.
7. **Phase 7: Contract Lifecycle** - Request service renewals, cancellations, outdoor transfers, and upgrades with Sales & Procurement vetting.`;
        }

        const agentMsg: ChatMessage = {
          id: `omni-fallback-${Date.now()}`,
          sender: "ConnectNAV Assist",
          text: text,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, agentMsg]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePresetClick = (question: string) => {
    handleSendMessage(question);
  };

  // Get preset questions relevant to current tab
  const getPresetQuestions = () => {
    const defaultPresets = ["What are the core L2C stages?", "Who is the active lead?"];
    if (activeTab === "onboarding") {
      return [
        "What is active lead's compliance status?",
        "How do I complete legal onboarding?",
        ...defaultPresets
      ];
    }
    if (activeTab === "feasibility") {
      return [
        "Show quotes available for active lead",
        "How is bandwidth feasibility checked?",
        ...defaultPresets
      ];
    }
    if (activeTab === "margin") {
      return [
        "Is margin verified for this lead?",
        "What compliance audit issues exist?",
        ...defaultPresets
      ];
    }
    if (activeTab === "delivery") {
      return [
        "What is the connectivity delivery status?",
        "Is site survey scheduled?",
        ...defaultPresets
      ];
    }
    if (activeTab === "support") {
      return [
        "Are there open SLA tickets?",
        "Tell me about the active SLA terms",
        ...defaultPresets
      ];
    }
    if (activeTab === "lifecycle") {
      return [
        "How do I request an upgrade or transfer?",
        "What is the vetting status for renewals?",
        ...defaultPresets
      ];
    }
    return defaultPresets;
  };

  return (
    <div id="omni-workspace-agent-root" className="fixed bottom-6 right-6 z-55 flex flex-col items-end">
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white rounded-full shadow-lg border border-teal-500/20 cursor-pointer font-bold text-xs"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span>ConnectNAV Assist</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[360px] sm:w-[400px] h-[580px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-[calc(100vw-32px)]"
          >
            {/* Header */}
            <div className="bg-[#0f1e41] text-white p-4 flex items-center justify-between border-b border-[#1b2f5b]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0d8e91] rounded-lg text-white">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-display text-white flex items-center gap-1.5">
                    ConnectNAV Assist
                  </h3>
                  <p className="text-[9px] text-[#43a9ac] font-mono tracking-wider uppercase">Reunert Connect AI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-[#16274e] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Context Indicator */}
            <div className="bg-slate-50 border-b border-slate-100 px-3.5 py-2 text-[10px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-slate-400">Context:</span>
              <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">{activePersona}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-700 font-bold max-w-[120px] truncate">{activeLead?.companyName || "No Lead"}</span>
              <span className="text-slate-400">|</span>
              <span className="text-teal-700 font-semibold">{activeTab.toUpperCase()}</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/55">
              {chatMessages.map(msg => {
                const isAgent = msg.sender !== "Client";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 max-w-[90%] ${isAgent ? "" : "ml-auto flex-row-reverse"}`}
                  >
                    {isAgent ? (
                      <div className="w-6 h-6 bg-teal-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-slate-750 text-white rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm mt-0.5">
                        U
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl shadow-xs border text-[11px] leading-relaxed ${
                        isAgent
                          ? "bg-white text-slate-800 border-slate-200/80 rounded-tl-none"
                          : "bg-[#0f1e41] text-white border-[#1b2f5b] rounded-tr-none"
                      }`}
                    >
                      {isAgent ? (
                        <div className="space-y-1.5">{formatMessageText(msg.text)}</div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      <span className={`block text-[8px] mt-1 text-right font-mono ${isAgent ? "text-slate-450" : "text-slate-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2 max-w-[90%]">
                  <div className="w-6 h-6 bg-teal-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200/80 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Presets / Suggestions */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider mb-1.5">Context Suggestions</p>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                {getPresetQuestions().map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(q)}
                    className="px-2.5 py-1 text-[10px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50/30 transition-all text-left cursor-pointer flex items-center gap-1 font-sans"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask about compliance, quotes, SLA..."
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-slate-55 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-sans text-slate-800 placeholder-slate-450"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
