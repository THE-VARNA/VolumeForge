// app/api/torque/incentives/[id]/results/route.ts
// get_epoch_leaderboard — mode: preview | recipients | download
// get_epoch_aggregate_stats

import { NextResponse } from "next/server";
import { getIncentiveResults } from "@/lib/torque/incentives";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const url = new URL(req.url);
    const mode = (url.searchParams.get("mode") ?? "preview") as
      | "preview"
      | "recipients"
      | "download";
    const epochConfigId = url.searchParams.get("epochConfigId") ?? undefined;

    const results = await getIncentiveResults(params.id, mode, epochConfigId);
    return NextResponse.json({ data: results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // If Torque creds not set, return empty rather than crashing
    if (message.includes("TORQUE_API_TOKEN")) {
      return NextResponse.json({ data: [], demo: true });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
