import { DIFFICULTY, GAME_CONFIG } from './config.js';
import {
    CONTROL_DEFS,
    MENU_CONTROL_KEYS,
    OPTIONS_CONTROL_KEYS,
    SKINS_PANEL_CONTROL_KEYS,
} from './uiDomAccessibilityDefs.js';

/** @type {Record<string, () => void>} */
const handlers = {};

/** @type {Set<string>} */
const visibleControls = new Set();

function getDocument() {
    return typeof document !== 'undefined' ? document : null;
}

function scaledSize(def, scaleX, scaleY) {
    const baseW = def.width ?? def.size ?? 44;
    const baseH = def.height ?? def.size ?? 44;
    const scale = Math.min(scaleX, scaleY);
    return {
        width: Math.max(baseW, baseW * scale),
        height: Math.max(baseH, baseH * scale),
    };
}

/** @param {Document} doc */
export function initAccessibilityLayer(doc = getDocument()) {
    if (!doc || doc.getElementById('a11y-controls')) return;

    const layer = doc.createElement('div');
    layer.id = 'a11y-controls';
    layer.setAttribute('aria-label', 'Contrôles du jeu');

    for (const def of Object.values(CONTROL_DEFS)) {
        const btn = doc.createElement('button');
        btn.type = 'button';
        btn.id = def.id;
        btn.className = 'a11y-btn';
        btn.setAttribute('aria-label', def.label);
        btn.hidden = true;
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            handlers[def.id]?.();
        });
        layer.appendChild(btn);
    }

    if (!doc.getElementById('ui-announcer')) {
        const announcer = doc.createElement('div');
        announcer.id = 'ui-announcer';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'visually-hidden';
        doc.body.appendChild(announcer);
    }

    doc.body.appendChild(layer);
}

/** @param {keyof typeof CONTROL_DEFS} key @param {() => void} handler */
export function bindAccessibilityAction(key, handler) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    handlers[def.id] = handler;
}

/** @param {keyof typeof CONTROL_DEFS} key @param {boolean} visible */
export function setAccessibilityControlVisible(key, visible) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    if (visible) visibleControls.add(def.id);
    else visibleControls.delete(def.id);
    const doc = getDocument();
    if (!doc) return;
    const btn = doc.getElementById(def.id);
    if (btn) btn.hidden = !visible;
}

/** @param {import('phaser').Game} game */
export function syncAccessibilityLayer(game) {
    const doc = getDocument();
    const canvas = game?.canvas;
    if (!doc || !canvas || typeof canvas.getBoundingClientRect !== 'function') return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const scaleX = rect.width / GAME_CONFIG.width;
    const scaleY = rect.height / GAME_CONFIG.height;

    for (const def of Object.values(CONTROL_DEFS)) {
        const btn = doc.getElementById(def.id);
        if (!btn) continue;
        const visible = visibleControls.has(def.id);
        btn.hidden = !visible;
        if (!visible) continue;

        const { width, height } = scaledSize(def, scaleX, scaleY);
        const screenX = rect.left + def.x * scaleX;
        const screenY = rect.top + def.y * scaleY;
        btn.style.width = `${width}px`;
        btn.style.height = `${height}px`;
        btn.style.left = `${screenX - width / 2}px`;
        btn.style.top = `${screenY - height / 2}px`;
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function setupMenuAccessibility(scene) {
    bindAccessibilityAction('menuStart', () => scene.handlePrimaryAction());
    bindAccessibilityAction('menuDaily', () => scene.launchDailyChallenge());
    bindAccessibilityAction('menuScores', () => scene.ui.toggleMenuScoresPanel());
    bindAccessibilityAction('menuOptions', () => scene.ui.toggleMenuOptionsPanel());
    bindAccessibilityAction('menuSkins', () => scene.ui.toggleMenuSkinsPanel());
    bindAccessibilityAction('menuDiffEasy', () => scene.changeDifficulty(DIFFICULTY.EASY));
    bindAccessibilityAction('menuDiffNormal', () => scene.changeDifficulty(DIFFICULTY.NORMAL));
    bindAccessibilityAction('menuDiffHard', () => scene.changeDifficulty(DIFFICULTY.HARD));
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), true);
    }
    syncAccessibilityLayer(scene.game);
}

function hideSubPanelControls() {
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setScoresPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof typeof CONTROL_DEFS} */ (key),
            open ? key === 'menuScores' : true
        );
    }
    hideSubPanelControls();
    syncAccessibilityLayer(scene.game);
    if (open) announceAccessibility('Panneau scores ouvert');
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setSkinsPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof typeof CONTROL_DEFS} */ (key),
            open ? key === 'menuSkins' : true
        );
    }
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), open);
    }
    syncAccessibilityLayer(scene.game);
    if (open) announceAccessibility('Panneau skins ouvert');
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindSkinsAccessibility(scene) {
    bindAccessibilityAction('menuSkinsPrev', () => scene.ui.cycleMenuSkin(-1));
    bindAccessibilityAction('menuSkinsNext', () => scene.ui.cycleMenuSkin(1));
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setOptionsPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), !open);
    }
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), open);
    }
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
    syncAccessibilityLayer(scene.game);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindOptionsAccessibility(scene) {
    bindAccessibilityAction('menuTraining', () => scene.toggleTraining());
    bindAccessibilityAction('menuHardcore', () => scene.toggleHardcore());
}

/** @param {string} message @param {Document} [doc] */
export function announceAccessibility(message, doc = getDocument()) {
    if (!doc) return;
    const el = doc.getElementById('ui-announcer');
    if (!el) return;
    el.textContent = '';
    const apply = () => {
        el.textContent = message;
    };
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(apply);
    } else {
        apply();
    }
}

/** Masque tous les boutons DOM overlay (pause menu, etc.). */
export function hideAllAccessibilityControls() {
    for (const key of Object.keys(CONTROL_DEFS)) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
}
