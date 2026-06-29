/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.BASE_PATH || './';
const THEME_COLOR = '#1a1a2e';

function phaserScriptSrc(basePath) {
    const normalized = basePath.endsWith('/') ? basePath : `${basePath}/`;
    return `${normalized}vendor/phaser.min.js`;
}

export default defineConfig(({ mode }) => {
    const phaserFromCdn = mode === 'production';

    return {
        base,
        build: {
            rollupOptions: {
                external: phaserFromCdn ? ['phaser'] : [],
                output: {
                    globals: { phaser: 'Phaser' },
                    manualChunks: phaserFromCdn ? undefined : { phaser: ['phaser'] },
                },
            },
        },
        plugins: [
            {
                name: 'inject-phaser-cdn',
                transformIndexHtml: {
                    order: 'post',
                    handler(html) {
                        if (!phaserFromCdn) return html;
                        return html.replace(
                            /(\s*<script type="module")/,
                            `\n    <script src="${phaserScriptSrc(base)}" crossorigin="anonymous"></script>$1`,
                        );
                    },
                },
            },
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['icons/*.png', 'vendor/*.js'],
                manifest: {
                    name: 'Floppy Bird',
                    short_name: 'Floppy',
                    description: 'Floppy Bird — évite les tuyaux et bats ton record.',
                    start_url: './',
                    scope: './',
                    display: 'standalone',
                    orientation: 'portrait',
                    background_color: THEME_COLOR,
                    theme_color: THEME_COLOR,
                    lang: 'fr',
                    icons: [
                        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,json,ico,webp,svg}'],
                    navigateFallback: 'index.html',
                    navigateFallbackDenylist: [/^\/offline\.html$/],
                },
            }),
        ],
        test: {
            environment: 'node',
            exclude: ['e2e/**', 'node_modules/**'],
            coverage: {
                provider: 'v8',
                include: ['src/**/*.js'],
                reporter: ['text', 'html', 'lcov'],
                thresholds: { lines: 75, functions: 70, branches: 70, statements: 75 },
            },
        },
    };
});
