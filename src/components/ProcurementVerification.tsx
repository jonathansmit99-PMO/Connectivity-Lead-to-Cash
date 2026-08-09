import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Briefcase,
  FileSpreadsheet,
  Calculator,
  Loader2,
  RefreshCw,
  ArrowRightLeft,
  AlertOctagon,
  Building2
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

  // Vendor Cost & Quote Upload State
  const [vendorCostMrc, setVendorCostMrc] = useState<number>(0);
  const [vendorCostNrc, setVendorCostNrc] = useState<number>(0);
  const [vendorName, setVendorName] = useState<string>("");
  const [vendorQuoteFile, setVendorQuoteFile] = useState<string | null>(null);
  const [isParsingVendorQuote, setIsParsingVendorQuote] = useState(false);
  const [costValidationSaved, setCostValidationSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vendor Change / Reassignment State
  const [isChangingVendor, setIsChangingVendor] = useState(false);
  const [selectedNewVendor, setSelectedNewVendor] = useState<string>("Openserve");
  const [vendorChangeReason, setVendorChangeReason] = useState<string>("Initial vendor wayleave / landlord permit rejected");
  const [customVendorReasonNote, setCustomVendorReasonNote] = useState<string>("");
  const [vendorChangeSuccessBanner, setVendorChangeSuccessBanner] = useState<string | null>(null);

  const handleConfirmVendorChange = () => {
    if (!activeQuote) return;
    const oldVendor = activeQuote.networkOperator || vendorName || "Initial Operator";
    const newVendorName = selectedNewVendor;
    const fullReason = customVendorReasonNote ? `${vendorChangeReason}: ${customVendorReasonNote}` : vendorChangeReason;

    // Estimate new wholesale cost based on selected vendor
    let newVendorMrc = Math.round(activeQuote.mrc * 0.50);
    let newVendorNrc = Math.round(activeQuote.nrc * 0.60);
    if (newVendorName === "Openserve") {
      newVendorMrc = Math.round(activeQuote.mrc * 0.52);
    } else if (newVendorName.includes("DFA")) {
      newVendorMrc = Math.round(activeQuote.mrc * 0.48);
    } else if (newVendorName.includes("Vumatel")) {
      newVendorMrc = Math.round(activeQuote.mrc * 0.50);
    } else if (newVendorName.includes("MetroFibre")) {
      newVendorMrc = Math.round(activeQuote.mrc * 0.46);
    } else if (newVendorName.includes("Frogfoot")) {
      newVendorMrc = Math.round(activeQuote.mrc * 0.49);
    }

    const cleanVendorFileName = `${newVendorName.replace(/[^a-zA-Z0-9]/g, '_')}_Wholesale_CostSheet_2026.pdf`;

    setQuotations(prev => prev.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          networkOperator: newVendorName,
          previousVendor: oldVendor,
          vendorChangeReason: fullReason,
          vendorCostMrc: newVendorMrc,
          vendorCostNrc: newVendorNrc,
          vendorQuoteFileName: cleanVendorFileName,
          costValidated: false
        };
      }
      return q;
    }));

    setVendorName(newVendorName);
    setVendorCostMrc(newVendorMrc);
    setVendorCostNrc(newVendorNrc);
    setVendorQuoteFile(cleanVendorFileName);
    setCostValidationSaved(false);
    setIsChangingVendor(false);
    setVendorChangeSuccessBanner(`Vendor successfully switched from ${oldVendor} to ${newVendorName}. Wholesale pricing reset.`);
  };

  // Sync vendor cost state when active quote changes
  useEffect(() => {
    if (activeQuote) {
      const defaultVendorMrc = activeQuote.vendorCostMrc ?? Math.round(activeQuote.mrc * 0.5);
      const defaultVendorNrc = activeQuote.vendorCostNrc ?? Math.round(activeQuote.nrc * 0.6);
      setVendorCostMrc(defaultVendorMrc);
      setVendorCostNrc(defaultVendorNrc);
      setVendorName(activeQuote.networkOperator || "Fibre Com Connect Wholesale");
      setVendorQuoteFile(activeQuote.vendorQuoteFileName || "FibreCom_Wholesale_CostSheet_2026.pdf");
      setCostValidationSaved(!!activeQuote.costValidated);
    }
  }, [activeQuote?.id, activeQuote?.mrc, activeQuote?.nrc]);

  // Derived metrics for selling price vs vendor cost validation
  const clientMrc = activeQuote?.mrc || 0;
  const clientNrc = activeQuote?.nrc || 0;
  const netMrcProfit = clientMrc - vendorCostMrc;
  const calculatedMrcMargin = clientMrc > 0 ? Math.round((netMrcProfit / clientMrc) * 100) : 0;
  const netNrcProfit = clientNrc - vendorCostNrc;
  const calculatedNrcMargin = clientNrc > 0 ? Math.round((netNrcProfit / clientNrc) * 100) : 0;
  const isMarginInTarget = calculatedMrcMargin >= 35 && netMrcProfit >= 0;

  const handleVendorQuoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingVendorQuote(true);
    setTimeout(() => {
      const fileName = file.name;
      setVendorQuoteFile(fileName);
      // Simulate smart parsing from vendor quote
      const parsedVendorMrc = Math.round(clientMrc * 0.48); // e.g. 52% margin
      const parsedVendorNrc = Math.round(clientNrc * 0.55);
      setVendorCostMrc(parsedVendorMrc);
      setVendorCostNrc(parsedVendorNrc);
      setIsParsingVendorQuote(false);
    }, 1200);
  };

  const handleSaveCostValidation = () => {
    if (!activeQuote) return;
    setQuotations(prev => prev.map(q => {
      if (q.id === activeQuote.id) {
        return {
          ...q,
          vendorCostMrc,
          vendorCostNrc,
          vendorQuoteFileName: vendorQuoteFile || "FibreCom_Wholesale_CostSheet_2026.pdf",
          vendorQuoteUploadedAt: new Date().toISOString(),
          marginPercentage: calculatedMrcMargin,
          costValidated: true,
          status: "margin_verified"
        };
      }
      return q;
    }));
    setCostValidationSaved(true);
  };

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
            {/* Vendor Selection & Alternative Feasibility Block */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100/80">
                    <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      Upstream Vendor Selection & Feasibility Management
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Manage assigned network operator. If the initial vendor is unfeasible, switch to an alternative supplier.
                    </p>
                  </div>
                </div>
                {!isChangingVendor && (
                  <button
                    type="button"
                    onClick={() => setIsChangingVendor(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Change / Switch Vendor
                  </button>
                )}
              </div>

              {/* Active Vendor Banner */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-md font-bold text-[11px] uppercase tracking-wider font-mono">
                    Active Operator
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      {activeQuote.networkOperator || vendorName || "Fibre Com Connect Wholesale"}
                      {activeQuote.previousVendor && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          Reassigned
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Feasibility Status: <strong className="text-emerald-700 font-semibold">Feasible Line Confirmed ✓</strong>
                    </p>
                  </div>
                </div>

                {activeQuote.previousVendor && (
                  <div className="text-left sm:text-right text-[11px] bg-amber-50/80 p-2 rounded-md border border-amber-200/80 max-w-xs">
                    <p className="text-amber-900 font-bold flex items-center gap-1 sm:justify-end">
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-600" /> Vendor Switch Record
                    </p>
                    <p className="text-amber-800 text-[10px] mt-0.5">
                      Previous: <span className="font-semibold">{activeQuote.previousVendor}</span>
                    </p>
                    {activeQuote.vendorChangeReason && (
                      <p className="text-amber-700 text-[10px] italic truncate">{activeQuote.vendorChangeReason}</p>
                    )}
                  </div>
                )}
              </div>

              {vendorChangeSuccessBanner && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{vendorChangeSuccessBanner}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setVendorChangeSuccessBanner(null)}
                    className="text-emerald-700 font-bold text-[10px] hover:underline cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Changing Vendor Form Expansion */}
              {isChangingVendor && (
                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <h5 className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      Select Alternative Network Vendor & Feasibility Reason
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsChangingVendor(false)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        1. Select New Target Network Operator *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          "Openserve",
                          "Dark Fibre Africa (DFA)",
                          "Vumatel / CIVH",
                          "MetroFibre Networx",
                          "Frogfoot Networks",
                          "Liquid Intelligent Tech",
                          "Link Africa",
                          "Fibre Com Connect Wholesale"
                        ].map((op) => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setSelectedNewVendor(op)}
                            className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${
                              selectedNewVendor === op
                                ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50"
                            }`}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          2. Primary Feasibility Issue with Initial Vendor *
                        </label>
                        <select
                          value={vendorChangeReason}
                          onChange={(e) => setVendorChangeReason(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Initial vendor wayleave / landlord permit rejected">Wayleave / Landlord Permit Refused</option>
                          <option value="High civil trenching / build cost surcharge (&gt; R100k)">High Build / Trenching Surcharge (&gt; R100k)</option>
                          <option value="No fiber port availability / POP exhaustion at site">No Port / POP Capacity at Building</option>
                          <option value="Unacceptable installation lead time (&gt; 12 weeks)">Excessive SLA / Delivery Lead Time (&gt; 12 weeks)</option>
                          <option value="Uncompetitive wholesale MRC rate">Uncompetitive Wholesale Rate</option>
                          <option value="Other feasibility constraint">Other Feasibility Constraint</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          3. Additional Reference / Feasibility Notes
                        </label>
                        <input
                          type="text"
                          value={customVendorReasonNote}
                          onChange={(e) => setCustomVendorReasonNote(e.target.value)}
                          placeholder="e.g. Wayleave ref #WF-884 decl. Switched to Openserve in-building riser."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingVendor(false)}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmVendorChange}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Vendor Switch to {selectedNewVendor}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vendor Wholesale Quote Upload & Cost Validation Panel */}
            <div className="p-4 bg-teal-50/40 border border-teal-200/80 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-teal-200/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
                    <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      Vendor Quote Upload & Cost Validation
                    </h4>
                    <p className="text-[11px] text-slate-500">Upload official vendor quote document and validate wholesale cost vs. client selling price.</p>
                  </div>
                </div>
                {costValidationSaved && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cost Validated
                  </span>
                )}
              </div>

              {/* File Upload Zone */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-700">Vendor Wholesale Quote Document *</p>
                    <p className="text-[10px] text-slate-500">Attach vendor wholesale pricing sheet (PDF, XLSX, TXT)</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleVendorQuoteUpload}
                    accept=".pdf,.xlsx,.xls,.txt,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsingVendorQuote}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isParsingVendorQuote ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" /> Parsing Vendor Sheet...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-teal-600" /> {vendorQuoteFile ? "Replace Vendor Quote" : "Upload Vendor Quote"}
                      </>
                    )}
                  </button>
                </div>

                {vendorQuoteFile && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-mono font-medium truncate">{vendorQuoteFile}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-sans">Wholesale Quote Attached</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">Parsed ✓</span>
                  </div>
                )}
              </div>

              {/* Vendor Cost Input Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Upstream Vendor / Operator</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. Fibre Com Connect"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor Cost (MRC / pm)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">R</span>
                    <input
                      type="number"
                      value={vendorCostMrc}
                      onChange={(e) => setVendorCostMrc(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      placeholder="2100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor Setup Cost (NRC)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">R</span>
                    <input
                      type="number"
                      value={vendorCostNrc}
                      onChange={(e) => setVendorCostNrc(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-2 py-1.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                      placeholder="1500"
                    />
                  </div>
                </div>
              </div>

              {/* Cost vs Selling Price Comparison Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold">
                      <th className="p-2">Financial Component</th>
                      <th className="p-2 text-right">Selling Price (Client)</th>
                      <th className="p-2 text-right">Vendor Cost (Wholesale)</th>
                      <th className="p-2 text-right">Net Profit</th>
                      <th className="p-2 text-right">Margin %</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 font-sans font-semibold text-slate-700 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-teal-600" /> Monthly Fee (MRC)
                      </td>
                      <td className="p-2 text-right font-bold text-slate-800">R {clientMrc.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-slate-600">R {vendorCostMrc.toLocaleString()}</td>
                      <td className={`p-2 text-right font-bold ${netMrcProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                        R {netMrcProfit.toLocaleString()}
                      </td>
                      <td className={`p-2 text-right font-bold ${calculatedMrcMargin >= 35 ? "text-emerald-700" : "text-amber-600"}`}>
                        {calculatedMrcMargin}%
                      </td>
                      <td className="p-2 text-center font-sans">
                        {calculatedMrcMargin >= 35 && netMrcProfit >= 0 ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Compliant ✓</span>
                        ) : netMrcProfit < 0 ? (
                          <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">Below Cost 🚨</span>
                        ) : (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Sub-Target ⚠️</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-sans font-semibold text-slate-700 flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-teal-600" /> Setup Fee (NRC)
                      </td>
                      <td className="p-2 text-right font-bold text-slate-800">R {clientNrc.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold text-slate-600">R {vendorCostNrc.toLocaleString()}</td>
                      <td className={`p-2 text-right font-bold ${netNrcProfit >= 0 ? "text-emerald-700" : "text-red-600"}`}>
                        R {netNrcProfit.toLocaleString()}
                      </td>
                      <td className="p-2 text-right font-bold text-slate-700">{calculatedNrcMargin}%</td>
                      <td className="p-2 text-center font-sans">
                        {netNrcProfit >= 0 ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Validated ✓</span>
                        ) : (
                          <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">Negative 🚨</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Overall Cost Validation Alert */}
              {!isMarginInTarget ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Cost Discrepancy / Below Target Margin Alert</p>
                    <p className="text-[11px] text-amber-700">
                      Selling price vs. Vendor cost yields <strong>{calculatedMrcMargin}% gross margin</strong> (target is 35%+). Consider negotiating vendor wholesale pricing or obtaining executive sign-off before issuing PO.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Cost Validated Successfully</p>
                    <p className="text-[11px] text-emerald-700">
                      Commercial selling price R {clientMrc.toLocaleString()} exceeds vendor wholesale cost R {vendorCostMrc.toLocaleString()} with an acceptable gross margin of <strong>{calculatedMrcMargin}%</strong>.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveCostValidation}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Save & Lock Vendor Cost Validation Matrix
              </button>
            </div>

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
                    <p className={`text-lg font-extrabold font-mono ${(activeQuote.vendorCostMrc ? calculatedMrcMargin : activeQuote.marginPercentage) >= 35 ? "text-emerald-600" : "text-amber-600"}`}>
                      {activeQuote.vendorCostMrc ? calculatedMrcMargin : activeQuote.marginPercentage}%
                    </p>
                    {(activeQuote.vendorCostMrc ? calculatedMrcMargin : activeQuote.marginPercentage) >= 35 ? (
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

              {(activeQuote.vendorCostMrc ? calculatedMrcMargin : activeQuote.marginPercentage) < 35 && (
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
