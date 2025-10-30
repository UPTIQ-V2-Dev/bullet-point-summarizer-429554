import { summaryService } from "../services/index.js";
import pick from "../utils/pick.js";
import { z } from 'zod';
const summarySchema = z.object({
    id: z.string(),
    originalText: z.string(),
    summaryText: z.string(),
    bulletPoints: z.array(z.string()),
    wordCount: z.number(),
    readingTime: z.number(),
    title: z.string().nullable(),
    userId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string()
});
const createSummaryTool = {
    id: 'summary_create',
    name: 'Create Summary',
    description: 'Generate AI summary and bullet points from text',
    inputSchema: z.object({
        text: z.string().min(10).max(50000),
        userId: z.number().int(),
        maxBulletPoints: z.number().int().min(1).max(20).optional(),
        tone: z.enum(['professional', 'casual', 'formal']).optional(),
        includeEmojis: z.boolean().optional()
    }),
    outputSchema: z.object({
        summary: z.string(),
        bulletPoints: z.array(z.string()),
        wordCount: z.number(),
        readingTime: z.number()
    }),
    fn: async (inputs) => {
        const options = pick(inputs, ['maxBulletPoints', 'tone', 'includeEmojis']);
        const result = await summaryService.createSummary(inputs.text, inputs.userId, options);
        return result;
    }
};
const getSummariesTool = {
    id: 'summary_get_all',
    name: 'Get All Summaries',
    description: 'Get all summaries for a user with optional filters and pagination',
    inputSchema: z.object({
        userId: z.number().int(),
        sortBy: z.string().optional(),
        limit: z.number().int().min(1).max(100).optional(),
        page: z.number().int().min(1).optional()
    }),
    outputSchema: z.object({
        results: z.array(summarySchema),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
        totalResults: z.number()
    }),
    fn: async (inputs) => {
        const options = pick(inputs, ['sortBy', 'limit', 'page']);
        const result = await summaryService.getSummariesByUser(inputs.userId, options);
        return result;
    }
};
const getSummaryTool = {
    id: 'summary_get_by_id',
    name: 'Get Summary By ID',
    description: 'Get a single summary by its ID',
    inputSchema: z.object({
        summaryId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        result: summarySchema.nullable()
    }),
    fn: async (inputs) => {
        const summary = await summaryService.getSummaryById(inputs.summaryId, inputs.userId);
        return { result: summary };
    }
};
const deleteSummaryTool = {
    id: 'summary_delete',
    name: 'Delete Summary',
    description: 'Delete a summary by its ID',
    inputSchema: z.object({
        summaryId: z.string(),
        userId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    fn: async (inputs) => {
        await summaryService.deleteSummaryById(inputs.summaryId, inputs.userId);
        return { success: true };
    }
};
export const summaryTools = [createSummaryTool, getSummariesTool, getSummaryTool, deleteSummaryTool];
