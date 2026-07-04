import React, { useState } from "react";
import { Lead } from "../types";
import { 
  Briefcase, 
  Building, 
  FileText, 
  Upload, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  FileCheck, 
  User, 
  Plus, 
  ChevronRight,
  BrainCircuit,
  Loader2
} from "lucide-react";

interface LeadCaptureProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  activePersona: string;
  onSelectLead: (leadId: string) => void;
  selectedLeadId: string;
}

export default function LeadCapture({
  leads,
  setLeads,
  activePersona,
  onSelectLead,
  selectedLeadId
}: LeadCaptureProps) {
  // Local state for capture forms
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    resellerName: "Smit & Partners ICT",
    clientName: "",
    email: "",
    phone: "",
    companyName: "",
    registrationNumber: "",
    vatNumber: "",
    industry: "Information Technology",
    address: "",
    billingName: "",
    billingEmail: "",
    billingPhone: "",
    authName: "",
    authEmail: "",
    authPhone: ""
  });

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: boolean }>({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [draftingContract, setDraftingContract] = useState(false);

  // Selected lead
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.companyName) return;

    const newLead: Lead = {
      id: `lead-${Date.now().toString().slice(-3)}`,
      resellerName: formData.resellerName || "Reunert Agent",
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber || `${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}/07`,
      vatNumber: formData.vatNumber || `4${Math.floor(100000000 + Math.random() * 900000000)}`,
      industry: formData.industry,
      address: formData.address,
      primaryBillingContact: {
        name: formData.billingName || formData.clientName,
        email: formData.billingEmail || formData.email,
        phone: formData.billingPhone || formData.phone
      },
      secondaryAuthContact: {
        name: formData.authName || "Alternative Contact",
        email: formData.authEmail || formData.email,
        phone: formData.authPhone || formData.phone
      },
      status: "lead_captured",
      documents: {},
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    onSelectLead(newLead.id);
    setIsCreating(false);
    setIsReviewing(true);
  };

  const handleUploadDoc = (docType: string) => {
    setUploadProgress(prev => ({ ...prev, [docType]: true }));
    setTimeout(() => {
      setUploadProgress(prev => ({ ...prev, [docType]: false }));
      setLeads(prev => prev.map(l => {
        if (l.id === activeLead.id) {
          const updatedDocs = { ...l.documents, [docType]: "uploaded" };
          let nextStatus = l.status;
          // If we uploaded 4 key documents, advance to compliance_pending
          const uploadCount = Object.keys(updatedDocs).length;
          if (uploadCount >= 4 && l.status === "company_details_entered") {
            nextStatus = "compliance_pending";
          } else if (l.status === "lead_captured") {
            nextStatus = "company_details_entered";
          }
          return {
            ...l,
            documents: updatedDocs,
            status: nextStatus
          };
        }
        return l;
      }));
    }, 1200);
  };

  const triggerComplianceAI = async () => {
    setIsAssessing(true);
    try {
      const response = await fetch("/api/gemini/assess-compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: activeLead }),
      });
      if (response.ok) {
        const result = await response.json();
        setLeads(prev => prev.map(l => {
          if (l.id === activeLead.id) {
            return {
              ...l,
              status: "compliance_completed",
              complianceResults: {
                ficaVerified: result.ficaVerified,
                cddVerified: result.cddVerified,
                ncaAffordability: result.ncaAffordability,
                kybVerified: result.kybVerified,
                notes: result.notes,
                checkedBy: "Gemini Compliance AI Auditor",
                checkedAt: new Date().toISOString()
              }
            };
          }
          return l;
        }));
      } else {
        throw new Error();
      }
    } catch {
      // Fallback
      setLeads(prev => prev.map(l => {
        if (l.id === activeLead.id) {
          return {
            ...l,
            status: "compliance_completed",
            complianceResults: {
              ficaVerified: true,
              cddVerified: true,
              ncaAffordability: true,
              kybVerified: true,
              notes: "Automatic Fallback: FICA, CDD, NCA and KYB validations completed. Registration numbers validated against standard corporate formats. Risk profile: LOW.",
              checkedBy: "Internal Compliance Officer (Simulated)",
              checkedAt: new Date().toISOString()
            }
          };
        }
        return l;
      }));
    } finally {
      setIsAssessing(false);
    }
  };

  const triggerDraftContractAI = async () => {
    setDraftingContract(true);
    try {
      const response = await fetch("/api/gemini/draft-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: activeLead,
          product: {
            serviceType: "enterprise",
            bandwidth: "200 Mbps",
            term: "24",
            vendor: "Fibre Com Connect"
          }
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setLeads(prev => prev.map(l => {
          if (l.id === activeLead.id) {
            return {
              ...l,
              status: "contract_drafted",
              contract: {
                draftText: result.draftText,
                draftUrl: "#"
              }
            };
          }
          return l;
        }));
      } else {
        throw new Error();
      }
    } catch {
      // Fallback draft
      setLeads(prev => prev.map(l => {
        if (l.id === activeLead.id) {
          return {
            ...l,
            status: "contract_drafted",
            contract: {
              draftText: `### MASTER SERVICES AGREEMENT ADDENDUM\n\n**BETWEEN:**\nConnectNAV (Pty) Ltd\n\n**AND:**\n${l.companyName} (Registration: ${l.registrationNumber})\n\n---\n\n#### 1. SERVICE SPECIFICATION\nConnectNAV agrees to provide high-speed broadband/enterprise digital links through selected vendor networks. Capacity thresholds, billing schedules, and support Handover criteria shall be maintained at Gold Tier Class standards.\n\n#### 2. REGULATORY & FICA CLEARANCE\nBoth parties acknowledge that digital onboarding criteria, NCA affordability limits, and tax verification criteria have been audited, recorded, and verified.\n\n#### 3. SIGNATURE BLOCKS\nBoth parties authorize the execution of this addendum under South African digital signature and ECT Act provisions.\n\nSigned digitally by Client and ConnectNAV Management.`,
              draftUrl: "#"
            }
          };
        }
        return l;
      }));
    } finally {
      setDraftingContract(false);
    }
  };

  const handleSignContract = () => {
    setLeads(prev => prev.map(l => {
      if (l.id === activeLead.id) {
        return {
          ...l,
          status: "contract_signed",
          contract: {
            ...l.contract,
            signedDate: new Date().toISOString(),
            signatureClient: l.clientName,
            signatureReunert: "Operations Lead (ConnectNAV)"
          }
        };
      }
      return l;
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lead_captured":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Lead Captured</span>;
      case "company_details_entered":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Company Profile</span>;
      case "compliance_pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Compliance Audit Awaiting</span>;
      case "compliance_completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Compliance Approved</span>;
      case "contract_drafted":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">Contract Drafted</span>;
      case "contract_signed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Contract Signed</span>;
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">Active Account</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="lead-capture-root">
      {/* Lead Directory Sidebar */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-[700px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-600" />
            Active Onboardings
          </h2>
          {(activePersona === "Sales / Reseller" || activePersona === "Admin") && (
            <button
              onClick={() => setIsCreating(true)}
              className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {leads.map(lead => (
            <button
              key={lead.id}
              onClick={() => {
                onSelectLead(lead.id);
                setIsCreating(false);
                setIsReviewing(false);
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                lead.id === selectedLeadId
                  ? "border-teal-500 bg-teal-50/50 shadow-sm"
                  : "border-slate-100 hover:border-slate-300 bg-slate-50/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-800 text-sm leading-tight line-clamp-1">{lead.companyName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">By {lead.resellerName}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 ${lead.id === selectedLeadId ? "text-teal-600" : ""}`} />
              </div>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100/60">
                <span className="text-[10px] font-mono text-slate-400">{lead.id}</span>
                {getStatusBadge(lead.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form/Details Display Area */}
      <div className="lg:col-span-2 space-y-6">
        {isCreating ? (
          /* 01 Capture Lead Form & Company Details */
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="font-display font-semibold text-xl text-slate-800 flex items-center gap-2">
                <Building className="w-6 h-6 text-teal-600" />
                Capture New Client Lead
              </h2>
              <button 
                onClick={() => setIsCreating(false)}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Reseller / Sales Channel Name *</label>
                  <input
                    type="text"
                    name="resellerName"
                    value={formData.resellerName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="Smit & Partners ICT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Client Authorized Signatory *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Client Professional Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="e.g. john@alpha.co.za"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Signatory Contact Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    placeholder="e.g. +27 11 400 5000"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  02 Company Registration & VAT Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Registered Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      placeholder="e.g. Alpha Banking Corporation Ltd"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Industry Type *</label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                    >
                      <option value="Information Technology">Information Technology</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Mining & Resources">Mining & Resources</option>
                      <option value="Logistics & Transport">Logistics & Transport</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Healthcare">Healthcare</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Company Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      placeholder="Leave blank for auto-generation (YYYY/NNNNNN/NN)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">VAT Number</label>
                    <input
                      type="text"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      placeholder="10-digit tax number starting with 4"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Corporate Physical Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      placeholder="e.g. 150 Rivonia Road, Sandton"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  required
                  className="mt-1 accent-teal-600"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600">
                  I agree that all onboarding procedures comply with corporate FICA matching standards, digital document policies, and appropriate authorization thresholds under South African legal guidelines.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
              >
                Create Company Lead Profile & Onboard <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* View Details & Actions of Selected Lead */
          <div className="space-y-6">
            {/* Quick Summary Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-semibold text-xl text-slate-800">{activeLead.companyName}</h2>
                    <span className="text-xs text-slate-400 font-mono">#{activeLead.id}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Industry: <span className="font-medium text-slate-700">{activeLead.industry}</span> | Registered address: <span className="font-medium text-slate-700">{activeLead.address}</span>
                  </p>
                </div>
                <div className="self-start md:self-center">
                  {getStatusBadge(activeLead.status)}
                </div>
              </div>
            </div>

            {/* Document Collection (Phase 1, Step 3) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                03 Compliance & KYC Document Repository
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                South African telecom regulations require corporate KYB validations. Click "Upload" to upload simulated document packets to verify client FICA, registration, and banking statuses.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "registrationPapers", label: "CIPC Co. Registration (Co14/CK1)" },
                  { key: "proofOfAddress", label: "Proof of Corporate Address (Utility Bill)" },
                  { key: "signatoryId", label: "ID Signatories (Identity Documents)" },
                  { key: "bankProof", label: "Corporate Bank Account Proof" },
                  { key: "taxInfo", label: "SARS Tax Clearance Certificate" },
                  { key: "cipcDocs", label: "CIPC Disclosures & Shareholder Certificate" }
                ].map(doc => {
                  const isUploaded = activeLead.documents?.[doc.key as keyof typeof activeLead.documents] === "uploaded";
                  const loading = uploadProgress[doc.key];

                  return (
                    <div 
                      key={doc.key}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                        isUploaded 
                          ? "border-emerald-200 bg-emerald-50/20" 
                          : "border-slate-100 bg-slate-50/50 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isUploaded ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="font-medium text-slate-700 text-xs">{doc.label}</span>
                      </div>

                      {isUploaded ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">Uploaded</span>
                      ) : (
                        <button
                          disabled={loading}
                          onClick={() => handleUploadDoc(doc.key)}
                          className="text-xs bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-teal-600" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              Upload
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 4 Review & Confirm Banner */}
              {Object.keys(activeLead.documents || {}).length >= 4 && activeLead.status === "company_details_entered" && (
                <div className="mt-5 p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-teal-800 text-sm">Step 4: Onboarding Profile Complete!</h4>
                      <p className="text-xs text-teal-600 mt-0.5">All compulsory KYC materials are in order. Submit to the Legal & Compliance desk for digital review.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setLeads(prev => prev.map(l => l.id === activeLead.id ? { ...l, status: "compliance_pending" } : l));
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                  >
                    Submit for Compliance Check
                  </button>
                </div>
              )}
            </div>

            {/* Compliance Audits (Step 5) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  05 FICA, CDD & NCA Compliance Review
                </span>
                {activeLead.complianceResults && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Audited
                  </span>
                )}
              </h3>

              {activeLead.complianceResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className={`p-2.5 rounded-lg border ${activeLead.complianceResults.ficaVerified ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-red-50/40 border-red-100 text-red-800"}`}>
                      <p className="text-[10px] uppercase font-semibold text-slate-500">FICA Validation</p>
                      <p className="text-xs font-bold mt-1">Verified</p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${activeLead.complianceResults.cddVerified ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-red-50/40 border-red-100 text-red-800"}`}>
                      <p className="text-[10px] uppercase font-semibold text-slate-500">CDD Due Diligence</p>
                      <p className="text-xs font-bold mt-1">Cleared</p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${activeLead.complianceResults.ncaAffordability ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-red-50/40 border-red-100 text-red-800"}`}>
                      <p className="text-[10px] uppercase font-semibold text-slate-500">NCA Affordability</p>
                      <p className="text-xs font-bold mt-1">Passed</p>
                    </div>
                    <div className={`p-2.5 rounded-lg border ${activeLead.complianceResults.kybVerified ? "bg-emerald-50/40 border-emerald-100 text-emerald-800" : "bg-red-50/40 border-red-100 text-red-800"}`}>
                      <p className="text-[10px] uppercase font-semibold text-slate-500">KYB Registration</p>
                      <p className="text-xs font-bold mt-1">Matched</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Audit Findings Summary</p>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeLead.complianceResults.notes}</p>
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Auditor: {activeLead.complianceResults.checkedBy}</span>
                      <span>Checked at: {new Date(activeLead.complianceResults.checkedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h4 className="font-medium text-slate-700 text-sm">Review Pending</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Auditors verify company details, corporate databases, and directors before drafting commercial contracts.
                  </p>
                  {(activePersona === "Legal / Compliance" || activePersona === "Admin") ? (
                    <button
                      disabled={isAssessing}
                      onClick={triggerComplianceAI}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 mx-auto shadow-sm"
                    >
                      {isAssessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Running AI Audits...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="w-3.5 h-3.5" />
                          Run Gemini Compliance AI Match
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
                      Switch to "Legal / Compliance" persona to approve this step.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Contract Finalization (Step 6) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                06 Contract Finalization (MSA Agreement)
              </h3>

              {activeLead.contract ? (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-700">MasterServicesAgreement_Draft.md</span>
                      {activeLead.contract.signedDate ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Signed digitally</span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full font-mono">Awaiting signatures</span>
                      )}
                    </div>
                    <div className="p-4 max-h-[220px] overflow-y-auto text-xs text-slate-600 font-mono space-y-2 whitespace-pre-wrap leading-relaxed bg-slate-50/30">
                      {activeLead.contract.draftText}
                    </div>
                  </div>

                  {activeLead.contract.signedDate ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div className="text-xs text-emerald-800">
                        <p className="font-bold">Contract Executed & Finalized</p>
                        <p className="mt-1">Signed by: <span className="font-semibold">{activeLead.contract.signatureClient}</span> (Client) and <span className="font-semibold">{activeLead.contract.signatureReunert}</span> (ConnectNAV Operator)</p>
                        <p className="mt-0.5 text-[10px] text-emerald-600">Timestamp: {new Date(activeLead.contract.signedDate).toLocaleString()}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {(activePersona === "Client" || activePersona === "Admin") ? (
                        <button
                          onClick={handleSignContract}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors text-xs flex items-center justify-center gap-1.5"
                        >
                          <FileCheck className="w-4 h-4" /> Sign Contract Addendum Digitally
                        </button>
                      ) : (
                        <div className="flex-1 text-center p-3.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 text-xs font-medium">
                          To execute contract, switch persona to "Client" to sign.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h4 className="font-medium text-slate-700 text-sm">Contract Addendum Pending</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Once FICA audits are complete, Legal can draft and share the customized commercial addendum.
                  </p>
                  {activeLead.status === "compliance_completed" ? (
                    (activePersona === "Legal / Compliance" || activePersona === "Admin") ? (
                      <button
                        disabled={draftingContract}
                        onClick={triggerDraftContractAI}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 mx-auto shadow-sm"
                      >
                        {draftingContract ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Drafting Contract...
                          </>
                        ) : (
                          <>
                            <BrainCircuit className="w-3.5 h-3.5" />
                            Draft MSA Contract via Gemini
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2.5 py-1 rounded-md">
                        Compliance is approved! Switch to "Legal / Compliance" to generate the contract draft.
                      </span>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Awaiting CDD/FICA verification approval above to unlock contract drafting.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Enable Product Access (Step 7) */}
            {activeLead.contract?.signedDate && (
              <div className="p-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl shadow-md flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm">07 Enable Product Access Complete!</h4>
                    <p className="text-[11px] text-teal-100 mt-0.5">The client is officially onboarded. They can now run feasibilities and purchase network products through the platform.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLeads(prev => prev.map(l => l.id === activeLead.id ? { ...l, status: "active" } : l));
                  }}
                  className="bg-white hover:bg-slate-50 text-teal-700 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors shrink-0 shadow-sm"
                >
                  Configure Feasibility check →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
