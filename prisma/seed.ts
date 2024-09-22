import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create the user if it doesn't exist
  const userEmail = 'olserra@gmail.com';
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: 'Olserra',
      email: userEmail,
      role: 'USER',
    },
  });

  // Define hard and soft skills
  const skills = [
    { name: 'JavaScript' },
    { name: 'Python' },
    { name: 'Java' },
    { name: 'C++' },
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'SQL' },
    { name: 'Git' },
    { name: 'Communication' },
    { name: 'Teamwork' },
    { name: 'Problem Solving' },
    { name: 'Time Management' },
    { name: 'Adaptability' },
    { name: 'Critical Thinking' },
  ];

  // Create skills in the database
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });

    // Create progress for each skill for the user
    await prisma.progress.create({
      data: {
        skillId: skill.name, // Assuming skill name is used as ID
        userId: user.id,
        currentProgress: 0, // Initial progress
        status: 'To be learned', // Initial status
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
