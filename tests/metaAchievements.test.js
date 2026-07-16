import { describe, it, expect, vi } from 'vitest';
import {
    notifyAchievementUnlocks,
    notifyEndOfRoundAchievements,
    notifyNewlyUnlockedSkins,
    snapshotUnlockedSkins,
} from '../src/metaAchievements.js';

vi.mock('../src/metaProgress.js', () => ({
    evaluateAchievements: vi.fn(() => []),
}));

vi.mock('../src/metaContext.js', () => ({
    buildMetaContext: vi.fn(() => ({ bestScoreAny: 0 })),
}));

vi.mock('../src/skins/index.js', () => ({
    listUnlockedSkins: vi.fn(() => ['classic']),
    getSkin: vi.fn((id) => ({ label: id === 'ruby' ? 'Rubis' : 'Classique' })),
}));

describe('metaAchievements', () => {
    it('notifie le callback quand des succès sont débloqués', async () => {
        const { evaluateAchievements } = await import('../src/metaProgress.js');
        vi.mocked(evaluateAchievements).mockReturnValueOnce([
            { id: 'first_flight', title: 'Premier vol' },
        ]);
        const notifier = vi.fn();
        const scene = { achievementNotifier: notifier, trainingMode: false };

        const newly = notifyAchievementUnlocks(scene);

        expect(evaluateAchievements).toHaveBeenCalledWith(scene, { timing: 'score' });
        expect(newly).toHaveLength(1);
        expect(notifier).toHaveBeenCalledWith([{ id: 'first_flight', title: 'Premier vol' }]);
    });

    it('notifyEndOfRoundAchievements filtre les succès de fin de manche', async () => {
        const { evaluateAchievements } = await import('../src/metaProgress.js');
        vi.mocked(evaluateAchievements).mockReturnValueOnce([
            { id: 'collector', title: 'Collectionneur' },
        ]);
        const notifier = vi.fn();
        const scene = { achievementNotifier: notifier, trainingMode: false };

        notifyEndOfRoundAchievements(scene);

        expect(evaluateAchievements).toHaveBeenCalledWith(scene, { timing: 'roundEnd' });
        expect(notifier).toHaveBeenCalled();
    });

    it('ignore l’absence de notifier', async () => {
        const { evaluateAchievements } = await import('../src/metaProgress.js');
        vi.mocked(evaluateAchievements).mockReturnValueOnce([
            { id: 'first_flight', title: 'Premier vol' },
        ]);
        const scene = { trainingMode: false };

        expect(() => notifyAchievementUnlocks(scene)).not.toThrow();
    });

    it('ne notifie pas si aucun nouveau succès', async () => {
        const notifier = vi.fn();
        const scene = { achievementNotifier: notifier, trainingMode: false };

        notifyAchievementUnlocks(scene);

        expect(notifier).not.toHaveBeenCalled();
    });

    it('notifie les skins nouvellement débloqués', async () => {
        const { listUnlockedSkins } = await import('../src/skins/index.js');
        const notifier = vi.fn();
        const scene = {
            achievementNotifier: notifier,
            trainingMode: false,
            round: { unlockedSkinIdsAtStart: ['classic'] },
        };
        vi.mocked(listUnlockedSkins).mockReturnValueOnce(['classic', 'ruby']);

        const newly = notifyNewlyUnlockedSkins(scene);

        expect(newly).toEqual([{ id: 'skin-ruby', title: 'Rubis', kind: 'skin' }]);
        expect(notifier).toHaveBeenCalledWith(newly);
    });

    it('snapshotUnlockedSkins mémorise l’état de départ', async () => {
        const { listUnlockedSkins } = await import('../src/skins/index.js');
        vi.mocked(listUnlockedSkins).mockReturnValueOnce(['classic', 'ruby']);
        const scene = { round: {} };
        snapshotUnlockedSkins(scene);
        expect(scene.round.unlockedSkinIdsAtStart).toEqual(['classic', 'ruby']);
    });
});
