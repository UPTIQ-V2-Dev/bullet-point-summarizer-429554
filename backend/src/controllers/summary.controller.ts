import { summaryService } from '../services/index.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createSummary = catchAsyncWithAuth(async (req, res) => {
    const { text, maxBulletPoints, tone, includeEmojis } = req.body;
    const userId = req.user.id;

    const result = await summaryService.createSummary(text, userId, {
        maxBulletPoints,
        tone,
        includeEmojis
    });

    res.status(httpStatus.OK).send(result);
});

const getSummaries = catchAsyncWithAuth(async (req, res) => {
    const options = pick(req.validatedQuery, ['sortBy', 'limit', 'page']);
    const userId = req.user.id;

    const result = await summaryService.getSummariesByUser(userId, options);
    res.send(result);
});

const getSummary = catchAsyncWithAuth(async (req, res) => {
    const summaryId = req.params.summaryId;
    const userId = req.user.id;

    const summary = await summaryService.getSummaryById(summaryId, userId);
    if (!summary) {
        return res.status(httpStatus.NOT_FOUND).send({ message: 'Summary not found' });
    }

    res.send(summary);
});

const deleteSummary = catchAsyncWithAuth(async (req, res) => {
    const summaryId = req.params.summaryId;
    const userId = req.user.id;

    await summaryService.deleteSummaryById(summaryId, userId);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createSummary,
    getSummaries,
    getSummary,
    deleteSummary
};
