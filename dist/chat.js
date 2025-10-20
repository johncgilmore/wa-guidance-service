"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaGuidanceChatService = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const guidanceMap_1 = require("./guidanceMap");
const prompts_1 = require("./prompts");
const MAX_CONTEXT_CHARS = 18000;
/**
 * Chat service for Washington guidance questions
 * Handles context loading, OpenAI integration, and response formatting
 */
class WaGuidanceChatService {
    constructor(options = {}) {
        const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key is required. Provide it via options or OPENAI_API_KEY env var.');
        }
        this.openaiClient = new openai_1.default({ apiKey });
        this.maxContextChars = options.maxContextChars ?? MAX_CONTEXT_CHARS;
        this.guidanceDir = options.guidanceDir;
    }
    /**
     * Load guidance text from a file
     */
    async loadGuidanceFile(href, label) {
        if (!this.guidanceDir) {
            throw new Error('Cannot load guidance files: guidanceDir not configured');
        }
        // Remove leading slash and resolve path
        const relativePath = href.replace(/^\//, '');
        const absolutePath = path_1.default.join(this.guidanceDir, relativePath);
        const text = await fs_1.promises.readFile(absolutePath, 'utf8');
        return `Source: ${label}\n\n${text.trim()}`;
    }
    /**
     * Build the context block by loading all relevant guidance documents
     */
    async buildContextBlock(tileId) {
        // If guidanceDir is not set, return empty context
        // (useful for testing or when docs are embedded elsewhere)
        if (!this.guidanceDir) {
            return '[Guidance documents would be loaded here]';
        }
        const entries = [...(guidanceMap_1.GUIDANCE_BY_TILE[tileId] ?? []), ...guidanceMap_1.GUIDANCE_SHARED];
        const sections = await Promise.all(entries.map((entry) => this.loadGuidanceFile(entry.href, entry.label)));
        const joined = sections.join('\n\n---\n\n');
        return joined.length > this.maxContextChars ? joined.slice(0, this.maxContextChars) : joined;
    }
    /**
     * Validate and sanitize chat messages
     */
    validateMessages(messages) {
        if (!Array.isArray(messages)) {
            throw new Error('Messages must be an array');
        }
        const validated = [];
        for (const entry of messages) {
            if (!entry ||
                typeof entry !== 'object' ||
                entry.role === undefined ||
                entry.content === undefined) {
                throw new Error('Invalid message format');
            }
            const { role, content } = entry;
            if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
                throw new Error('Invalid message: role must be "user" or "assistant", content must be string');
            }
            validated.push({ role, content });
        }
        return validated;
    }
    /**
     * Send a chat request and get a response
     */
    async chat(tileId, messages) {
        // Validate tile ID
        if (!(0, guidanceMap_1.isWaTileId)(tileId)) {
            throw new Error(`Invalid or missing tile id: ${String(tileId)}`);
        }
        // Validate and sanitize messages
        const validatedMessages = this.validateMessages(messages);
        if (validatedMessages.length === 0) {
            throw new Error('At least one message is required');
        }
        // Build context from guidance documents
        const contextBlock = await this.buildContextBlock(tileId);
        // Get the system prompt
        const systemPrompt = (0, prompts_1.buildSystemPrompt)(contextBlock);
        // Prepare recent messages (keep only last 8 for context window)
        const recentMessages = validatedMessages.slice(-8).map((message) => ({
            role: message.role,
            content: message.content.trim(),
        }));
        // Call OpenAI API
        const response = await this.openaiClient.chat.completions.create({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                ...recentMessages.map((message) => ({
                    role: message.role,
                    content: message.content,
                })),
            ],
        });
        // Extract and parse the response
        const rawContent = response.choices[0]?.message?.content?.trim();
        if (!rawContent) {
            throw new Error('No response received from OpenAI');
        }
        let parsed;
        try {
            parsed = JSON.parse(rawContent);
        }
        catch (parseError) {
            console.error('Failed to parse OpenAI response as JSON:', parseError, rawContent);
            throw new Error('OpenAI returned invalid JSON response');
        }
        // Extract answer and suggested questions
        const answer = typeof parsed.answer === 'string'
            ? (parsed.answer).trim()
            : null;
        if (!answer) {
            throw new Error('OpenAI response did not contain an answer');
        }
        const suggestedQuestionsRaw = parsed.suggestedQuestions;
        const suggestedQuestions = Array.isArray(suggestedQuestionsRaw)
            ? suggestedQuestionsRaw
                .filter((entry) => typeof entry === 'string')
                .map((entry) => entry.trim())
                .filter(Boolean)
                .slice(0, 2)
            : [];
        return {
            answer,
            suggestedQuestions,
        };
    }
}
exports.WaGuidanceChatService = WaGuidanceChatService;
//# sourceMappingURL=chat.js.map