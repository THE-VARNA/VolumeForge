// Torque Custom Events service
// Full lifecycle per official docs:
// 1. create_custom_event  — register schema (eventName, name, fields)
// 2. attach_custom_event  — attach to active project (customEventId)
// 3. sendEvent            — POST to ingest.torque.so with x-api-key header
//    payload: { userPubkey, timestamp, eventName, data: {...} }
//    NOTE: userPubkey is top-level, NOT inside data
// 4. list_project_events  — verify query-readiness (ingested ≥ once required)

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

// list all custom events across all projects
export async function listCustomEvents(): Promise<TorqueCustomEvent[]> {
  const res = await torqueClient.get<{ data: TorqueCustomEvent[] }>(
    "/events/custom",
  );
  return res.data ?? [];
}

// list events for active project — shows query-readiness
// Events must be ingested at least once before they become query-ready
export async function listProjectEvents(): Promise<TorqueCustomEvent[]> {
  const res = await torqueClient.get<{ data: TorqueCustomEvent[] }>(
    "/events/project",
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
