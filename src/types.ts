export interface Lead {
  id: string;
  resellerName: string;
  clientName: string;
  email: string;
  phone: string;
  companyName: string;
  registrationNumber: string;
  vatNumber: string;
  industry: string;
  address: string;
  primaryBillingContact: {
    name: string;
    email: string;
    phone: string;
  };
  secondaryAuthContact: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'lead_captured' | 'company_details_entered' | 'documents_uploaded' | 'compliance_pending' | 'compliance_checks_running' | 'compliance_completed' | 'contract_drafted' | 'contract_signed' | 'active';
  documents: {
    registrationPapers?: string;
    proofOfAddress?: string;
    signatoryId?: string;
    bankProof?: string;
    taxInfo?: string;
    cipcDocs?: string;
  };
  complianceResults?: {
    ficaVerified: boolean;
    cddVerified: boolean;
    ncaAffordability: boolean;
    kybVerified: boolean;
    notes: string;
    checkedBy: string;
    checkedAt: string;
  };
  contract?: {
    draftUrl?: string;
    draftText?: string;
    signedDate?: string;
    signatureClient?: string;
    signatureReunert?: string;
  };
  createdAt: string;
}

export interface FeasibilityStudy {
  id: string;
  leadId: string;
  address: string;
  gpsCoordinates: string;
  status: 'not_started' | 'running' | 'completed';
  services: Array<{
    type: 'Fiber' | 'Wireless' | 'Satellite' | 'LTE';
    available: boolean;
    vendor: string;
    maxSpeed: string;
    latency: string;
    estimatedLeadTime: string;
  }>;
}

export interface ProductSelection {
  leadId: string;
  serviceType: 'broadband' | 'enterprise';
  bandwidth: string; // e.g. "100 Mbps", "1 Gbps"
  term: '12' | '24' | '36'; // months
  vendor: string;
}

export interface Quotation {
  id: string;
  leadId: string;
  address: string;
  gpsCoordinates: string;
  networkOperator: string; // e.g. "Fibre Com Connect", "Reunert Infra"
  networkType: 'Fiber' | 'Wireless' | 'LTE';
  networkStatus: 'Live' | 'WIP';
  leadTimeWeeks: number;
  bandwidth: string;
  nrc: number; // Non-Recurring Cost
  mrc: number; // Monthly Recurring Cost
  termMonths: number;
  lastMileProvider: string;
  contention: string; // e.g., "1:1", "1:10"
  provisioningType: 'Layer 2' | 'Layer 3';
  notes: string;
  pricingValidityDays: number; // usually 30
  status: 'draft' | 'uploaded' | 'margin_verified' | 'po_uploaded' | 'rejected';
  marginPercentage: number;
  vendorCostMrc?: number;
  vendorCostNrc?: number;
  vendorQuoteFileName?: string;
  vendorQuoteUploadedAt?: string;
  costValidated?: boolean;
  previousVendor?: string;
  vendorChangeReason?: string;
  poNumber?: string;
  poUploadedAt?: string;
}

export interface OccupancyDocument {
  id: string;
  leadId: string;
  buildingName: string;
  address: string;
  gpsCoordinates: string;
  onsiteContactName: string;
  onsiteContactPhone: string;
  onsiteContactEmail: string;
  landlordName: string;
  landlordPhone: string;
  landlordEmail: string;
  gpsValidated: boolean;
  termsAgreed: boolean;
  status: 'pending' | 'submitted';
}

