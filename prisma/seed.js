import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing plans
  await prisma.plan.deleteMany();

  // Create default plans
  const plans = [
    {
      name: "Free",
      description: "Basic features for personal use",
      price: 0,
      features: [
        { name: "10 README file updates / month", available: true },
        { name: "Basic GitHub repository integration", available: true },
        { name: "Manually update README files", available: true },
        { name: "Default branch only (no branch selection)", available: true },
      ],
      maxRepos: 5,
      isActive: true,
    },
    {
      name: "Starter",
      description: "Advanced features for growing needs",
      price: 10,
      features: [
        { name: "Everything in Free", available: true },
        { name: "Unlimited README file updates", available: false },
        { name: "Auto-update README files on commit", available: false },
        { name: "Monitor up to 5 repositories", available: false },
        { name: "Priority support", available: false },
        { name: "Select specific branches for updates", available: false },
        { name: "Control repository updates via Telegram commands", available: false },
      ],
      maxRepos: 5,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan,
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
