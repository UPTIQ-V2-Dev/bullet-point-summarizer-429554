import { slackController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { slackValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// Authenticated routes - all Slack operations require authentication
router.route('/send-message').post(auth(), validate(slackValidation.sendMessage), slackController.sendMessage);
router.route('/channels').get(auth(), validate(slackValidation.getChannels), slackController.getChannels);
router.route('/workspaces').get(auth(), validate(slackValidation.getWorkspaces), slackController.getWorkspaces);
export default router;
/**
 * @swagger
 * tags:
 *   name: Slack
 *   description: Slack integration for sending summary messages
 */
/**
 * @swagger
 * /slack/send-message:
 *   post:
 *     summary: Send summary message to Slack channel
 *     description: Send a formatted summary message to a specified Slack channel and store the message record in the database.
 *     tags: [Slack]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channelId
 *               - message
 *               - summaryId
 *             properties:
 *               channelId:
 *                 type: string
 *                 pattern: '^C[A-Z0-9]+$'
 *                 description: Slack channel ID (starts with 'C')
 *                 example: "C1234567890"
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 4000
 *                 description: Message content to send
 *                 example: "Summary: Q3 Marketing Strategy focuses on digital channels..."
 *               summaryId:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the summary to link this message to
 *                 example: "summary_123"
 *             example:
 *               channelId: "C1234567890"
 *               message: "Summary: Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation."
 *               summaryId: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       "200":
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messageId:
 *                   type: string
 *                   description: Slack message ID
 *                   example: "1234567890.123456"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   description: Message timestamp
 *                   example: "2025-10-30T10:00:00Z"
 *       "400":
 *         description: Bad Request - Invalid channel ID, message, or summaryId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid channel or message"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - Slack integration not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Slack integration not configured"
 *       "500":
 *         description: Internal Server Error - Slack API error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Slack API error"
 */
/**
 * @swagger
 * /slack/channels:
 *   get:
 *     summary: Get list of available Slack channels
 *     description: Retrieve a list of all Slack channels that the authenticated user has access to.
 *     tags: [Slack]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of available channels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Channel ID
 *                     example: "C1234567890"
 *                   name:
 *                     type: string
 *                     description: Channel name
 *                     example: "general"
 *                   isPrivate:
 *                     type: boolean
 *                     description: Whether the channel is private
 *                     example: false
 *                   memberCount:
 *                     type: integer
 *                     description: Number of members in the channel
 *                     example: 25
 *               example:
 *                 - id: "C1234567890"
 *                   name: "general"
 *                   isPrivate: false
 *                   memberCount: 25
 *                 - id: "C0987654321"
 *                   name: "marketing"
 *                   isPrivate: false
 *                   memberCount: 10
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - Slack integration not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Slack integration not configured"
 *       "500":
 *         description: Internal Server Error - Slack API error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Slack API error"
 */
/**
 * @swagger
 * /slack/workspaces:
 *   get:
 *     summary: Get list of connected Slack workspaces
 *     description: Retrieve a list of all Slack workspaces that are connected to the application.
 *     tags: [Slack]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: List of connected workspaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Workspace ID
 *                     example: "T1234567890"
 *                   name:
 *                     type: string
 *                     description: Workspace name
 *                     example: "My Company"
 *                   domain:
 *                     type: string
 *                     description: Workspace domain
 *                     example: "mycompany.slack.com"
 *               example:
 *                 - id: "T1234567890"
 *                   name: "My Company"
 *                   domain: "mycompany.slack.com"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - Slack integration not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Slack integration not configured"
 *       "500":
 *         description: Internal Server Error - Slack API error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Slack API error"
 */
