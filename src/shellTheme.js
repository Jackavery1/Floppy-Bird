import { DESIGN_TOKENS } from './designTokens.js';
import { getBackgroundCanvasColor } from './textures/backgroundTextures.js';

const CSS_VARS = Object.freeze({
    '--couleur-fond': () => getBackgroundCanvasColor(),
    '--couleur-texte-chargement': () => DESIGN_TOKENS.texteChargement,
    '--couleur-texte-hint': () => DESIGN_TOKENS.texteHint,
    '--couleur-accent': () => DESIGN_TOKENS.accent,
    '--police-interface': () => DESIGN_TOKENS.policeInterface,
    '--police-titre': () => DESIGN_TOKENS.policeTitre,
});

/** Aligne fond letterbox, theme-color et variables CSS sur la période jour/nuit. */
export function syncShellTheme(doc = document) {
    const root = doc.documentElement;
    if (!root?.style) return;

    for (const [name, resolve] of Object.entries(CSS_VARS)) {
        root.style.setProperty(name, resolve());
    }

    const fond = getBackgroundCanvasColor();
    doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', fond);
    if (doc.body?.style) {
        doc.body.style.background = fond;
    }
}
