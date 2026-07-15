import Phaser from 'phaser';
import { preloadTexturesEssential } from './textures/index.js';
import { initSceneCore } from './sceneContext.js';
import { setupSceneWorld } from './sceneSetup.js';
import { updateSceneFrame } from './sceneTick.js';
import { cancelPipeSpawnTimer, clearSpawnInvincibility } from './sceneRound.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        initSceneCore(this);
    }

    create() {
        preloadTexturesEssential(this);
        import('./textures/decorPreload.js').then(({ preloadDecorTextures }) => {
            preloadDecorTextures(this);
            setupSceneWorld(this);
        });
    }

    update() {
        updateSceneFrame(this);
    }

    shutdown() {
        cancelPipeSpawnTimer(this);
        clearSpawnInvincibility(this);
        if (this.ghost) this.ghost.destroy();
        if (this.bird) this.bird.destroy();
        if (this.pipes) this.pipes.destroy();
        if (this.scoreEffects) this.scoreEffects.destroy();
        if (this.ui) this.ui.destroy();
    }
}
