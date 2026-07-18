import { buildMetaContext } from '../../metaContext.js';
import { loadSelectedSkin } from '../../metaStorage.js';
import { loadHighScore } from '../../highScores.js';
import { getSkin, listUnlockedSkins, SKIN_IDS } from '../../skins/index.js';
import { getSkinPattern } from '../../skinPatterns.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';

/** @param {import('../core/ui.js').UI} ui */
export function refreshSkinsTab(ui) {
    if (!ui._skinCells) return;
    const scene = ui.scene;
    const ctx = buildMetaContext(scene);
    const unlocked = new Set(listUnlockedSkins(ctx));
    const selected = loadSelectedSkin();

    ui._skinsCountLine?.setText(`${ctx.unlockedSkinCount}/${SKIN_IDS.length} débloqués`);

    const selectedSkin = getSkin(selected);
    const selectedPattern = getSkinPattern(selected);
    const selectedUnlocked = unlocked.has(selected);
    ui._skinsPatternLine?.setText(
        selectedUnlocked
            ? `${selectedSkin.label} · ${selectedPattern.tagline}`
            : `Verrouillé · ${selectedSkin.hint}`
    );

    ui._skinCells.forEach(({ skinId, frame, preview, nameLabel, recordLabel }) => {
        const isUnlocked = unlocked.has(skinId);
        const isSelected = skinId === selected;
        preview.setAlpha(isUnlocked ? 1 : 0.28);
        nameLabel.setColor(
            isUnlocked
                ? isSelected
                    ? DESIGN_TOKENS.accent
                    : DESIGN_TOKENS.texteSkinLabel
                : DESIGN_TOKENS.texteVerrouille
        );
        nameLabel.setText(getSkin(skinId).label);
        frame.setStrokeStyle(
            2,
            isSelected
                ? hexVersPhaser(DESIGN_TOKENS.accent)
                : hexVersPhaser(DESIGN_TOKENS.cadreSkinContour)
        );
        if (recordLabel) {
            if (isUnlocked) {
                const best = loadHighScore(scene.difficulty, scene.hardcoreMode, skinId);
                recordLabel.setVisible(true);
                recordLabel.setText(best > 0 ? `★ ${best}` : '');
            } else {
                recordLabel.setVisible(false);
                recordLabel.setText('');
            }
        }
    });
}
