export const ACHIEVEMENTS = Object.freeze([
    {
        id: 'first_flight',
        title: 'Premier vol',
        desc: 'Marquer 1 point',
        check: ctx => ctx.score >= 1,
    },
    {
        id: 'ten_pipes',
        title: 'Dix tuyaux',
        desc: '10 points en une partie',
        check: ctx => ctx.score >= 10,
    },
    {
        id: 'hardcore_hero',
        title: 'Hardcore',
        desc: '5 points en hardcore',
        check: ctx => ctx.hardcore && ctx.score >= 5,
    },
    {
        id: 'daily_flyer',
        title: 'Défi du jour',
        desc: '8 points au défi du jour',
        check: ctx => ctx.dailyChallenge && ctx.score >= 8,
    },
    {
        id: 'collector',
        title: 'Collectionneur',
        desc: '3 skins débloqués',
        check: ctx => ctx.unlockedSkinCount >= 3,
        timing: 'roundEnd',
    },
]);
