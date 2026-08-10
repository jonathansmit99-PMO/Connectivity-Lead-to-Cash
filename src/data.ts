import { Lead, FeasibilityStudy, Quotation, OccupancyDocument, ProjectCase, SupportTicket, LifecycleRequest } from "./types";

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-001",
    resellerName: "Smit & Partners ICT",
    clientName: "Alpha Bank South Africa",
    email: "procurement@alphabank.co.za",
    phone: "+27 11 400 5000",
    companyName: "Alpha Banking Corporation Ltd",
    registrationNumber: "2015/348291/06",
    vatNumber: "4590281726",
    industry: "Financial Services",
    address: "150 Rivonia Road, Sandown, Sandton, 2196",
    primaryBillingContact: {
      name: "Dumisani Khumalo",
      email: "billing@alphabank.co.za",
      phone: "+27 11 400 5001"
    },
    secondaryAuthContact: {
      name: "Sarah Jenkins",
      email: "jenkins.s@alphabank.co.za",
      phone: "+27 11 400 5002"
    },
    status: "active",
    documents: {
      registrationPapers: "uploaded",
      proofOfAddress: "uploaded",
      signatoryId: "uploaded",
      bankProof: "uploaded",
      taxInfo: "uploaded",
      cipcDocs: "uploaded"
    },
    complianceResults: {
      ficaVerified: true,
      cddVerified: true,
      ncaAffordability: true,
      kybVerified: true,
      notes: "Company details match CIPC records. Signatories verified via Home Affairs. Financial affordability cleared under NCA.",
      checkedBy: "Thabo Cele (Compliance Officer)",
      checkedAt: "2026-06-25T11:20:00Z"
    },
    contract: {
      draftText: "### MASTER SERVICES AGREEMENT ADDENDUM\n\n**BETWEEN:**\nConnectNAV (Pty) Ltd\n\n**AND:**\nAlpha Banking Corporation Ltd (Registration: 2015/348291/06)\n\nThis agreement outlines the provision of high-speed enterprise dedicated fiber links with SLA thresholds of 99.5% uptime.\n\nSigned on 2026-06-26.",
      signedDate: "2026-06-26T14:30:00Z",
      signatureClient: "Dumisani Khumalo",
      signatureReunert: "Director of ConnectNAV"
    },
    createdAt: "2026-06-24T09:15:00Z"
  },
  {
    id: "lead-002",
    resellerName: "Apex Telecoms Reseller",
    clientName: "Gold Reef Mining Corp",
    email: "infrastructure@goldreef.co.za",
    phone: "+27 11 883 4100",
    companyName: "Gold Reef Mining Operations",
    registrationNumber: "2008/114958/07",
    vatNumber: "4203918274",
    industry: "Mining & Resources",
    address: "Sector 4 Outer Loop Road, Carltonville, 2499",
    primaryBillingContact: {
      name: "Jacobus van der Merwe",
      email: "jvdm@goldreef.co.za",
      phone: "+27 18 786 1120"
    },
    secondaryAuthContact: {
      name: "Thandi Molefe",
      email: "tmolefe@goldreef.co.za",
      phone: "+27 18 786 1125"
    },
    status: "compliance_pending",
    documents: {
      registrationPapers: "uploaded",
      proofOfAddress: "uploaded",
      signatoryId: "uploaded",
      bankProof: "uploaded",
      taxInfo: "uploaded"
    },
    createdAt: "2026-06-26T14:10:00Z"
  },
  {
    id: "lead-003",
    resellerName: "ConnectNAV Agent",
    clientName: "Cape Logistics Ltd",
    email: "cape.ops@capelogistics.co.za",
    phone: "+27 21 551 2000",
    companyName: "Cape Logistics Ltd",
    registrationNumber: "2018/664322/06",
    vatNumber: "4820194857",
    industry: "Logistics & Transport",
    address: "24 Montague Drive, Montague Gardens, Cape Town, 7441",
    primaryBillingContact: {
      name: "Nicolette Fourie",
      email: "nicolette@capelogistics.co.za",
      phone: "+27 21 551 2005"
    },
    secondaryAuthContact: {
      name: "Marcus Adams",
      email: "madams@capelogistics.co.za",
      phone: "+27 21 551 2008"
    },
    status: "lead_captured",
    documents: {},
    createdAt: "2026-06-27T10:00:00Z"
  }
];

