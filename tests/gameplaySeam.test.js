import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { GAME_STATE } from '../src/gameState.js';
import { createGameplaySeam } from '../src/testSeam/gameplaySeam.js';
import {
    collidesWithPipeGroup,
    isBirdInPipeGap,
    birdClearedPipeForScore,
} from '../src/pipeCollision.js';

vi.mock('../src/sceneBeginRound.js', () => ({
    beginRound: vi.fn(),
}));

vi.mock('../src/sceneJumpBuffer.js', () => ({
    requestJump: vi.fn(),
}));

vi.mock('../src/sceneDeath.js', () => ({
    triggerDeath: vi.fn(),
}));

vi.mock('../src/sceneRound.js', () => ({
    checkScorePipes: vi.fn(),
    tickPipeSpawnFallback: vi.fn((scene, deltaMs) => {
        scene.round._pipeSpawnWaitMs = (scene.round._pipeSpawnWaitMs ?? 0) + deltaMs;
    }),
}));

vi.mock('../src/sceneA11ySync.js', () => ({
    hideAccessibilityForRoundStart: vi.fn(),
}));

vi.mock('../src/sceneMenuSync.js', () => ({
    closeMenuPanelsForRoundStart: vi.fn(),
}));

function createScene() {
    const gapY = 180;
    const gap = 108;
    const topPipe = { x: 74, y: gapY - gap / 2, scored: false };
    const bottomPipe = { x: 74, y: gapY + gap / 2 };
    const scene = {
        state: GAME_STATE.PLAYING,
        hardcoreMode: false,
        trainingMode: false,
        playMode: 'classic',
        dailyChallengeMode: false,
        round: {
            jumpBufferFrames: 0,
            coyoteFrames: 0,
            spawnInvincible: false,
            score: 0,
        },
        bird: {
            x: 74,
            y: gapY,
            width: 28,
            height: 20,
            sprite: { setPosition: vi.fn(), clearTint: vi.fn(), setTint: vi.fn() },
            getBounds() {
                const mx = 3;
                const my = 2;
                return {
                    x: this.x - this.width / 2 + mx,
                    y: this.y - this.height / 2 + my,
                    width: this.width - mx * 2,
                    height: this.height - my * 2,
                };
            },
        },
        pipes: {
            topPipes: [topPipe],
            bottomPipes: [bottomPipe],
            pipeWidth: 40,
            pipeBodyWidth: 28,
            spawn: vi.fn(),
            checkCollisionWithBird(birdBounds) {
                return (
                    collidesWithPipeGroup(this.topPipes, 'top', birdBounds, this.pipeBodyWidth) ||
                    collidesWithPipeGroup(
                        this.bottomPipes,
                        'bottom',
                        birdBounds,
                        this.pipeBodyWidth
                    )
                );
            },
            isBirdInGap(birdBounds) {
                return isBirdInPipeGap(
                    birdBounds,
                    this.topPipes,
                    this.bottomPipes,
                    this.pipeBodyWidth
                );
            },
        },
        ui: {
            clearOverlay: vi.fn(),
        },
        triggerDeath: vi.fn(),
    };
    return scene;
}

