export const HARDCORE_UNLOCK_SCORE = 20;

/** @param {import('./metaContext.js').MetaContext} ctx */
export function isHardcoreUnlocked(ctx) {
    return ctx.bestScoreAny >= HARDCORE_UNLOCK_SCORE;
}

export const HARDCORE_UNLOCK_HINT = `Meilleur score ≥ ${HARDCORE_UNLOCK_SCORE} en mode classique`;
