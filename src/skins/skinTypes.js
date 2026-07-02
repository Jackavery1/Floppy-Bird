/** @typedef {{
 *   body: number, bodyHi: number, wing: number, beak: number, beakDark: number,
 *   [extra: string]: number,
 * }} SkinPalette */

/**
 * @typedef {Object} SkinAccessory
 * @property {number} [height]
 * @property {number} [bodyOffsetY]
 * @property {number} [alpha]
 * @property {(g: import('phaser').GameObjects.Graphics, ox: number, oy: number,
 *   pos: 'up'|'mid'|'down', palette: SkinPalette) => void} [draw]
 */

/**
 * @typedef {Object} SkinUnlockSpec
 * @property {'always' | 'scoreAny' | 'normal' | 'hard' | 'hardcore' | 'allDifficulties'
 *   | 'dailyCompletions' | 'training' | 'neonCollection'} type
 * @property {number} [min]
 */

/**
 * @typedef {Object} SkinDefinition
 * @property {string} label
 * @property {string} hint
 * @property {'classic' | 'special'} family
 * @property {SkinPalette} palette
 * @property {string} [accessoryKey]
 * @property {SkinUnlockSpec} unlock
 */

/**
 * @typedef {Object} SkinEntry
 * @property {string} id
 * @property {string} label
 * @property {string} hint
 * @property {'classic' | 'special'} family
 * @property {SkinPalette} palette
 * @property {SkinAccessory} [accessory]
 * @property {(ctx: import('../metaContext.js').MetaContext) => boolean} unlock
 */

export {};
