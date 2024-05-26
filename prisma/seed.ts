import { prisma } from "../prisma/prisma";

async function seed() {
  try {
    // Create user data
    await prisma.user.create({
      data: {
        name: "Otavio Serra",
        email: "olserra@gmail.com",
        role: "ADMIN",
      },
    });

    console.log("Seed data created successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
