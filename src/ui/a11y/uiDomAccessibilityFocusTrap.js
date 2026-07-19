import { getDocument } from './uiDomAccessibilityState.js';

/** @type {(() => void) | null} */
let escapeHandler = null;

/** @param {(() => void) | null} handler */
export function setAccessibilityEscapeHandler(handler) {
    escapeHandler = typeof handler === 'function' ? handler : null;
}

/** @returns {HTMLButtonElement[]} */
export function getVisibleA11yButtons(doc = getDocument()) {
    if (!doc) return [];
    const layer = doc.getElementById('a11y-controls');
    if (!layer) return [];
    return [...layer.querySelectorAll('button.a11y-btn')].filter((btn) => {
        if (btn.hidden) return false;
        const disabled =
            typeof btn.getAttribute === 'function'
                ? btn.getAttribute('aria-disabled')
                : btn['aria-disabled'];
        return disabled !== 'true';
    });
}

/** Focus le premier contrôle a11y visible (ouverture panneau / pause / game over). */
export function focusFirstVisibleAccessibilityControl(doc = getDocument()) {
    const buttons = getVisibleA11yButtons(doc);
    const first = buttons[0];
    if (!first || typeof first.focus !== 'function') return false;
    first.focus({ preventScroll: true, focusVisible: false });
    return true;
}

/**
 * Trap Tab + Escape dans `#a11y-controls` quand des boutons sont visibles.
 * @param {Document} [doc]
 */
export function bindAccessibilityFocusTrap(doc = getDocument()) {
    if (!doc) return;
    const layer = doc.getElementById('a11y-controls');
    if (!layer) return;
    if (!layer.dataset) layer.dataset = {};
    if (layer.dataset.focusTrapBound === '1') return;
    layer.dataset.focusTrapBound = '1';
    layer.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (getVisibleA11yButtons(doc).length === 0) return;
            event.preventDefault();
            event.stopPropagation?.();
            escapeHandler?.();
            return;
        }
        if (event.key !== 'Tab') return;
        const buttons = getVisibleA11yButtons(doc);
        if (buttons.length === 0) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const active = doc.activeElement;
        if (event.shiftKey) {
            if (active === first || !layer.contains(active)) {
                event.preventDefault();
                last.focus({ focusVisible: true });
            }
            return;
        }
        if (active === last || !layer.contains(active)) {
            event.preventDefault();
            first.focus({ focusVisible: true });
        }
    });
}
