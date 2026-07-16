import { SKIN_IDS } from './skins/index.js';

export const ACHIEVEMENTS = Object.freeze([
    {
        id: 'first_flight',
        title: 'Premier vol',
        desc: 'Marquer 1 point',
        check: (ctx) => ctx.score >= 1,
    },
    {
        id: 'ten_pipes',
        title: 'Dix tuyaux',
        desc: '10 points en une partie',
        check: (ctx) => ctx.score >= 10,
    },
    {
        id: 'score_25',
        title: 'Vingt-cinq',
        desc: '25 points en une partie',
        check: (ctx) => ctx.score >= 25,
    },
    {
        id: 'hardcore_hero',
        title: 'Hardcore',
        desc: '8 points en hardcore',
        check: (ctx) => ctx.hardcore && ctx.score >= 8,
    },
    {
        id: 'daily_flyer',
        title: 'Défi du jour',
        desc: "Atteindre l'objectif du défi quotidien",
        check: (ctx) => ctx.dailyChallenge && ctx.dailyGoalMet,
        timing: 'roundEnd',
    },
    {
        id: 'daily_streak',
        title: 'Régularité',
        desc: '3 défis du jour consécutifs',
        check: (ctx) => ctx.dailyStreak >= 3,
        timing: 'roundEnd',
    },
    {
        id: 'collector',
        title: 'Collectionneur',
        desc: '3 skins débloqués',
        check: (ctx) => ctx.unlockedSkinCount >= 3,
        timing: 'roundEnd',
    },
    {
        id: 'neon_legend',
        title: 'Légende néon',
        desc: `Débloquer les ${SKIN_IDS.length} skins`,
        check: (ctx) => ctx.unlockedSkinCount >= SKIN_IDS.length,
        timing: 'roundEnd',
    },
]);
