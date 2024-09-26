// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skillsData = [
  { name: "Software Engineering" },
  { name: "Leadership" },
  { name: "Analytical" },
  { name: "Creative" },
  { name: "Interpersonal" },
  { name: "Artificial Intelligence" },
  { name: "Data Science" },
  { name: "Negotiation" },
  { name: "Artistic" },
  { name: "Marketing" },
  { name: "Web3" },
];

async function main() {
  // Drop existing progress and skills to avoid unique constraint violations
  await prisma.progress.deleteMany({});
  await prisma.skill.deleteMany({});

  // Seed skills
  for (const skill of skillsData) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log('Seeding skills completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
