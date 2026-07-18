import { GAME_CONFIG, DIFFICULTY } from '../../config.js';
import { Utils } from '../../utils.js';
import { loadHighScore } from '../../highScores.js';
import { bindUiFacade } from './uiFacadeBind.js';
import {
    closeAllMenuPanels as closeAllMenuPanelsImpl,
    prepareMenuRebuild as prepareMenuRebuildImpl,
} from '../menu/uiMenu.js';
import {
    DEPTH,
    GAME_OVER_RESTART_BTN_COLOR,
    GAME_OVER_RESTART_BTN_WIDTH,
    GAME_OVER_RESTART_BTN_HEIGHT,
    MENU_BTN_COLOR,
    UI_LAYOUT,
} from '../shared/uiLayout.js';
import { destroyInGameControls } from '../hud/uiHud.js';

export class UI {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this._scoreTextShadow = null;
        this.scoreValue = 0;
        this.highScore = loadHighScore(DIFFICULTY.NORMAL);

        this._diffBtnGraphics = null;
        this._diffBtnLabels = [];
        this._currentDifficulty = DIFFICULTY.NORMAL;
        this._menuBtnGraphics = null;
        this._pauseBtnGraphics = null;
        this._trainingBadge = null;
        this._hoveredDifficulty = null;
        this._focusedDifficulty = null;
        this._trainingLabel = null;
        this._hardcoreLabel = null;
        this._tutorialHint = null;
        this._inGameControlElements = [];
        this._overlays = { menu: [], pause: [], gameOver: [] };
    }

    /** @param {{ force?: boolean }} [opts] */
    closeAllMenuPanels(opts) {
        return closeAllMenuPanelsImpl(this, opts);
    }

    prepareMenuRebuild() {
        return prepareMenuRebuildImpl(this);
    }

    /** @param {'menu' | 'pause' | 'gameOver'} key */
    clearOverlay(key) {
        Utils.clearElements(this._overlays[key]);
    }

    /** @param {'menu' | 'pause' | 'gameOver'} key @param {import('phaser').GameObjects.GameObject[]} elements */
    setOverlay(key, elements) {
        this.clearOverlay(key);
        this._overlays[key].push(...elements);
    }

    createOverlay(alpha = 0.7, depth = DEPTH.OVERLAY_DIM, color = 0x000000) {
        return this.scene.add
            .rectangle(
                GAME_CONFIG.centerX,
                GAME_CONFIG.centerY,
                GAME_CONFIG.width,
                GAME_CONFIG.height,
                color,
                alpha
            )
            .setDepth(depth);
    }

    drawGameOverRestartButton(restartBtnY, fillColor = GAME_OVER_RESTART_BTN_COLOR) {
        const g = this._restartBtnGraphics;
        if (!g) return;
        g.clear();
        g.fillStyle(fillColor, 1);
        g.fillRoundedRect(
            GAME_CONFIG.centerX - GAME_OVER_RESTART_BTN_WIDTH / 2,
            restartBtnY - GAME_OVER_RESTART_BTN_HEIGHT / 2,
            GAME_OVER_RESTART_BTN_WIDTH,
            GAME_OVER_RESTART_BTN_HEIGHT,
            UI_LAYOUT.menuBtn.radius
        );
    }

    drawGameOverMenuButton(menuBtnY, fillColor = MENU_BTN_COLOR) {
        const { menuBtn } = UI_LAYOUT;
        const g = this._menuBtnGraphics;
        if (!g) return;
        g.clear();
        g.fillStyle(fillColor, 1);
        g.fillRoundedRect(
            GAME_CONFIG.centerX - menuBtn.width / 2,
            menuBtnY - menuBtn.height / 2,
            menuBtn.width,
            menuBtn.height,
            menuBtn.radius
        );
    }

    destroy() {
        if (this.scoreText) this.scoreText.destroy();
        if (this._scoreTextShadow) this._scoreTextShadow.destroy();
        this._scoreTextShadow = null;
        destroyInGameControls(this);
        this.clearOverlay('menu');
        this.clearOverlay('pause');
        this.clearOverlay('gameOver');
        if (this._diffBtnGraphics) this._diffBtnGraphics.destroy();
        if (this._menuBtnGraphics) this._menuBtnGraphics.destroy();
        if (this._restartBtnGraphics) this._restartBtnGraphics.destroy();
        this._restartBtnGraphics = null;
        this._restartBtnText = null;
        this._diffBtnLabels = [];
    }
}

bindUiFacade(UI);
