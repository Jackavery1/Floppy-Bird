/** @typedef {{
 *   tagline: string,
 *   goalOffset: number,
 *   gravityMult: number,
 *   jumpMult: number,
 *   speedMult: number,
 * }} SkinPattern */

/** @type {Record<string, SkinPattern>} */
export const SKIN_PATTERNS = Object.freeze({
    classic: {
        tagline: 'Équilibré',
        goalOffset: 0,
        gravityMult: 1,
        jumpMult: 1,
        speedMult: 1,
    },
    lavande: {
        tagline: 'Léger · chute douce',
        goalOffset: 0,
        gravityMult: 0.96,
        jumpMult: 1,
        speedMult: 1,
    },
    ruby: {
        tagline: 'Tuyaux plus rapides',
        goalOffset: 1,
        gravityMult: 1,
        jumpMult: 1,
        speedMult: 1.05,
    },
    ambre: {
        tagline: 'Rythme soutenu',
        goalOffset: 0,
        gravityMult: 1,
        jumpMult: 1,
        speedMult: 1.03,
    },
    ocean: {
        tagline: 'Chute lente · saut ample',
        goalOffset: 0,
        gravityMult: 0.92,
        jumpMult: 1.05,
        speedMult: 1,
    },
    corail: {
        tagline: 'Saut généreux',
        goalOffset: 1,
        gravityMult: 1,
        jumpMult: 1.06,
        speedMult: 1,
    },
    forest: {
        tagline: 'Gravité renforcée',
        goalOffset: 1,
        gravityMult: 1.05,
        jumpMult: 1,
        speedMult: 1,
    },
    minuit: {
        tagline: 'Chute dense',
        goalOffset: 1,
        gravityMult: 1.03,
        jumpMult: 1,
        speedMult: 1.02,
    },
    armure: {
        tagline: 'Lourd · chute rapide',
        goalOffset: 2,
        gravityMult: 1.08,
        jumpMult: 0.96,
        speedMult: 1,
    },
    mushu: {
        tagline: 'Saut explosif',
        goalOffset: 1,
        gravityMult: 1,
        jumpMult: 1.12,
        speedMult: 1,
    },
    phoenix: {
        tagline: 'Flambée · saut vif',
        goalOffset: 2,
        gravityMult: 1.05,
        jumpMult: 1.14,
        speedMult: 1.04,
    },
    fantome: {
        tagline: 'Ultra-léger',
        goalOffset: 2,
        gravityMult: 0.88,
        jumpMult: 1.04,
        speedMult: 0.98,
    },
    glace: {
        tagline: 'Glissant · tuyaux rapides',
        goalOffset: 1,
        gravityMult: 0.82,
        jumpMult: 1,
        speedMult: 1.07,
    },
    tempete: {
        tagline: 'Chaos · chute lourde',
        goalOffset: 2,
        gravityMult: 1.05,
        jumpMult: 0.92,
        speedMult: 1.13,
    },
    cosmos: {
        tagline: 'Apesanteur lunaire',
        goalOffset: 3,
        gravityMult: 0.76,
        jumpMult: 1.1,
        speedMult: 0.94,
    },
    neon: {
        tagline: 'Vitesse cyber',
        goalOffset: 3,
        gravityMult: 1,
        jumpMult: 1,
        speedMult: 1.1,
    },
});

/** @param {string} skinId */
export function getSkinPattern(skinId) {
    return SKIN_PATTERNS[skinId] ?? SKIN_PATTERNS.classic;
}

/** @param {import('./config.js').DifficultyConfig} diffConfig @param {string} skinId */
export function applySkinPatternToDifficulty(diffConfig, skinId) {
    const p = getSkinPattern(skinId);
    return {
        ...diffConfig,
        gravity: diffConfig.gravity * p.gravityMult,
        jumpPower: diffConfig.jumpPower * p.jumpMult,
        speed: diffConfig.speed * p.speedMult,
    };
}
