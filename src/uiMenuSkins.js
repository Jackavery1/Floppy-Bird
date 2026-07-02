import { GAME_CONFIG } from './config.js';
import { buildMetaContext } from './metaContext.js';
import { loadSelectedSkin } from './metaStorage.js';
import { loadHighScore } from './storage.js';
import { applySelectedSkin } from './skins/skinSelection.js';
import { getSkin, listUnlockedSkins, SKIN_IDS, birdTextureKey, isSpecialSkin } from './skins/index.js';
import {
    addCenteredText,
    DEPTH,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

const SKIN_COLS = 4;
const SKIN_CELL_W = 52;
const SKIN_CELL_H = 56;

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {import('phaser').GameObjects.GameObject[]} panelElements
 */
export function buildSkinsTab(ui, elements, panelElements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.skinsPanel;
    ui._skinsTabElements = [];
    ui._skinCells = [];

    const title = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.skinsTitle,
        'APPARENCE', {
            fontSize: '12px', fill: '#90CAF9', fontStyle: 'bold',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(title);
    elements.push(title);
    ui._skinsTabElements.push(title);

    ui._skinsCountLine = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.skinsSubtitle,
        '', { fontSize: '11px', fill: '#B0BEC5', stroke: '#0d1117', strokeThickness: 2 }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(ui._skinsCountLine);
    elements.push(ui._skinsCountLine);
    ui._skinsTabElements.push(ui._skinsCountLine);

    const gridLeft = GAME_CONFIG.centerX - ((SKIN_COLS - 1) * SKIN_CELL_W) / 2;

    SKIN_IDS.forEach((skinId, index) => {
        const col = index % SKIN_COLS;
        const row = Math.floor(index / SKIN_COLS);
        const cx = gridLeft + col * SKIN_CELL_W;
        const cy = panel.skinsRow1 + row * (SKIN_CELL_H + 8);

        const frame = scene.add.rectangle(cx, cy, 46, 46, 0x263238, 0.9);
        frame.setStrokeStyle(2, 0x455A64);
        frame.setDepth(DEPTH.PANEL_FRAME);
        panelElements.push(frame);
        elements.push(frame);
        ui._skinsTabElements.push(frame);

        const preview = scene.add.sprite(cx, cy - 2, birdTextureKey(skinId), 1);
        preview.setScale(1.35);
        preview.setDepth(DEPTH.PANEL_PREVIEW);
        panelElements.push(preview);
        elements.push(preview);
        ui._skinsTabElements.push(preview);

        const skin = getSkin(skinId);
        const nameLabel = addCenteredText(
            scene, cx, cy + 24, skin.label, {
                fontSize: '9px', fill: '#CFD8DC',
                stroke: '#0d1117', strokeThickness: 2,
            }, DEPTH.PANEL_PREVIEW,
        );
        panelElements.push(nameLabel);
        elements.push(nameLabel);
        ui._skinsTabElements.push(nameLabel);

        let recordLabel = null;
        if (isSpecialSkin(skinId)) {
            recordLabel = addCenteredText(
                scene, cx, cy + 34, '', {
                    fontSize: '8px', fill: '#FFD54F',
                    stroke: '#0d1117', strokeThickness: 2,
                }, DEPTH.PANEL_PREVIEW,
            );
            panelElements.push(recordLabel);
            elements.push(recordLabel);
            ui._skinsTabElements.push(recordLabel);
        }

        const hit = scene.add.rectangle(cx, cy, MIN_TOUCH, MIN_TOUCH, 0x000000, 0);
        hit.setDepth(DEPTH.PANEL_TOP);
        hit.setInteractive({ useHandCursor: true });
        hit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            const ctx = buildMetaContext(scene);
            const unlocked = listUnlockedSkins(ctx);
            if (!unlocked.includes(skinId)) return;
            applySelectedSkin(scene, skinId);
            refreshSkinsTab(ui);
        });
        panelElements.push(hit);
        elements.push(hit);
        ui._skinsTabElements.push(hit);

        ui._skinCells.push({ skinId, frame, preview, nameLabel, recordLabel, hit });
    });

    ui._skinHint = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.skinsHint,
        'Scores · hardcore · défi du jour · entraînement · néon = collection', {
            fontSize: '10px', fill: '#78909C', fontStyle: 'italic',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(ui._skinHint);
    elements.push(ui._skinHint);
    ui._skinsTabElements.push(ui._skinHint);

    refreshSkinsTab(ui);
}

/** @param {import('./ui.js').UI} ui */
export function refreshSkinsTab(ui) {
    if (!ui._skinCells) return;
    const scene = ui.scene;
    const ctx = buildMetaContext(scene);
    const unlocked = new Set(listUnlockedSkins(ctx));
    const selected = loadSelectedSkin();

    ui._skinsCountLine?.setText(`${ctx.unlockedSkinCount}/${SKIN_IDS.length} débloqués`);

    ui._skinCells.forEach(({ skinId, frame, preview, nameLabel, recordLabel }) => {
        const isUnlocked = unlocked.has(skinId);
        const isSelected = skinId === selected;
        preview.setAlpha(isUnlocked ? 1 : 0.28);
        nameLabel.setColor(isUnlocked ? (isSelected ? '#FDD835' : '#CFD8DC') : '#546E7A');
        nameLabel.setText(isUnlocked ? getSkin(skinId).label : '???');
        frame.setStrokeStyle(2, isSelected ? 0xFDD835 : 0x455A64);
        if (!isUnlocked) {
            nameLabel.setText('???');
        }
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
