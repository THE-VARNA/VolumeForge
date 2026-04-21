import { NextResponse } from "next/server";
import { listRecurringIncentives } from "@/lib/torque/incentives";

export async function GET() {
  try {
    const incentives = await listRecurringIncentives();
    return NextResponse.json({ incentives });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
