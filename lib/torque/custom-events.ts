// Torque Custom Events & Data Sources service
// Full lifecycle per official docs:
// 1. create_custom_event  — register schema (eventName, name, fields)
//    NOTE: userPubkey and timestamp are NOT schema fields — always top-level on ingested events
// 2. attach_custom_event  — attach to active project (customEventId)
// 3. sendEvent            — POST to ingest.torque.so with x-api-key header
//    payload: { userPubkey, timestamp, eventName, data: {...} }
// 4. list_custom_events(scope: "project" | "owned") — shows query-readiness
//    Must be ingested ≥ once before generate_incentive_query accepts it

import { torqueClient } from "./client";
import type {
  TorqueApiKey,
  TorqueCustomEvent,
  TorqueEventPayload,
} from "./types";

const TORQUE_INGEST_URL =
  process.env.TORQUE_INGEST_URL ?? "https://ingest.torque.so/events";

// Step 1 — create schema
// confirmed: true skips the preview prompt (MCP optional flag)
export async function createCustomEvent(params: {
  eventName: string;
  name: string;
  fields: {
    fieldName: string;
    type: "string" | "number" | "boolean";
    label?: string;
    description?: string;
  }[];
  confirmed?: boolean;
}): Promise<TorqueCustomEvent> {
  return torqueClient.post<TorqueCustomEvent>("/events/custom", params);
}

// Step 2 — attach to active project
export async function attachCustomEvent(params: {
  customEventId: string;
}): Promise<{ success: boolean }> {
  return torqueClient.post<{ success: boolean }>("/events/custom/attach", params);
}

// list_custom_events — scope controls what you see:
//   "project" (default) — events attached to the active project
//   "owned"  — all events you own across every project, attached or not
// Events must be ingested ≥ once before they become query-ready for generate_incentive_query
export async function listCustomEvents(
  scope: "project" | "owned" = "project",
): Promise<TorqueCustomEvent[]> {
  const res = await torqueClient.get<{ data: TorqueCustomEvent[] }>(
    `/events/custom?scope=${scope}`,
  );
  return res.data ?? [];
}

// Step 3 — send event to ingest.torque.so
// Enforces payload shape from official docs:
//   { userPubkey, timestamp, eventName, data: { ...customFields } }
//   Header: x-api-key: <TORQUE_API_KEY>
export async function sendEvent(payload: TorqueEventPayload): Promise<void> {
  const apiKey = process.env.TORQUE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TORQUE_API_KEY is not set. Required as x-api-key header for event ingestion.",
    );
  }

  const res = await fetch(TORQUE_INGEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Torque ingest error ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

// API key management
export async function listApiKeys(): Promise<TorqueApiKey[]> {
  const res = await torqueClient.get<{ data: TorqueApiKey[] }>("/api-keys");
  return res.data ?? [];
}

export async function createApiKey(params: {
  name: string;
}): Promise<TorqueApiKey & { key: string }> {
  // Key is shown once — cannot be retrieved later
  return torqueClient.post<TorqueApiKey & { key: string }>("/api-keys", params);
}
