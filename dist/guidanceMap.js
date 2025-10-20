"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUIDANCE_SHARED = exports.GUIDANCE_BY_TILE = void 0;
exports.isWaTileId = isWaTileId;
/**
 * Mapping from tile id to one or more guidance docs.
 * These paths are relative to a guidance root directory or can be full URLs.
 */
exports.GUIDANCE_BY_TILE = {
    it: [
        {
            href: '/wa-guidance/it/guidance.txt',
            label: 'Interim Guidance — Information Technology Services (ESSB 5814)',
        },
    ],
    marketing: [
        {
            href: '/wa-guidance/marketing/guidance.txt',
            label: 'Interim Guidance — Advertising Services (ESSB 5814)',
        },
    ],
    webdev: [
        {
            href: '/wa-guidance/webdev/guidance.txt',
            label: 'Interim Guidance — Custom Website Development (ESSB 5814)',
        },
    ],
    software: [
        {
            href: '/wa-guidance/software/guidance.txt',
            label: 'Interim Guidance — Custom Software (ESSB 5814)',
        },
    ],
    engineering: [
        {
            href: '/wa-guidance/engineering/guidance.txt',
            label: 'Interim Guidance — Professional Services with Digital Delivery (ESSB 5814)',
        },
    ],
    staffing: [
        {
            href: '/wa-guidance/staffing/guidance.txt',
            label: 'Interim Guidance — Temporary Staffing Services (ESSB 5814)',
        },
    ],
    security: [
        {
            href: '/wa-guidance/security/guidance.txt',
            label: 'Interim Guidance — Investigation, Security, Security Monitoring, and Armored Car (ESSB 5814)',
        },
    ],
    presentations: [
        {
            href: '/wa-guidance/presentations/guidance.txt',
            label: 'Interim Guidance — Live Presentations (ESSB 5814)',
        },
    ],
    'professional-services': [
        {
            href: '/wa-guidance/professional-services/guidance.txt',
            label: 'Interim Guidance — Professional Services & DAS Features (ESSB 5814)',
        },
    ],
    'data-processing': [
        {
            href: '/wa-guidance/data-processing/guidance.txt',
            label: 'Interim Guidance — Data Processing & AI Platforms (ESSB 5814)',
        },
    ],
    contracts: [
        {
            href: '/wa-guidance/contracts/guidance.txt',
            label: 'Interim Guidance — Existing Contracts prior to Oct 1, 2025 (ESSB 5814)',
        },
    ],
};
/**
 * Shared cross-cutting references (e.g., DAS exclusions / retail definition).
 */
exports.GUIDANCE_SHARED = [
    {
        href: '/wa-guidance/shared/das-retail/guidance.txt',
        label: 'Interim Guidance — DAS exclusions and definition of "retail sale" (ESSB 5814)',
    },
];
/**
 * Type guard to check if a value is a valid tile ID
 */
function isWaTileId(value) {
    return typeof value === 'string' && Object.prototype.hasOwnProperty.call(exports.GUIDANCE_BY_TILE, value);
}
//# sourceMappingURL=guidanceMap.js.map