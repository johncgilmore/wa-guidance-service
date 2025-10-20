import { GUIDANCE_BY_TILE, GUIDANCE_SHARED, isWaTileId } from '../guidanceMap';
import type { WaTileId } from '../types';

describe('Guidance Map', () => {
  describe('GUIDANCE_BY_TILE', () => {
    it('should have all 11 tiles defined', () => {
      const tileIds: WaTileId[] = [
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

      expect(Object.keys(GUIDANCE_BY_TILE).length).toBe(11);
      tileIds.forEach((tileId) => {
        expect(GUIDANCE_BY_TILE).toHaveProperty(tileId);
      });
    });

    it('should have at least one guidance entry per tile', () => {
      Object.entries(GUIDANCE_BY_TILE).forEach(([tileId, entries]) => {
        expect(entries.length).toBeGreaterThan(0);
      });
    });

    it('should have valid guidance entries with href and label', () => {
      Object.entries(GUIDANCE_BY_TILE).forEach(([tileId, entries]) => {
        entries.forEach((entry) => {
          expect(entry).toHaveProperty('href');
          expect(entry).toHaveProperty('label');
          expect(typeof entry.href).toBe('string');
          expect(typeof entry.label).toBe('string');
          expect(entry.href.length).toBeGreaterThan(0);
          expect(entry.label.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have hrefs pointing to guidance txt files', () => {
      Object.entries(GUIDANCE_BY_TILE).forEach(([tileId, entries]) => {
        entries.forEach((entry) => {
          expect(entry.href).toMatch(/\.txt$/);
          expect(entry.href).toContain('/wa-guidance/');
        });
      });
    });

    it('should have labels mentioning ESSB 5814', () => {
      Object.entries(GUIDANCE_BY_TILE).forEach(([tileId, entries]) => {
        entries.forEach((entry) => {
          expect(entry.label).toContain('ESSB 5814');
        });
      });
    });
  });

  describe('GUIDANCE_SHARED', () => {
    it('should have shared guidance entries', () => {
      expect(GUIDANCE_SHARED.length).toBeGreaterThan(0);
    });

    it('should have valid shared guidance entries', () => {
      GUIDANCE_SHARED.forEach((entry) => {
        expect(entry).toHaveProperty('href');
        expect(entry).toHaveProperty('label');
        expect(typeof entry.href).toBe('string');
        expect(typeof entry.label).toBe('string');
      });
    });

    it('should reference DAS/retail guidance', () => {
      const hasRetailReference = GUIDANCE_SHARED.some(
        (entry) =>
          entry.label.toLowerCase().includes('das') ||
          entry.label.toLowerCase().includes('retail'),
      );
      expect(hasRetailReference).toBe(true);
    });
  });

  describe('Tile ID validation', () => {
    it('should validate all tiles in GUIDANCE_BY_TILE', () => {
      Object.keys(GUIDANCE_BY_TILE).forEach((tileId) => {
        expect(isWaTileId(tileId)).toBe(true);
      });
    });

    it('should return guidance entries for all valid tiles', () => {
      const tiles: WaTileId[] = [
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

      tiles.forEach((tileId) => {
        expect(GUIDANCE_BY_TILE[tileId]).toBeDefined();
        expect(Array.isArray(GUIDANCE_BY_TILE[tileId])).toBe(true);
      });
    });
  });
});