export const INITIAL_FEASIBILITIES: FeasibilityStudy[] = [
  {
    id: "feas-001",
    leadId: "lead-001",
    address: "150 Rivonia Road, Sandown, Sandton, 2196",
    gpsCoordinates: "-26.1014, 28.0572",
    status: "completed",
    services: [
      { type: "Fiber", available: true, vendor: "Fibre Com Connect", maxSpeed: "1 Gbps", latency: "4ms", estimatedLeadTime: "4 weeks" },
      { type: "Wireless", available: true, vendor: "Reunert AirLink", maxSpeed: "100 Mbps", latency: "12ms", estimatedLeadTime: "2 weeks" },
      { type: "LTE", available: true, vendor: "MTN South Africa", maxSpeed: "80 Mbps", latency: "25ms", estimatedLeadTime: "3 days" },
      { type: "Satellite", available: true, vendor: "Starlink Business", maxSpeed: "220 Mbps", latency: "45ms", estimatedLeadTime: "7 days" }
    ]
  },
  {
    id: "feas-002",
    leadId: "lead-002",
    address: "Sector 4 Outer Loop Road, Carltonville, 2499",
    gpsCoordinates: "-26.3582, 27.3911",
    status: "completed",
    services: [
      { type: "Fiber", available: false, vendor: "Fibre Com Connect", maxSpeed: "N/A", latency: "N/A", estimatedLeadTime: "WIP (12 weeks)" },
      { type: "Wireless", available: true, vendor: "Reunert AirLink", maxSpeed: "150 Mbps", latency: "15ms", estimatedLeadTime: "3 weeks" },
      { type: "LTE", available: true, vendor: "Vodacom Business", maxSpeed: "50 Mbps", latency: "30ms", estimatedLeadTime: "3 days" },
      { type: "Satellite", available: true, vendor: "Starlink Business", maxSpeed: "220 Mbps", latency: "45ms", estimatedLeadTime: "7 days" }
    ]
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: "quote-001",
    leadId: "lead-001",
    address: "150 Rivonia Road, Sandown, Sandton, 2196",
    gpsCoordinates: "-26.1014, 28.0572",
    networkOperator: "Fibre Com Connect",
    networkType: "Fiber",
    networkStatus: "Live",
    leadTimeWeeks: 4,
    bandwidth: "500 Mbps",
    nrc: 8500,
    mrc: 14500,
    termMonths: 24,
    lastMileProvider: "Fibre Com Connect",
    contention: "1:1",
    provisioningType: "Layer 3",
    notes: "Direct fiber entry into ground floor server room. Pricing includes basic civil works.",
    pricingValidityDays: 30,
    status: "po_uploaded",
    marginPercentage: 42.5,
    poNumber: "PO-992014-ALPHA",
    poUploadedAt: "2026-06-26T15:00:00Z"
  },
  {
    id: "quote-002",
    leadId: "lead-002",
    address: "Sector 4 Outer Loop Road, Carltonville, 2499",
    gpsCoordinates: "-26.3582, 27.3911",
    networkOperator: "Reunert AirLink",
    networkType: "Wireless",
    networkStatus: "Live",
    leadTimeWeeks: 3,
    bandwidth: "100 Mbps",
    nrc: 4500,
    mrc: 7200,
    termMonths: 36,
    lastMileProvider: "Reunert Wireless Network",
    contention: "1:1",
    provisioningType: "Layer 2",
    notes: "Requires standard pole mount (3m mast) on mine house roof.",
    pricingValidityDays: 30,
    status: "uploaded",
    marginPercentage: 38.0
  }
];

