import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet") ?? undefined;
  const eventType = searchParams.get("type") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "50");

  try {
    const [trades, customs] = await Promise.all([
      prisma.tradeEvent.findMany({
        where: {
          ...(wallet ? { wallet } : {}),
          ...(eventType === "trade" || !eventType ? {} : { id: "never" }),
        },
        orderBy: { timestamp: "desc" },
        take: eventType === "custom" ? 0 : Math.ceil(limit / 2),
      }),
      prisma.customEvent.findMany({
        where: {
          ...(wallet ? { wallet } : {}),
          ...(eventType === "trade" ? { id: "never" } : {}),
        },
        orderBy: { timestamp: "desc" },
        take: eventType === "trade" ? 0 : Math.ceil(limit / 2),
      }),
    ]);

    const feed = [
      ...trades.map((t) => ({
        id: t.id,
        type: "trade" as const,
        wallet: t.wallet,
        eventName: t.instruction,
        amountUsd: t.amountUsd,
        timestamp: t.timestamp,
        programId: t.programId,
      })),
      ...customs.map((c) => ({
        id: c.id,
        type: "custom" as const,
        wallet: c.wallet,
        eventName: c.eventName,
        amountUsd: null,
        timestamp: c.timestamp,
        data: c.data,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

    return NextResponse.json({ feed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
