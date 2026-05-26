import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SOUND } from '../src/gameConstants.js';

function createMockContext() {
    const oscillators = [];
    const osc = () => {
        const o = {
            type: 'sine',
            frequency: {
                value: 0,
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
            },
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
        };
        oscillators.push(o);
        return o;
    };
    const gain = () => ({
        gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
    });
    return {
        state: 'running',
        currentTime: 0,
        destination: {},
        resume: vi.fn().mockResolvedValue(undefined),
        createOscillator: vi.fn(osc),
        createGain: vi.fn(gain),
        oscillators,
    };
}

describe('audio', () => {
    let mockCtx;
    let playSound;
    let resumeAudio;

    beforeEach(async () => {
        vi.resetModules();
        mockCtx = createMockContext();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        vi.stubGlobal('webkitAudioContext', undefined);
        const mod = await import('../src/audio.js');
        playSound = mod.playSound;
        resumeAudio = mod.resumeAudio;
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('resumeAudio reprend un contexte suspendu', async () => {
        mockCtx.state = 'suspended';
        await resumeAudio();
        expect(mockCtx.resume).toHaveBeenCalled();
    });

    it('playSound ne lève pas pour les sons connus', () => {
        expect(() => {
            playSound(SOUND.JUMP);
            playSound(SOUND.SCORE);
            playSound(SOUND.GAME_OVER);
            playSound(SOUND.GROUND);
        }).not.toThrow();
        expect(mockCtx.createOscillator.mock.calls.length).toBeGreaterThan(0);
    });

    it('utilise triangle pour gameover et sine pour ground', () => {
        playSound(SOUND.GAME_OVER);
        const gameoverOsc = mockCtx.oscillators.at(-1);
        expect(gameoverOsc.type).toBe('triangle');

        playSound(SOUND.GROUND);
        const groundOsc = mockCtx.oscillators.at(-1);
        expect(groundOsc.type).toBe('sine');
    });

    it('ne joue rien lorsque le son est coupé', async () => {
        const store = { 'flappy-bird-muted': '1', 'floppy-bird-volume': '0' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
        vi.resetModules();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        const { playSound: play } = await import('../src/audio.js');
        mockCtx.createOscillator.mockClear();
        play(SOUND.JUMP);
        expect(mockCtx.createOscillator).not.toHaveBeenCalled();
    });

    it('applique le volume sur les gains', async () => {
        const store = { 'floppy-bird-volume': '0.5' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
        vi.resetModules();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        const { playSound: play, getVolume } = await import('../src/audio.js');
        expect(getVolume()).toBe(0.5);
        play(SOUND.JUMP);
        const gainNode = mockCtx.createGain.mock.results[0].value;
        expect(gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.1, 0);
    });
});
