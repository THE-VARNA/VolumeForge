// Torque API response types — typed against official docs

export interface TorqueProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface TorqueRecurringIncentive {
  id: string;
  name: string;
  description?: string;
  type: "leaderboard" | "rebate" | "raffle" | "direct";
  status: "ACTIVE" | "PAUSED" | "ENDED" | "DRAFT";
  emissionType: "TOKENS" | "SOL";
  totalFundAmount: number;
  tokenAddress?: string;
  startDate: string;
  // Schedule — one of, not both
  evalDurationDays?: number;
  interval?: "DAILY" | "WEEKLY" | "MONTHLY";
  maxIterations?: number;
  customFormula?: string;
  rebatePercentage?: number;
  raffleBuckets?: RaffleBucket[];
  raffleWeighting?: "WEIGHTED_BY_METRIC" | "EQUAL_CHANCES";
  sqlQuery?: string;
  customEventId?: string;
  instructionId?: string;
  projectId: string;
  createdAt: string;
}

export interface RaffleBucket {
  amount: number;
  count: number;
}

export interface TorqueIncentiveResult {
  wallet: string;
  value: number;
  rank?: number;
  payout?: number;
  status?: "DISTRIBUTED" | "PENDING" | "FAILED";
}

export interface TorqueAnalytics {
  totalParticipants: number;
  totalRewarded: number;
  epochHistory: EpochSummary[];
}

export interface EpochSummary {
  epochConfigId: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalPaid: number;
  status: string;
}

// IDL types
export interface TorqueIdl {
  id: string;
  displayName: string;
  description?: string;
  programAddress: string;
  instructions: TorqueInstruction[];
  createdAt: string;
}

export interface TorqueInstruction {
  id: string;
  name: string;
  label?: string;
  fields: TorqueField[];
  accounts: TorqueAccount[];
}

export interface TorqueField {
  name: string;
  type: "number" | "string" | "boolean";
  label?: string;
  description?: string;
}

export interface TorqueAccount {
  name: string;
  label?: string;
}

// Custom event types
export interface TorqueCustomEvent {
  id: string;
  eventName: string;
  name: string;
  fields: TorqueEventField[];
  queryReady?: boolean;
  createdAt: string;
}

export interface TorqueEventField {
  fieldName: string;
  type: "string" | "number" | "boolean";
  label?: string;
  description?: string;
}

// Ingestion payload — matches official docs exactly
// userPubkey and timestamp are top-level; custom fields go inside data
export interface TorqueEventPayload {
  userPubkey: string;
  timestamp: number; // ms epoch
  eventName: string;
  data: Record<string, string | number | boolean>;
}

export interface TorqueApiKey {
  id: string;
  name: string;
  maskedKey: string;
  createdAt: string;
}

export interface CreateIncentiveParams {
  name: string;
  description?: string;
  type: "leaderboard" | "rebate" | "raffle" | "direct";
  emissionType: "TOKENS" | "SOL";
  totalFundAmount: number;
  tokenAddress?: string;
  tokenDecimals?: number;
  startDate: string;
  // XOR — provide one, not both (doc rule)
  evalDurationDays?: number;
  interval?: "DAILY" | "WEEKLY" | "MONTHLY";
  maxIterations?: number;
  sqlQuery?: string;
  customEventId?: string;
  instructionId?: string;
  customFormula?: string;
  maxPerParticipant?: number;
  // type-specific
  rebatePercentage?: number;
  raffleBuckets?: RaffleBucket[];
  raffleWeighting?: "WEIGHTED_BY_METRIC" | "EQUAL_CHANCES";
  allocations?: { address: string; amount: number }[];
  confirmed?: boolean;
}
