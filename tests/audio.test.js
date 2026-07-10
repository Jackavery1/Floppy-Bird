import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SOUND } from '../src/config.js';

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
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
    });
    return {
        state: 'running',
        currentTime: 0,
        sampleRate: 44100,
        destination: {},
        resume: vi.fn().mockResolvedValue(undefined),
        createOscillator: vi.fn(osc),
        createGain: vi.fn(gain),
        createBuffer: vi.fn((channels, length) => ({
            getChannelData: () => new Float32Array(length),
        })),
        createBufferSource: vi.fn(() => ({
            buffer: null,
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
        })),
        createBiquadFilter: vi.fn(() => ({
            type: 'lowpass',
            frequency: { value: 0 },
            connect: vi.fn(),
        })),
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

    it('getScoreToneType varie selon le score', async () => {
        const { getScoreToneType } = await import('../src/audio.js');
        expect(getScoreToneType(1)).toBe('triangle');
        expect(getScoreToneType(2)).toBe('square');
        expect(getScoreToneType(3)).toBe('sine');
    });

    it('playScore ajoute un son de palier tous les 10 points', () => {
        mockCtx.createOscillator.mockClear();
        playSound(SOUND.SCORE, 9);
        const atNine = mockCtx.createOscillator.mock.calls.length;
        playSound(SOUND.SCORE, 10);
        const atTen = mockCtx.createOscillator.mock.calls.length;
        expect(atTen).toBeGreaterThan(atNine);
        const milestoneOsc = mockCtx.oscillators.at(-1);
        expect(milestoneOsc.type).toBe('square');
    });

    it('playScore ajoute une fanfare aux paliers 5, 15 et 20', () => {
        mockCtx.createOscillator.mockClear();
        playSound(SOUND.SCORE, 4);
        const atFour = mockCtx.createOscillator.mock.calls.length;
        playSound(SOUND.SCORE, 5);
        const atFive = mockCtx.createOscillator.mock.calls.length;
        expect(atFive).toBeGreaterThan(atFour);

        mockCtx.createOscillator.mockClear();
        playSound(SOUND.SCORE, 14);
        const atFourteen = mockCtx.createOscillator.mock.calls.length;
        playSound(SOUND.SCORE, 15);
        expect(mockCtx.createOscillator.mock.calls.length).toBeGreaterThan(atFourteen);

        mockCtx.createOscillator.mockClear();
        playSound(SOUND.SCORE, 19);
        const atNineteen = mockCtx.createOscillator.mock.calls.length;
        playSound(SOUND.SCORE, 20);
        const atTwenty = mockCtx.createOscillator.mock.calls.length;
        expect(atTwenty).toBeGreaterThan(atNineteen);
        const typesAtTwenty = mockCtx.oscillators.slice(atNineteen).map((o) => o.type);
        expect(typesAtTwenty).toContain('square');
        expect(typesAtTwenty).toContain('sine');
    });

    it('utilise triangle pour gameover et bruit filtré pour ground', () => {
        playSound(SOUND.GAME_OVER);
        expect(mockCtx.oscillators.some((o) => o.type === 'triangle')).toBe(true);

        mockCtx.createBuffer.mockClear();
        playSound(SOUND.GROUND);
        expect(mockCtx.createBuffer).toHaveBeenCalled();
    });

    it('ne joue rien lorsque le son est coupé', async () => {
        const store = { 'flappy-bird-muted': '1', 'flappy-bird-volume': '0' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => {
                store[k] = v;
            },
        });
        vi.resetModules();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        const { playSound: play } = await import('../src/audio.js');
        mockCtx.createOscillator.mockClear();
        play(SOUND.JUMP);
        expect(mockCtx.createOscillator).not.toHaveBeenCalled();
    });

    it('applique le volume sur les gains avec attaque', async () => {
        const store = { 'flappy-bird-volume': '0.5' };
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => {
                store[k] = v;
            },
        });
        vi.resetModules();
        const Ctx = vi.fn(() => mockCtx);
        vi.stubGlobal('AudioContext', Ctx);
        const { playSound: play, getVolume } = await import('../src/audio.js');
        expect(getVolume()).toBe(0.5);
        play(SOUND.JUMP);
        const gainNode = mockCtx.createGain.mock.results[1].value;
        expect(gainNode.gain.linearRampToValueAtTime).toHaveBeenCalled();
    });

    it('isAudioAvailable détecte l’absence d’AudioContext', async () => {
        vi.stubGlobal('AudioContext', undefined);
        vi.stubGlobal('webkitAudioContext', undefined);
        vi.resetModules();
        const { isAudioAvailable } = await import('../src/audio.js');
        expect(isAudioAvailable()).toBe(false);
    });
});
