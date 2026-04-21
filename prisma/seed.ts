import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Deterministic wallet addresses for demo
const WALLETS = [
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "3fAzTkmPgK1FmBEbgQjxjSXTe9rVQ8mN2LbF4d5HmD3P",
  "9pTBJv3HyNs7A2VqG6YkZmXeL5MrRp8CwdFbK4NvDtU1",
  "5sKJwPmN8HuT3aLdG9FbE2RqZvX6CnD4SyV7MkA1fBrQ",
  "AkjLP3mN8vT9bCd5KwR6Xq2Zy4Mu7Fs1nYoE8HgJpW2T",
  "BpRqL7mTu4dNk3Hj9Xs2Vy5Wa8Ci6Fg0oZnJmN1De3P",
  "CsJmN4pUv5eOl8Ij0Yt3Wz6Xb9Dr7Gh1qMkL2FaKe4R",
  "DtKnO5qVw6fPm9Jk1Zu4Xa7Yc0Es8Gi2rNlH3GbLf5S",
  "EuLoP6rWx7gQn0Kl2Av5Yb8Zd1Ft9Hj3sMmI4HcMg6T",
  "FvMpQ7sXy8hRo1Lm3Bw6Zc9Ae2Gu0Ik4tNnJ5IdNh7U",
];

const PROGRAMS = [
  "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QDFXesTg",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
];

const INSTRUCTIONS = ["swap", "perp_open", "perp_close", "add_liquidity", "remove_liquidity"];

const CUSTOM_EVENTS = [
  "referral_click",
  "signup_bonus",
  "social_share",
  "onboarding_complete",
];

