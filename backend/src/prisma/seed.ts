import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: 'ADMIN',
            isEmailVerified: true
        }
    });

    console.log('✅ Created admin user:', admin.email);

    // Create sample summary
    const sampleSummary = await prisma.summary.upsert({
        where: { id: 'sample-summary-1' },
        update: {},
        create: {
            id: 'sample-summary-1',
            originalText:
                'Q3 Marketing Strategy focuses on digital channels. Key initiatives include social media campaigns, influencer partnerships, and content marketing. We expect a 15% increase in lead generation through these digital efforts. The budget allocation prioritizes social media advertising and content creation tools.',
            summaryText:
                'Q3 Marketing Strategy focuses on digital channels. Key initiatives include social media campaigns, influencer partnerships, and content marketing. We expect a 15% increase in lead generation through these digital efforts. Executed outcome by AI Slack Summarizer.',
            bulletPoints: JSON.stringify([
                '• Q3 Marketing Strategy focuses on digital channels.',
                '• Key initiatives include social media campaigns, influencer partnerships, and content marketing.',
                '• We expect a 15% increase in lead generation through these digital efforts.',
                '• The budget allocation prioritizes social media advertising and content creation tools.'
            ]),
            wordCount: 45,
            readingTime: 1,
            title: 'Q3 Marketing Strategy',
            userId: admin.id
        }
    });

    console.log('✅ Created sample summary:', sampleSummary.id);
}

main()
    .catch(e => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
