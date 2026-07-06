import { SOUND, GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { GAME_STATE } from './gameState.js';
import { playSound } from './audio.js';
import { hapticLight, hapticMedium } from './haptics.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { prefersReducedMotion, sceneCameraShake, sceneTween } from './motion.js';
import { DEPTH } from './uiLayout.js';
import { Utils } from './utils.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function playJumpFeedback() {
    playSound(SOUND.JUMP);
    hapticLight();
}

/** @param {number} score */
export function playScoreFeedback(score) {
    playSound(SOUND.SCORE, score);
    hapticLight();
}

/** @param {SceneContext} scene @param {'pipe' | 'ground' | 'ceiling'} [cause] */
export function playDeathImpactFeedback(scene, cause = 'pipe') {
    playSound(SOUND.GAME_OVER);
    hapticMedium();
    scene.ui.hideInGameScore();
    if (cause === 'pipe') {
        sceneCameraShake(scene.cameras.main, 200, 0.015);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.texteHud), 0.8);
        spawnImpactParticles(scene, scene.bird.x, scene.bird.y, 'pipe');
    } else if (cause === 'ground') {
        sceneCameraShake(scene.cameras.main, 140, 0.012);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.accentGap), 0.65);
        spawnImpactParticles(scene, scene.bird.x, GAME_CONFIG.groundY - 20, 'ground');
    } else {
        sceneCameraShake(scene.cameras.main, 120, 0.01);
        scene.ui.showFlash(hexVersPhaser(DESIGN_TOKENS.flashPlafond), 0.55);
        spawnImpactParticles(scene, scene.bird.x, 30, 'ceiling');
    }
    applyDeathSlowMo(scene);
}

/** @param {SceneContext} scene */
function applyDeathSlowMo(scene) {
    const { deathSlowMoMs, deathSlowMoScale } = GAME_CONFIG.round;
    if (prefersReducedMotion()) {
        applyTrainingTimeScale(scene);
        return;
    }
    scene.time.timeScale = deathSlowMoScale;
    scene.time.delayedCall(deathSlowMoMs, () => {
        if (scene.state === GAME_STATE.DYING || scene.state === GAME_STATE.PLAYING) {
            applyTrainingTimeScale(scene);
        }
    });
}

export function playGroundImpactFeedback() {
    playSound(SOUND.GROUND);
    hapticLight();
}

/** Particules d'impact lors de la collision (pipe, ground, ceiling). */
function spawnImpactParticles(scene, cx, cy, cause) {
    if (prefersReducedMotion()) return;
    const colors = {
        pipe: hexVersPhaser(DESIGN_TOKENS.accentScoreHardcore),
        ground: hexVersPhaser(DESIGN_TOKENS.accentGap),
        ceiling: hexVersPhaser(DESIGN_TOKENS.flashPlafond),
    };
    const color = colors[cause] || colors.pipe;
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const vx = Math.cos(angle) * 80;
        const vy = Math.sin(angle) * 80;
        const size = Utils.randomInt(2, 4);
        const particle = scene.add.rectangle(cx, cy, size, size, color, 0.8);
        particle.setDepth(DEPTH.GAME_LAYER);
        sceneTween(scene, {
            targets: particle,
            x: cx + vx,
            y: cy + vy,
            alpha: 0,
            duration: Utils.randomInt(400, 600),
            ease: 'Cubic.easeOut',
            onComplete: () => particle.destroy(),
        });
    }
}
