import { vi } from 'vitest';

export function createGraphicsMock() {
    const g = {
        fillStyle: vi.fn(),
        fillRect: vi.fn(),
        fillCircle: vi.fn(),
        fillEllipse: vi.fn(),
        fillRoundedRect: vi.fn(),
        fillPoints: vi.fn(),
        generateTexture: vi.fn(),
        destroy: vi.fn(),
        clear: vi.fn(),
        lineStyle: vi.fn(),
        strokeRoundedRect: vi.fn(),
        setDepth: vi.fn(),
        setAlpha: vi.fn(),
    };
    for (const fn of Object.values(g)) {
        if (typeof fn === 'function' && fn.mockReturnValue) {
            fn.mockReturnValue(g);
        }
    }
    return g;
}

export function createTextureStore() {
    const textures = new Map();
    return {
        exists: (key) => textures.has(key),
        remove: (key) => textures.delete(key),
        get: (key) => {
            if (!textures.has(key)) {
                textures.set(key, { add: vi.fn() });
            }
            return textures.get(key);
        },
        _register: (key) => textures.set(key, { add: vi.fn() }),
    };
}

export function createTextureScene() {
    const graphics = createGraphicsMock();
    const textures = createTextureStore();
    graphics.generateTexture = vi.fn((key) => {
        textures._register(key);
    });
    return {
        make: { graphics: vi.fn(() => graphics) },
        textures,
        _graphics: graphics,
    };
}

export function createSpriteMock() {
    return {
        x: 0,
        y: 0,
        setDisplaySize: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setOrigin: vi.fn().mockReturnThis(),
        setAlpha: vi.fn().mockReturnThis(),
        setPosition: vi.fn().mockReturnThis(),
        setRotation: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        destroy: vi.fn(),
        tilePositionX: 0,
    };
}

export function createInteractable() {
    const obj = {
        setDepth: vi.fn(),
        setInteractive: vi.fn(),
        on: vi.fn(),
        setAlpha: vi.fn(),
        destroy: vi.fn(),
        setOrigin: vi.fn(),
        setText: vi.fn(),
        setColor: vi.fn(),
    };
    for (const fn of Object.values(obj)) {
        if (typeof fn === 'function' && fn.mockReturnValue) {
            fn.mockReturnValue(obj);
        }
    }
    return obj;
}

export function createBaseScene(overrides = {}) {
    const sprite = createSpriteMock();
    const delayedCalls = [];
    const makeInteractable = () => createInteractable();
    return {
        add: {
            sprite: vi.fn(() => sprite),
            rectangle: vi.fn(makeInteractable),
            text: vi.fn(makeInteractable),
            graphics: vi.fn(() => createGraphicsMock()),
            tileSprite: vi.fn(() => sprite),
        },
        make: {
            graphics: vi.fn(() => createGraphicsMock()),
            text: vi.fn(() => ({ width: 100, destroy: vi.fn() })),
        },
        input: {
            keyboard: { on: vi.fn(), once: vi.fn() },
            on: vi.fn(),
            once: vi.fn(),
            hitTestPointer: vi.fn(() => []),
        },
        cameras: { main: { shake: vi.fn() } },
        time: {
            timeScale: 1,
            now: 0,
            delayedCall: vi.fn((_ms, cb) => {
                delayedCalls.push(cb);
                return { remove: vi.fn() };
            }),
        },
        tweens: { add: vi.fn() },
        anims: { create: vi.fn() },
        events: { once: vi.fn() },
        game: { loop: { delta: 16.67, actualFps: 60 } },
        textures: createTextureStore(),
        _sprite: sprite,
        _delayedCalls: delayedCalls,
        ...overrides,
    };
}