describe('gameplaySeam', () => {
    let scene;
    let seam;

    beforeEach(() => {
        vi.clearAllMocks();
        scene = createScene();
        seam = createGameplaySeam(() => scene);
    });

    it('getGameplayEquity expose la durée hardcore', () => {
        scene.hardcoreMode = true;
        expect(seam.getGameplayEquity()?.spawnInvincibilityMs).toBe(
            GAME_CONFIG.round.hardcoreSpawnInvincibilityMs
        );
    });

    it('restartRoundWithModes prépare le menu puis relance la manche', async () => {
        scene.state = GAME_STATE.MENU;
        const { beginRound } = await import('../src/sceneBeginRound.js');
        const { hideAccessibilityForRoundStart } = await import('../src/sceneA11ySync.js');

        seam.restartRoundWithModes({ hardcore: true, training: false });

        expect(hideAccessibilityForRoundStart).toHaveBeenCalled();
        expect(scene.ui.clearOverlay).toHaveBeenCalledWith('menu');
        expect(beginRound).toHaveBeenCalledWith(scene, { resetBird: true });
        expect(scene.hardcoreMode).toBe(true);
    });

    it('runCoyoteGapExitScenario protège puis laisse mourir', () => {
        const result = seam.runCoyoteGapExitScenario();

        expect(result?.coyoteInGap).toBe(GAME_CONFIG.bird.coyoteTimeFrames);
        expect(result?.collidesAfterExit).toBe(true);
        expect(result?.hasCoyoteAfterExit).toBe(true);
        expect(result?.noDeathDuringCoyote).toBe(true);
        expect(result?.coyoteExpired).toBe(true);
        expect(result?.deathAfterCoyoteExpired).toBe(true);
    });

    it('holdBirdAtCenter remet l’oiseau au centre sans vélocité', () => {
        scene.bird.y = 400;
        scene.bird.velocityY = 5;
        expect(seam.holdBirdAtCenter()).toBe(true);
        expect(scene.bird.y).toBe(GAME_CONFIG.centerY);
        expect(scene.bird.velocityY).toBe(0);
        expect(scene.bird.sprite.setPosition).toHaveBeenCalledWith(
            scene.bird.x,
            GAME_CONFIG.centerY
        );
    });

    it('requestJump délègue au buffer de saut', async () => {
        const { requestJump } = await import('../src/sceneJumpBuffer.js');
        seam.requestJump();
        expect(requestJump).toHaveBeenCalledWith(scene);
    });

    it('getPipeState expose le premier tuyau', () => {
        expect(seam.getPipeState()).toMatchObject({
            pipeCount: 1,
            firstPipeX: 74,
            pipeWidth: 40,
        });
    });

    it('advancePipeSpawnWait accumule le délai et peut spawner', () => {
        scene.round._pipeSpawnWaitMs = 0;
        scene.pipes.topPipes = [];
        scene.pipes.spawn = vi.fn(() => {
            scene.pipes.topPipes.push({ x: 200, scored: false });
        });
        const result = seam.advancePipeSpawnWait(1250);
        expect(result?.waitMs).toBe(1250);
        expect(scene.pipes.spawn).toHaveBeenCalled();
        expect(result?.pipeCount).toBe(1);
    });

    it('advancePipeForScore positionne l’oiseau après le tuyau pour scoring', async () => {
        const { checkScorePipes } = await import('../src/sceneRound.js');
        const pipe = scene.pipes.topPipes[0];
        seam.advancePipeForScore();
        expect(birdClearedPipeForScore(scene.bird, pipe.x, scene.pipes.pipeWidth)).toBe(true);
        expect(checkScorePipes).toHaveBeenCalledWith(scene);
    });

    it('alignBirdInFirstGap centre l’oiseau dans le corridor', () => {
        const result = seam.alignBirdInFirstGap();
        expect(result?.gapMidY).toBe(
            (scene.pipes.topPipes[0].y + scene.pipes.bottomPipes[0].y) / 2
        );
        expect(scene.bird.y).toBe(result?.gapMidY);
        expect(scene.bird.velocityY).toBe(0);
    });

    it('tickSurvivalAssist maintient l’oiseau dans le gap actif', () => {
        const result = seam.tickSurvivalAssist();
        expect(result?.score).toBe(0);
        expect(scene.round.coyoteFrames).toBe(GAME_CONFIG.bird.coyoteTimeFrames);
        expect(scene.bird.velocityY).toBe(0);
    });

    it('triggerDeath délègue à sceneDeath', async () => {
        const { triggerDeath } = await import('../src/sceneDeath.js');
        seam.triggerDeath('ground');
        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ground');
    });
});
