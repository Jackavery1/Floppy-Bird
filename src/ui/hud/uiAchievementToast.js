import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, menuTextStyle } from '../../designTokens.js';
import { sceneTween } from '../../motion.js';
import { announceAccessibility } from '../a11y/uiDomAccessibilityControls.js';
import { addCenteredText, DEPTH } from '../shared/uiLayout.js';
import { acquireHudBannerSlot, releaseHudBannerSlot } from './uiHudBannerStack.js';

/** @param {import('../../sceneTypes.js').SceneContext} scene @param {{ title: string }} achievement */
function showAchievementToast(scene, achievement) {
    const ui = scene.ui;
    if (!ui) return;
    const slot = acquireHudBannerSlot(ui);
    const y = slot.y;
    const toast = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        y,
        `🏆 ${achievement.title}`,
        menuTextStyle({
            fontSize: '14px',
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.contourHud,
        }),
        DEPTH.ACHIEVEMENT_TOAST
    );
    toast.__bannerRow = slot.row;
    announceAccessibility(`Succès : ${achievement.title}`);
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

/** @param {import('../../sceneTypes.js').SceneContext} scene @param {Array<{ title: string }>} achievements */
export function showAchievementToasts(scene, achievements) {
    achievements.forEach((achievement, index) => {
        scene.time.delayedCall(index * 450, () => {
            showAchievementToast(scene, achievement);
        });
    });
}
