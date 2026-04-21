import { NextRequest, NextResponse } from "next/server";
import { sendEvent } from "@/lib/torque/custom-events";
import { prisma } from "@/lib/db/prisma";
import { torqueEventPayloadSchema } from "@/schemas/custom-event";

// POST /api/torque/events
// Proxy to ingest.torque.so — enforces correct payload shape from docs
// { userPubkey, timestamp, eventName, data: {...} }
// Header: x-api-key (set via TORQUE_API_KEY env var server-side)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = torqueEventPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    // Send to Torque ingest
    await sendEvent(payload);

    // Also persist locally for activity feed
    await prisma.customEvent.create({
      data: {
        eventName: payload.eventName,
        wallet: payload.userPubkey,
        timestamp: new Date(payload.timestamp),
        data: payload.data,
      },
    });

    // Ensure wallet record exists
    await prisma.wallet.upsert({
      where: { address: payload.userPubkey },
      create: { address: payload.userPubkey },
      update: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
