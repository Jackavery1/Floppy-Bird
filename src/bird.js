import { GAME_CONFIG, SOUND } from './config.js';
import { playSound } from './audio.js';
import { hapticLight } from './haptics.js';

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
        this._jumpBuffered = false;

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
        if (this._jumpBuffered) {
            this._jumpBuffered = false;
            this.jump();
        }
        this.applyFall(step, 'live');
    }

    bufferJump() {
        this._jumpBuffered = true;
    }

    /** Gravité + déplacement ; rotation « live » (vol) ou « death » (chute game over). */
    applyFall(step, rotation = 'live') {
        this.velocityY = Math.min(this.velocityY + this.gravity * step, this.maxFallSpeed);
        this.y += this.velocityY * step;
        this.sprite.setPosition(this.x, this.y);
        if (rotation === 'live') {
            const angle = Math.min(Math.max(this.velocityY * 3, -30), 60);
            this.sprite.setRotation(angle * Math.PI / 180);
        } else {
            this.sprite.setRotation(Math.PI / 2.2);
        }
    }

    jump() {
        this.velocityY = this.jumpPower;
        this.sprite.play('bird-bat', true);
        playSound(SOUND.JUMP);
        hapticLight();
    }

    // Hitbox réduite (mx=5, my=4) — plus permissive que le sprite visible
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
        return this.y - this.height / 2 < 0;
    }

    isHittingGround() {
        return this.y + this.height / 2 >= GAME_CONFIG.groundY;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this._jumpBuffered = false;
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
