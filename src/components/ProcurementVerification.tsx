import React, { useState, useEffect } from "react";
import { Lead, Quotation, ProjectCase, OccupancyDocument } from "../types";
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Upload, 
  Download,
  DollarSign, 
  Activity, 
  FileText, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  Briefcase
} from "lucide-react";

interface ProcurementVerificationProps {
  leads: Lead[];
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  cases: ProjectCase[];
  setCases: React.Dispatch<React.SetStateAction<ProjectCase[]>>;
  occupancies: OccupancyDocument[];
  setOccupancies: React.Dispatch<React.SetStateAction<OccupancyDocument[]>>;
  activePersona: string;
  selectedLeadId: string;
}

export default function ProcurementVerification({
  leads,
  quotations,
  setQuotations,
  cases,
  setCases,
  occupancies,
  setOccupancies,
  activePersona,
  selectedLeadId
}: ProcurementVerificationProps) {
  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeQuote = quotations.find(q => q.leadId === activeLead?.id);
  const activeCase = cases.find(c => c.leadId === activeLead?.id);
  const activeOcc = occupancies.find(o => o.leadId === activeLead?.id);

  // Local states
  const [poNumber, setPoNumber] = useState("");
  const [uploadingPO, setUploadingPO] = useState(false);
  const [poFileUploaded, setPoFileUploaded] = useState(false);

  // Occupancy local form state
  const [occupancyForm, setOccupancyForm] = useState({
    buildingName: "",
    onsiteContactName: "",
    onsiteContactPhone: "",
    onsiteContactEmail: "",
    landlordName: "",
    landlordPhone: "",
    landlordEmail: "",
    termsAgreed: false,
  });

  // Sync Occupancy local form state
  useEffect(() => {
    if (activeOcc) {
      setOccupancyForm({
        buildingName: activeOcc.buildingName,
        onsiteContactName: activeOcc.onsiteContactName,
        onsiteContactPhone: activeOcc.onsiteContactPhone,
        onsiteContactEmail: activeOcc.onsiteContactEmail || activeLead?.email || "",
        landlordName: activeOcc.landlordName,
        landlordPhone: activeOcc.landlordPhone || "",
        landlordEmail: activeOcc.landlordEmail,
        termsAgreed: activeOcc.termsAgreed,
      });
      setValidationStatus(activeOcc.gpsValidated ? "validated" : "none");
    } else {
      setOccupancyForm({
        buildingName: activeLead?.companyName ? `${activeLead.companyName} Sandton Campus` : "Rivonia Heights Block C",
        onsiteContactName: activeLead?.clientName || "Lebo Nkosi",
        onsiteContactPhone: activeLead?.phone || "+27 82 455 1200",
        onsiteContactEmail: activeLead?.email || "site.manager@company.co.za",
        landlordName: "Redefine Properties",
        landlordPhone: "+27 11 500 8000",
        landlordEmail: "info@redefine.co.za",
        termsAgreed: true,
      });
      setValidationStatus("none");
    }
  }, [activeOcc, activeLead]);

  const [validationStatus, setValidationStatus] = useState<"none" | "checking" | "validated">("none");

  const handleDownloadQuote = (quoteToDownload: Quotation) => {
    const formattedDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    const content = `
===================================================================
                  REUNERT CONNECTIQ COMMERCIAL QUOTATION
===================================================================
Reference Number:   ${quoteToDownload.id}
Date Issued:        ${formattedDate}
Pricing Validity:   ${quoteToDownload.pricingValidityDays || 30} Days

-------------------------------------------------------------------
CLIENT & SITE DETAILS
-------------------------------------------------------------------
Company Name:       ${activeLead?.companyName || "Client"}
Contact Person:     ${activeLead?.clientName || activeLead?.primaryBillingContact?.name || "Procurement Officer"}
Site Address:       ${quoteToDownload.address}
GPS Coordinates:    ${quoteToDownload.gpsCoordinates}

-------------------------------------------------------------------
NETWORK & TECHNICAL SPECIFICATIONS
-------------------------------------------------------------------
Service Tier:       ${quoteToDownload.networkType || "Fiber Link"}
Bandwidth:          ${quoteToDownload.bandwidth}
Contention Ratio:   ${quoteToDownload.contention}
Network Operator:   ${quoteToDownload.networkOperator}
Last Mile Provider: ${quoteToDownload.lastMileProvider}
Contract Term:      ${quoteToDownload.termMonths} Months
Lead Time:          ${quoteToDownload.leadTimeWeeks} Weeks

-------------------------------------------------------------------
COMMERCIAL FINANCIAL BREAKDOWN (ZAR)
-------------------------------------------------------------------
Non-Recurring Setup Fee (NRC):  R ${quoteToDownload.nrc.toLocaleString()}
Monthly Recurring Cost (MRC):  R ${quoteToDownload.mrc.toLocaleString()} / month
Margin Compliance:              ${quoteToDownload.marginPercentage}%

-------------------------------------------------------------------
TERMS & COMPLIANCE
-------------------------------------------------------------------
Status:             ${(quoteToDownload.status || "verified").toUpperCase()}
Notes:              ${quoteToDownload.notes || "Official quotation verified for procurement."}

Reunert ConnectIQ Telecoms Operations
Contact: quotes@connectiq.reunert.co.za
===================================================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ConnectIQ_Quotation_${(activeLead?.companyName || "Client").replace(/[^a-zA-Z0-9]/g, '_')}_${quoteToDownload.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleValidateGPS = () => {
    setValidationStatus("checking");
    setTimeout(() => {
      setValidationStatus("validated");
    }, 1500);
  };

  const handleSubmitOccupancy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occupancyForm.buildingName || !occupancyForm.landlordName) return;

    const newOcc: OccupancyDocument = {
      id: `occ-${Date.now().toString().slice(-3)}`,
      leadId: activeLead.id,
      buildingName: occupancyForm.buildingName,
      address: activeLead.address,
      gpsCoordinates: "-26.1014, 28.0572", // pulled from study
      onsiteContactName: occupancyForm.onsiteContactName,
      onsiteContactPhone: occupancyForm.onsiteContactPhone,
      onsiteContactEmail: occupancyForm.onsiteContactEmail,
      landlordName: occupancyForm.landlordName,
      landlordPhone: occupancyForm.landlordPhone,
      landlordEmail: occupancyForm.landlordEmail,
      gpsValidated: validationStatus === "validated",
      termsAgreed: occupancyForm.termsAgreed,
      status: "submitted"
    };

    setOccupancies(prev => [newOcc, ...prev.filter(o => o.leadId !== activeLead.id)]);
  };

  const handleVerifyMarginAndPlaceOrder = () => {
    if (!activeQuote || !poNumber) return;

    setUploadingPO(true);
    setTimeout(() => {
      // 1. Update quotation status
      setQuotations(prev => prev.map(q => {
        if (q.id === activeQuote.id) {
          return {
            ...q,
            status: "po_uploaded",
            poNumber: poNumber,
            poUploadedAt: new Date().toISOString()
          };
        }
        return q;
      }));

      // 2. Trigger Project Case Creation (Delivery)
      const newCase: ProjectCase = {
        id: `case-${Date.now().toString().slice(-3)}`,
        leadId: activeLead.id,
        quotationId: activeQuote.id,
        status: "case_created",
        routerInstalled: false,
        finalTestingPassed: false,
        clientSignedOff: false,
        slaTerms: activeQuote.networkType === "Fiber" 
          ? "99.5% Premium Fiber SLA, 4-hour Mean Time To Resolve (MTTR)" 
          : "99.0% High-Availability Wireless SLA, 8-hour MTTR"
      };

      setCases(prev => [newCase, ...prev.filter(c => c.leadId !== activeLead.id)]);
      setUploadingPO(false);
      setPoFileUploaded(true);
    }, 1500);
  };

  // Commission calculations
  const calculateCommission = (mrc: number) => {
    // 10% of MRC is standard commission for resellers
    return Math.round(mrc * 0.10);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="procurement-handoff-root">
      {/* Left: Request for Occupancy Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            Phase 3: Request for Occupancy (RFO) Electronic Form
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            An occupancy document is prefilled with GPS coordinates from our study. The client provides landlord details and onsite contacts. Incorrect inputs incur legal civil works penalties.
          </p>
        </div>

        {activeOcc ? (
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">RFO Document Submitted</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Submitted</span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
              <div><span className="text-slate-400">Building Name:</span> <span className="font-semibold">{activeOcc.buildingName}</span></div>
              <div><span className="text-slate-400">GPS Status:</span> <span className="font-semibold text-emerald-700">{activeOcc.gpsValidated ? "Validated Match ✓" : "Manual Match"}</span></div>
              <div><span className="text-slate-400">Onsite Contact:</span> <span className="font-semibold">{activeOcc.onsiteContactName}</span></div>
              <div><span className="text-slate-400">Onsite Phone:</span> <span className="font-semibold">{activeOcc.onsiteContactPhone}</span></div>
              <div><span className="text-slate-400">Landlord Name:</span> <span className="font-semibold">{activeOcc.landlordName}</span></div>
              <div><span className="text-slate-400">Landlord Email:</span> <span className="font-semibold">{activeOcc.landlordEmail}</span></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOccupancy} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600 border border-slate-100/60">
              <p className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">Prefilled Study Data:</p>
              <p>GPS Coordinates: <span className="font-mono font-bold text-slate-800">-26.1014, 28.0572</span></p>
              <p>Physical Address: <span className="font-bold text-slate-800">{activeLead?.address}</span></p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Building/Campus Name *</label>
                <input
                  type="text"
                  required
                  value={occupancyForm.buildingName}
                  onChange={(e) => setOccupancyForm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white"
                  placeholder="e.g. Rivonia Heights Block C"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Onsite Tech Contact *</label>
                  <input
                    type="text"
                    required
                    value={occupancyForm.onsiteContactName}
                    onChange={(e) => setOccupancyForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Lebo Nkosi"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Onsite Phone *</label>
                  <input
                    type="text"
                    required
                    value={occupancyForm.onsiteContactPhone}
                    onChange={(e) => setOccupancyForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="+27 82 455 1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Landlord Entity *</label>
                  <input
                    type="text"
                    required
                    value={occupancyForm.landlordName}
                    onChange={(e) => setOccupancyForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="Redefine Properties"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Landlord Email *</label>
                  <input
                    type="email"
                    required
                    value={occupancyForm.landlordEmail}
                    onChange={(e) => setOccupancyForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="approvals@redefine.co.za"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3 items-center">
                <button
                  type="button"
                  onClick={handleValidateGPS}
                  className={`px-3 py-1.5 border rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    validationStatus === "validated" 
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {validationStatus === "checking" ? "Verifying..." : validationStatus === "validated" ? "GPS Match Validated ✓" : "Validate GPS Coordinates"}
                </button>
                <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-tight">
                  <input
                    type="checkbox"
                    id="agreeOcc"
                    required
                    checked={occupancyForm.termsAgreed}
                    onChange={(e) => setOccupancyForm(prev => ({ ...prev, termsAgreed: e.target.checked }))}
                    className="mt-0.5 accent-teal-600 font-mono"
                  />
                  <label htmlFor="agreeOcc">Incorrect landlord contacts incur ZAR 5,000 civil correction penalty fee.</label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!occupancyForm.termsAgreed || validationStatus !== "validated"}
              className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer"
            >
              Submit Electronic Landlord Occupancy Form
            </button>
          </form>
        )}
      </div>

      {/* Right: Procurement Verification & Order Placement */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Procurement Audit, Margin Verification & Vendor Handoff
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            The procurement department checks vendor prices, audits profit margins, records commissions, and submits the official client PO to trigger actual site case conversion.
          </p>
        </div>

        {activeQuote ? (
          <div className="space-y-5">
            {/* Margin Verification Panel */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                  Margin Compliance Dashboard
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadQuote(activeQuote)}
                    className="px-2 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Download Official Quote Document"
                  >
                    <Download className="w-3 h-3" />
                    Download Quote
                  </button>
                  <span className="text-[10px] text-slate-500 font-semibold font-mono">ID: {activeQuote.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Commercial Revenue (MRC)</p>
                  <p className="text-lg font-extrabold text-slate-800 font-mono">R {activeQuote.mrc.toLocaleString()} <span className="text-xs text-slate-400">/pm</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Gross Margin</p>
                  <div className="flex items-center gap-1.5">
                    <p className={`text-lg font-extrabold font-mono ${activeQuote.marginPercentage >= 35 ? "text-emerald-600" : "text-amber-600"}`}>
                      {activeQuote.marginPercentage}%
                    </p>
                    {activeQuote.marginPercentage >= 35 ? (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">In Target</span>
                    ) : (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">Sub-Threshold</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Install Setup Fee (NRC)</p>
                  <p className="text-sm font-bold text-slate-800 font-mono">R {activeQuote.nrc.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Reseller Channel Commission (10%)</p>
                  <p className="text-xs font-bold text-indigo-700 font-mono">R {calculateCommission(activeQuote.mrc).toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">on completion</span></p>
                </div>
              </div>

              {activeQuote.marginPercentage < 35 && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-start gap-2 text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Caution:</strong> Profit margins are below standard enterprise threshold levels. Vendor negotiation or Director approval is recommended.
                  </span>
                </div>
              )}
            </div>

            {/* Vendor Order Placement */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                Submit Client PO & Place Vendor Orders
              </h4>

              {activeQuote.status === "po_uploaded" || activeCase ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Vendor Order Dispatched</p>
                      <p className="text-[11px] text-emerald-600 mt-0.5">PO Number: <span className="font-mono font-bold">{activeQuote.poNumber || "PO-SIM-920"}</span>. Project Case successfully created!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Enterprise Purchase Order (PO) Number</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white font-mono"
                      placeholder="e.g. PO-98042-ALPHABANK"
                    />
                  </div>

                  {activePersona === "Legal / Procurement" || activePersona === "Admin" ? (
                    <button
                      onClick={handleVerifyMarginAndPlaceOrder}
                      disabled={uploadingPO || !poNumber || !activeOcc}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {uploadingPO ? (
                        <>
                          <Activity className="w-4 h-4 animate-spin" />
                          Placing Vendor Order & Deploying Project Case...
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4" />
                          Audit Quote & Issue Vendor PO Order
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 text-center text-xs font-semibold">
                      Please switch persona to "Legal / Procurement" and complete Landlord Occupancy form (on the left) to place the vendor order.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h4 className="font-medium text-slate-700 text-sm">No Active Quote Found</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Please generate or parse a commercial quotation for the active lead first under the "Feasibility & Quote" panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
