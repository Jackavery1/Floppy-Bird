import { GAME_CONFIG } from './config.js';
import { CONTROL_DEFS } from './uiDomAccessibilityDefs.js';
import { announceAccessibility } from './uiDomAccessibilityControls.js';
import {
    blurHandlers,
    focusHandlers,
    getDocument,
    handlers,
    visibleControls,
} from './uiDomAccessibilityState.js';

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
        btn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handlers[def.id]?.();
            }
        });
        btn.addEventListener('focus', () => {
            announceAccessibility(def.label, doc);
            focusHandlers[def.id]?.();
        });
        btn.addEventListener('blur', () => {
            blurHandlers[def.id]?.();
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
