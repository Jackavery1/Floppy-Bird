import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Bird } from '../src/bird.js';
import { GAME_CONFIG } from '../src/config.js';

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

function createMockScene() {
    const sprite = {
        setDisplaySize: vi.fn(),
        setDepth: vi.fn(),
        setPosition: vi.fn(),
        setRotation: vi.fn(),
        play: vi.fn(),
        stop: vi.fn(),
        setFrame: vi.fn(),
        setAlpha: vi.fn(),
        setTexture: vi.fn(),
        destroy: vi.fn(),
    };
    return {
        add: { sprite: vi.fn(() => sprite) },
        _sprite: sprite,
    };
}

describe('Bird', () => {
    let scene;
    let bird;

    beforeEach(() => {
        scene = createMockScene();
        bird = new Bird(scene, 80, 400);
    });

    describe('getBounds', () => {
        it('retourne une hitbox légèrement réduite par rapport au sprite', () => {
            bird.x = 100;
            bird.y = 200;
            const b = bird.getBounds();
            expect(b).toEqual({
                x: 100 - 14 + 3,
                y: 200 - 10 + 2,
                width: 22,
                height: 16,
            });
        });
    });

    describe('isOutOfBounds', () => {
        it('détecte le plafond uniquement', () => {
            bird.y = bird.height / 2 - 1;
            expect(bird.isOutOfBounds()).toBe(true);
            bird.y = bird.height / 2;
            expect(bird.isOutOfBounds()).toBe(false);
        });
    });

    describe('isHittingGround', () => {
        it('détecte le contact avec le sol', () => {
            bird.y = GAME_CONFIG.groundY - bird.height / 2;
            expect(bird.isHittingGround()).toBe(true);
            bird.y = GAME_CONFIG.groundY - bird.height / 2 - 1;
            expect(bird.isHittingGround()).toBe(false);
        });
    });

    describe('applyDifficulty', () => {
        it('applique gravité, saut et vitesse max de chute', () => {
            bird.applyDifficulty({
                gravity: 0.55,
                jumpPower: -11,
                maxFallSpeed: 14,
            });
            expect(bird.gravity).toBe(0.55);
            expect(bird.jumpPower).toBe(-11);
            expect(bird.maxFallSpeed).toBe(14);
        });
    });

    describe('update', () => {
        it('plafonne velocityY à maxFallSpeed', () => {
            bird.velocityY = 20;
            bird.maxFallSpeed = 10;
            bird.update(1);
            expect(bird.velocityY).toBe(10);
        });

        it('incrémente la position verticale', () => {
            bird.velocityY = 0;
            bird.gravity = 0.7;
            bird.maxFallSpeed = 10;
            const y0 = bird.y;
            bird.update(1);
            expect(bird.y).toBe(y0 + 0.7);
            expect(scene._sprite.setPosition).toHaveBeenCalledWith(bird.x, bird.y);
        });
    });

    describe('jump', () => {
        it('réinitialise velocityY au jumpPower', () => {
            bird.jumpPower = -12;
            bird.jump();
            expect(bird.velocityY).toBe(-12);
            expect(scene._sprite.play).toHaveBeenCalledWith('bird-bat-classic', true);
        });
    });

    describe('bufferJump', () => {
        it('consomme le buffer au prochain update', () => {
            bird.jumpPower = -8;
            bird.bufferJump();
            bird.update(1);
            expect(bird.velocityY).toBe(-8 + bird.gravity);
            expect(scene._sprite.play).toHaveBeenCalledWith('bird-bat-classic', true);
        });
    });
});
