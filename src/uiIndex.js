/**
 * Carte des modules UI — point d’entrée façade (utilisé par sceneSetup).
 * Les sous-modules restent importables directement pour limiter le graphe.
 * @module uiIndex
 *
 * Carte (1 ligne / module) :
 * - ui.js — façade principale Phaser (classe UI)
 * - uiIndex.js — ce barrel / carte des exports publics
 * - uiDepth.js — constantes z-order DEPTH
 * - uiLayout.js — layout, texte centré, couleurs boutons, TOUCH_TARGETS
 * - uiLayoutConstants.js — constantes panel game over, polices FONT / FONT_TITLE
 * - uiText.js — styles texte Phaser (titres, labels, boutons)
 * - uiToggleIcons.js — icônes entraînement / hardcore dans le menu options
 * - uiHud.js — barrel HUD (score, contrôles, feedback)
 * - uiHudScore.js — affichage score en jeu
 * - uiHudControls.js — bouton pause et badges mode
 * - uiHudFeedback.js — barrel bannières + tutoriels HUD
 * - uiHudBanners.js — bannières transitoires (record, série, coyote…)
 * - uiHudTutorial.js — hints tutoriel pulsants (saut, gap, hardcore)
 * - uiMenu.js — menu principal et orchestration panneaux
 * - uiMenuBuild.js — assemblage des éléments menu
 * - uiMenuLayout.js — géométrie panneaux menu
 * - uiMenuHeader.js — titre et sélecteur difficulté
 * - uiMenuPanel.js — utilitaires panneau générique (toggle, visibilité)
 * - uiMenuDailyChallenge.js — bouton défi du jour
 * - uiMenuOptions.js — panneau options (toggle, fermeture)
 * - uiMenuOptionsContent.js — contenu texte du panneau options
 * - uiMenuOptionsLabels.js — libellés entraînement / hardcore
 * - uiMenuOptionsModes.js — toggles entraînement et hardcore
 * - uiMenuOptionsMute.js — contrôle volume / mute
 * - uiMenuScores.js — contenu liste scores
 * - uiMenuScoresPanel.js — panneau scores (toggle)
 * - uiMenuSkins.js — grille sélection skins
 * - uiMenuSkinsPanel.js — panneau skins (toggle)
 * - uiPause.js — overlay pause
 * - uiGameOver.js — assemblage écran game over
 * - uiGameOverPanel.js — coque panneau doré game over
 * - uiGameOverSummary.js — résumé score / record
 * - uiGameOverActions.js — boutons rejouer / menu
 * - uiGameOverDecor.js — décorations plaque game over
 * - uiGameOverLeaderboard.js — mini-classement local
 * - uiAchievementToast.js — toasts trophées débloqués
 */

/** Façade principale Phaser */
export { UI } from './ui.js';

/** Profondeur z-order et layout */
export { DEPTH } from './uiDepth.js';
export { UI_LAYOUT, MIN_TOUCH, addCenteredText, TOUCH_TARGETS } from './uiLayout.js';

/** Menu principal et panneaux */
export { showMenu, updateDifficultyButtons, refreshHighScore } from './uiMenu.js';
export { buildMenuHeader, buildMenuDifficulty } from './uiMenuHeader.js';
export { buildMenuDailyChallenge, refreshDailyChallengeButton } from './uiMenuDailyChallenge.js';
export { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';
export { toggleMenuOptions, applyTrainingLabel, applyHardcoreLabel } from './uiMenuOptions.js';
export { toggleMenuScores } from './uiMenuScoresPanel.js';
export { toggleMenuSkins } from './uiMenuSkinsPanel.js';
export { buildMenuToggleButton } from './uiMenuPanel.js';

/** HUD en jeu */
export { createScoreDisplay, updateScore, showInGameScore } from './uiHudScore.js';
export {
    showRecordBroken,
    showDailyGoalReached,
    showDifficultyEscalation,
    showScoreStreak,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
} from './uiHudFeedback.js';
export { createInGameControls } from './uiHudControls.js';

/** Pause et game over */
export { showPause } from './uiPause.js';
export { buildGameOverUI } from './uiGameOver.js';
export { buildGameOverShell } from './uiGameOverPanel.js';
export { buildGameOverSummary } from './uiGameOverSummary.js';
export { buildGameOverActions, animateGameOverReveal } from './uiGameOverActions.js';
export { showAchievementToasts } from './uiAchievementToast.js';
