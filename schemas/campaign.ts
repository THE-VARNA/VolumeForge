import { z } from "zod";

// Enforce evalDurationDays XOR interval at schema level (doc rule)
const scheduleBase = z.object({
  startDate: z.string().datetime({ message: "Start date must be ISO datetime" }),
  maxIterations: z.number().int().positive().optional(),
});

const scheduleWithDuration = scheduleBase.extend({
  evalDurationDays: z.number().int().positive(),
  epochInterval: z.undefined().optional(),
});

const scheduleWithInterval = scheduleBase.extend({
  epochInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY"]),
  evalDurationDays: z.undefined().optional(),
});

const scheduleSchema = z.union([scheduleWithDuration, scheduleWithInterval]);

// Reward base
const rewardBase = z.object({
  rewardToken: z.string().min(1, "Reward token is required"),
  rewardPool: z.number().positive("Reward pool must be positive"),
  maxPerParticipant: z.number().positive().optional(),
});

// Leaderboard
export const leaderboardSchema = z
  .object({
    type: z.literal("LEADERBOARD"),
    name: z.string().min(2, "Campaign name required"),
    description: z.string().optional(),
    protocolName: z.string().min(1, "Protocol name required"),
    programAddress: z.string().optional(),
    customEventName: z.string().optional(),
    customFormula: z.string().optional(),
  })
  .merge(rewardBase)
  .and(scheduleSchema);

// Rebate
export const rebateSchema = z
  .object({
    type: z.literal("REBATE"),
    name: z.string().min(2),
    description: z.string().optional(),
    protocolName: z.string().min(1),
    programAddress: z.string().optional(),
    customEventName: z.string().optional(),
    rebatePercentage: z
      .number()
      .min(0.01, "Min 0.01%")
      .max(100, "Max 100%"),
  })
  .merge(rewardBase)
  .and(scheduleSchema);

// Raffle bucket
export const raffleBucketSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  count: z.number().int().positive("Count must be positive integer"),
});

// Raffle
export const raffleSchema = z
  .object({
    type: z.literal("RAFFLE"),
    name: z.string().min(2),
    description: z.string().optional(),
    protocolName: z.string().min(1),
    programAddress: z.string().optional(),
    customEventName: z.string().optional(),
    raffleBuckets: z
      .array(raffleBucketSchema)
      .min(1, "At least one prize bucket required"),
    raffleWeighting: z.enum(["WEIGHTED_BY_METRIC", "EQUAL_CHANCES"]).default("WEIGHTED_BY_METRIC"),
  })
  .merge(rewardBase)
  .and(scheduleSchema);

// Direct allocation
export const directAllocationSchema = z.object({
  address: z.string().min(32, "Invalid wallet address"),
  amount: z.number().positive("Amount must be positive"),
});

// Direct — recurring fixed payouts to specific wallets
export const directSchema = z
  .object({
    type: z.literal("DIRECT"),
    name: z.string().min(2),
    description: z.string().optional(),
    protocolName: z.string().min(1),
    allocations: z
      .array(directAllocationSchema)
      .min(1, "At least one allocation required"),
  })
  .merge(rewardBase)
  .and(scheduleSchema);

// Discriminated union — Zod resolves type from the literal "type" field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const campaignSchema = z.discriminatedUnion("type", [
  leaderboardSchema as any,
  rebateSchema as any,
  raffleSchema as any,
  directSchema as any,
]);

export type CampaignFormValues = z.infer<typeof campaignSchema>;
export type RaffleBucketValues = z.infer<typeof raffleBucketSchema>;
export type DirectAllocationValues = z.infer<typeof directAllocationSchema>;
