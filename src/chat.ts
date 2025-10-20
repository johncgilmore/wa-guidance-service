import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';

import { type WaTileId, type ChatMessage, type ChatResponse, type ChatServiceOptions } from './types';
import { GUIDANCE_BY_TILE, GUIDANCE_SHARED, isWaTileId } from './guidanceMap';
import { buildSystemPrompt } from './prompts';

const MAX_CONTEXT_CHARS = 18000;

/**
 * Chat service for Washington guidance questions
 * Handles context loading, OpenAI integration, and response formatting
 */
export class WaGuidanceChatService {
  private openaiClient: OpenAI;
  private maxContextChars: number;
  private guidanceDir?: string;

  constructor(options: ChatServiceOptions = {}) {
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is required. Provide it via options or OPENAI_API_KEY env var.');
    }

    this.openaiClient = new OpenAI({ apiKey });
    this.maxContextChars = options.maxContextChars ?? MAX_CONTEXT_CHARS;
    this.guidanceDir = options.guidanceDir;
  }

  /**
   * Load guidance text from a file
   */
  private async loadGuidanceFile(href: string, label: string): Promise<string> {
    if (!this.guidanceDir) {
      throw new Error('Cannot load guidance files: guidanceDir not configured');
    }

    // Remove leading slash and resolve path
    const relativePath = href.replace(/^\//, '');
    const absolutePath = path.join(this.guidanceDir, relativePath);
    const text = await fs.readFile(absolutePath, 'utf8');
    return `Source: ${label}\n\n${text.trim()}`;
  }

  /**
   * Build the context block by loading all relevant guidance documents
   */
  private async buildContextBlock(tileId: WaTileId): Promise<string> {
    // If guidanceDir is not set, return empty context
    // (useful for testing or when docs are embedded elsewhere)
    if (!this.guidanceDir) {
      return '[Guidance documents would be loaded here]';
    }

    const entries = [...(GUIDANCE_BY_TILE[tileId] ?? []), ...GUIDANCE_SHARED];
    const sections = await Promise.all(
      entries.map((entry) => this.loadGuidanceFile(entry.href, entry.label))
    );
    const joined = sections.join('\n\n---\n\n');
    return joined.length > this.maxContextChars ? joined.slice(0, this.maxContextChars) : joined;
  }

  /**
   * Validate and sanitize chat messages
   */
  private validateMessages(messages: unknown): ChatMessage[] {
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    const validated: ChatMessage[] = [];
    for (const entry of messages) {
      if (
        !entry ||
        typeof entry !== 'object' ||
        (entry as { role?: unknown }).role === undefined ||
        (entry as { content?: unknown }).content === undefined
      ) {
        throw new Error('Invalid message format');
      }

      const { role, content } = entry as { role: unknown; content: unknown };
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
  async chat(tileId: unknown, messages: unknown): Promise<ChatResponse> {
    // Validate tile ID
    if (!isWaTileId(tileId)) {
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
    const systemPrompt = buildSystemPrompt(contextBlock);

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
          role: message.role as 'user' | 'assistant',
          content: message.content,
        })),
      ],
    });

    // Extract and parse the response
    const rawContent = response.choices[0]?.message?.content?.trim();
    if (!rawContent) {
      throw new Error('No response received from OpenAI');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError, rawContent);
      throw new Error('OpenAI returned invalid JSON response');
    }

    // Extract answer and suggested questions
    const answer = typeof (parsed as { answer?: unknown }).answer === 'string'
      ? ((parsed as { answer: string }).answer).trim()
      : null;

    if (!answer) {
      throw new Error('OpenAI response did not contain an answer');
    }

    const suggestedQuestionsRaw = (parsed as { suggestedQuestions?: unknown }).suggestedQuestions;
    const suggestedQuestions = Array.isArray(suggestedQuestionsRaw)
      ? suggestedQuestionsRaw
          .filter((entry): entry is string => typeof entry === 'string')
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
