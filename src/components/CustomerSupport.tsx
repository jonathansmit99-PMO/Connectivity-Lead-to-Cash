import React, { useState, useEffect, useRef } from "react";
import { Lead, ProjectCase, SupportTicket, ChatMessage } from "../types";
import { 
  Tv, 
  User, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Send, 
  Briefcase, 
  Layers, 
  Cpu,
  Loader2,
  BrainCircuit
} from "lucide-react";

interface CustomerSupportProps {
  leads: Lead[];
  cases: ProjectCase[];
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  selectedLeadId: string;
}

export default function CustomerSupport({
  leads,
  cases,
  tickets,
  setTickets,
  selectedLeadId
}: CustomerSupportProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id);

  // Filter support tickets for current lead
  const currentTickets = tickets.filter(t => t.projectCaseId === activeCase?.id);

  // State for logging a support call
  const [issueType, setIssueType] = useState<"Speed" | "Latency" | "Billing" | "Hardware" | "Other">("Speed");
  const [description, setDescription] = useState("");
  const [loggingCall, setLoggingCall] = useState(false);

  // State for KAM Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "msg-1", sender: "KAM", text: "Hello! I am your ConnectNAV Assist Key Account Manager (KAM) AI Assistant. How can I assist you with your Lead-to-Cash onboarding, FICA compliance reviews, or active service SLAs today?", timestamp: new Date().toISOString() }
  ]);
  const [userInput, setUserInput] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLogTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !activeCase) return;

    setLoggingCall(true);
    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `tck-${Date.now().toString().slice(-3)}`,
        projectCaseId: activeCase.id,
        companyName: activeLead.companyName,
        issueType: issueType,
        description: description,
        status: "open",
        loggedAt: new Date().toISOString()
      };

      setTickets(prev => [newTicket, ...prev]);
      setDescription("");
      setLoggingCall(false);
    }, 1200);
  };

  const handleSendChat = async () => {
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-u-${Date.now()}`,
      sender: "Client",
      text: userInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setSendingChat(true);

    try {
      // Send chat context to full-stack Gemini API endpoint
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          currentContext: {
            lead: activeLead,
            activeCase: activeCase
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const assistantMsg: ChatMessage = {
          id: `msg-a-${Date.now()}`,
          sender: "KAM",
          text: result.text,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error();
      }
    } catch {
      // Fallback response if Gemini fails
      setTimeout(() => {
        let text = "I've received your query. Let me connect you with our technical network desk to verify speed configurations and optical link parameters.";
        if (userInput.toLowerCase().includes("contract") || userInput.toLowerCase().includes("signed")) {
          text = `Checking your active contract details. Our Master Services Agreement was created for ${activeLead.companyName}. It outlines standard symmetrical port metrics with a 99.5% service uptime guarantee. Let me know if you'd like a physical PDF copy of terms.`;
        } else if (userInput.toLowerCase().includes("fica") || userInput.toLowerCase().includes("compliance")) {
          text = `Regarding your compliance files: We have recorded your registration and banking documents. Compliance status currently stands at '${activeLead.status}'. If you need to submit additional CIPC forms, let our compliance desk know.`;
        }
        const assistantMsg: ChatMessage = {
          id: `msg-a-${Date.now()}`,
          sender: "KAM",
          text: text,
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }, 1500);
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="support-panel-root">
      {/* Active Customer List and SLA Specs (Phase 4, Part 3) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-teal-600" />
            Live SLA Service Specs
          </h3>

          {activeCase && activeCase.status === "live" ? (
            <div className="space-y-3.5">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Connection Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-sm font-bold text-emerald-900">Line Active & Live</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Assigned Port:</span> <span className="font-semibold text-slate-800">VLAN {activeCase.handoverCertificate?.vlanId}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Network Class:</span> <span className="font-semibold text-slate-800">Gold SLA (99.5%)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">IP Subnet:</span> <span className="font-mono text-slate-800">{activeCase.handoverCertificate?.ipSubnet}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Support Hours:</span> <span className="font-semibold text-slate-800">24/7 Proactive Monitoring</span></div>
                <div className="flex justify-between"><span className="text-slate-400">MTTR Guarantee:</span> <span className="font-semibold text-slate-800">4 Hours</span></div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Service has not been deployed live yet.</p>
              <p className="text-[10px] text-slate-400 mt-1">SLA specs will populate here once router activation goes live.</p>
            </div>
          )}
        </div>

        {/* Support Call Logging Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-teal-600" />
            Log Support Ticket
          </h3>

          {activeCase && activeCase.status === "live" ? (
            <form onSubmit={handleLogTicket} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Classification</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Speed">Bandwidth Speed Issues</option>
                  <option value="Latency">High Latency or Packet Loss</option>
                  <option value="Billing">Billing & Remittance</option>
                  <option value="Hardware">Edge Router / CPE Issues</option>
                  <option value="Other">Other / General Request</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Problem Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Describe speed or hardware observations..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loggingCall}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1"
              >
                {loggingCall ? "Creating ticket..." : "Log Call with Support Desk"}
              </button>
            </form>
          ) : (
            <div className="p-3.5 bg-amber-50 text-amber-800 border border-amber-100 text-xs rounded-lg">
              Support call logging is restricted until the client's network connectivity has been set active by engineering.
            </div>
          )}
        </div>
      </div>

      {/* KAM Chat Area (Phase 4, Part 3) */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-[600px]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-slate-800">Key Account Manager (KAM) Chat</h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Powered by ConnectNAV Assist
              </p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">ID: {activeLead.id}</span>
        </div>

        {/* Chat message track */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 p-2 bg-slate-50/50 rounded-xl border border-slate-100/40">
          {chatMessages.map((msg) => {
            const isKAM = msg.sender === "KAM";
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isKAM ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`p-2 rounded-lg shrink-0 h-8 w-8 flex items-center justify-center text-xs font-bold ${isKAM ? "bg-teal-500 text-white" : "bg-slate-800 text-white"}`}>
                  {isKAM ? <BrainCircuit className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  isKAM 
                    ? "bg-white text-slate-800 border border-slate-150 rounded-tl-none" 
                    : "bg-teal-600 text-white rounded-tr-none"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[9px] mt-1.5 font-mono text-right ${isKAM ? "text-slate-400" : "text-teal-200"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          {sendingChat && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="p-2 rounded-lg bg-teal-500 text-white shrink-0">
                <BrainCircuit className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                Key Account Manager is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            disabled={sendingChat}
            placeholder="Type your question about SLAs, FICA files, contract clauses..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
          />
          <button
            onClick={handleSendChat}
            disabled={sendingChat || !userInput.trim()}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
