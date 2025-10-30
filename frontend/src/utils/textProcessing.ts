import { MAX_TEXT_LENGTH, MIN_TEXT_LENGTH } from '@/lib/constants';

export const validateText = (text: string): { isValid: boolean; error?: string } => {
    if (!text.trim()) {
        return { isValid: false, error: 'Text cannot be empty' };
    }

    if (text.length < MIN_TEXT_LENGTH) {
        return { isValid: false, error: `Text must be at least ${MIN_TEXT_LENGTH} characters long` };
    }

    if (text.length > MAX_TEXT_LENGTH) {
        return { isValid: false, error: `Text cannot exceed ${MAX_TEXT_LENGTH} characters` };
    }

    return { isValid: true };
};

export const cleanText = (text: string): string => {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

export const getWordCount = (text: string): number => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
};

export const getCharacterCount = (text: string): number => {
    return text.length;
};

export const getReadingTime = (wordCount: number): number => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
};
