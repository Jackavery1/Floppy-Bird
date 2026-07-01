import { GAME_CONFIG } from './config.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { birdTextureKey } from './skins.js';
import { loadSelectedSkin } from './metaStorage.js';

const STORAGE_KEY = STORAGE_KEYS.ghost;

function normalizeGhostPayload(parsed) {
    if (Array.isArray(parsed)) {
        return {
            score: 0,
            path: parsed.filter(p => Number.isFinite(p.t) && Number.isFinite(p.y)),
            difficulty: null,
            hardcore: false,
        };
    }
    const path = Array.isArray(parsed.path)
        ? parsed.path.filter(p => Number.isFinite(p.t) && Number.isFinite(p.y))
        : [];
    const score = Number(parsed.score);
    return {
        score: Number.isFinite(score) && score >= 0 ? score : 0,
        path,
        difficulty: typeof parsed.difficulty === 'string' ? parsed.difficulty : null,
        hardcore: parsed.hardcore === true,
    };
}

export function loadGhostData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { score: 0, path: [], difficulty: null, hardcore: false };
        return normalizeGhostPayload(JSON.parse(raw));
    } catch {
        return { score: 0, path: [], difficulty: null, hardcore: false };
    }
}

export function saveGhostData(score, path, { difficulty, hardcore } = {}) {
    if (!path?.length) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            score,
            path: path.slice(0, 600),
            difficulty,
            hardcore: hardcore === true,
        }));
    } catch { /* quota */ }
}

export function ghostMatchesMode(saved, difficulty, hardcoreMode) {
    if (saved.difficulty == null) return true;
    return saved.difficulty === difficulty && saved.hardcore === !!hardcoreMode;
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
        this._saved = loadGhostData();
        this.path = ghostMatchesMode(this._saved, scene.difficulty, scene.hardcoreMode)
            ? this._saved.path
            : [];
        this._savedScore = this._saved.score;
        this.sprite = null;
        this._recording = [];
        this._roundStartMs = 0;
        this._sampleAcc = 0;
    }

    _refreshPathForMode() {
        const saved = loadGhostData();
        this.path = ghostMatchesMode(saved, this.scene.difficulty, this.scene.hardcoreMode)
            ? saved.path
            : [];
        this._savedScore = saved.score;
    }

    createSprite() {
        if (this.sprite) this.sprite.destroy();
        if (!this.path.length) {
            this.sprite = null;
            return;
        }
        const skinId = loadSelectedSkin();
        this.sprite = this.scene.add.sprite(
            GAME_CONFIG.bird.startX,
            GAME_CONFIG.centerY,
            birdTextureKey(skinId),
            1,
        );
        this.sprite.setDisplaySize(GAME_CONFIG.bird.width, GAME_CONFIG.bird.height);
        this.sprite.setAlpha(GAME_CONFIG.training.ghostAlpha);
        this.sprite.setDepth(9);
        this.sprite.setTint(0xaaddff);
    }

    beginRound() {
        this._refreshPathForMode();
        this._recording = [];
        this._roundStartMs = this.scene.time.now;
        this._sampleAcc = 0;
        this.createSprite();
    }

    recordJump() {
        if (!this.scene.trainingMode) return;
        const elapsed = this.scene.time.now - this._roundStartMs;
        this._recording.push({ t: elapsed, y: this.scene.bird.y, j: 1 });
    }

    _replayWingFrame(elapsed) {
        if (!this.path.some(p => p.j && Math.abs(p.t - elapsed) < 90)) return 1;
        return 0;
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
                this.sprite.setFrame(this._replayWingFrame(elapsed));
            }
        }
    }

    finishRound(score) {
        if (score > this._savedScore && this._recording.length > 0) {
            this.path = [...this._recording];
            this._savedScore = score;
            saveGhostData(score, this.path, {
                difficulty: this.scene.difficulty,
                hardcore: this.scene.hardcoreMode,
            });
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
