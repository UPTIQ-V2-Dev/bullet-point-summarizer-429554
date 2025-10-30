import { api } from '@/lib/api';
import { GenerateSummaryRequest, GenerateSummaryResponse } from '@/types/summary';
import { mockSummaryResponse } from '@/data/summaryMockData';
import { emitter } from '@/agentSdk';

export const generateSummary = async (request: GenerateSummaryRequest): Promise<GenerateSummaryResponse> => {
    // Use agent sync event for summary generation
    const agentResponse = await emitter.emit({
        agentId: '90d76718-973e-4519-bfde-f182d01d45a0',
        event: 'Paste Source Text textarea',
        payload: {
            text: request.text,
            maxBulletPoints: request.maxBulletPoints || 7,
            tone: request.tone || 'professional',
            includeEmojis: request.includeEmojis || false
        }
    });

    if (agentResponse && agentResponse.summary) {
        // Transform agent response to match expected format
        const summary = agentResponse.summary;
        const bulletPoints = summary
            .split('\n')
            .filter((line: string) => line.trim().startsWith('•') || line.trim().startsWith('-'))
            .map((line: string) => line.trim().replace(/^[•-]\s*/, ''));

        return {
            summary: summary,
            bulletPoints: bulletPoints.length > 0 ? bulletPoints : [summary],
            wordCount: summary.split(' ').length,
            readingTime: Math.ceil(summary.split(' ').length / 200) // Assuming 200 words per minute
        };
    }

    // Fallback to mock data if agent call fails
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return mockSummaryResponse;
    }

    // Fallback to API call if both agent and mock data are unavailable
    const response = await api.post<GenerateSummaryResponse>('/summarize', request);
    return response.data;
};
