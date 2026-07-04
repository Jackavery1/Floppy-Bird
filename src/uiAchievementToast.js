import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH } from './uiLayout.js';

/** @param {import('./sceneTypes.js').SceneContext} scene @param {{ title: string }} achievement */
function showAchievementToast(scene, achievement) {
    const toast = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        118,
        `🏆 ${achievement.title}`,
        menuTextStyle({
            fontSize: '14px',
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.contourHud,
        }),
        DEPTH.ACHIEVEMENT_TOAST
    );
    sceneTween(scene, {
        targets: toast,
        alpha: { from: 1, to: 0 },
        y: 100,
        duration: 1800,
        delay: 400,
        ease: 'Power2',
        onComplete: () => toast.destroy(),
    });
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {Array<{ title: string }>} achievements */
export function showAchievementToasts(scene, achievements) {
    achievements.forEach((a) => showAchievementToast(scene, a));
}
