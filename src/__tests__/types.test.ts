import { isWaTileId } from '../guidanceMap';
import type { ChatMessage, WaTileId } from '../types';

describe('Type Guards and Validation', () => {
  describe('isWaTileId', () => {
    it('should accept valid tile IDs', () => {
      const validTiles: WaTileId[] = [
        'it',
        'marketing',
        'webdev',
        'software',
        'engineering',
        'staffing',
        'security',
        'presentations',
        'professional-services',
        'data-processing',
        'contracts',
      ];

      validTiles.forEach((tileId) => {
        expect(isWaTileId(tileId)).toBe(true);
      });
    });

    it('should reject invalid tile IDs', () => {
      const invalidTiles = [
        'invalid-tile',
        'foo',
        'bar',
        '',
        123,
        null,
        undefined,
        {},
        [],
      ];

      invalidTiles.forEach((tileId) => {
        expect(isWaTileId(tileId)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(isWaTileId('WEBDEV')).toBe(false); // case sensitive
      expect(isWaTileId('software ')).toBe(false); // trailing space
      expect(isWaTileId(' software')).toBe(false); // leading space
      expect(isWaTileId('soft ware')).toBe(false); // space in middle
    });
  });

  describe('ChatMessage type validation', () => {
    it('should accept valid user messages', () => {
      const message: ChatMessage = {
        role: 'user',
        content: 'What is ESSB 5814?',
      };
      expect(message.role).toBe('user');
      expect(typeof message.content).toBe('string');
    });

    it('should accept valid assistant messages', () => {
      const message: ChatMessage = {
        role: 'assistant',
        content: 'ESSB 5814 is a Washington State law...',
      };
      expect(message.role).toBe('assistant');
      expect(typeof message.content).toBe('string');
    });

    it('should allow empty content strings', () => {
      const message: ChatMessage = {
        role: 'user',
        content: '',
      };
      expect(message.content).toBe('');
    });

    it('should allow multiline content', () => {
      const message: ChatMessage = {
        role: 'assistant',
        content: 'Line 1\nLine 2\nLine 3',
      };
      expect(message.content).toContain('\n');
    });
  });
});
