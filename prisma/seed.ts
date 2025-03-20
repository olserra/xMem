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

    // Create data
    const data1 = await prisma.data.create({
        data: {
            content: "Run 5 miles",
            type: "TEXT",
            userId: user.id,
            metadata: { duration: "40 minutes" },
            version: 1,
            isArchived: false,
            embedding: []
        },
    });

    const data2 = await prisma.data.create({
        data: {
            content: "Lift weights (chest)",
            type: "TEXT",
            userId: user.id,
            metadata: { reps: 12, sets: 4 },
            version: 1,
            isArchived: false,
            embedding: []
        },
    });

    console.log("Created data:", { data1, data2 });

    // Create subjects
    const subject1 = await prisma.subject.create({
        data: {
            name: "Fitness",
            description: "Fitness related tasks and goals"
        }
    });

    const subject2 = await prisma.subject.create({
        data: {
            name: "Workout",
            description: "Workout routines and exercises"
        }
    });

    console.log("Created subjects:", { subject1, subject2 });

    // Create DataToSubject relationships
    await Promise.all([
        prisma.data.update({
            where: { id: data1.id },
            data: {
                subjects: {
                    connect: { id: subject1.id }
                }
            }
        }),
        prisma.data.update({
            where: { id: data2.id },
            data: {
                subjects: {
                    connect: { id: subject2.id }
                }
            }
        })
    ]);

    console.log("Created DataToSubject relationships");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
