/**
 * Tile IDs for Washington ESSB 5814 service categories
 */
export type WaTileId = 'it' | 'marketing' | 'webdev' | 'software' | 'engineering' | 'staffing' | 'security' | 'presentations' | 'professional-services' | 'data-processing' | 'contracts';
/**
 * A single guidance document reference
 */
export type GuidanceEntry = {
    /** Path or URL to the guidance document */
    href: string;
    /** Short description of the document */
    label: string;
};
/**
 * A chat message in the conversation
 */
export type ChatMessage = {
    role: 'assistant' | 'user';
    content: string;
};
/**
 * Options for the chat service
 */
export interface ChatServiceOptions {
    /** OpenAI API key - if not provided, uses OPENAI_API_KEY env var */
    apiKey?: string;
    /** Maximum context length in characters (default: 18000) */
    maxContextChars?: number;
    /** Directory path where guidance files are stored (for local filesystem access) */
    guidanceDir?: string;
}
/**
 * Response from the chat service
 */
export interface ChatResponse {
    answer: string;
    suggestedQuestions: string[];
}
/**
 * Request payload for chat
 */
export interface ChatRequest {
    tileId: WaTileId;
    messages: ChatMessage[];
}
//# sourceMappingURL=types.d.ts.map