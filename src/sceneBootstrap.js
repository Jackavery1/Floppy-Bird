import { GAME_CONFIG } from './config.js';
import { hasCoyoteGrace } from './sceneCoyote.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function frameStep(scene) {
    const base = (scene.game.loop.delta / 1000) * 60;
    if (scene.trainingMode) {
        return base * GAME_CONFIG.training.timeScale;
    }
    return base;
}

export function warnFileProtocol() {
    if (typeof location === 'undefined' || location.protocol !== 'file:') return;
    if (document.getElementById('file-protocol-warn')) return;
    const warn = document.createElement('div');
    warn.id = 'file-protocol-warn';
    warn.textContent = 'Lance le jeu avec npm run dev (serveur requis pour scores et PWA).';
    document.body.prepend(warn);
}

/** @param {SceneContext} scene */
export function primeAudio(scene, resumeAudio) {
    const resume = () => resumeAudio();
    scene.input.once('pointerdown', resume);
    scene.input.keyboard.once('keydown', resume);
}

/** @param {SceneContext} scene */
export function applyTrainingTimeScale(scene) {
    scene.time.timeScale = scene.trainingMode ? GAME_CONFIG.training.timeScale : 1;
}

/** @param {SceneContext} scene */
export function checkCollisions(scene) {
    if (scene.round.spawnInvincible) return;
    if (!scene.pipes.checkCollisionWithBird(scene.bird.getBounds())) return;
    if (hasCoyoteGrace(scene)) return;
    scene.triggerDeath();
}