function randomWallet() {
  return WALLETS[Math.floor(Math.random() * WALLETS.length)];
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log("🌱 Seeding VolumeForge database...");

  // Clean
  await prisma.leaderboardRow.deleteMany();
  await prisma.raffleEntry.deleteMany();
  await prisma.rebateClaim.deleteMany();
  await prisma.sybilRiskSignal.deleteMany();
  await prisma.campaignResult.deleteMany();
  await prisma.epoch.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.tradeEvent.deleteMany();
  await prisma.customEvent.deleteMany();
  await prisma.wallet.deleteMany();

  // Wallets
  await prisma.wallet.createMany({
    data: WALLETS.map((address, i) => ({
      address,
      label: `Trader #${i + 1}`,
      sybilScore: i < 2 ? Math.floor(randomBetween(60, 90)) : Math.floor(randomBetween(0, 30)),
    })),
  });
  console.log(`  ✓ ${WALLETS.length} wallets`);

  // Campaigns
  const [leaderboard, rebate, raffle] = await Promise.all([
    prisma.campaign.create({
      data: {
        name: "Drift Weekly Trader Leaderboard",
        description: "Top traders by weekly volume earn SOL rewards",
        type: "LEADERBOARD",
        status: "ACTIVE",
        protocolName: "Drift Protocol",
        programAddress: PROGRAMS[0],
        rewardToken: "SOL",
        rewardPool: 50,
        customFormula: "RANK <= 3 ? (4 - RANK) * 10 : N",
        startDate: daysAgo(7),
        epochInterval: "WEEKLY",
        maxIterations: 12,
        torqueOfferId: "demo-offer-leaderboard-001",
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Jupiter 5% Trade Rebate",
        description: "Earn 5% back on every swap through Jupiter",
        type: "REBATE",
        status: "ACTIVE",
        protocolName: "Jupiter",
        programAddress: PROGRAMS[1],
        rewardToken: "SOL",
        rewardPool: 100,
        rebatePercentage: 5,
        startDate: daysAgo(14),
        epochInterval: "WEEKLY",
        maxIterations: 8,
        torqueOfferId: "demo-offer-rebate-001",
      },
    }),
    prisma.campaign.create({
      data: {
        name: "Raydium Epoch 3 Raffle",
        description: "Weighted raffle — more LP volume = more tickets",
        type: "RAFFLE",
        status: "PAUSED",
        protocolName: "Raydium",
        programAddress: PROGRAMS[2],
        rewardToken: "SOL",
        rewardPool: 30,
        raffleBuckets: [
          { amount: 10, count: 1 },
          { amount: 5, count: 5 },
          { amount: 1, count: 20 },
        ],
        raffleWeighting: "WEIGHTED_BY_METRIC",
        startDate: daysAgo(21),
        evalDurationDays: 7,
        torqueOfferId: "demo-offer-raffle-001",
      },
    }),
  ]);

  console.log("  ✓ 3 campaigns");

  // Epochs
  const epoch = await prisma.epoch.create({
    data: {
      campaignId: leaderboard.id,
      startDate: daysAgo(7),
      endDate: new Date(),
      status: "ACTIVE",
    },
  });

  // Leaderboard rows
  await prisma.leaderboardRow.createMany({
    data: WALLETS.slice(0, 8).map((wallet, i) => ({
      epochId: epoch.id,
      wallet,
      rank: i + 1,
      score: Math.round((1 - i / 8) * 100000 + randomBetween(0, 5000)),
      volume: Math.round((1 - i / 8) * 1500000 + randomBetween(0, 100000)),
      rewardAmt: parseFloat(((1 - i / 8) * 10 + randomBetween(0, 2)).toFixed(4)),
      payStatus: i < 3 ? "DISTRIBUTED" : "PENDING",
    })),
  });

  // Trade events (200)
  const tradeData = Array.from({ length: 200 }, (_, i) => ({
    txSignature: `sig_${i}_${Math.random().toString(36).slice(2)}`,
    wallet: randomWallet(),
    programId: PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)],
    instruction: INSTRUCTIONS[Math.floor(Math.random() * INSTRUCTIONS.length)],
    amountUsd: randomBetween(100, 500000),
    timestamp: new Date(Date.now() - randomBetween(0, 7 * 24 * 60 * 60 * 1000)),
    raw: { slot: Math.floor(randomBetween(200000000, 300000000)) },
  }));

  await prisma.tradeEvent.createMany({ data: tradeData });
  console.log("  ✓ 200 trade events");

  // Custom events (20)
  const customData = Array.from({ length: 20 }, (_, i) => ({
    eventName: CUSTOM_EVENTS[i % CUSTOM_EVENTS.length],
    wallet: randomWallet(),
    timestamp: new Date(Date.now() - randomBetween(0, 7 * 24 * 60 * 60 * 1000)),
    data: { source: "demo", index: i },
  }));

  await prisma.customEvent.createMany({ data: customData });
  console.log("  ✓ 20 custom events");

  // Sybil signals
  await prisma.sybilRiskSignal.createMany({
    data: WALLETS.slice(0, 3).map((wallet) => ({
      wallet,
      signalType: "MICRO_TRADES",
      score: randomBetween(20, 80),
      details: { count: Math.floor(randomBetween(5, 30)), threshold: 50 },
    })),
  });

  // Raffle entries
  await prisma.raffleEntry.createMany({
    data: WALLETS.map((wallet, i) => ({
      campaignId: raffle.id,
      wallet,
      tickets: Math.floor(randomBetween(1, 200)),
      won: i === 0,
      prizeAmt: i === 0 ? 10 : null,
      drawnAt: i === 0 ? new Date() : null,
    })),
  });

  // Rebate claims
  await prisma.rebateClaim.createMany({
    data: WALLETS.slice(0, 5).map((wallet, i) => ({
      campaignId: rebate.id,
      wallet,
      volume: randomBetween(50000, 1000000),
      rebateAmt: randomBetween(0.5, 10),
      status: i === 0 ? "CLAIMED" : i < 3 ? "PENDING" : "INELIGIBLE",
      claimedAt: i === 0 ? new Date() : null,
    })),
  });

  // Campaign result
  await prisma.campaignResult.create({
    data: {
      campaignId: leaderboard.id,
      epochId: epoch.id,
      totalPaid: 18.4,
      participants: 892,
      roi: 3.8,
    },
  });

  console.log("  ✓ Raffle entries, rebate claims, campaign results");
  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
