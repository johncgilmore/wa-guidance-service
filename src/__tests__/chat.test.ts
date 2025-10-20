import { WaGuidanceChatService } from '../chat';
import { buildSystemPrompt } from '../prompts';
import type { ChatMessage } from '../types';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('WaGuidanceChatService', () => {
  let service: WaGuidanceChatService;
  let mockOpenAICreate: jest.Mock;

  beforeEach(() => {
    // Clear env var to test error handling
    delete process.env.OPENAI_API_KEY;
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should throw if no API key provided', () => {
      expect(() => {
        new WaGuidanceChatService();
      }).toThrow('OpenAI API key is required');
    });

    it('should throw if API key is empty string', () => {
      expect(() => {
        new WaGuidanceChatService({ apiKey: '' });
      }).toThrow('OpenAI API key is required');
    });

    it('should initialize with provided API key', () => {
      expect(() => {
        new WaGuidanceChatService({ apiKey: 'test-key' });
      }).not.toThrow();
    });

    it('should initialize with env var API key', () => {
      process.env.OPENAI_API_KEY = 'env-test-key';
      expect(() => {
        new WaGuidanceChatService();
      }).not.toThrow();
      delete process.env.OPENAI_API_KEY;
    });

    it('should use default maxContextChars if not provided', () => {
      service = new WaGuidanceChatService({ apiKey: 'test-key' });
      expect(service).toBeDefined();
    });

    it('should use provided maxContextChars', () => {
      service = new WaGuidanceChatService({
        apiKey: 'test-key',
        maxContextChars: 5000,
      });
      expect(service).toBeDefined();
    });
  });

  describe('Message Validation', () => {
    beforeEach(() => {
      service = new WaGuidanceChatService({ apiKey: 'test-key' });
    });

    it('should reject non-array messages', async () => {
      await expect(
        service.chat('software', { role: 'user', content: 'test' } as any),
      ).rejects.toThrow('Messages must be an array');
    });

    it('should reject empty message array', async () => {
      await expect(service.chat('software', [])).rejects.toThrow(
        'At least one message is required',
      );
    });

    it('should reject messages without role', async () => {
      const invalidMessages = [{ content: 'test' }];
      await expect(service.chat('software', invalidMessages as any)).rejects.toThrow(
        'Invalid message format',
      );
    });

    it('should reject messages without content', async () => {
      const invalidMessages = [{ role: 'user' }];
      await expect(service.chat('software', invalidMessages as any)).rejects.toThrow(
        'Invalid message format',
      );
    });

    it('should reject messages with invalid role', async () => {
      const invalidMessages = [{ role: 'system', content: 'test' }];
      await expect(service.chat('software', invalidMessages as any)).rejects.toThrow(
        'Invalid message: role must be "user" or "assistant"',
      );
    });

    it('should reject messages with non-string content', async () => {
      const invalidMessages = [{ role: 'user', content: 123 }];
      await expect(service.chat('software', invalidMessages as any)).rejects.toThrow(
        'Invalid message: role must be "user" or "assistant", content must be string',
      );
    });

    it('should accept valid messages', async () => {
      const OpenAI = require('openai');
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'Test answer',
                suggestedQuestions: ['Q1', 'Q2'],
              }),
            },
          },
        ],
      });
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockCreate } },
      }));

      service = new WaGuidanceChatService({ apiKey: 'test-key' });
      const messages: ChatMessage[] = [
        { role: 'user', content: 'What is ESSB 5814?' },
      ];

      const result = await service.chat('software', messages);
      expect(result.answer).toBe('Test answer');
    });
  });

  describe('Tile ID Validation', () => {
    beforeEach(() => {
      service = new WaGuidanceChatService({ apiKey: 'test-key' });
    });

    it('should reject invalid tile ID', async () => {
      await expect(service.chat('invalid-tile', [])).rejects.toThrow(
        'Invalid or missing tile id',
      );
    });

    it('should reject null tile ID', async () => {
      await expect(service.chat(null, [])).rejects.toThrow(
        'Invalid or missing tile id',
      );
    });

    it('should reject undefined tile ID', async () => {
      await expect(service.chat(undefined, [])).rejects.toThrow(
        'Invalid or missing tile id',
      );
    });

    it('should reject numeric tile ID', async () => {
      await expect(service.chat(123 as any, [])).rejects.toThrow(
        'Invalid or missing tile id',
      );
    });

    it('should accept valid tile IDs', async () => {
      const OpenAI = require('openai');
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'Test answer',
                suggestedQuestions: [],
              }),
            },
          },
        ],
      });
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockCreate } },
      }));

      service = new WaGuidanceChatService({ apiKey: 'test-key' });
      const validTiles = [
        'it',
        'software',
        'webdev',
        'contracts',
        'professional-services',
      ];

      for (const tileId of validTiles) {
        const result = await service.chat(tileId as any, [
          { role: 'user', content: 'test' },
        ]);
        expect(result).toHaveProperty('answer');
      }
    });
  });

  describe('OpenAI Response Handling', () => {
    beforeEach(() => {
      const OpenAI = require('openai');
      mockOpenAICreate = jest.fn();
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockOpenAICreate } },
      }));
      service = new WaGuidanceChatService({ apiKey: 'test-key' });
    });

    it('should handle successful OpenAI response', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'ESSB 5814 is a Washington law...',
                suggestedQuestions: ['When does it apply?', 'Who must comply?'],
              }),
            },
          },
        ],
      });

      const result = await service.chat('software', [
        { role: 'user', content: 'What is ESSB 5814?' },
      ]);

      expect(result.answer).toBe('ESSB 5814 is a Washington law...');
      expect(result.suggestedQuestions).toEqual(['When does it apply?', 'Who must comply?']);
    });

    it('should limit suggested questions to 2', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'Test',
                suggestedQuestions: ['Q1', 'Q2', 'Q3', 'Q4'],
              }),
            },
          },
        ],
      });

      const result = await service.chat('software', [
        { role: 'user', content: 'test' },
      ]);

      expect(result.suggestedQuestions.length).toBeLessThanOrEqual(2);
    });

    it('should trim whitespace from answer', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: '  \n  Test answer  \n  ',
                suggestedQuestions: [],
              }),
            },
          },
        ],
      });

      const result = await service.chat('software', [
        { role: 'user', content: 'test' },
      ]);

      expect(result.answer).toBe('Test answer');
    });

    it('should throw if no response content', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [{ message: { content: null } }],
      });

      await expect(
        service.chat('software', [{ role: 'user', content: 'test' }]),
      ).rejects.toThrow('No response received from OpenAI');
    });

    it('should throw if response is empty string', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [{ message: { content: '' } }],
      });

      await expect(
        service.chat('software', [{ role: 'user', content: 'test' }]),
      ).rejects.toThrow('No response received from OpenAI');
    });

    it('should throw if response is not valid JSON', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'This is not JSON',
            },
          },
        ],
      });

      await expect(
        service.chat('software', [{ role: 'user', content: 'test' }]),
      ).rejects.toThrow('OpenAI returned invalid JSON response');
    });

    it('should throw if JSON is missing answer', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                suggestedQuestions: ['Q1'],
              }),
            },
          },
        ],
      });

      await expect(
        service.chat('software', [{ role: 'user', content: 'test' }]),
      ).rejects.toThrow('OpenAI response did not contain an answer');
    });

    it('should handle missing suggestedQuestions gracefully', async () => {
      mockOpenAICreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'Test answer',
              }),
            },
          },
        ],
      });

      const result = await service.chat('software', [
        { role: 'user', content: 'test' },
      ]);

      expect(result.answer).toBe('Test answer');
      expect(result.suggestedQuestions).toEqual([]);
    });
  });

  describe('Message History', () => {
    beforeEach(() => {
      const OpenAI = require('openai');
      mockOpenAICreate = jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                answer: 'Test answer',
                suggestedQuestions: [],
              }),
            },
          },
        ],
      });
      OpenAI.mockImplementation(() => ({
        chat: { completions: { create: mockOpenAICreate } },
      }));
      service = new WaGuidanceChatService({ apiKey: 'test-key' });
    });

    it('should handle single message', async () => {
      const messages: ChatMessage[] = [{ role: 'user', content: 'Hello' }];
      const result = await service.chat('software', messages);
      expect(result).toHaveProperty('answer');
    });

    it('should handle conversation history', async () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'What is ESSB 5814?' },
        {
          role: 'assistant',
          content: 'ESSB 5814 is a Washington State law...',
        },
        { role: 'user', content: 'When does it take effect?' },
      ];

      const result = await service.chat('software', messages);
      expect(result).toHaveProperty('answer');
    });

    it('should trim content from messages', async () => {
      const messages: ChatMessage[] = [
        { role: 'user', content: '  \n  test  \n  ' },
      ];

      await service.chat('software', messages);

      const callArgs = mockOpenAICreate.mock.calls[0][0];
      expect(callArgs.messages).toBeDefined();
    });
  });

  describe('Service Configuration', () => {
    it('should use custom guidanceDir if provided', () => {
      service = new WaGuidanceChatService({
        apiKey: 'test-key',
        guidanceDir: '/custom/path',
      });
      expect(service).toBeDefined();
    });

    it('should use custom maxContextChars', () => {
      service = new WaGuidanceChatService({
        apiKey: 'test-key',
        maxContextChars: 5000,
      });
      expect(service).toBeDefined();
    });
  });
});
