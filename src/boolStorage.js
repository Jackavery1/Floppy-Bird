/** Lecture / écriture de drapeaux booléens `localStorage` (`'1'` / `'0'`). */
export function loadBoolFlag(key) {
    try {
        return localStorage.getItem(key) === '1';
    } catch {
        return false;
    }
}

/** @param {string} key @param {boolean} enabled */
export function saveBoolFlag(key, enabled) {
    try {
        localStorage.setItem(key, enabled ? '1' : '0');
    } catch {
        /* quota localStorage */
    }
}
