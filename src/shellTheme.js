import { getBackgroundPeriod } from './backgroundPeriod.js';
import { prefersHighContrast } from './designTokens.js';
import { getBackgroundCanvasColor } from './textures/backgroundTextures.js';

/** Aligne data-theme, contraste et theme-color (vars CSS via feuilles — pas de CSSOM). */
export function syncShellTheme(doc = document) {
    const root = doc.documentElement;
    if (!root) return;

    const period = getBackgroundPeriod();
    if (root.dataset) {
        root.dataset.theme = period;
        if (prefersHighContrast()) {
            root.dataset.contrastHigh = 'true';
        } else {
            delete root.dataset.contrastHigh;
        }
    }

    const fond = getBackgroundCanvasColor();
    const themeMetas = doc.querySelectorAll?.('meta[name="theme-color"]');
    if (themeMetas?.length) {
        for (const meta of themeMetas) {
            meta.setAttribute('content', fond);
        }
    } else {
        doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', fond);
    }
}
