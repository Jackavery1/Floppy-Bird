import { SKIN_IDS } from './skinIds.js';

/**
 * @param {import('./skinTypes.js').SkinUnlockSpec} spec
 * @param {Record<string, { unlock: (ctx: import('../metaContext.js').MetaContext) => boolean }>} skins
 * @returns {(ctx: import('../metaContext.js').MetaContext) => boolean}
 */
export function resolveUnlock(spec, skins) {
    switch (spec.type) {
        case 'always':
            return () => true;
        case 'scoreAny':
            return (ctx) => ctx.bestScoreAny >= spec.min;
        case 'normal':
            return (ctx) => ctx.bestNormalScore >= spec.min;
        case 'hard':
            return (ctx) => ctx.bestHardScore >= spec.min;
        case 'hardcore':
            return (ctx) => ctx.bestHardcoreScore >= spec.min;
        case 'allDifficulties':
            return (ctx) =>
                ctx.bestEasyScore >= spec.min &&
                ctx.bestNormalScore >= spec.min &&
                ctx.bestHardScore >= spec.min;
        case 'dailyCompletions':
            return (ctx) => ctx.dailyCompletionsTotal >= spec.min;
        case 'training':
            return (ctx) => ctx.bestTrainingScore >= spec.min;
        case 'neonCollection':
            return (ctx) =>
                SKIN_IDS.filter((id) => id !== 'neon').every((id) => skins[id].unlock(ctx));
        default:
            return () => false;
    }
}
