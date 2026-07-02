import { describe, it, expect, vi } from 'vitest';
import { playScoreFeedback } from '../src/sceneFeedback.js';
import { SOUND } from '../src/config.js';

vi.mock('../src/audio.js', () => ({ playSound: vi.fn() }));
vi.mock('../src/haptics.js', () => ({ hapticLight: vi.fn() }));

describe('sceneFeedback', () => {
    it('playScoreFeedback déclenche audio et haptique', async () => {
        const { playSound } = await import('../src/audio.js');
        const { hapticLight } = await import('../src/haptics.js');
        playScoreFeedback(3);
        expect(playSound).toHaveBeenCalledWith(SOUND.SCORE, 3);
        expect(hapticLight).toHaveBeenCalled();
    });
});
