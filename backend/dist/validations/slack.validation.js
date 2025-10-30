import Joi from 'joi';
const sendMessage = {
    body: Joi.object().keys({
        channelId: Joi.string()
            .required()
            .pattern(/^C[A-Z0-9]+$/)
            .messages({
            'string.pattern.base': 'Channel ID must be a valid Slack channel ID format'
        }),
        message: Joi.string().required().min(1).max(4000).messages({
            'string.min': 'Message cannot be empty',
            'string.max': 'Message cannot exceed 4000 characters'
        }),
        summaryId: Joi.string().required().uuid().messages({
            'string.uuid': 'Summary ID must be a valid UUID'
        })
    })
};
const getChannels = {
// No query parameters needed for getting channels
};
const getWorkspaces = {
// No query parameters needed for getting workspaces
};
export default {
    sendMessage,
    getChannels,
    getWorkspaces
};
