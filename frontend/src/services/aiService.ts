import { api } from '@/lib/api';
import { GenerateSummaryRequest, GenerateSummaryResponse } from '@/types/summary';
import { mockSummaryResponse } from '@/data/summaryMockData';

export const generateSummary = async (request: GenerateSummaryRequest): Promise<GenerateSummaryResponse> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return mockSummaryResponse;
    }

    const response = await api.post<GenerateSummaryResponse>('/summarize', request);
    return response.data;
};
