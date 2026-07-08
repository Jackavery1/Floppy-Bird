/**
 * Tokens visuels partagés entre le shell HTML (`style.css`) et l’UI Phaser.
 * Les variables CSS `:root` sont synchronisées via {@link syncShellTheme}.
 *
 * Matrice typo (Phaser + shell) :
 * | Rôle              | Taille   | Police              | Style helper           |
 * |-------------------|----------|---------------------|------------------------|
 * | Titre jeu / chrome| 12 px min| Press Start 2P      | panelChromeTextStyle   |
 * | HUD / menu corps  | 12 px    | Segoe UI (shell)    | menuHomeTextStyle      |
 * | Hints gameplay    | 13–14 px | Segoe UI            | hudTextStyle           |
 * | Bannières HUD     | 11 px    | Segoe UI            | hudTextStyle           |
 * | Grille skins      | 11 px    | Segoe UI            | menuTextStyle          |
 * | Chargement shell  | 14–16 px | policeInterface     | CSS `#loading`         |
 */
export const DESIGN_TOKENS = Object.freeze({
    fondNuit: '#1a1a2e',
    fondJour: '#87ceeb',
    texteChargement: '#90caf9',
    texteHint: '#ffffff',
    accent: '#fdd835',
    accentGap: '#FFCC80',
    flashPlafond: '#b3e5fc',
    texteHud: '#ffffff',
    contourHud: '#000000',
    texteSecondaire: '#B0BEC5',
    badgeDaily: '#CE93D8',
    badgeDailySecondary: '#B39DDB',
    badgeTraining: '#81D4FA',
    badgeHardcore: '#FF8A80',
    bannerEscalation: '#FF8A65',
    bannerStreak: '#FFAB40',
    bannerSuccess: '#81C784',
    bannerCoyote: '#FFEEAA',
    texteMenu: '#ffffff',
    texteHintMenu: '#ECEFF1',
    contourMenu: '#0d1117',
    accentTitre: '#FDD835',
    accentTitreContour: '#E65100',
    accentTitreOmbre: '#BF360C',
    badgeDailyContour: '#4A148C',
    texteClair: '#ECEFF1',
    texteSkinLabel: '#CFD8DC',
    texteVerrouille: '#90A4AE',
    accentScoreHardcore: '#FFAB91',
    contourOptions: '#0D47A1',
    contourSkins: '#004D40',
    texteGameOver: '#FF1744',
    contourGameOver: '#8B0000',
    texteMuted: '#cccccc',
    texteHintFaible: '#aaaaaa',
    accentLeaderboardNew: '#ffff00',
    texteLeaderboard: '#90CAF9',
    boutonPause: '#37474f',
    boutonPauseHover: '#546e7a',
    boutonMenu: '#1565c0',
    boutonMenuHover: '#42a5f5',
    medailleOr: '#ffd700',
    medailleArgent: '#9e9e9e',
    medailleBronze: '#cd7f32',
    confettiRose: '#ff6f91',
    confettiBleu: '#64b5f6',
    fondPanneauGameOver: '#141e30',
    liseréGameOver: '#ffd700',
    cadreSkinFond: '#263238',
    cadreSkinContour: '#455a64',
    boutonDaily: '#6a1b9a',
    boutonDailyHover: '#9c27b0',
    boutonSkins: '#00897b',
    boutonSkinsStroke: '#4db6ac',
    boutonScores: '#5e35b1',
    boutonScoresHover: '#7e57c2',
    boutonScoresStroke: '#b39ddb',
    boutonOptionsStroke: '#42a5f5',
    toggleTrainingInner: '#e3f2fd',
    toggleHardcoreOn: '#e53935',
    toggleHardcoreInner: '#ffcdd2',
    policeInterface: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    policeTitre: '"Press Start 2P", "Courier New", monospace',
});

/** Contraste renforcé OS (`prefers-contrast: more`) — aligné sur `style.css`. */
export function prefersHighContrast() {
    if (typeof matchMedia === 'undefined') return false;
    return matchMedia('(prefers-contrast: more)').matches;
}

function epaisseurContourHud() {
    return prefersHighContrast() ? 3 : 2;
}

/** Style Phaser texte HUD (contour noir systématique). */
export function hudTextStyle(overrides = {}) {
    return {
        stroke: DESIGN_TOKENS.contourHud,
        strokeThickness: epaisseurContourHud(),
        ...overrides,
    };
}

/** Style Phaser texte menu / panneau (contour sombre). */
export function menuTextStyle(overrides = {}) {
    return {
        stroke: DESIGN_TOKENS.contourMenu,
        strokeThickness: epaisseurContourHud(),
        ...overrides,
    };
}

/** Boutons et onglets de panneau — police pixel rétro (Press Start 2P), min 12 px. */
export function panelChromeTextStyle(overrides = {}) {
    return menuTextStyle({
        fontFamily: DESIGN_TOKENS.policeTitre,
        fontSize: '12px',
        ...overrides,
    });
}

/** Texte lisible de l'écran d'accueil (hors titre du jeu). */
export function menuHomeTextStyle(overrides = {}) {
    return hudTextStyle({
        fontSize: '12px',
        fill: DESIGN_TOKENS.texteMenu,
        fontStyle: 'bold',
        ...overrides,
    });
}

/** @param {string} hex Ex. `#fdd835` */
export function hexVersPhaser(hex) {
    return Number.parseInt(hex.replace('#', ''), 16);
}

/** Couleurs Phaser des médailles game over (or / argent / bronze). */
export const MEDAILLE_COLORS_PHASER = Object.freeze({
    or: hexVersPhaser(DESIGN_TOKENS.medailleOr),
    argent: hexVersPhaser(DESIGN_TOKENS.medailleArgent),
    bronze: hexVersPhaser(DESIGN_TOKENS.medailleBronze),
});

/** Palette confettis (nouveau record). */
export const CONFETTI_COLORS_PHASER = Object.freeze([
    hexVersPhaser(DESIGN_TOKENS.medailleOr),
    hexVersPhaser(DESIGN_TOKENS.confettiRose),
    hexVersPhaser(DESIGN_TOKENS.confettiBleu),
    hexVersPhaser(DESIGN_TOKENS.bannerSuccess),
    hexVersPhaser(DESIGN_TOKENS.texteHud),
]);
