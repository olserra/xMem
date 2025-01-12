import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    let user = await prisma.user.findUnique({
        where: { email: "testuser@example.com" },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: "Test User",
                email: "testuser@example.com",
                emailVerified: new Date(),
                role: "USER",
                image: "https://example.com/image.jpg",
            },
        });
        console.log("Created user:", user);
    } else {
        console.log("User already exists:", user);
    }

    // Create Project with memories
    const project1 = await prisma.project.create({
        data: {
            name: "Fitness Tracker",
            description: "Track my fitness goals and progress.",
            type: "fitness_tracker",
            visibility: "private",
            userId: user.id,
            memories: {
                create: [
                    {
                        content: "Run 5 miles",
                        tags: ["exercise", "running"],
                        type: "task",
                        metadata: { duration: "40 minutes" },
                        userId: user.id,
                    },
                    {
                        content: "Lift weights (chest)",
                        tags: ["exercise", "strength"],
                        type: "task",
                        metadata: { reps: 12, sets: 4 },
                        userId: user.id,
                    },
                ],
            },
        },
    });

    console.log("Created project:", project1);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
