import prisma from '../client.ts';
import { Summary } from '../generated/prisma/index.js';
import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';

/**
 * Helper function to convert database summary to API format
 */
const formatSummaryForAPI = (summary: Summary): Summary & { bulletPoints: string[] } => {
    const bulletPoints =
        typeof summary.bulletPoints === 'string' ? JSON.parse(summary.bulletPoints) : summary.bulletPoints;

    return {
        ...summary,
        bulletPoints
    };
};

/**
 * Generate AI summary and bullet points from text
 * @param {string} originalText - The original text to summarize
 * @param {number} userId - The user ID creating the summary
 * @param {Object} options - Summarization options
 * @param {number} [options.maxBulletPoints] - Maximum number of bullet points to generate
 * @param {string} [options.tone] - Tone of the summary
 * @param {boolean} [options.includeEmojis] - Whether to include emojis
 * @returns {Promise<Object>} Summary data with bullet points, word count, and reading time
 */
const createSummary = async (
    originalText: string,
    userId: number,
    options: {
        maxBulletPoints?: number;
        tone?: string;
        includeEmojis?: boolean;
    } = {}
): Promise<{
    summary: string;
    bulletPoints: string[];
    wordCount: number;
    readingTime: number;
}> => {
    const { maxBulletPoints = 5, tone = 'professional', includeEmojis = false } = options;

    // Calculate word count and reading time (average 200 words per minute)
    const wordCount = originalText.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Generate AI summary and bullet points
    const { summaryText, bulletPoints } = generateAISummary(originalText, {
        maxBulletPoints,
        tone,
        includeEmojis
    });

    // Store in database
    await prisma.summary.create({
        data: {
            originalText,
            summaryText,
            bulletPoints: JSON.stringify(bulletPoints),
            wordCount,
            readingTime,
            userId
        }
    });

    return {
        summary: summaryText,
        bulletPoints,
        wordCount,
        readingTime
    };
};

/**
 * Get summaries for a user with pagination
 * @param {number} userId - The user ID
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getSummariesByUser = async (
    userId: number,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
    } = {}
): Promise<{
    results: Summary[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    // Parse sortBy option (format: "field:asc" or "field:desc")
    let orderBy = { createdAt: 'desc' as const };
    if (options.sortBy) {
        const [field, direction] = options.sortBy.split(':');
        if (field && (direction === 'asc' || direction === 'desc')) {
            orderBy = { [field]: direction } as any;
        }
    }

    const [summaries, totalResults] = await Promise.all([
        prisma.summary.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy
        }),
        prisma.summary.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    return {
        results: summaries.map(formatSummaryForAPI),
        page,
        limit,
        totalPages,
        totalResults
    };
};

/**
 * Get summary by ID
 * @param {string} id - Summary ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Summary | null>}
 */
const getSummaryById = async (id: string, userId: number): Promise<Summary | null> => {
    const summary = await prisma.summary.findUnique({
        where: { id }
    });

    if (!summary) {
        return null;
    }

    // Check if user owns this summary
    if (summary.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
    }

    return formatSummaryForAPI(summary);
};

/**
 * Delete summary by ID
 * @param {string} id - Summary ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Summary>}
 */
const deleteSummaryById = async (id: string, userId: number): Promise<Summary> => {
    const summary = await getSummaryById(id, userId);
    if (!summary) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Summary not found');
    }

    await prisma.summary.delete({ where: { id } });
    return formatSummaryForAPI(summary);
};

/**
 * AI text summarization function (simulated)
 * This would integrate with actual AI service in production
 */
const generateAISummary = (
    text: string,
    options: {
        maxBulletPoints: number;
        tone: string;
        includeEmojis: boolean;
    }
): {
    summaryText: string;
    bulletPoints: string[];
} => {
    const { maxBulletPoints, tone, includeEmojis } = options;

    // Split text into sentences for processing
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Generate summary (take first 2-3 key sentences and enhance them)
    const keySentences = sentences
        .slice(0, Math.min(3, sentences.length))
        .map(s => s.trim())
        .filter(s => s.length > 10);

    let summaryText = keySentences.join('. ');
    if (summaryText && !summaryText.endsWith('.')) {
        summaryText += '.';
    }

    // Add tone-specific enhancement
    if (tone === 'casual') {
        summaryText += ' This content has been processed for easy understanding.';
    } else if (tone === 'formal') {
        summaryText += ' This summary has been generated through advanced text analysis.';
    } else {
        summaryText += ' Executed outcome by AI Slack Summarizer.';
    }

    // Generate bullet points from sentences
    let bulletPoints: string[] = [];
    const maxPoints = Math.min(maxBulletPoints, sentences.length);

    for (let i = 0; i < maxPoints && i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        if (sentence.length > 10) {
            let bullet = includeEmojis ? `🔸 ${sentence}` : `• ${sentence}`;
            if (!bullet.endsWith('.')) {
                bullet += '.';
            }
            bulletPoints.push(bullet);
        }
    }

    // Ensure we have at least one bullet point
    if (bulletPoints.length === 0) {
        const fallback = includeEmojis
            ? '🔸 Key information extracted from text.'
            : '• Key information extracted from text.';
        bulletPoints = [fallback];
    }

    return {
        summaryText,
        bulletPoints
    };
};

export default {
    createSummary,
    getSummariesByUser,
    getSummaryById,
    deleteSummaryById
};
