import { getBackgroundPeriod } from './backgroundPeriod.js';
import { DESIGN_TOKENS, prefersHighContrast } from './designTokens.js';
import { SPACING } from './uiLayoutConstants.js';
import { getBackgroundCanvasColor } from './textures/backgroundTextures.js';

import { SHELL_HIGH_CONTRAST_CSS_VARS } from './shellTokenDefaults.js';

const CONTRAST_CSS_VARS = SHELL_HIGH_CONTRAST_CSS_VARS;

const CSS_VARS = Object.freeze({
    '--couleur-fond': () => getBackgroundCanvasColor(),
    '--couleur-texte-chargement': () => DESIGN_TOKENS.texteChargement,
    '--couleur-texte-hint': () => DESIGN_TOKENS.texteHint,
    '--couleur-accent': () => DESIGN_TOKENS.accent,
    '--police-interface': () => DESIGN_TOKENS.policeInterface,
    '--police-titre': () => DESIGN_TOKENS.policeTitre,
    '--spacing-xs': () => `${SPACING.xs}px`,
    '--spacing-sm': () => `${SPACING.sm}px`,
    '--spacing-md': () => `${SPACING.md}px`,
    '--spacing-lg': () => `${SPACING.lg}px`,
    '--spacing-xl': () => `${SPACING.xl}px`,
});

/** Aligne fond letterbox, theme-color et variables CSS sur la période jour/nuit. */
export function syncShellTheme(doc = document) {
    const root = doc.documentElement;
    if (!root?.style) return;

    for (const [name, resolve] of Object.entries(CSS_VARS)) {
        root.style.setProperty(name, resolve());
    }

    const period = getBackgroundPeriod();
    if (root.dataset) {
        root.dataset.theme = period;
    }
    root.style.colorScheme = period === 'day' ? 'light' : 'dark';

    if (prefersHighContrast()) {
        for (const [name, value] of Object.entries(CONTRAST_CSS_VARS)) {
            root.style.setProperty(name, value);
        }
        if (root.dataset) {
            root.dataset.contrastHigh = 'true';
        }
    } else if (root.dataset) {
        delete root.dataset.contrastHigh;
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
    if (doc.body?.style) {
        doc.body.style.background = fond;
    }
}
