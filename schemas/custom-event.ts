import { z } from "zod";

// Torque event ingestion payload — from official docs
// userPubkey and timestamp are always top-level
// custom fields go inside data — NOT alongside userPubkey
export const torqueEventPayloadSchema = z.object({
  userPubkey: z.string().min(32, "Invalid wallet address"),
  timestamp: z.number().int().positive("Timestamp must be ms epoch"),
  eventName: z.string().min(1, "Event name required"),
  data: z.record(z.union([z.string(), z.number(), z.boolean()])),
});

export type TorqueEventPayloadInput = z.infer<typeof torqueEventPayloadSchema>;

// Referral event schema (backed by custom event)
export const referralEventSchema = z.object({
  userPubkey: z.string().min(32),
  referrerCode: z.string().min(1),
  referee: z.string().min(32),
});

export type ReferralEventInput = z.infer<typeof referralEventSchema>;