export const INITIAL_OCCUPANCIES: OccupancyDocument[] = [
  {
    id: "occ-001",
    leadId: "lead-001",
    buildingName: "Alpha Bank Sandton Campus",
    address: "150 Rivonia Road, Sandown, Sandton, 2196",
    gpsCoordinates: "-26.1014, 28.0572",
    onsiteContactName: "Lebo Nkosi",
    onsiteContactPhone: "+27 82 455 1200",
    onsiteContactEmail: "lnkosi@alphabank.co.za",
    landlordName: "Redefine Properties",
    landlordPhone: "+27 11 283 0000",
    landlordEmail: "info@redefine.co.za",
    gpsValidated: true,
    termsAgreed: true,
    status: "submitted"
  }
];

export const INITIAL_CASES: ProjectCase[] = [
  {
    id: "case-001",
    leadId: "lead-001",
    quotationId: "quote-001",
    status: "live",
    surveyDate: "2026-06-25",
    planningDocName: "Reunert_150Rivonia_Planning_v2.pdf",
    planningDocUrl: "#",
    handoverCertificate: {
      testResults: "Symmetric 500Mbps, 100% throughput, 0% packet loss, ping 3.8ms to Reunert Core",
      linkStatus: "Excellent",
      ipSubnet: "196.15.22.40/29",
      vlanId: 1042,
      handoverDate: "2026-06-27T16:00:00Z"
    },
    routerInstalled: true,
    finalTestingPassed: true,
    clientSignedOff: true,
    clientSignOffDate: "2026-06-27T16:15:00Z",
    slaTerms: "99.5% Gold Class SLA, 4hr MTTR, 24/7 Proactive Monitoring"
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "ticket-001",
    projectCaseId: "case-001",
    companyName: "Alpha Banking Corporation Ltd",
    issueType: "Speed",
    description: "Brief packet drop observed during corporate backup sync on Saturday evening.",
    status: "resolved",
    loggedAt: "2026-06-27T18:30:00Z",
    resolutionNotes: "Line stabilized automatically. Monitored active optical power levels: solid at -14.2dBm."
  }
];

export const INITIAL_LIFECYCLE_REQUESTS: LifecycleRequest[] = [
  {
    id: "req-001",
    leadId: "lead-001",
    companyName: "Alpha Banking Corporation Ltd",
    requestType: "upgrade",
    status: "pending_sales",
    details: {
      newBandwidth: "1000 Mbps",
      newTermMonths: 36,
      reason: "Increasing corporate database replication frequency and migrating disaster recovery to multi-region cloud services.",
      effectiveDate: "2026-07-01"
    },
    submittedBy: "Dumisani Khumalo",
    submittedAt: "2026-06-27T08:00:00Z"
  },
  {
    id: "req-002",
    leadId: "lead-001",
    companyName: "Alpha Banking Corporation Ltd",
    requestType: "outdoor_transfer",
    status: "approved",
    details: {
      newAddress: "Suite 4B, 160 Rivonia Road, Sandton, 2196",
      newCoordinates: "-26.1010, 28.0578",
      reason: "Office expansion and relocation to the adjacent block.",
      effectiveDate: "2026-08-01"
    },
    submittedBy: "Sarah Jenkins",
    submittedAt: "2026-06-25T10:00:00Z",
    vettedBySales: {
      vetted: true,
      vettedBy: "Sipho Sithole (Sales VP)",
      vettedAt: "2026-06-25T14:30:00Z",
      status: "approved",
      notes: "Commercial terms approved. Same local loop provider can carry out the transfer."
    },
    vettedByProcurement: {
      vetted: true,
      vettedBy: "Patricia Ndlovu (Procurement Chief)",
      vettedAt: "2026-06-26T09:15:00Z",
      status: "approved",
      notes: "Relocation feasibility confirmed with network operator. Approved and updated."
    }
  }
];

