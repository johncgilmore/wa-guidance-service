"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWaTileId = exports.GUIDANCE_SHARED = exports.GUIDANCE_BY_TILE = exports.WA_CHAT_DISCLAIMER = exports.buildSystemPrompt = exports.WaGuidanceChatService = void 0;
var chat_1 = require("./chat");
Object.defineProperty(exports, "WaGuidanceChatService", { enumerable: true, get: function () { return chat_1.WaGuidanceChatService; } });
var prompts_1 = require("./prompts");
Object.defineProperty(exports, "buildSystemPrompt", { enumerable: true, get: function () { return prompts_1.buildSystemPrompt; } });
Object.defineProperty(exports, "WA_CHAT_DISCLAIMER", { enumerable: true, get: function () { return prompts_1.WA_CHAT_DISCLAIMER; } });
var guidanceMap_1 = require("./guidanceMap");
Object.defineProperty(exports, "GUIDANCE_BY_TILE", { enumerable: true, get: function () { return guidanceMap_1.GUIDANCE_BY_TILE; } });
Object.defineProperty(exports, "GUIDANCE_SHARED", { enumerable: true, get: function () { return guidanceMap_1.GUIDANCE_SHARED; } });
Object.defineProperty(exports, "isWaTileId", { enumerable: true, get: function () { return guidanceMap_1.isWaTileId; } });
//# sourceMappingURL=index.js.map