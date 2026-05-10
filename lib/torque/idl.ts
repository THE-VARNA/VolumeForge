// Torque Data Sources service
// Covers: IDL pipeline, custom events, Dune event sources
//
// IDL pipeline (doc-confirmed):
//   create_idl (preview → commit) → list_idls → create_instruction
//   → generate_incentive_query (source: "idl_instruction")
//   → [preview_incentive_query — optional] → create_recurring_incentive
//
// Custom event pipeline:
//   create_custom_event → attach_custom_event → sendEvent (≥1) → generate_incentive_query (source: "custom_event")
//
// Dune pipeline:
//   register_dune_event_source → wait 24h → generate_incentive_query (source: "dune_query")

import { torqueClient } from "./client";
import type { TorqueIdl, TorqueInstruction } from "./types";

// parse_idl — accepts filePath or idl JSON (not both)
// Limits: 15 numbers, 15 strings, 10 booleans, 30 accounts per instruction
export async function parseIdl(params: {
  idl: unknown; // inline IDL JSON object
}): Promise<{ instructions: TorqueInstruction[] }> {
  return torqueClient.post<{ instructions: TorqueInstruction[] }>(
    "/idl/parse",
    params,
  );
}

// create_idl — upload IDL and create instruction tracking
// programAddress is extracted from IDL's `address` field automatically
export async function createIdl(params: {
  idl: unknown;
  programAddress?: string;
  displayName: string;
  description?: string;
  selectedInstructions?: string[]; // instruction names to track
}): Promise<TorqueIdl> {
  return torqueClient.post<TorqueIdl>("/idl", params);
}

// create_instruction — add an instruction to an existing uploaded IDL
export async function createInstruction(params: {
  idlId: string;
  instructionName: string;
  label?: string;
  fields?: { name: string; type: "number" | "string" | "boolean"; label?: string }[];
  accounts?: { name: string; label?: string }[];
}): Promise<TorqueInstruction> {
  return torqueClient.post<TorqueInstruction>(
    `/idl/${params.idlId}/instructions`,
    params,
  );
}

// list_idls — all uploaded IDLs + tracked instructions for active project
export async function listIdls(): Promise<TorqueIdl[]> {
  const res = await torqueClient.get<{ data: TorqueIdl[] }>("/idl");
  return res.data ?? [];
}

// generate_incentive_query — all three source types (doc-confirmed)
// source: "idl_instruction" | "custom_event" | "dune_query"
export async function generateIncentiveQuery(
  params:
    | { source: "idl_instruction"; instructionId: string; valueExpression?: string; filterExpression?: string }
    | { source: "custom_event"; customEventId: string; valueExpression?: string; filterExpression?: string }
    | { source: "dune_query"; duneEventQueryId: string; valueExpression?: string; filterExpression?: string },
): Promise<{ sqlQuery: string }> {
  return torqueClient.post<{ sqlQuery: string }>(
    "/query/generate",
    params,
  );
}

// preview_incentive_query — optional creation-time test (not in the required pipeline)
// Use to validate the query returns expected wallets before committing
export async function previewIncentiveQuery(params: {
  sqlQuery: string;
  limit?: number;
}): Promise<{ rows: { wallet: string; value: number }[] }> {
  return torqueClient.post<{ rows: { wallet: string; value: number }[] }>(
    "/query/preview",
    params,
  );
}
