import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find or create Roche organization
  let rocheOrg = await prisma.organization.findFirst({ where: { name: 'Roche' } });
  if (!rocheOrg) {
    rocheOrg = await prisma.organization.create({
      data: {
        name: 'Roche',
        description: 'Roche Demo Organization',
      },
    });
  }

  // Upsert Otavio as ADMIN in Roche
  await prisma.user.upsert({
    where: { email: 'otavio.serra@contractors.roche.com' },
    update: {
      organizationId: rocheOrg.id,
      role: 'ADMIN',
    },
    create: {
      name: 'Otavio Serra',
      email: 'otavio.serra@contractors.roche.com',
      organizationId: rocheOrg.id,
      role: 'ADMIN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 