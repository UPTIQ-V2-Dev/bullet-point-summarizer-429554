import { slackService } from "../services/index.js";
import { z } from 'zod';
const channelSchema = z.object({
    id: z.string(),
    name: z.string(),
    isPrivate: z.boolean(),
    memberCount: z.number()
});
const workspaceSchema = z.object({
    id: z.string(),
    name: z.string(),
    domain: z.string()
});
const sendMessageTool = {
    id: 'slack_send_message',
    name: 'Send Slack Message',
    description: 'Send a summary message to a specified Slack channel',
    inputSchema: z.object({
        channelId: z.string().regex(/^C[A-Z0-9]+$/, 'Channel ID must be a valid Slack channel ID format'),
        message: z.string().min(1, 'Message cannot be empty').max(4000, 'Message cannot exceed 4000 characters'),
        summaryId: z.string().uuid('Summary ID must be a valid UUID')
    }),
    outputSchema: z.object({
        success: z.boolean(),
        messageId: z.string(),
        timestamp: z.string()
    }),
    fn: async (inputs) => {
        const result = await slackService.sendMessage(inputs.channelId, inputs.message, inputs.summaryId);
        return result;
    }
};
const getChannelsTool = {
    id: 'slack_get_channels',
    name: 'Get Slack Channels',
    description: 'Get list of available Slack channels',
    inputSchema: z.object({}),
    outputSchema: z.array(channelSchema),
    fn: async () => {
        const channels = await slackService.getChannels();
        return channels;
    }
};
const getWorkspacesTool = {
    id: 'slack_get_workspaces',
    name: 'Get Slack Workspaces',
    description: 'Get list of connected Slack workspaces',
    inputSchema: z.object({}),
    outputSchema: z.array(workspaceSchema),
    fn: async () => {
        const workspaces = await slackService.getWorkspaces();
        return workspaces;
    }
};
const getMessagesBySummaryTool = {
    id: 'slack_get_messages_by_summary',
    name: 'Get Slack Messages by Summary',
    description: 'Get all Slack messages sent for a specific summary',
    inputSchema: z.object({
        summaryId: z.string().uuid('Summary ID must be a valid UUID')
    }),
    outputSchema: z.array(z.object({
        id: z.string(),
        content: z.string(),
        channelId: z.string(),
        channelName: z.string(),
        sentAt: z.string(),
        summaryId: z.string(),
        createdAt: z.string()
    })),
    fn: async (inputs) => {
        const messages = await slackService.getMessagesBySummaryId(inputs.summaryId);
        return messages.map(msg => ({
            ...msg,
            sentAt: msg.sentAt.toISOString(),
            createdAt: msg.createdAt.toISOString()
        }));
    }
};
export const slackTools = [sendMessageTool, getChannelsTool, getWorkspacesTool, getMessagesBySummaryTool];
