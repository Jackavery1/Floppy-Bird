import { STORAGE_KEYS } from './storageKeys.js';

function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** @returns {{ dateKey: string, completed: boolean, goal: number, score: number, difficulty: string, skinId: string } | null} */
export function loadDailyCompletion(date = new Date()) {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.dailyCompletion);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (data?.dateKey !== dateKey(date)) return null;
        return data;
    } catch {
        return null;
    }
}

/** @param {{ goal: number, score: number, difficulty: string, skinId: string, date?: Date }} payload */
export function saveDailyCompletion({ goal, score, difficulty, skinId, date = new Date() }) {
    const completed = score >= goal;
    try {
        localStorage.setItem(
            STORAGE_KEYS.dailyCompletion,
            JSON.stringify({
                dateKey: dateKey(date),
                completed,
                goal,
                score,
                difficulty,
                skinId,
            })
        );
    } catch {
        /* quota localStorage */
    }
    if (completed) {
        recordDailyStatsCompletion(date);
    }
}

export function isDailyCompletedToday(date = new Date()) {
    return loadDailyCompletion(date)?.completed === true;
}

/** @returns {{ totalCompletions: number, consecutiveDays: number }} */
export function loadDailyStats() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.dailyStats);
        if (!raw) return { totalCompletions: 0, consecutiveDays: 0 };
        const data = JSON.parse(raw);
        const total = Number(data?.totalCompletions ?? 0);
        const consecutiveDays = Number(data?.consecutiveDays ?? 0);
        return {
            totalCompletions: Number.isFinite(total) && total >= 0 ? total : 0,
            consecutiveDays:
                Number.isFinite(consecutiveDays) && consecutiveDays >= 0 ? consecutiveDays : 0,
        };
    } catch {
        return { totalCompletions: 0, consecutiveDays: 0 };
    }
}

function saveDailyStats(stats) {
    try {
        localStorage.setItem(STORAGE_KEYS.dailyStats, JSON.stringify(stats));
    } catch {
        /* quota localStorage */
    }
}

function previousDayKey(date) {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    return dateKey(d);
}

/** Incrémente le compteur une seule fois par jour réussi. */
function recordDailyStatsCompletion(date = new Date()) {
    const today = dateKey(date);
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.dailyStats);
        const data = raw ? JSON.parse(raw) : {};
        if (data?.lastCountedDay === today) return;
        const total = Number(data?.totalCompletions ?? 0);
        const yesterday = previousDayKey(date);
        let consecutiveDays = 1;
        if (data?.lastCountedDay === yesterday) {
            const prev = Number(data?.consecutiveDays ?? 0);
            consecutiveDays = (Number.isFinite(prev) && prev > 0 ? prev : 1) + 1;
        }
        saveDailyStats({
            totalCompletions: (Number.isFinite(total) ? total : 0) + 1,
            lastCountedDay: today,
            consecutiveDays,
        });
    } catch {
        /* quota localStorage */
    }
}
