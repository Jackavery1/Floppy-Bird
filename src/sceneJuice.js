import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { prefersReducedMotion, sceneCameraShake, sceneTween } from './motion.js';
import { DEPTH } from './ui/shared/uiDepth.js';
import { Utils } from './utils.js';

/**
 * Rafale de particules token-based (score, mort, impacts).
 * @param {import('./sceneTypes.js').SceneContext} scene
 * @param {number} cx
 * @param {number} cy
 * @param {{ count?: number, colors?: number[], speed?: number, sizeMin?: number, sizeMax?: number }} [opts]
 */
export function spawnBurstParticles(scene, cx, cy, opts = {}) {
    if (prefersReducedMotion()) return;
    const count = opts.count ?? 8;
    const colors = opts.colors ?? [hexVersPhaser(DESIGN_TOKENS.accent)];
    const speed = opts.speed ?? 80;
    const sizeMin = opts.sizeMin ?? 2;
    const sizeMax = opts.sizeMax ?? 4;

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Utils.randomInt(-2, 2) * 0.05;
        const dist = speed * (0.75 + Math.random() * 0.35);
        const vx = Math.cos(angle) * dist;
        const vy = Math.sin(angle) * dist;
        const size = Utils.randomInt(sizeMin, sizeMax);
        const color = colors[i % colors.length];
        const particle = scene.add.rectangle(cx, cy, size, size, color, 0.85);
        particle.setDepth(DEPTH.GAME_LAYER);
        sceneTween(scene, {
            targets: particle,
            x: cx + vx,
            y: cy + vy,
            alpha: 0,
            duration: Utils.randomInt(350, 650),
            ease: 'Cubic.easeOut',
            onComplete: () => particle.destroy(),
        });
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {number} cx @param {number} cy @param {number} score */
export function spawnScoreJuice(scene, cx, cy, score) {
    if (prefersReducedMotion()) return;
    const colors = [hexVersPhaser(DESIGN_TOKENS.accent), hexVersPhaser(DESIGN_TOKENS.bannerStreak)];
    spawnBurstParticles(scene, cx, cy, { count: 6, colors, speed: 55, sizeMin: 2, sizeMax: 3 });
    if (score > 0 && score % 10 === 0) {
        sceneCameraShake(scene.cameras?.main, 90, 0.004);
        spawnBurstParticles(scene, cx, cy - 8, {
            count: 10,
            colors: [
                hexVersPhaser(DESIGN_TOKENS.medailleOr),
                hexVersPhaser(DESIGN_TOKENS.confettiBleu),
            ],
            speed: 95,
            sizeMin: 3,
            sizeMax: 5,
        });
    }
}

/**
 * @param {import('./sceneTypes.js').SceneContext} scene
 * @param {number} cx
 * @param {number} cy
 * @param {'pipe' | 'ground' | 'ceiling'} cause
 */
export function spawnDeathJuice(scene, cx, cy, cause) {
    if (prefersReducedMotion()) return;
    const colors = {
        pipe: [
            hexVersPhaser(DESIGN_TOKENS.accentScoreHardcore),
            hexVersPhaser(DESIGN_TOKENS.texteGameOver),
        ],
        ground: [
            hexVersPhaser(DESIGN_TOKENS.accentGap),
            hexVersPhaser(DESIGN_TOKENS.bannerSuccess),
        ],
        ceiling: [
            hexVersPhaser(DESIGN_TOKENS.flashPlafond),
            hexVersPhaser(DESIGN_TOKENS.confettiBleu),
        ],
    };
    const palette = colors[cause] ?? colors.pipe;
    spawnBurstParticles(scene, cx, cy, {
        count: 12,
        colors: palette,
        speed: 100,
        sizeMin: 2,
        sizeMax: 5,
    });
    spawnBurstParticles(scene, cx, cy, {
        count: 6,
        colors: palette,
        speed: 45,
        sizeMin: 4,
        sizeMax: 6,
    });
}
