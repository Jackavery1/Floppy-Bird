import { DIFFICULTY } from './config.js';
import { STORAGE_KEYS, highScoreKey, leaderboardKey } from './storageKeys.js';
import { routedSkinId } from './skinStorageRouting.js';

function parseScore(raw) {
    const n = Number.parseInt(raw ?? '', 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
}

function migrateLegacyHighScore(difficulty) {
    if (difficulty !== DIFFICULTY.NORMAL) return 0;
    try {
        const legacy = localStorage.getItem(STORAGE_KEYS.highScore);
        const n = parseScore(legacy);
        if (n !== null && n > 0) {
            localStorage.setItem(highScoreKey(difficulty), String(n));
        }
        return n ?? 0;
    } catch {
        return 0;
    }
}

function migrateLegacyLeaderboard(difficulty) {
    if (difficulty !== DIFFICULTY.NORMAL) return [];
    try {
        const legacy = localStorage.getItem(STORAGE_KEYS.leaderboard);
        if (!legacy) return [];
        const parsed = JSON.parse(legacy);
        if (!Array.isArray(parsed)) return [];
        const key = leaderboardKey(difficulty);
        localStorage.setItem(key, legacy);
        return loadLeaderboard(difficulty);
    } catch {
        return [];
    }
}

export function loadHighScore(difficulty = DIFFICULTY.NORMAL, hardcore = false, skinId = null) {
    try {
        const raw = localStorage.getItem(highScoreKey(difficulty, hardcore, routedSkinId(skinId)));
        const n = parseScore(raw);
        if (n !== null) return n;
        if (!hardcore && !routedSkinId(skinId)) return migrateLegacyHighScore(difficulty);
        return 0;
    } catch {
        return 0;
    }
}

export function saveHighScore(
    score,
    difficulty = DIFFICULTY.NORMAL,
    currentHigh,
    hardcore = false,
    skinId = null
) {
    const high = currentHigh ?? loadHighScore(difficulty, hardcore, skinId);
    if (score > high) {
        try {
            localStorage.setItem(
                highScoreKey(difficulty, hardcore, routedSkinId(skinId)),
                String(score)
            );
        } catch {
            /* quota localStorage */
        }
        return score;
    }
    return high;
}

export function loadLeaderboard(difficulty = DIFFICULTY.NORMAL, hardcore = false, skinId = null) {
    try {
        const routed = routedSkinId(skinId);
        const data = localStorage.getItem(leaderboardKey(difficulty, hardcore, routed));
        if (!data) {
            if (!hardcore && !routed) return migrateLegacyLeaderboard(difficulty);
            return [];
        }
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((item) => {
                if (typeof item === 'number') {
                    return { score: item, id: `legacy-${item}`, skinId: 'classic' };
                }
                const s = Number(item.score);
                return {
                    score: Number.isFinite(s) && s >= 0 ? s : 0,
                    id: item.id || `legacy-${s}`,
                    skinId: typeof item.skinId === 'string' ? item.skinId : 'classic',
                };
            })
            .filter((e) => Number.isFinite(e.score) && e.score >= 0);
    } catch {
        return [];
    }
}

export function saveToLeaderboard(
    score,
    difficulty = DIFFICULTY.NORMAL,
    hardcore = false,
    skinId = null
) {
    const entries = loadLeaderboard(difficulty, hardcore, skinId);
    if (score <= 0) {
        return { entries, highlightId: null };
    }
    const highlightId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    entries.push({ score, id: highlightId, skinId: skinId ?? 'classic' });
    entries.sort((a, b) => b.score - a.score);
    const top5 = entries.slice(0, 5);
    try {
        localStorage.setItem(
            leaderboardKey(difficulty, hardcore, routedSkinId(skinId)),
            JSON.stringify(top5)
        );
    } catch {
        /* quota localStorage */
    }
    return { entries: top5, highlightId };
}
