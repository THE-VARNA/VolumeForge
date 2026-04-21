import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const epochId = searchParams.get("epochId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const rows = await prisma.leaderboardRow.findMany({
      where: {
        ...(epochId ? { epochId } : {}),
        ...(search
          ? { wallet: { contains: search, mode: "insensitive" } }
          : {}),
      },
      orderBy: { rank: "asc" },
      take: 100,
      include: { walletRef: true },
    });

    return NextResponse.json({ rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
