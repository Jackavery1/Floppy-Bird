import { buildMetaContext } from './metaContext.js';
import { loadSelectedSkin } from './metaStorage.js';
import { applySelectedSkin } from './skins/skinSelection.js';
import { getSkin, cycleUnlockedSkin } from './skins/index.js';
import { announceAccessibility } from './uiDomAccessibilityControls.js';
import { refreshSkinsTab } from './uiMenuSkinsRefresh.js';

/** @param {import('./ui.js').UI} ui @param {number} step */
export function cycleMenuSkin(ui, step) {
    const ctx = buildMetaContext(ui.scene);
    const current = loadSelectedSkin();
    const nextId = cycleUnlockedSkin(current, ctx, step);
    if (nextId === current) return;
    applySelectedSkin(ui.scene, nextId);
    refreshSkinsTab(ui);
    const nextSkin = getSkin(nextId);
    announceAccessibility(`Apparence sélectionnée : ${nextSkin.label}`);
}
