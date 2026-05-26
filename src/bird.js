import { GAME_CONFIG } from './config.js';
import { playSound } from './audio.js';
import { SOUND } from './gameConstants.js';

export class Bird {
    constructor(scene, x, y) {
        this.scene = scene;
        const cfg = GAME_CONFIG.bird;

        this.x = x;
        this.y = y;
        this.width = cfg.width;
        this.height = cfg.height;

        this.velocityY = 0;
        this.gravity = cfg.gravity;
        this.jumpPower = cfg.jumpPower;
        this.maxFallSpeed = cfg.maxFallSpeed;

        this.sprite = scene.add.sprite(x, y, 'bird-sheet', 1);
        this.sprite.setDisplaySize(this.width, this.height);
        this.sprite.setDepth(10);
    }

    applyDifficulty(diffConfig) {
        this.gravity = diffConfig.gravity;
        this.jumpPower = diffConfig.jumpPower;
        this.maxFallSpeed = diffConfig.maxFallSpeed;
    }

    update(step = 1) {
        this.velocityY += this.gravity * step;
        if (this.velocityY > this.maxFallSpeed) {
            this.velocityY = this.maxFallSpeed;
        }
        this.y += this.velocityY * step;
        this.sprite.setPosition(this.x, this.y);
        // Rotation: clamp between -30° and 60°
        const angle = Math.min(Math.max(this.velocityY * 3, -30), 60);
        this.sprite.setRotation(angle * Math.PI / 180);
    }

    jump() {
        this.velocityY = this.jumpPower;
        this.sprite.play('bird-bat', true);
        playSound(SOUND.JUMP);
    }

    // Hitbox 28×20 px centred (mx=5, my=4) — generous, matches visible body
    getBounds() {
        const mx = 5, my = 4;
        return {
            x: this.x - this.width / 2 + mx,
            y: this.y - this.height / 2 + my,
            width:  this.width  - mx * 2,
            height: this.height - my * 2,
        };
    }

    isOutOfBounds() {
        // Only check ceiling — ground is handled separately via isHittingGround()
        return this.y - this.height / 2 < 0;
    }

    isHittingGround() {
        return this.y + this.height / 2 >= GAME_CONFIG.groundY;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.sprite.stop();
        this.sprite.setFrame(1);
        this.sprite.setRotation(0);
        this.sprite.setPosition(x, y);
        this.sprite.setAlpha(1);
    }

    destroy() {
        this.sprite.destroy();
    }
}
