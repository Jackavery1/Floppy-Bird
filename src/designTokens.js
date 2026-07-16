/**
 * Tokens visuels partagés entre le shell HTML (`style.css`) et l'UI Phaser.
 * Les variables CSS `:root` sont synchronisées via {@link syncShellTheme}.
 *
 * Matrice typo (Phaser + shell) :
 * | Rôle              | Taille   | Police              | Style helper           |
 * |-------------------|----------|---------------------|------------------------|
 * | Titre jeu / chrome| 14 px    | Press Start 2P      | panelChromeTextStyle / FONT_SIZE_CHROME |
 * | HUD / menu corps  | 12 px    | Segoe UI (shell)    | menuHomeTextStyle / FONT_SIZE_BODY |
 * | Hints gameplay    | 13–14 px | Segoe UI            | hudTextStyle / FONT_SIZE_HINT–CHROME |
 * | Bannières HUD     | 14–16 px | Segoe UI            | FONT_SIZE_CHROME / BANNER / EMPHASIS |
 * | Grille skins      | 11–13 px | Segoe UI            | FONT_SIZE_TINY–COMPACT |
 * | Chargement shell  | 14–16 px | policeInterface     | CSS `#loading`         |
 */
import { getBackgroundPeriod } from './backgroundPeriod.js';

export const DESIGN_TOKENS = Object.freeze({
    fondNuit: '#1a1a2e',
    fondJour: '#87ceeb',
    texteChargement: '#90caf9',
    /** Texte chargement shell sur ciel jour (AA sur fondJour). */
    texteChargementJour: '#0d47a1',
    texteHint: '#ffffff',
    accent: '#fdd835',
    /** Hover CTA jaune (REJOUER) — plus clair que `accent` / `accentTitre`. */
    accentHover: '#ffeb3b',
    accentGap: '#FFCC80',
    flashPlafond: '#b3e5fc',
    texteHud: '#ffffff',
    /** Fill HUD score/hints sur ciel jour — contraste fill seul (stroke reste noir). */
    texteHudJour: '#0d1117',
    contourHud: '#000000',
    texteSecondaire: '#B0BEC5',
    badgeDaily: '#CE93D8',
    badgeDailySecondary: '#B39DDB',
    badgeTraining: '#81D4FA',
    badgeHardcore: '#FF8A80',
    bannerEscalation: '#FF8A65',
    bannerStreak: '#FFAB40',
    bannerSuccess: '#81C784',
    /** Teinte sprite oiseau pendant coyote time. */
    teinteCoyoteActif: '#FFD54F',
    texteMenu: '#ffffff',
    texteHintMenu: '#ECEFF1',
    contourMenu: '#0d1117',
    /** Texte sur fond accent jaune (difficulté active, REJOUER). */
    texteBoutonJaune: '#0d1117',
    difficulteFacile: '#88ff88',
    difficulteNormal: '#ffff00',
    difficulteDifficile: '#ff8888',
    accentTitre: '#FDD835',
    /** Score HUD en jour — ambre plus sombre sur ciel clair (AA via contour + fill). */
    accentTitreJour: '#F9A825',
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
    boutonSkinsHover: '#26a69a',
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
    const base = prefersHighContrast() ? 3 : 2;
    if (getBackgroundPeriod() === 'day') return Math.max(base, 4);
    return base;
}

function ombreHudJour() {
    if (getBackgroundPeriod() !== 'day') return null;
    return {
        offsetX: 0,
        offsetY: 1,
        color: DESIGN_TOKENS.contourHud,
        blur: 3,
        stroke: true,
        fill: false,
    };
}

function assombrirHex(hex, facteur = 0.82) {
    const n = Number.parseInt(hex.replace('#', ''), 16);
    const r = Math.floor(((n >> 16) & 0xff) * facteur);
    const g = Math.floor(((n >> 8) & 0xff) * facteur);
    const b = Math.floor((n & 0xff) * facteur);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Fill bannière HUD — assombri en mode jour pour le contraste sur ciel clair. */
export function hudBannerFill(tokenKey) {
    const fill = DESIGN_TOKENS[tokenKey];
    if (getBackgroundPeriod() === 'day') return assombrirHex(fill);
    return fill;
}

/** Style Phaser texte HUD (contour noir systématique). */
export function hudTextStyle(overrides = {}) {
    const day = getBackgroundPeriod() === 'day';
    const defaultFill = day ? DESIGN_TOKENS.texteHudJour : DESIGN_TOKENS.texteHud;
    const rawFill = overrides.fill;
    const needsDayRemap =
        rawFill == null ||
        rawFill === DESIGN_TOKENS.texteHud ||
        rawFill === DESIGN_TOKENS.texteMenu ||
        rawFill === DESIGN_TOKENS.texteHint;
    const fill = needsDayRemap
        ? day
            ? DESIGN_TOKENS.texteHudJour
            : (rawFill ?? defaultFill)
        : rawFill;
    const style = {
        stroke: DESIGN_TOKENS.contourHud,
        strokeThickness: epaisseurContourHud(),
        ...overrides,
        fill,
    };
    const shadow = ombreHudJour();
    if (shadow) style.shadow = shadow;
    return style;
}

/** Style Phaser texte menu / panneau (contour sombre). */
export function menuTextStyle(overrides = {}) {
    return {
        stroke: DESIGN_TOKENS.contourMenu,
        strokeThickness: epaisseurContourHud(),
        ...overrides,
    };
}

/** Boutons et onglets de panneau — police pixel rétro (Press Start 2P), défaut 14 px (`FONT_SIZE_CHROME`). */
export function panelChromeTextStyle(overrides = {}) {
    return menuTextStyle({
        fontFamily: DESIGN_TOKENS.policeTitre,
        fontSize: '14px',
        ...overrides,
    });
}

/** Texte lisible sur bouton jaune (difficulté active, rejouer) — 14 px (`FONT_SIZE_CHROME`). */
export function yellowChromeButtonTextStyle(overrides = {}) {
    return {
        fontFamily: DESIGN_TOKENS.policeTitre,
        fontSize: '14px',
        fill: DESIGN_TOKENS.texteBoutonJaune,
        fontStyle: 'bold',
        ...overrides,
    };
}

/** Texte lisible de l'écran d'accueil (hors titre du jeu). */
export function menuHomeTextStyle(overrides = {}) {
    return hudTextStyle({
        fontSize: '13px',
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

/** Glyphes affichés avec Press Start 2P (chrome panneaux, titres, pause). */
export const GLYPHES_TITRE_UI = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    ' .,·:;!?\'"()[]{}+-=*/%#@&_',
    '◂▸▾★—…',
    'éèêëàâäùûüôöîïçœ',
    'ÉÈÊËÀÂÄÙÛÜÔÖÎÏÇŒ',
].join('');
