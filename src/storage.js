import { DIFFICULTY } from './config.js';
import { STORAGE_KEYS, highScoreKey, leaderboardKey } from './storageKeys.js';

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

export function loadHighScore(difficulty = DIFFICULTY.NORMAL) {
    try {
        const raw = localStorage.getItem(highScoreKey(difficulty));
        const n = parseScore(raw);
        if (n !== null) return n;
        return migrateLegacyHighScore(difficulty);
    } catch {
        return 0;
    }
}

export function saveHighScore(score, difficulty = DIFFICULTY.NORMAL, currentHigh = loadHighScore(difficulty)) {
    if (score > currentHigh) {
        try {
            localStorage.setItem(highScoreKey(difficulty), String(score));
        } catch { /* quota */ }
        return score;
    }
    return currentHigh;
}

export function loadLeaderboard(difficulty = DIFFICULTY.NORMAL) {
    try {
        const data = localStorage.getItem(leaderboardKey(difficulty));
        if (!data) return migrateLegacyLeaderboard(difficulty);
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map(item => {
                if (typeof item === 'number') {
                    return { score: item, id: `legacy-${item}` };
                }
                const s = Number(item.score);
                return {
                    score: Number.isFinite(s) && s >= 0 ? s : 0,
                    id: item.id || `legacy-${s}`,
                };
            })
            .filter(e => Number.isFinite(e.score) && e.score >= 0);
    } catch {
        return [];
    }
}

export function saveToLeaderboard(score, difficulty = DIFFICULTY.NORMAL) {
    const entries = loadLeaderboard(difficulty);
    if (score <= 0) {
        return { entries, highlightId: null };
    }
    const highlightId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    entries.push({ score, id: highlightId });
    entries.sort((a, b) => b.score - a.score);
    try {
        localStorage.setItem(
            leaderboardKey(difficulty),
            JSON.stringify(entries.slice(0, 5)),
        );
    } catch { /* quota */ }
    return { entries: entries.slice(0, 5), highlightId };
}
