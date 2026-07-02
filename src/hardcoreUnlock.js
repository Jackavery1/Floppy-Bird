/** @param {import('./metaContext.js').MetaContext} ctx */
export function isHardcoreUnlocked(ctx) {
    return ctx.bestScoreAny >= 10;
}

export const HARDCORE_UNLOCK_HINT = 'Meilleur score ≥ 10 en mode classique';
