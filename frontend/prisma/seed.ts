import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find or create the user with olserra@gmail.com
    let user = await prisma.user.findUnique({
        where: { email: "olserra@gmail.com" },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: "olserra@gmail.com",
                name: "Orlando Serra",
                image: "https://avatars.githubusercontent.com/u/12345678?v=4",
                emailVerified: new Date(),
            }
        });
        console.log("Created new user:", user);
    } else {
        console.log("Found existing user:", user);
    }

    // Delete existing data for this user
    await prisma.data.deleteMany({
        where: { userId: user.id }
    });
    console.log("Deleted existing data");

    // Define subjects
    const subjectDefinitions = [
        {
            name: "Fitness",
            description: "Fitness related tasks and goals"
        },
        {
            name: "Workout",
            description: "Workout routines and exercises"
        },
        {
            name: "Nutrition",
            description: "Diet and nutrition plans"
        },
        {
            name: "Meditation",
            description: "Mindfulness and meditation practices"
        },
        {
            name: "Reading",
            description: "Books and articles to read"
        }
    ];

    // Create or find subjects
    const subjects = await Promise.all(
        subjectDefinitions.map(async (subject) => {
            const existingSubject = await prisma.subject.findUnique({
                where: { name: subject.name }
            });

            if (existingSubject) {
                console.log(`Subject "${subject.name}" already exists`);
                return existingSubject;
            }

            const newSubject = await prisma.subject.create({
                data: subject
            });
            console.log(`Created subject: "${subject.name}"`);
            return newSubject;
        })
    );

    console.log("All subjects ready:", subjects);

    // Create data entries
    const dataEntries = [
        {
            content: "Run 5 miles",
            type: "TEXT",
            metadata: { duration: "40 minutes", intensity: "moderate" },
            subjects: [subjects[0], subjects[1]],
            tags: ["cardio", "outdoor", "morning"]
        },
        {
            content: "Lift weights (chest)",
            type: "TEXT",
            metadata: { reps: 12, sets: 4, weight: "60kg" },
            subjects: [subjects[1]],
            tags: ["strength", "gym", "chest"]
        },
        {
            content: "Meal prep for the week",
            type: "TEXT",
            metadata: { meals: 5, calories: 2000 },
            subjects: [subjects[2]],
            tags: ["meal-prep", "healthy", "planning"]
        },
        {
            content: "Morning meditation session",
            type: "TEXT",
            metadata: { duration: "15 minutes", type: "mindfulness" },
            subjects: [subjects[3]],
            tags: ["morning", "mindfulness", "daily"]
        },
        {
            content: "Read 'Atomic Habits' chapter 3",
            type: "TEXT",
            metadata: { pages: 30, time: "45 minutes" },
            subjects: [subjects[4]],
            tags: ["book", "productivity", "learning"]
        },
        {
            content: "Yoga class",
            type: "TEXT",
            metadata: { duration: "60 minutes", level: "intermediate" },
            subjects: [subjects[0], subjects[3]],
            tags: ["flexibility", "mind-body", "class"]
        },
        {
            content: "Protein shake recipe",
            type: "TEXT",
            metadata: { ingredients: ["whey", "banana", "almond milk"], calories: 300 },
            subjects: [subjects[2]],
            tags: ["recipe", "post-workout", "protein"]
        },
        {
            content: "HIIT workout routine",
            type: "TEXT",
            metadata: { rounds: 4, rest: "30 seconds" },
            subjects: [subjects[0], subjects[1]],
            tags: ["hiit", "cardio", "intense"]
        },
        {
            content: "Read 'The Psychology of Money'",
            type: "TEXT",
            metadata: { pages: 25, time: "40 minutes" },
            subjects: [subjects[4]],
            tags: ["book", "finance", "learning"]
        },
        {
            content: "Evening meditation",
            type: "TEXT",
            metadata: { duration: "20 minutes", type: "guided" },
            subjects: [subjects[3]],
            tags: ["evening", "guided", "relaxation"]
        }
    ];

    // Create all data entries and their relationships
    for (const entry of dataEntries) {
        const data = await prisma.data.create({
            data: {
                content: entry.content,
                type: entry.type,
                userId: user.id,
                metadata: entry.metadata,
                version: 1,
                isArchived: false,
                embedding: [],
                tags: entry.tags
            }
        });

        // Connect subjects
        await prisma.data.update({
            where: { id: data.id },
            data: {
                subjects: {
                    connect: entry.subjects.map(subject => ({ id: subject.id }))
                }
            }
        });
    }

    console.log("Created all data entries with their relationships");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


