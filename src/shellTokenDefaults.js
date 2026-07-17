import { DESIGN_TOKENS } from './designTokens.js';
import { SPACING } from './ui/shared/uiLayoutConstants.js';

/** Fallbacks statiques du shell — doivent rester alignés avec public/shell-tokens.css */
export const SHELL_TOKEN_CSS_FALLBACKS = Object.freeze({
    '--couleur-fond': DESIGN_TOKENS.fondNuit,
    '--couleur-texte-chargement': DESIGN_TOKENS.texteChargement,
    '--couleur-texte-hint': DESIGN_TOKENS.texteHint,
    '--couleur-accent': DESIGN_TOKENS.accent,
    '--couleur-alerte': DESIGN_TOKENS.alerteErreurFond,
    '--couleur-alerte-texte': DESIGN_TOKENS.alerteErreurTexte,
    '--police-interface': DESIGN_TOKENS.policeInterface,
    '--police-titre': DESIGN_TOKENS.policeTitre,
    '--spacing-xs': `${SPACING.xs}px`,
    '--spacing-sm': `${SPACING.sm}px`,
    '--spacing-md': `${SPACING.md}px`,
    '--spacing-lg': `${SPACING.lg}px`,
    '--spacing-xl': `${SPACING.xl}px`,
});

/** Overrides `prefers-contrast: more` — alignés avec shellTheme.js */
export const SHELL_HIGH_CONTRAST_CSS_VARS = Object.freeze({
    '--couleur-texte-chargement': DESIGN_TOKENS.texteChargementContraste,
    '--couleur-texte-hint': DESIGN_TOKENS.texteHint,
    '--couleur-accent': DESIGN_TOKENS.accentHover,
});
