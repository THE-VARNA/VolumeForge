// Torque IDL service
// Implements the documented pipeline:
// parse_idl → create_idl → generate_incentive_query (source: "idl_instruction")
//   → [preview_incentive_query — optional creation-time test]
//   → create_recurring_incentive
//
// Also exposes: list_idls, create_instruction

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

// generate_incentive_query with source: "idl_instruction"
// Returns the SQL query string for use in create_recurring_incentive
export async function generateIncentiveQuery(params: {
  source: "idl_instruction";
  instructionId: string;
  metricField?: string; // which numeric field to aggregate
}): Promise<{ sqlQuery: string }> {
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
