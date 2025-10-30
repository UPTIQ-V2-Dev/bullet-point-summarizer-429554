import { useMutation } from '@tanstack/react-query';
import { generateSummary } from '@/services/aiService';
import { GenerateSummaryRequest, GenerateSummaryResponse } from '@/types/summary';

export const useSummary = () => {
    return useMutation<GenerateSummaryResponse, Error, GenerateSummaryRequest>({
        mutationFn: generateSummary
    });
};