export interface ProjectCase {
  id: string;
  leadId: string;
  quotationId: string;
  status: 'case_created' | 'survey_scheduled' | 'survey_completed' | 'vendor_feasibility_checked' | 'planning_uploaded' | 'landlord_approval_pending' | 'landlord_approved' | 'installation_scheduled' | 'installed' | 'testing_and_handover' | 'router_configured' | 'live';
  surveyDate?: string;
  surveyEngineer?: string;
  surveyCompleted?: boolean;
  vendorFeasibilityChecked?: boolean;
  vendorIsFeasible?: boolean;
  vendorUnfeasibleReason?: string;
  vendorUnfeasibleNotifiedDepartments?: string[];
  vendorUnfeasibleNotificationSentAt?: string;
  planningDocName?: string;
  planningDocUrl?: string;
  planningDocSigned?: boolean;
  planningDocSignedBy?: string;
  planningDocSignedTitle?: string;
  planningDocSignedDate?: string;
  buildStartDate?: string;
  buildEndDate?: string;
  handoverDocName?: string;
  handoverDocUrl?: string;
  handoverDocUploadedAt?: string;
  // PM Router Engineer Booking Fields
  pmRouterEngineerBooked?: boolean;
  pmRouterEngineerName?: string;
  pmRouterEngineerRole?: string;
  pmRouterEngineerDate?: string;
  pmRouterEngineerNotes?: string;
  // New Phase 5 Booking Fields
  bookingAddress?: string;
  bookingGps?: string;
  bookingContactName?: string;
  bookingContactPhone?: string;
  bookingContactEmail?: string;
  bookingDateTime?: string;
  bookingEquipment?: string;
  // Phase 5 Field Engineer Portal Tracking Fields
  fieldEquipmentCollectedAt?: string;
  fieldTravelStartedAt?: string;
  fieldTravelArrivedAt?: string;
  fieldTravelDurationMins?: number;
  fieldActivationStartedAt?: string;
  fieldActivationCompletedAt?: string;
  fieldActivationDurationMins?: number;
  fieldChatMessages?: Array<{ id: string; sender: 'field' | 'remote'; text: string; timestamp: string }>;
  // Phase 5 Field Engineer Action Fields
  fieldArrivedAt?: string;
  fieldDoneAt?: string;
  fieldLinkUp?: boolean;
  fieldClientGettingSpeed?: boolean;
  fieldClientSpeedMetric?: string;
  fieldVoiceActive?: boolean;
  fieldCloudActive?: boolean;
  fieldSecurityActive?: boolean;
  fieldClientSignedOff?: boolean;
  fieldClientSignName?: string;
  fieldClientSignDate?: string;
  // Phase 5 Remote Engineer Action Fields
  remoteVlanId?: number;
  remoteIpAddress?: string;
  remoteSubnetAllocation?: '/30' | '/29' | '/31';
  remoteBandwidth?: string;
  remoteConnectivityTested?: boolean;
  remoteConnectivityLog?: string;
  remoteVoiceConfigured?: boolean;
  remoteAdditionalVlans?: string;
  remoteIpSecTunnels?: string;
  
  handoverCertificate?: {
    testResults: string; // e.g., "100Mbps download, 98Mbps upload, zero loss"
    linkStatus: 'Excellent' | 'Good' | 'Fair';
    ipSubnet: string; // e.g., "196.15.22.40/29"
    vlanId: number;
    handoverDate: string;
  };
  routerInstalled: boolean;
  finalTestingPassed: boolean;
  clientSignedOff: boolean;
  clientSignOffDate?: string;
  slaTerms: string; // e.g. "99.5% uptime SLA, 4 hour MTTR"
}

export interface SupportTicket {
  id: string;
  projectCaseId: string;
  companyName: string;
  issueType: 'Speed' | 'Latency' | 'Billing' | 'Hardware' | 'Other';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  loggedAt: string;
  resolutionNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: string; // e.g., "Client", "KAM" (Key Account Manager), "System"
  text: string;
  timestamp: string;
}

export interface LifecycleRequest {
  id: string;
  leadId: string;
  companyName: string;
  requestType: 'renewal' | 'cancellation' | 'outdoor_transfer' | 'upgrade';
  status: 'pending_sales' | 'pending_procurement' | 'approved' | 'rejected';
  details: {
    newTermMonths?: number;
    newBandwidth?: string;
    newAddress?: string;
    newCoordinates?: string;
    reason?: string;
    effectiveDate: string;
  };
  submittedBy: string;
  submittedAt: string;
  vettedBySales?: {
    vetted: boolean;
    vettedBy: string;
    vettedAt: string;
    status: 'approved' | 'rejected';
    notes?: string;
  };
  vettedByProcurement?: {
    vetted: boolean;
    vettedBy: string;
    vettedAt: string;
    status: 'approved' | 'rejected';
    notes?: string;
  };
}
