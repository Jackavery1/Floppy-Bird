import { GAME_CONFIG } from './config.js';
import { buildMetaContext } from './metaContext.js';
import { loadSelectedSkin, loadUnlockedAchievements, saveSelectedSkin } from './metaStorage.js';
import { ACHIEVEMENTS } from './achievements.js';
import { getSkin, nextUnlockedSkin } from './skins.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

function metaRowY(layout) {
    return (layout.mute ?? UI_LAYOUT.menu.mute) - 22;
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function cycleSelectedSkin(scene) {
    const ctx = buildMetaContext(scene);
    const current = loadSelectedSkin();
    const next = nextUnlockedSkin(current, ctx);
    saveSelectedSkin(next);
    scene.bird.setSkin(next);
    return next;
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {object} layout */
export function appendMetaMenu(ui, elements, layout) {
    const scene = ui.scene;
    const ctx = buildMetaContext(scene);
    const skin = getSkin(loadSelectedSkin());
    const rowY = metaRowY(layout);

    ui._skinLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        rowY,
        `APPARENCE · ${skin.label} (${ctx.unlockedSkinCount}/4)`,
        { fontSize: '10px', fill: '#cccccc', fontStyle: 'bold' },
        52,
    );
    elements.push(ui._skinLabel);

    ui._skinHit = scene.add.rectangle(
        GAME_CONFIG.centerX, rowY, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._skinHit.setDepth(54);
    ui._skinHit.setInteractive({ useHandCursor: true });
    ui._skinHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        const next = cycleSelectedSkin(scene);
        const fresh = buildMetaContext(scene);
        ui._skinLabel.setText(`APPARENCE · ${getSkin(next).label} (${fresh.unlockedSkinCount}/4)`);
    });
    elements.push(ui._skinHit);

    const achCount = loadUnlockedAchievements().length;
    ui._achLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        rowY + 14,
        `TROPHÉES ${achCount}/${ACHIEVEMENTS.length}`,
        { fontSize: '9px', fill: '#aaaaaa' },
        51,
    );
    elements.push(ui._achLabel);
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {{ title: string }} achievement */
export function showAchievementToast(scene, achievement) {
    const toast = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        118,
        `🏆 ${achievement.title}`,
        {
            fontSize: '13px',
            fill: '#FDD835',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        },
        120,
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
    achievements.forEach(a => showAchievementToast(scene, a));
}
