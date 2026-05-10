// TanStack Query hooks for all major data fetching operations

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Campaigns ───────────────────────────────────────────────────────────────

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
    staleTime: 30_000,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${id}`);
      if (!res.ok) throw new Error("Failed to fetch campaign");
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: unknown) => {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to create campaign");
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

// ─── Torque Incentives ───────────────────────────────────────────────────────

export function useTorqueIncentives() {
  return useQuery({
    queryKey: ["torque", "incentives"],
    queryFn: async () => {
      const res = await fetch("/api/torque/incentives");
      if (!res.ok) throw new Error("Failed to fetch Torque incentives");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useTorqueIncentive(id: string) {
  return useQuery({
    queryKey: ["torque", "incentives", id],
    queryFn: async () => {
      const res = await fetch(`/api/torque/incentives/${id}`);
      if (!res.ok) throw new Error("Failed to fetch incentive");
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useTorqueIncentiveResults(
  id: string,
  mode: "preview" | "recipients" | "download" = "preview",
  epochConfigId?: string,
) {
  return useQuery({
    queryKey: ["torque", "incentives", id, "results", mode, epochConfigId],
    queryFn: async () => {
      const params = new URLSearchParams({ mode });
      if (epochConfigId) params.set("epochConfigId", epochConfigId);
      const res = await fetch(`/api/torque/incentives/${id}/results?${params}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      return res.json();
    },
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export function useLeaderboard(campaignId?: string) {
  return useQuery({
    queryKey: ["leaderboard", campaignId],
    queryFn: async () => {
      const url = campaignId
        ? `/api/leaderboard?campaignId=${campaignId}`
        : "/api/leaderboard";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
    staleTime: 30_000,
    refetchInterval: 60_000, // live polling
  });
}

// ─── Activity Feed ───────────────────────────────────────────────────────────

export function useActivityFeed(filter?: "trade" | "custom") {
  return useQuery({
    queryKey: ["feed", filter],
    queryFn: async () => {
      const url = filter ? `/api/feed?type=${filter}` : "/api/feed";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch activity feed");
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// ─── Torque Custom Events ────────────────────────────────────────────────────

export function useTorqueCustomEvents(scope: "project" | "owned" = "project") {
  return useQuery({
    queryKey: ["torque", "events", scope],
    queryFn: async () => {
      const res = await fetch(`/api/torque/events?scope=${scope}`);
      if (!res.ok) throw new Error("Failed to fetch custom events");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useSendTorqueEvent() {
  return useMutation({
    mutationFn: async (payload: {
      userPubkey: string;
      timestamp: number;
      eventName: string;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch("/api/torque/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to send event");
      }
      return res.json();
    },
  });
}

// ─── IDL ─────────────────────────────────────────────────────────────────────

export function useTorqueIdls() {
  return useQuery({
    queryKey: ["torque", "idls"],
    queryFn: async () => {
      const res = await fetch("/api/torque/idl");
      if (!res.ok) throw new Error("Failed to fetch IDLs");
      return res.json();
    },
    staleTime: 120_000,
  });
}
