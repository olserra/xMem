import { PrismaClient } from '@prisma/client';
import { skills } from '@/app/data/skills'; // Adjust the import path as necessary

const prisma = new PrismaClient();

async function main() {
  // Drop existing progress, skills, users, accounts, and sessions
  await prisma.progress.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.account.deleteMany({}); // Drop all accounts
  await prisma.session.deleteMany({}); // Drop all sessions

  // Seed skills
  for (const skill of skills) {
    const existingSkill = await prisma.skill.findUnique({
      where: { name: skill.title }, // Use skill.title from the imported data
    });

    // Only create the skill if it does not already exist
    if (!existingSkill) {
      await prisma.skill.create({
        data: {
          name: skill.title,
          description: skill.description || '', // Use skill.description if available
          // Assuming skill has a category and labels
          category: skill.category || '', // Adjust if category is not in your skills structure
          labels: {
            set: skill.labels || [], // Use skill.labels if available
          },
        },
      });
    }
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
