import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, menuTextStyle } from '../../designTokens.js';
import { sceneTween } from '../../motion.js';
import { announceAccessibility } from '../a11y/uiDomAccessibilityControls.js';
import { addCenteredText, DEPTH, FONT_SIZE_CHROME } from '../shared/uiLayout.js';
import { acquireHudBannerSlot, releaseHudBannerSlot } from './uiHudBannerStack.js';

/** @param {import('../../sceneTypes.js').SceneContext} scene @param {{ title: string, kind?: string }} achievement */
function showAchievementToast(scene, achievement) {
    const ui = scene.ui;
    if (!ui) return;
    const slot = acquireHudBannerSlot(ui);
    const y = slot.y;
    const prefix = achievement.kind === 'skin' ? 'Skin' : 'Succès';
    const toast = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        y,
        `${prefix} · ${achievement.title}`,
        menuTextStyle({
            fontSize: FONT_SIZE_CHROME,
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.contourHud,
        }),
        DEPTH.ACHIEVEMENT_TOAST
    );
    toast.__bannerRow = slot.row;
    announceAccessibility(`${prefix} : ${achievement.title}`);
    sceneTween(scene, {
        targets: toast,
        alpha: { from: 1, to: 0 },
        y: y - 18,
        duration: 1800,
        delay: 400,
        ease: 'Power2',
        onComplete: () => {
            releaseHudBannerSlot(ui, slot.row);
            toast.destroy();
        },
    });
}

/** @param {import('../../sceneTypes.js').SceneContext} scene @param {Array<{ title: string, kind?: string }>} achievements */
export function showAchievementToasts(scene, achievements) {
    achievements.forEach((achievement, index) => {
        scene.time.delayedCall(index * 450, () => {
            showAchievementToast(scene, achievement);
        });
    });
}
