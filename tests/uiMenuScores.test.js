import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn((diff, hardcore) => {
        if (!hardcore) return { easy: 1, normal: 2, hard: 3 }[diff] ?? 0;
        return { easy: 4, normal: 5, hard: 6 }[diff] ?? 0;
    }),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadUnlockedAchievements: vi.fn(() => []),
}));

describe('uiMenuScores hardcore par difficulté', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('affiche une ligne HC par difficulté et refresh les met à jour', async () => {
        const { loadHighScore } = await import('../src/storage.js');
        const texts = [];
        const makeLabel = (initial) => {
            const label = {
                setText: vi.fn((t) => {
                    label._text = t;
                    texts.push(t);
                }),
                _text: initial,
            };
            return label;
        };

        const scene = {
            add: {
                graphics: () => ({
                    setDepth: vi.fn().mockReturnThis(),
                    lineStyle: vi.fn(),
                    lineBetween: vi.fn(),
                }),
                text: vi.fn((_x, _y, content) => {
                    const label = makeLabel(content);
                    texts.push(content);
                    return {
                        ...label,
                        setOrigin: vi.fn().mockReturnThis(),
                        setDepth: vi.fn().mockReturnThis(),
                        setScrollFactor: vi.fn().mockReturnThis(),
                    };
                }),
            },
        };

        vi.doMock('../src/ui/menu/uiMenuPanel.js', () => ({
            buildMenuToggleButton: () => ({
                bg: {},
                label: {},
                hit: {},
                paint: vi.fn(),
            }),
        }));

        const { buildScoresTab, refreshScoresTab } = await import('../src/ui/menu/uiMenuScores.js');
        const ui = { scene };
        const elements = [];
        const panelElements = [];
        buildScoresTab(ui, elements, panelElements);

        expect(ui._hardcoreScoreLines).toHaveLength(3);
        expect(texts.some((t) => t === 'HC FACILE · 4')).toBe(true);
        expect(texts.some((t) => t === 'HC NORMAL · 5')).toBe(true);
        expect(texts.some((t) => t === 'HC DIFFICILE · 6')).toBe(true);
        expect(texts.some((t) => t === 'HARDCORE · 6')).toBe(false);

        vi.mocked(loadHighScore).mockImplementation((diff, hardcore) => {
            if (!hardcore) return 0;
            return { easy: 7, normal: 8, hard: 9 }[diff] ?? 0;
        });
        refreshScoresTab(ui);
        expect(ui._hardcoreScoreLines[0].label.setText).toHaveBeenCalledWith('HC FACILE · 7');
        expect(ui._hardcoreScoreLines[2].label.setText).toHaveBeenCalledWith('HC DIFFICILE · 9');
    });
});
