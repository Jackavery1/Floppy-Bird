import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cycleMenuSkin } from '../src/ui/menu/uiMenuSkinCycle.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { UI } from '../src/ui/core/ui.js';

vi.mock('../src/metaContext.js', () => ({
    buildMetaContext: vi.fn(() => ({ unlockedSkinCount: 3 })),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/skins/skinSelection.js', () => ({
    applySelectedSkin: vi.fn((scene, skinId) => skinId),
}));

vi.mock('../src/skins/index.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        cycleUnlockedSkin: vi.fn((current) => current),
        getSkin: vi.fn((id) => ({ label: id === 'cosmos' ? 'Cosmos' : 'Classic' })),
    };
});

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', () => ({
    announceAccessibility: vi.fn(),
}));

vi.mock('../src/ui/menu/uiMenuSkinsRefresh.js', () => ({
    refreshSkinsTab: vi.fn(),
}));

describe('uiMenuSkinCycle', () => {
    let scene;
    let ui;

    beforeEach(async () => {
        vi.clearAllMocks();
        scene = createBaseScene({
            round: createRoundState(),
            bird: { setSkin: vi.fn() },
        });
        ui = new UI(scene);
    });

    it('ne change rien si cycleUnlockedSkin renvoie le skin courant', async () => {
        const { applySelectedSkin } = await import('../src/skins/skinSelection.js');
        const { refreshSkinsTab } = await import('../src/ui/menu/uiMenuSkinsRefresh.js');
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');

        cycleMenuSkin(ui, 1);

        expect(applySelectedSkin).not.toHaveBeenCalled();
        expect(refreshSkinsTab).not.toHaveBeenCalled();
        expect(announceAccessibility).not.toHaveBeenCalled();
    });

    it('applique le skin suivant, rafraîchit l’onglet et annonce le libellé', async () => {
        const { cycleUnlockedSkin, getSkin } = await import('../src/skins/index.js');
        const { applySelectedSkin } = await import('../src/skins/skinSelection.js');
        const { refreshSkinsTab } = await import('../src/ui/menu/uiMenuSkinsRefresh.js');
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');

        vi.mocked(cycleUnlockedSkin).mockReturnValue('cosmos');
        vi.mocked(getSkin).mockReturnValue({ label: 'Cosmos' });

        cycleMenuSkin(ui, 1);

        expect(applySelectedSkin).toHaveBeenCalledWith(scene, 'cosmos');
        expect(refreshSkinsTab).toHaveBeenCalledWith(ui);
        expect(announceAccessibility).toHaveBeenCalledWith('Apparence sélectionnée : Cosmos');
    });

    it('passe le pas de cycle à cycleUnlockedSkin', async () => {
        const { cycleUnlockedSkin } = await import('../src/skins/index.js');
        vi.mocked(cycleUnlockedSkin).mockReturnValue('classic');

        cycleMenuSkin(ui, -1);

        expect(cycleUnlockedSkin).toHaveBeenCalledWith('classic', { unlockedSkinCount: 3 }, -1);
    });
});
