/**
 * Washington ESSB 5814 Guidance Service
 *
 * A modular service for providing AI-powered assistance with Washington tax guidance.
 * Can be used as a library in other projects or called via HTTP endpoints.
 *
 * @example
 * // Usage in Node.js
 * import { WaGuidanceChatService } from '@cstreettax/wa-guidance-service';
 *
 * const service = new WaGuidanceChatService({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   guidanceDir: path.join(process.cwd(), 'public'),
 * });
 *
 * const response = await service.chat('software', [
 *   { role: 'user', content: 'What is ESSB 5814?' }
 * ]);
 *
 * console.log(response.answer);
 */

export { WaGuidanceChatService } from './chat';
export { buildSystemPrompt, WA_CHAT_DISCLAIMER } from './prompts';
export { GUIDANCE_BY_TILE, GUIDANCE_SHARED, isWaTileId } from './guidanceMap';
export { loadGuidanceForTile, getGuidanceMetadata } from './guidanceLoader';
export type { WaTileId, GuidanceEntry, ChatMessage, ChatServiceOptions, ChatResponse, ChatRequest } from './types';
