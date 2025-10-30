export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    SUMMARIES: 'ai_summarizer_summaries',
    SETTINGS: 'ai_summarizer_settings',
    SLACK_TOKEN: 'ai_summarizer_slack_token',
    THEME: 'ai_summarizer_theme'
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Text processing constants
export const MAX_TEXT_LENGTH = 50000;
export const MIN_TEXT_LENGTH = 50;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Summary constants
export const DEFAULT_MAX_BULLET_POINTS = 7;
export const MIN_BULLET_POINTS = 3;
export const MAX_BULLET_POINTS = 10;

// Supported file types
export const SUPPORTED_FILE_TYPES = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const SUPPORTED_FILE_EXTENSIONS = ['.txt', '.pdf', '.docx'];

// App metadata
export const APP_NAME = 'AI Slack Summarizer';
export const APP_DESCRIPTION = 'Paste text, generate summary, and share instantly on Slack.';
