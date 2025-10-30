import { summaryController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { summaryValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// Main summarization endpoint according to API spec
router.route('/').post(auth(), validate(summaryValidation.createSummary), summaryController.createSummary);
// Additional CRUD endpoints for managing summaries
router.route('/list').get(auth(), validate(summaryValidation.getSummaries), summaryController.getSummaries);
router
    .route('/:summaryId')
    .get(auth(), validate(summaryValidation.getSummary), summaryController.getSummary)
    .delete(auth(), validate(summaryValidation.deleteSummary), summaryController.deleteSummary);
export default router;
/**
 * @swagger
 * tags:
 *   name: AI Summarization
 *   description: AI text summarization and bullet point generation
 */
/**
 * @swagger
 * /summarize:
 *   post:
 *     summary: Generate AI summary and bullet points from text
 *     description: Generate AI summary and bullet points from text with optional parameters for customization.
 *     tags: [AI Summarization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 50000
 *                 description: The text to summarize (10-50000 characters)
 *               maxBulletPoints:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 default: 5
 *                 description: Maximum number of bullet points to generate
 *               tone:
 *                 type: string
 *                 enum: [professional, casual, formal]
 *                 default: professional
 *                 description: Tone of the summary
 *               includeEmojis:
 *                 type: boolean
 *                 default: false
 *                 description: Whether to include emojis in bullet points
 *             example:
 *               text: "Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation."
 *               maxBulletPoints: 5
 *               tone: "professional"
 *               includeEmojis: false
 *     responses:
 *       "200":
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                   description: AI-generated summary text
 *                 bulletPoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of bullet points
 *                 wordCount:
 *                   type: integer
 *                   description: Word count of original text
 *                 readingTime:
 *                   type: integer
 *                   description: Estimated reading time in minutes
 *               example:
 *                 summary: "Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation. Executed outcome by AI Slack Summarizer."
 *                 bulletPoints:
 *                   - "• Q3 Marketing Strategy focuses on digital channels."
 *                   - "• Key initiatives: social media campaign, partnerships."
 *                   - "• Expected outcome: 15% increase in lead generation."
 *                   - "• Executed outcome by AI Slack Summarizer."
 *                 wordCount: 24
 *                 readingTime: 1
 *       "400":
 *         description: Bad request - Text content is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Text content is required"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Invalid input parameters"
 *       "500":
 *         description: AI service error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "AI service error"
 */
/**
 * @swagger
 * /summarize/list:
 *   get:
 *     summary: Get user's summaries
 *     description: Get paginated list of summaries created by the authenticated user.
 *     tags: [AI Summarization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         default: 10
 *         description: Maximum number of summaries
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       originalText:
 *                         type: string
 *                       summaryText:
 *                         type: string
 *                       bulletPoints:
 *                         type: array
 *                         items:
 *                           type: string
 *                       wordCount:
 *                         type: integer
 *                       readingTime:
 *                         type: integer
 *                       title:
 *                         type: string
 *                         nullable: true
 *                       userId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /summarize/{summaryId}:
 *   get:
 *     summary: Get summary by ID
 *     description: Get a specific summary by its ID. Users can only access their own summaries.
 *     tags: [AI Summarization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Summary ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 originalText:
 *                   type: string
 *                 summaryText:
 *                   type: string
 *                 bulletPoints:
 *                   type: array
 *                   items:
 *                     type: string
 *                 wordCount:
 *                   type: integer
 *                 readingTime:
 *                   type: integer
 *                 title:
 *                   type: string
 *                   nullable: true
 *                 userId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - Access denied
 *       "404":
 *         description: Summary not found
 *   delete:
 *     summary: Delete summary by ID
 *     description: Delete a specific summary by its ID. Users can only delete their own summaries.
 *     tags: [AI Summarization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: summaryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Summary ID
 *     responses:
 *       "204":
 *         description: No content - Summary deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - Access denied
 *       "404":
 *         description: Summary not found
 */
