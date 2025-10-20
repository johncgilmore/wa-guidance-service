import { type GuidanceEntry, type WaTileId } from './types';
/**
 * Mapping from tile id to one or more guidance docs.
 * These paths are relative to a guidance root directory or can be full URLs.
 */
export declare const GUIDANCE_BY_TILE: Record<WaTileId, GuidanceEntry[]>;
/**
 * Shared cross-cutting references (e.g., DAS exclusions / retail definition).
 */
export declare const GUIDANCE_SHARED: GuidanceEntry[];
/**
 * Type guard to check if a value is a valid tile ID
 */
export declare function isWaTileId(value: unknown): value is WaTileId;
//# sourceMappingURL=guidanceMap.d.ts.map