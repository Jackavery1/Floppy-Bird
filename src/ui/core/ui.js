import { DIFFICULTY } from '../../config.js';
import { loadHighScore } from '../../highScores.js';
import { bindUiFacade } from './uiFacadeBind.js';
import {
    closeAllMenuPanels as closeAllMenuPanelsImpl,
    prepareMenuRebuild as prepareMenuRebuildImpl,
} from '../menu/uiMenu.js';
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
