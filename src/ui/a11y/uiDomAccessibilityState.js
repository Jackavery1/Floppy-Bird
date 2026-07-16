/** @type {Record<string, () => void>} */
export const handlers = {};

/** @type {Record<string, () => void>} */
export const focusHandlers = {};

/** @type {Record<string, () => void>} */
export const blurHandlers = {};

/** @type {Set<string>} */
export const visibleControls = new Set();

export function getDocument() {
    return typeof document !== 'undefined' ? document : null;
}
