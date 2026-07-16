import { GAME_CONFIG } from './config.js';
import { applySkinPatternToDifficulty } from './skinPatterns.js';

/**
 * Difficulté de manche pour le défi du jour :
 * pattern skin (borné) + gaps plus serrés, tuyaux plus rapides, spawn plus dense.
 * @param {ReturnType<typeof GAME_CONFIG.getDifficulty>} diffConfig
 * @param {string} skinId
 */
export function applyDailyRoundDifficulty(diffConfig, skinId) {
    const d = GAME_CONFIG.daily;
    const patterned = applySkinPatternToDifficulty(diffConfig, skinId, {
        minGravityMult: d.minGravityMult,
        maxJumpMult: d.maxJumpMult,
        minSpeedMult: d.minSpeedMult,
    });
    return {
        ...patterned,
        gap: Math.max(GAME_CONFIG.pipes.minPipeGap, Math.round(patterned.gap * d.gapMult)),
        speed: patterned.speed * d.speedMult,
        pipeInterval: Math.max(48, Math.round(patterned.pipeInterval * d.pipeIntervalMult)),
    };
}
