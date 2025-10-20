import { type ChatResponse, type ChatServiceOptions } from './types';
/**
 * Chat service for Washington guidance questions
 * Handles context loading, OpenAI integration, and response formatting
 */
export declare class WaGuidanceChatService {
    private openaiClient;
    private maxContextChars;
    private guidanceDir?;
    constructor(options?: ChatServiceOptions);
    /**
     * Load guidance text from a file
     */
    private loadGuidanceFile;
    /**
     * Build the context block by loading all relevant guidance documents
     */
    private buildContextBlock;
    /**
     * Validate and sanitize chat messages
     */
    private validateMessages;
    /**
     * Send a chat request and get a response
     */
    chat(tileId: unknown, messages: unknown): Promise<ChatResponse>;
}
//# sourceMappingURL=chat.d.ts.map