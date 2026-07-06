/** @type {Record<string, () => void>} */
export const handlers = {};

/** @type {Set<string>} */
export const visibleControls = new Set();

export function getDocument() {
    return typeof document !== 'undefined' ? document : null;
}
