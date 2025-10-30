import { GenerateSummaryResponse } from '@/types/summary';

export const mockSummaryResponse: GenerateSummaryResponse = {
    summary:
        'Q3 Marketing Strategy focuses on digital channels. Key initiatives: social media campaign, partnerships. Expected outcome: 15% increase in lead generation. Executed outcome by AI Slack Summarizer.',
    bulletPoints: [
        '• Q3 Marketing Strategy focuses on digital channels.',
        '• Key initiatives: social media campaign, partnerships.',
        '• Expected outcome: 15% increase in lead generation.',
        '• Executed outcome by AI Slack Summarizer.'
    ],
    wordCount: 24,
    readingTime: 1
};

export const mockSampleTexts = [
    {
        title: 'Marketing Strategy',
        content:
            'Q3 Marketing Strategy, Project Alpha Alpha Start-up Notes Latest Industry Report, AI will analyze and condense the key information.'
    },
    {
        title: 'Project Status Update',
        content:
            'Project Status Update: Development phase 85% complete. Backend API integration finished. Frontend UI components in progress. Testing scheduled for next week. Deployment target: end of month.'
    },
    {
        title: 'Meeting Notes',
        content:
            'Team Meeting Notes: Discussed quarterly goals, budget allocation, and resource planning. Action items: hire 2 developers, implement new CRM system, review marketing spend effectiveness.'
    }
];
