/**
 * Tokens visuels partagés entre le shell HTML (`style.css`) et l’UI Phaser.
 * Les variables CSS `:root` sont synchronisées via {@link syncShellTheme}.
 */
export const DESIGN_TOKENS = Object.freeze({
    fondNuit: '#1a1a2e',
    fondJour: '#87ceeb',
    texteChargement: '#90caf9',
    texteHint: '#ffffff',
    accent: '#fdd835',
    accentGap: '#FFCC80',
    texteHud: '#ffffff',
    contourHud: '#000000',
    texteSecondaire: '#78909C',
    badgeDaily: '#CE93D8',
    badgeDailySecondary: '#B39DDB',
    badgeTraining: '#81D4FA',
    badgeHardcore: '#FF8A80',
    bannerEscalation: '#FF8A65',
    bannerStreak: '#FFAB40',
    bannerSuccess: '#81C784',
    bannerCoyote: '#FFEEAA',
    texteMenu: '#ffffff',
    texteHintMenu: '#B0BEC5',
    contourMenu: '#0d1117',
    accentTitre: '#FDD835',
    accentTitreContour: '#E65100',
    accentTitreOmbre: '#BF360C',
    badgeDailyContour: '#4A148C',
    texteClair: '#ECEFF1',
    texteSkinLabel: '#CFD8DC',
    texteVerrouille: '#546E7A',
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
    boutonOptionsStroke: '#42a5f5',
    policeInterface: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    policeTitre: '"Press Start 2P", "Courier New", monospace',
});

/** Style Phaser texte HUD (contour noir systématique). */
export function hudTextStyle(overrides = {}) {
    return {
        stroke: DESIGN_TOKENS.contourHud,
        strokeThickness: 2,
        ...overrides,
    };
}

/** Style Phaser texte menu / panneau (contour sombre). */
export function menuTextStyle(overrides = {}) {
    return {
        stroke: DESIGN_TOKENS.contourMenu,
        strokeThickness: 2,
        ...overrides,
    };
}

/** @param {string} hex Ex. `#fdd835` */
export function hexVersPhaser(hex) {
    return Number.parseInt(hex.replace('#', ''), 16);
}

/** Couleurs Phaser des médailles game over (or / argent / bronze). */
export const MEDAILLE_COLORS_PHASER = Object.freeze({
    gold: hexVersPhaser(DESIGN_TOKENS.medailleOr),
    silver: hexVersPhaser(DESIGN_TOKENS.medailleArgent),
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
