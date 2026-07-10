import { CONTROL_DEFS } from './uiDomAccessibilityDefs.js';
import { getDocument, handlers, visibleControls } from './uiDomAccessibilityState.js';

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

/** @param {keyof typeof CONTROL_DEFS} key @param {string} label */
export function setAccessibilityControlLabel(key, label) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    const doc = getDocument();
    if (!doc) return;
    const btn = doc.getElementById(def.id);
    if (btn?.setAttribute) btn.setAttribute('aria-label', label);
}

/** @param {keyof typeof CONTROL_DEFS} key @param {boolean} pressed */
export function setAccessibilityControlPressed(key, pressed) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    const doc = getDocument();
    if (!doc) return;
    const btn = doc.getElementById(def.id);
    if (btn?.setAttribute) btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
}

/** @param {keyof typeof CONTROL_DEFS} key @param {boolean} expanded */
export function setAccessibilityControlExpanded(key, expanded) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    const doc = getDocument();
    if (!doc) return;
    const btn = doc.getElementById(def.id);
    if (btn?.setAttribute) btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

/** @param {keyof typeof CONTROL_DEFS} key @param {boolean} disabled */
export function setAccessibilityControlDisabled(key, disabled) {
    const def = CONTROL_DEFS[key];
    if (!def) return;
    const doc = getDocument();
    if (!doc) return;
    const btn = doc.getElementById(def.id);
    if (!btn) return;
    if (disabled) {
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('aria-label', `${def.label} (verrouillé)`);
        btn.disabled = true;
        btn.tabIndex = -1;
    } else {
        btn.removeAttribute('aria-disabled');
        btn.setAttribute('aria-label', def.label);
        btn.disabled = false;
        btn.tabIndex = 0;
    }
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

/** @param {import('./ui.js').UI} ui */
export function syncOptionsTabAccessibility(ui) {
    if (!ui) return;
    const tab = ui._optionsActiveTab ?? 'preferences';
    setAccessibilityControlExpanded('menuOptionsTabControls', tab === 'controls');
    setAccessibilityControlExpanded('menuOptionsTabPreferences', tab === 'preferences');
}

/** Masque tous les boutons DOM overlay (pause menu, etc.). */
export function hideAllAccessibilityControls() {
    for (const key of Object.keys(CONTROL_DEFS)) {
        setAccessibilityControlVisible(/** @type {keyof typeof CONTROL_DEFS} */ (key), false);
    }
}
