import { NextRequest, NextResponse } from "next/server";
import {
  getRecurringIncentive,
  getIncentiveResults,
  getRecurringIncentiveAnalytics,
} from "@/lib/torque/incentives";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") as "preview" | "recipients" | "download" | null;
  const epochConfigId = searchParams.get("epochConfigId") ?? undefined;

  try {
    if (mode) {
      const results = await getIncentiveResults(id, mode, epochConfigId);
      return NextResponse.json({ results });
    }

    const analyticsRequested = searchParams.get("analytics") === "true";
    if (analyticsRequested) {
      const analytics = await getRecurringIncentiveAnalytics(id);
      return NextResponse.json(analytics);
    }

    const incentive = await getRecurringIncentive(id);
    return NextResponse.json(incentive);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
