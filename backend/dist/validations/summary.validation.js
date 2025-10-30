import Joi from 'joi';
const createSummary = {
    body: Joi.object().keys({
        text: Joi.string().required().min(10).max(50000), // Minimum 10 chars, maximum 50k chars
        maxBulletPoints: Joi.number().integer().min(1).max(20).optional(),
        tone: Joi.string().valid('professional', 'casual', 'formal').optional(),
        includeEmojis: Joi.boolean().optional()
    })
};
const getSummaries = {
    query: Joi.object().keys({
        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1).max(100),
        page: Joi.number().integer().min(1)
    })
};
const getSummary = {
    params: Joi.object().keys({
        summaryId: Joi.string().required()
    })
};
const deleteSummary = {
    params: Joi.object().keys({
        summaryId: Joi.string().required()
    })
};
export default {
    createSummary,
    getSummaries,
    getSummary,
    deleteSummary
};
