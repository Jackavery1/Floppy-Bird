import { GAME_CONFIG } from './config.js';
import { initClouds, createGround } from './sceneBackground.js';
import { setupSceneInput } from './sceneInput.js';
import { Bird } from './bird.js';
import { Pipes } from './pipes.js';
import { UI } from './ui.js';
import { ScoreEffects } from './scoreEffects.js';
import { GhostReplay } from './training.js';
import { warnFileProtocol, primeAudio, applyTrainingTimeScale } from './sceneBootstrap.js';
import { showMenu } from './sceneFlow.js';
import { resumeAudio } from './audio.js';

export function setupSceneWorld(scene) {
    warnFileProtocol();
    primeAudio(scene, resumeAudio);
    setupSceneInput(scene);

    const bg = scene.add.sprite(GAME_CONFIG.centerX, GAME_CONFIG.centerY, 'background');
    bg.setDisplaySize(GAME_CONFIG.width, GAME_CONFIG.height);
    bg.setDepth(0);

    scene._clouds = initClouds(scene);
    scene._groundSprite = createGround(scene);

    scene.anims.create({
        key: 'bird-bat',
        frames: [
            { key: 'bird-sheet', frame: 0 },
            { key: 'bird-sheet', frame: 1 },
            { key: 'bird-sheet', frame: 2 },
            { key: 'bird-sheet', frame: 1 },
        ],
        frameRate: 10,
        repeat: 0,
    });

    scene.bird = new Bird(scene, GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
    scene.pipes = new Pipes(scene);
    scene.ui = new UI(scene);
    scene.scoreEffects = new ScoreEffects(scene);
    scene.ghost = new GhostReplay(scene);

    applyTrainingTimeScale(scene);
    showMenu(scene);

    if (GAME_CONFIG.debug) {
        scene.fps = scene.add.text(10, 10, '', {
            fontSize: '14px', fill: '#fff', fontFamily: 'monospace',
        });
        scene.fps.setDepth(100);
    }

    scene.events.once('shutdown', scene.shutdown, scene);
}
