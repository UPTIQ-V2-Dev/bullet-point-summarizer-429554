import { slackService } from '../services/index.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import httpStatus from 'http-status';

const sendMessage = catchAsyncWithAuth(async (req, res) => {
    const { channelId, message, summaryId } = req.body;
    const result = await slackService.sendMessage(channelId, message, summaryId);
    res.status(httpStatus.OK).send(result);
});

const getChannels = catchAsyncWithAuth(async (req, res) => {
    const channels = await slackService.getChannels();
    res.status(httpStatus.OK).send(channels);
});

const getWorkspaces = catchAsyncWithAuth(async (req, res) => {
    const workspaces = await slackService.getWorkspaces();
    res.status(httpStatus.OK).send(workspaces);
});

export default {
    sendMessage,
    getChannels,
    getWorkspaces
};
