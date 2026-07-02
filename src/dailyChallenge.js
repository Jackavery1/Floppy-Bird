import { DIFFICULTY, GAME_CONFIG } from './config.js';
import { getSkin, SKIN_IDS } from './skins.js';
import { getSkinPattern } from './skinPatterns.js';
import { isDailyCompletedToday } from './dailyChallengeProgress.js';

export function getDailyChallengeCode(date = new Date()) {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 10000;
    }
    return String(hash).padStart(4, '0');
}

export function getDailyChallengeSeed(date = new Date()) {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
        hash ^= key.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

export function getDailyChallengeLabel(date = new Date()) {
    return `Défi du jour #${getDailyChallengeCode(date)} · séquence partagée`;
}

/** Skin imposé du jour (aperçu même si verrouillé en classique). */
export function getDailyChallengeSkin(date = new Date()) {
    const seed = getDailyChallengeSeed(date);
    return SKIN_IDS[seed % SKIN_IDS.length];
}

const BASE_DAILY_GOALS = Object.freeze({
    [DIFFICULTY.EASY]: 6,
    [DIFFICULTY.NORMAL]: 10,
    [DIFFICULTY.HARD]: 14,
});

/** Objectif de score selon difficulté + pattern du skin du jour. */
export function getDailyChallengeGoal(difficulty, date = new Date()) {
    const skinId = getDailyChallengeSkin(date);
    const base = BASE_DAILY_GOALS[difficulty] ?? BASE_DAILY_GOALS[DIFFICULTY.NORMAL];
    return base + (getSkinPattern(skinId).goalOffset ?? 0);
}

/**
 * @param {string} difficulty
 * @param {Date} [date]
 * @returns {{ code: string, skinId: string, skinLabel: string, goal: number, patternTag: string, completed: boolean }}
 */
export function getDailyChallengeSummary(difficulty, date = new Date()) {
    const skinId = getDailyChallengeSkin(date);
    const skin = getSkin(skinId);
    const pattern = getSkinPattern(skinId);
    return {
        code: getDailyChallengeCode(date),
        skinId,
        skinLabel: skin.label,
        goal: getDailyChallengeGoal(difficulty, date),
        patternTag: pattern.tagline,
        completed: isDailyCompletedToday(date),
    };
}

export function formatDailyMenuButtonLabel(difficulty, date = new Date()) {
    const s = getDailyChallengeSummary(difficulty, date);
    const done = s.completed ? ' ✓' : '';
    return `DÉFI #${s.code} · ${s.skinLabel} · ${s.goal} pts${done}`;
}

export function formatDailyMenuSubtitle(difficulty, date = new Date()) {
    const s = getDailyChallengeSummary(difficulty, date);
    const diff = GAME_CONFIG.difficultyLabels[difficulty] ?? difficulty;
    return `${s.patternTag} · objectif ${s.goal} pts (${diff})`;
}

export function formatDailyHudLabel(score, goal) {
    return `DÉFI ${score}/${goal}`;
}
