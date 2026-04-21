// Torque Incentives service
// Wraps: create_recurring_incentive, list_recurring_incentives,
//        get_recurring_incentive, get_incentive_results, get_recurring_incentive_analytics

import { torqueClient } from "./client";
import type {
  CreateIncentiveParams,
  TorqueAnalytics,
  TorqueIncentiveResult,
  TorqueRecurringIncentive,
} from "./types";

// Enforce the XOR schedule rule from the official docs:
// "Provide either evalDurationDays or interval, not both."
function validateSchedule(params: CreateIncentiveParams): void {
  if (params.evalDurationDays !== undefined && params.interval !== undefined) {
    throw new Error(
      "Torque API: provide either evalDurationDays or interval, not both.",
    );
  }
}

export async function createRecurringIncentive(
  params: CreateIncentiveParams,
): Promise<TorqueRecurringIncentive> {
  validateSchedule(params);
  return torqueClient.post<TorqueRecurringIncentive>(
    "/incentives/recurring",
    params,
  );
}

export async function listRecurringIncentives(): Promise<
  TorqueRecurringIncentive[]
> {
  const res = await torqueClient.get<{
    data: TorqueRecurringIncentive[];
  }>("/incentives/recurring");
  return res.data ?? [];
}

export async function getRecurringIncentive(
  recurringOfferId: string,
): Promise<TorqueRecurringIncentive> {
  return torqueClient.get<TorqueRecurringIncentive>(
    `/incentives/recurring/${recurringOfferId}`,
  );
}

export async function getRecurringIncentiveAnalytics(
  recurringOfferId: string,
): Promise<TorqueAnalytics> {
  return torqueClient.get<TorqueAnalytics>(
    `/incentives/recurring/${recurringOfferId}/analytics`,
  );
}

// mode:
//   "preview"    — evaluation scores: ranked wallets and their metric values
//   "recipients" — allocations and payouts with distribution status
//   "download"   — signed URL for CSV export
export async function getIncentiveResults(
  recurringOfferId: string,
  mode: "preview" | "recipients" | "download" = "preview",
  epochConfigId?: string,
): Promise<TorqueIncentiveResult[]> {
  const params = new URLSearchParams({ mode });
  if (epochConfigId) params.set("epochConfigId", epochConfigId);
  const res = await torqueClient.get<{ data: TorqueIncentiveResult[] }>(
    `/incentives/recurring/${recurringOfferId}/results?${params.toString()}`,
  );
  return res.data ?? [];
}
