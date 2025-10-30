export interface Summary {
    id: string;
    originalText: string;
    summaryText: string;
    bulletPoints: string[];
    createdAt: string;
    wordCount: number;
    readingTime: number;
    title?: string;
}

export interface TextInput {
    content: string;
    wordCount: number;
    characterCount: number;
    source: 'paste' | 'file';
    fileName?: string;
}

export interface SlackMessage {
    id: string;
    content: string;
    channelId: string;
    channelName: string;
    sentAt: string;
    summaryId: string;
}

export interface SlackChannel {
    id: string;
    name: string;
    isPrivate: boolean;
    memberCount?: number;
}

export interface SlackWorkspace {
    id: string;
    name: string;
    domain: string;
}

export interface GenerateSummaryRequest {
    text: string;
    maxBulletPoints?: number;
    tone?: 'professional' | 'casual' | 'technical';
    includeEmojis?: boolean;
}

export interface GenerateSummaryResponse {
    summary: string;
    bulletPoints: string[];
    wordCount: number;
    readingTime: number;
}

export interface SendSlackMessageRequest {
    channelId: string;
    message: string;
    summaryId: string;
}

export interface SendSlackMessageResponse {
    success: boolean;
    messageId: string;
    timestamp: string;
}
