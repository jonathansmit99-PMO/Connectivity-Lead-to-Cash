import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  RefreshCw, 
  Trash2, 
  MapPin, 
  ArrowUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  User, 
  Check, 
  X, 
  FileText, 
  ShieldCheck, 
  Building,
  Layers,
  Sparkles,
  HelpCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { Lead, ProjectCase, Quotation, LifecycleRequest } from "../types";

interface ContractLifecycleProps {
  leads: Lead[];
  cases: ProjectCase[];
  quotations: Quotation[];
  lifecycleRequests: LifecycleRequest[];
  setLifecycleRequests: React.Dispatch<React.SetStateAction<LifecycleRequest[]>>;
  activePersona: string;
  selectedLeadId: string;
}

export default function ContractLifecycle({
  leads,
  cases,
  quotations,
  lifecycleRequests,
  setLifecycleRequests,
  activePersona,
  selectedLeadId
}: ContractLifecycleProps) {
  // Active lead
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeCase = cases.find(c => c.leadId === activeLead?.id && c.status === "live");
  const activeQuotation = activeCase 
    ? quotations.find(q => q.id === activeCase.quotationId) 
    : quotations.find(q => q.leadId === activeLead?.id && q.status === "po_uploaded");

  // Local state for the Request Form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState<'renewal' | 'cancellation' | 'outdoor_transfer' | 'upgrade'>('upgrade');
  
  // Form fields
  const [newTermMonths, setNewTermMonths] = useState<number>(24);
  const [newBandwidth, setNewBandwidth] = useState<string>("1 Gbps");
  const [newAddress, setNewAddress] = useState<string>("");
  const [newCoordinates, setNewCoordinates] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // default 30 days from now
  );

  // Vetting notes
  const [salesNotes, setSalesNotes] = useState<string>("");
  const [procurementNotes, setProcurementNotes] = useState<string>("");

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: LifecycleRequest = {
      id: `req-${Date.now()}`,
      leadId: activeLead.id,
      companyName: activeLead.companyName,
      requestType,
      status: "pending_sales",
      details: {
        newTermMonths: requestType === "renewal" || requestType === "upgrade" ? newTermMonths : undefined,
        newBandwidth: requestType === "upgrade" ? newBandwidth : undefined,
        newAddress: requestType === "outdoor_transfer" ? newAddress : undefined,
        newCoordinates: requestType === "outdoor_transfer" ? newCoordinates : undefined,
        reason,
        effectiveDate
      },
      submittedBy: activePersona === "Client" ? activeLead.clientName : `${activePersona} Representative`,
      submittedAt: new Date().toISOString()
    };

    setLifecycleRequests(prev => [newRequest, ...prev]);
    
    // Reset Form
    setShowRequestForm(false);
    setReason("");
    setNewAddress("");
    setNewCoordinates("");
  };

  // Vetting Actions
  const handleSalesVetting = (requestId: string, status: 'approved' | 'rejected') => {
    setLifecycleRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: status === 'rejected' ? 'rejected' : 'pending_procurement',
          vettedBySales: {
            vetted: true,
            vettedBy: activePersona === "Admin" ? "System Admin (Sales)" : "Sales Specialist",
            vettedAt: new Date().toISOString(),
            status,
            notes: salesNotes || "Sales parameters verified and approved commercially."
          }
        };
      }
      return req;
    }));
    setSalesNotes("");
  };

  const handleProcurementVetting = (requestId: string, status: 'approved' | 'rejected') => {
    setLifecycleRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const isApproved = status === 'approved';
        return {
          ...req,
          status: isApproved ? 'approved' : 'rejected',
          vettedByProcurement: {
            vetted: true,
            vettedBy: activePersona === "Admin" ? "System Admin (Procurement)" : "Procurement Officer",
            vettedAt: new Date().toISOString(),
            status,
            notes: procurementNotes || "Procurement verified logistics and vendor availability."
          }
        };
      }
      return req;
    }));
    setProcurementNotes("");
  };

  // Check if current active client has an active request
  const clientRequests = lifecycleRequests.filter(r => r.leadId === activeLead.id);

  return (
    <div className="space-y-6" id="contract-lifecycle-root">
      
      {/* SECTION 1: Current Active Service and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Active Service Details card */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-[#1c2836] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{activeLead.companyName}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">CURRENT ENTERPRISE SERVICE PROFILE</p>
                </div>
              </div>
              {activeCase ? (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                  ● ACTIVE SERVICE
                </span>
              ) : (
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  PENDING INSTALLATION
                </span>
              )}
            </div>

            {activeQuotation ? (
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Service Operator</span>
                    <p className="text-xs font-bold text-slate-800">{activeQuotation.networkOperator}</p>
                    <span className="text-[9px] text-slate-500 font-mono">Carrier Class Link</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Active Bandwidth</span>
                    <p className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
                      <ArrowUp className="w-4 h-4 text-teal-600 rotate-45" />
                      {activeQuotation.bandwidth} Symmetric
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">Dedicated {activeQuotation.networkType}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Contract Commitment</span>
                    <p className="text-xs font-bold text-slate-800">{activeQuotation.termMonths} Months</p>
                    <span className="text-[9px] text-slate-500 font-mono">Term Ending: R {activeQuotation.mrc.toLocaleString()}/pm</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">IP Allocations</span>
                    <p className="text-xs font-mono font-bold text-slate-800">
                      {activeCase?.handoverCertificate?.ipSubnet || "196.15.22.40/29"}
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">VLAN: {activeCase?.handoverCertificate?.vlanId || 1042}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">SLA Grade</span>
                    <p className="text-xs font-bold text-slate-800">Gold SLA (99.5%)</p>
                    <span className="text-[9px] text-slate-500 font-mono">4-Hour MTTR Guarantee</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">FICA & Compliance</span>
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Passed
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono">CIPC & NCA Cleared</span>
                  </div>
                </div>

                {/* Relocation Address displays if existing transfer exists */}
                {activeLead.address && (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Service Delivery Location</span>
                      <p className="text-xs text-slate-700 font-medium">{activeLead.address}</p>
                      <span className="text-[9px] text-slate-400 font-mono">{activeQuotation.gpsCoordinates}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  This client doesn't have an active live quotation on record. Please complete Phase 1 & 2 to generate commercial parameters.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
              <p className="text-[10px] font-mono text-slate-500 font-semibold">ALL L2C REGULATORY LOGS IN ORDER</p>
            </div>
            
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Request Contract Modification
            </button>
          </div>
        </div>

        {/* Info card for quick request guidelines */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Contract Lifecycle Guidelines
          </h4>
          
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              ConnectNAV provides seamless link management. Any requested modification must pass through strict commercial and engineering review.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <div className="p-1 bg-blue-50 text-blue-600 rounded-lg shrink-0"><RefreshCw className="w-3.5 h-3.5" /></div>
                <div>
                  <h5 className="font-bold text-slate-800 text-[11px]">Renewals</h5>
                  <p className="text-[10px] text-slate-500">Extend contracts. Committing to 36 months reduces monthly rates by up to 15%.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="p-1 bg-purple-50 text-purple-600 rounded-lg shrink-0"><ArrowUp className="w-3.5 h-3.5" /></div>
                <div>
                  <h5 className="font-bold text-slate-800 text-[11px]">Upgrades</h5>
                  <p className="text-[10px] text-slate-500">Scale bandwidth. Core infrastructure allows immediate port-level upgrades.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="p-1 bg-amber-50 text-amber-600 rounded-lg shrink-0"><MapPin className="w-3.5 h-3.5" /></div>
                <div>
                  <h5 className="font-bold text-slate-800 text-[11px]">Outdoor Transfers</h5>
                  <p className="text-[10px] text-slate-500">Office relocation. Triggers rapid feasibility checking on the new address.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="p-1 bg-red-50 text-red-600 rounded-lg shrink-0"><Trash2 className="w-3.5 h-3.5" /></div>
                <div>
                  <h5 className="font-bold text-slate-800 text-[11px]">Cancellations</h5>
                  <p className="text-[10px] text-slate-500">Requires 30 days notice. Cancellation penalties apply before term maturity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Modal Request Modification Form */}
      <AnimatePresence>
        {showRequestForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-[#1c2836] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-teal-400 animate-spin-slow" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                    Request Link Modification
                  </h3>
                </div>
                <button 
                  onClick={() => setShowRequestForm(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
                {/* Selector */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Modification Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "upgrade", label: "Upgrade", icon: ArrowUp },
                      { id: "renewal", label: "Renewal", icon: RefreshCw },
                      { id: "outdoor_transfer", label: "Transfer", icon: MapPin },
                      { id: "cancellation", label: "Cancel", icon: Trash2 }
                    ].map(type => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => setRequestType(type.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-bold border flex flex-col items-center gap-1 transition-all ${
                          requestType === type.id
                            ? "bg-teal-50 border-teal-500 text-teal-700 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Elements depending on type */}
                {requestType === "upgrade" && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Target Speed</label>
                      <select
                        value={newBandwidth}
                        onChange={e => setNewBandwidth(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                      >
                        <option value="1 Gbps">1 Gbps Symmetric</option>
                        <option value="2 Gbps">2 Gbps Symmetric</option>
                        <option value="10 Gbps">10 Gbps Enterprise Core</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Extend Term</label>
                      <select
                        value={newTermMonths}
                        onChange={e => setNewTermMonths(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                      >
                        <option value={12}>12 Months</option>
                        <option value={24}>24 Months (Recommended)</option>
                        <option value={36}>36 Months (Max discount)</option>
                      </select>
                    </div>
                  </div>
                )}

                {requestType === "renewal" && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Select Renewal Term Commitment</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[12, 24, 36].map(m => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setNewTermMonths(m)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            newTermMonths === m
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {m} Months
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {requestType === "outdoor_transfer" && (
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">New Physical Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 160 Rivonia Road, Sandown, Sandton"
                        value={newAddress}
                        onChange={e => setNewAddress(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">GPS Coordinates</label>
                      <input
                        type="text"
                        placeholder="e.g. -26.1010, 28.0578"
                        value={newCoordinates}
                        onChange={e => setNewCoordinates(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>
                )}

                {requestType === "cancellation" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase">Early Termination Notice:</span>
                      <p className="mt-0.5 text-red-600">
                        Early contract cancellation may trigger a clawback on Non-Recurring Setup costs and standard cancellation charges based on outstanding contract terms.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Requested Effective Date</label>
                    <input
                      type="date"
                      value={effectiveDate}
                      onChange={e => setEffectiveDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Submitted By (User Persona)</label>
                    <input
                      type="text"
                      value={activePersona === "Client" ? activeLead.clientName : `${activePersona}`}
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">Justification Reason</label>
                  <textarea
                    rows={3}
                    placeholder="Provide professional/operational reasons for this modification."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Submit Modification Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 3: Current Requests List & Vetting Workflow */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          Pending & Past Lifecycle Modification Requests
        </h3>

        {lifecycleRequests.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-xs">
            No contract modification requests logged yet. Use the action button above to submit.
          </div>
        ) : (
          <div className="space-y-4">
            {lifecycleRequests.map(req => {
              // Vetting Status badges
              const getStatusBadge = (status: string) => {
                switch(status) {
                  case 'approved':
                    return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">APPROVED & LIVE</span>;
                  case 'rejected':
                    return <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">REJECTED</span>;
                  case 'pending_sales':
                    return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">PENDING SALES VETTING</span>;
                  case 'pending_procurement':
                    return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">PENDING PROCUREMENT VETTING</span>;
                  default:
                    return null;
                }
              };

              const getModificationIcon = (type: string) => {
                switch(type) {
                  case 'renewal': return <RefreshCw className="w-4 h-4 text-blue-600" />;
                  case 'cancellation': return <Trash2 className="w-4 h-4 text-red-600" />;
                  case 'outdoor_transfer': return <MapPin className="w-4 h-4 text-amber-600" />;
                  case 'upgrade': return <ArrowUp className="w-4 h-4 text-teal-600" />;
                  default: return <FileText className="w-4 h-4" />;
                }
              };

              const isSalesVettingAllowed = (activePersona === "Sales / Reseller" || activePersona === "Admin") && req.status === "pending_sales";
              const isProcurementVettingAllowed = (activePersona === "Legal / Procurement" || activePersona === "Admin") && req.status === "pending_procurement";

              return (
                <div key={req.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  
                  {/* Left Column: Request Profile */}
                  <div className="p-5 flex-1 space-y-3.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-50 border border-slate-150 rounded-lg">
                          {getModificationIcon(req.requestType)}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Request ID: {req.id}</span>
                          <h4 className="text-xs font-bold text-slate-800 uppercase font-sans tracking-tight">
                            {req.requestType.replace("_", " ")} Request
                          </h4>
                        </div>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Target Client</span>
                        <p className="font-bold text-slate-700">{req.companyName}</p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Proposed Date</span>
                        <p className="font-medium text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {req.details.effectiveDate}
                        </p>
                      </div>

                      {req.details.newBandwidth && (
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Target Speed Upgrade</span>
                          <p className="font-bold text-teal-700 flex items-center gap-1 text-[11px]">
                            <ArrowUp className="w-3.5 h-3.5 text-teal-600 rotate-45" /> {req.details.newBandwidth}
                          </p>
                        </div>
                      )}

                      {req.details.newTermMonths && (
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Target New Term</span>
                          <p className="font-bold text-slate-700">{req.details.newTermMonths} Months</p>
                        </div>
                      )}

                      {req.details.newAddress && (
                        <div className="col-span-2">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">New Address</span>
                          <p className="font-semibold text-slate-700">{req.details.newAddress}</p>
                          <span className="text-[9px] text-slate-400 font-mono">GPS: {req.details.newCoordinates}</span>
                        </div>
                      )}

                      <div className="col-span-2">
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Client Justification</span>
                        <p className="text-slate-600 leading-relaxed font-sans mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-150">
                          "{req.details.reason}"
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono pt-1.5 flex items-center justify-between">
                      <span>Submitted By: <strong>{req.submittedBy}</strong></span>
                      <span>{new Date(req.submittedAt).toLocaleDateString()} {new Date(req.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>

                  {/* Right Column: Vetting status & controls */}
                  <div className="p-5 md:w-80 bg-slate-50/50 flex flex-col justify-between gap-4">
                    
                    {/* Sales Review Status */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                        <span>1. Sales Review</span>
                        {req.vettedBySales ? (
                          req.vettedBySales.status === 'approved' ? (
                            <span className="text-emerald-600 flex items-center gap-0.5"><Check className="w-3 h-3" /> PASSED</span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-0.5"><X className="w-3 h-3" /> REJECTED</span>
                          )
                        ) : (
                          <span className="text-blue-500">PENDING</span>
                        )}
                      </div>
                      
                      {req.vettedBySales ? (
                        <div className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] text-slate-600">
                          <p className="font-semibold text-slate-700">{req.vettedBySales.vettedBy}</p>
                          <p className="italic mt-0.5">"{req.vettedBySales.notes}"</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">Awaiting commercial verification by Sales Team.</p>
                      )}

                      {/* Sales vetting controls */}
                      {isSalesVettingAllowed && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            placeholder="Enter Sales commercial notes..."
                            value={salesNotes}
                            onChange={e => setSalesNotes(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] focus:outline-none focus:border-teal-500"
                            rows={2}
                          ></textarea>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSalesVetting(req.id, 'rejected')}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer"
                            >
                              Reject Request
                            </button>
                            <button
                              onClick={() => handleSalesVetting(req.id, 'approved')}
                              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3 text-white" /> Approve Commercials
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Procurement Review Status */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase">
                        <span>2. Procurement Review</span>
                        {req.vettedByProcurement ? (
                          req.vettedByProcurement.status === 'approved' ? (
                            <span className="text-emerald-600 flex items-center gap-0.5"><Check className="w-3 h-3" /> PASSED</span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-0.5"><X className="w-3 h-3" /> REJECTED</span>
                          )
                        ) : (
                          <span className="text-blue-500">PENDING</span>
                        )}
                      </div>

                      {req.vettedByProcurement ? (
                        <div className="bg-white p-2 rounded-lg border border-slate-150 text-[10px] text-slate-600">
                          <p className="font-semibold text-slate-700">{req.vettedByProcurement.vettedBy}</p>
                          <p className="italic mt-0.5">"{req.vettedByProcurement.notes}"</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">
                          {req.status === "pending_sales" 
                            ? "Awaiting Sales clearance first." 
                            : "Awaiting legal/regulatory audit by Procurement."}
                        </p>
                      )}

                      {/* Procurement vetting controls */}
                      {isProcurementVettingAllowed && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            placeholder="Enter Procurement logistics/legal notes..."
                            value={procurementNotes}
                            onChange={e => setProcurementNotes(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] focus:outline-none focus:border-teal-500"
                            rows={2}
                          ></textarea>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleProcurementVetting(req.id, 'rejected')}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer"
                            >
                              Reject Request
                            </button>
                            <button
                              onClick={() => handleProcurementVetting(req.id, 'approved')}
                              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3 text-white" /> Approve & Release
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
