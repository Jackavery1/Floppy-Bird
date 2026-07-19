import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Bird } from '../src/bird.js';
import { GAME_CONFIG } from '../src/config.js';
import { birdSpriteScale } from '../src/textures/birdTextures.js';
import { BIRD_COLLISION_INSET } from '../src/ui/shared/uiPhaserComponents.js';

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/textures/index.js', () => ({
    ensureBirdTexture: vi.fn(),
    ensureBirdTextures: vi.fn(),
}));

function createMockScene() {
    const sprite = {
        setScale: vi.fn(),
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
        it('applique un scale uniforme pour conserver le ratio texture', () => {
            expect(scene._sprite.setScale).toHaveBeenCalledWith(
                birdSpriteScale(GAME_CONFIG.bird.width)
            );
        });

        it('retourne une hitbox légèrement réduite par rapport au sprite', () => {
            bird.x = 100;
            bird.y = 200;
            const { width, height } = GAME_CONFIG.bird;
            const { x: mx, y: my } = BIRD_COLLISION_INSET;
            const b = bird.getBounds();
            expect(b).toEqual({
                x: 100 - width / 2 + mx,
                y: 200 - height / 2 + my,
                width: width - mx * 2,
                height: height - my * 2,
            });
            const sprite = bird.getSpriteBounds();
            expect(sprite).toEqual({
                x: 100 - width / 2,
                y: 200 - height / 2,
                width,
                height,
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

    describe('applyFall', () => {
        it('applique une rotation « death » fixe', () => {
            bird.applyFall(1, 'death');
            expect(scene._sprite.setRotation).toHaveBeenCalledWith(Math.PI / 2.2);
        });
    });

    describe('setSkin', () => {
        it('change la texture et réinitialise l’animation', () => {
            bird.setSkin('neon');
            expect(scene._sprite.setTexture).toHaveBeenCalled();
            expect(scene._sprite.stop).toHaveBeenCalled();
            expect(scene._sprite.setFrame).toHaveBeenCalledWith(1);
        });
    });

    describe('reset', () => {
        it('réinitialise position, vélocité et sprite', () => {
            bird.velocityY = 5;
            bird.reset(80, 400);
            expect(bird.x).toBe(80);
            expect(bird.y).toBe(400);
            expect(bird.velocityY).toBe(0);
            expect(scene._sprite.setRotation).toHaveBeenCalledWith(0);
            expect(scene._sprite.setAlpha).toHaveBeenCalledWith(1);
        });
    });

    describe('destroy', () => {
        it('détruit le sprite', () => {
            bird.destroy();
            expect(scene._sprite.destroy).toHaveBeenCalled();
        });
    });
});
