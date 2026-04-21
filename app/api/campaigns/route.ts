import { NextRequest, NextResponse } from "next/server";
import { listRecurringIncentives, createRecurringIncentive } from "@/lib/torque/incentives";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const [torqueIncentives, localCampaigns] = await Promise.all([
      listRecurringIncentives().catch(() => []),
      prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return NextResponse.json({ torqueIncentives, campaigns: localCampaigns });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, description, type, protocolName, programAddress,
      customEventName, rewardToken, rewardPool, rebatePercentage,
      raffleBuckets, raffleWeighting, allocations, customFormula,
      maxPerParticipant, startDate, evalDurationDays, epochInterval,
      maxIterations, instructionId, customEventId,
    } = body;

    // Create on Torque if credentials are available
    let torqueOfferId: string | undefined;
    if (process.env.TORQUE_API_TOKEN) {
      const torqueParams = {
        name,
        description,
        type: type.toLowerCase() as "leaderboard" | "rebate" | "raffle" | "direct",
        emissionType: "SOL" as const,
        totalFundAmount: rewardPool,
        startDate,
        ...(evalDurationDays ? { evalDurationDays } : {}),
        ...(epochInterval ? { interval: epochInterval } : {}),
        ...(maxIterations ? { maxIterations } : {}),
        ...(customFormula ? { customFormula } : {}),
        ...(maxPerParticipant ? { maxPerParticipant } : {}),
        ...(rebatePercentage ? { rebatePercentage } : {}),
        ...(raffleBuckets ? { raffleBuckets } : {}),
        ...(raffleWeighting ? { raffleWeighting } : {}),
        ...(allocations ? { allocations } : {}),
        ...(instructionId ? { instructionId } : {}),
        ...(customEventId ? { customEventId } : {}),
        confirmed: true,
      };
      const torqueRes = await createRecurringIncentive(torqueParams);
      torqueOfferId = torqueRes.id;
    }

    // Persist locally
    const campaign = await prisma.campaign.create({
      data: {
        name, description, type, status: "ACTIVE",
        protocolName: protocolName ?? "Unknown",
        programAddress, customEventName, customEventId, instructionId,
        torqueOfferId,
        rewardToken: rewardToken ?? "SOL",
        rewardPool, rebatePercentage, raffleBuckets, raffleWeighting,
        allocations, customFormula, maxPerParticipant,
        startDate: new Date(startDate),
        evalDurationDays, epochInterval, maxIterations,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
