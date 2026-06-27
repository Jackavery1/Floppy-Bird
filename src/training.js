import { GAME_CONFIG } from './config.js';

const STORAGE_KEY = GAME_CONFIG.storage.ghost;

export function loadGhostData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { score: 0, path: [] };
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return { score: 0, path: parsed.filter(p => Number.isFinite(p.t) && Number.isFinite(p.y)) };
        }
        const path = Array.isArray(parsed.path)
            ? parsed.path.filter(p => Number.isFinite(p.t) && Number.isFinite(p.y))
            : [];
        const score = Number(parsed.score);
        return {
            score: Number.isFinite(score) && score >= 0 ? score : 0,
            path,
        };
    } catch {
        return { score: 0, path: [] };
    }
}

export function loadGhostPath() {
    return loadGhostData().path;
}

export function saveGhostData(score, path) {
    if (!path?.length) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            score,
            path: path.slice(0, 600),
        }));
    } catch { /* quota */ }
}

export function saveGhostPath(path) {
    saveGhostData(0, path);
}

export function interpolateGhostY(path, elapsedMs) {
    if (!path.length) return null;
    if (elapsedMs <= path[0].t) return path[0].y;
    const last = path.at(-1);
    if (elapsedMs >= last.t) return last.y;

    for (let i = 1; i < path.length; i++) {
        const prev = path[i - 1];
        const next = path[i];
        if (elapsedMs <= next.t) {
            const span = next.t - prev.t || 1;
            const t = (elapsedMs - prev.t) / span;
            return prev.y + (next.y - prev.y) * t;
        }
    }
    return last.y;
}

export class GhostReplay {
    constructor(scene) {
        this.scene = scene;
        const saved = loadGhostData();
        this.path = saved.path;
        this._savedScore = saved.score;
        this.sprite = null;
        this._recording = [];
        this._roundStartMs = 0;
        this._sampleAcc = 0;
    }

    createSprite() {
        if (this.sprite) this.sprite.destroy();
        if (!this.path.length) {
            this.sprite = null;
            return;
        }
        this.sprite = this.scene.add.sprite(
            GAME_CONFIG.bird.startX,
            GAME_CONFIG.centerY,
            'bird-sheet',
            1,
        );
        this.sprite.setDisplaySize(GAME_CONFIG.bird.width, GAME_CONFIG.bird.height);
        this.sprite.setAlpha(GAME_CONFIG.training.ghostAlpha);
        this.sprite.setDepth(9);
        this.sprite.setTint(0xaaddff);
    }

    beginRound() {
        this._recording = [];
        this._roundStartMs = this.scene.time.now;
        this._sampleAcc = 0;
        this.createSprite();
    }

    update(step) {
        if (!this.scene.trainingMode) return;

        const elapsed = this.scene.time.now - this._roundStartMs;
        this._sampleAcc += step;
        if (this._sampleAcc >= GAME_CONFIG.training.sampleEveryFrames) {
            this._sampleAcc = 0;
            this._recording.push({ t: elapsed, y: this.scene.bird.y });
        }

        if (this.sprite && this.path.length) {
            const y = interpolateGhostY(this.path, elapsed);
            if (y !== null) {
                this.sprite.setPosition(GAME_CONFIG.bird.startX, y);
            }
        }
    }

    finishRound(score) {
        if (score > this._savedScore && this._recording.length > 0) {
            this.path = [...this._recording];
            this._savedScore = score;
            saveGhostData(score, this.path);
        }
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        this.sprite = null;
    }
}
