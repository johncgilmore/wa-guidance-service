/**
 * Guidance Loader - Loads bundled guidance or external files
 * 
 * This module handles loading guidance documents from either:
 * 1. Bundled files (shipped with the package)
 * 2. External directory (user-provided)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { WaTileId, GuidanceEntry } from './types';
import { GUIDANCE_BY_TILE, GUIDANCE_SHARED } from './guidanceMap';

/**
 * Load guidance content from files
 * 
 * @param tileId - The service category to load guidance for
 * @param guidanceDir - Optional custom directory (if not provided, uses bundled guidance)
 * @returns Combined guidance text from all relevant documents
 */
export async function loadGuidanceForTile(
  tileId: WaTileId,
  guidanceDir?: string
): Promise<string> {
  const entries = GUIDANCE_BY_TILE[tileId];
  
  if (!entries || entries.length === 0) {
    throw new Error(`No guidance entries found for tile: ${tileId}`);
  }

  // Determine base path: bundled or user-provided
  const basePath = guidanceDir 
    ? guidanceDir 
    : path.join(__dirname, '..', 'guidance');

  // Load all guidance files for this tile
  const guidanceTexts: string[] = [];
  
  for (const entry of entries) {
    const filePath = path.join(basePath, entry.href);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      guidanceTexts.push(`# ${entry.label}\n\n${content}`);
    } catch (error) {
      // If bundled guidance fails and no custom dir provided, throw helpful error
      if (!guidanceDir) {
        throw new Error(
          `Failed to load bundled guidance for ${tileId}. ` +
          `File not found: ${filePath}. ` +
          `You may need to provide a guidanceDir option or ensure guidance files are included in the package.`
        );
      }
      throw new Error(
        `Failed to load guidance file: ${filePath}. ` +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Also load shared guidance
  for (const sharedEntry of GUIDANCE_SHARED) {
    const filePath = path.join(basePath, sharedEntry.href);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      guidanceTexts.push(`# ${sharedEntry.label}\n\n${content}`);
    } catch (error) {
      // Shared guidance is optional, just log if missing
      console.warn(`Optional shared guidance not found: ${filePath}`);
    }
  }

  return guidanceTexts.join('\n\n---\n\n');
}

/**
 * Get metadata about bundled guidance version
 * 
 * @returns Metadata about the guidance documents including version and last update dates
 */
export async function getGuidanceMetadata(): Promise<any> {
  try {
    const metadataPath = path.join(__dirname, '..', 'guidance', 'metadata.json');
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      version: 'unknown',
      lastChecked: 'unknown',
      note: 'Metadata not available - guidance may be provided externally'
    };
  }
}

