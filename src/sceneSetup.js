import { GAME_CONFIG } from './config.js';
import { initClouds, initCelestial, createHills, createGround } from './sceneBackground.js';
import { setupSceneInput } from './sceneInput.js';
import { syncShellTheme } from './shellTheme.js';
import { Bird } from './bird.js';
import { Pipes } from './pipes.js';
import { UI } from './uiIndex.js';
import { ScoreEffects } from './scoreEffects.js';
import { GhostReplay } from './training.js';
import { warnFileProtocol, primeAudio, applyTrainingTimeScale } from './sceneBootstrap.js';
import { showMenu } from './sceneFlow.js';
import { resumeAudio } from './audio.js';
import { createBirdAnimations, ensurePipeTextures } from './textures/index.js';
import { loadSelectedSkin } from './metaStorage.js';
import { wireSceneBindings } from './sceneBindings.js';
import { DEPTH } from './uiDepth.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function setupSceneWorld(scene) {
    warnFileProtocol();
    primeAudio(scene, resumeAudio);
    setupSceneInput(scene);

    const bg = scene.add.sprite(GAME_CONFIG.centerX, GAME_CONFIG.centerY, 'background');
    bg.setDisplaySize(GAME_CONFIG.width, GAME_CONFIG.height);
    bg.setDepth(DEPTH.WORLD_BG);

    scene._celestial = initCelestial(scene);
    scene._hills = createHills(scene);
    scene._clouds = initClouds(scene);
    scene._groundSprite = createGround(scene);

    ensurePipeTextures(scene);
    createBirdAnimations(scene);

    scene.bird = new Bird(scene, GAME_CONFIG.bird.startX, GAME_CONFIG.centerY, loadSelectedSkin());
    scene.pipes = new Pipes(scene);
    scene.ui = new UI(scene);
    wireSceneBindings(scene);
    scene.scoreEffects = new ScoreEffects(scene);
    scene.ghost = new GhostReplay(scene);

    applyTrainingTimeScale(scene);
    syncShellTheme();
    showMenu(scene);

    if (GAME_CONFIG.debug) {
        scene.fps = scene.add.text(10, 10, '', {
            fontSize: '14px',
            fill: '#fff',
            fontFamily: 'monospace',
        });
        scene.fps.setDepth(DEPTH.FPS);
    }

    scene.events.once('shutdown', scene.shutdown, scene);
}
