import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        coverage: {
            provider: 'v8',
            include: ['src/**/*.js'],
            // Phaser / UI : exclus des seuils (smoke + tests manuels) ; logique métier couverte
            exclude: [
                'src/main.js',
                'src/ui.js',
                'src/GameScene.js',
                'src/proceduralTextures.js',
            ],
            reporter: ['text', 'html', 'lcov'],
            thresholds: {
                lines: 75,
                functions: 70,
                branches: 70,
                statements: 75,
            },
        },
    },
});
