/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.BASE_PATH || './';
const PHASER_VERSION = '3.80.1';
const PHASER_CDN = `https://cdn.jsdelivr.net/npm/phaser@${PHASER_VERSION}/dist/phaser.min.js`;

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
                            `\n    <script src="${PHASER_CDN}" crossorigin="anonymous"></script>$1`,
                        );
                    },
                },
            },
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['icons/*.png'],
                manifest: {
                    name: 'Floppy Bird',
                    short_name: 'Floppy',
                    description: 'Floppy Bird — évite les tuyaux et bats ton record.',
                    start_url: './',
                    scope: './',
                    display: 'standalone',
                    orientation: 'portrait',
                    background_color: '#1a1a2e',
                    theme_color: '#16213e',
                    lang: 'fr',
                    icons: [
                        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                    ],
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,json,ico,webp,svg}'],
                    navigateFallback: 'offline.html',
                    runtimeCaching: [
                        {
                            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/phaser@/,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'phaser-cdn',
                                expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
                            },
                        },
                    ],
                },
            }),
        ],
        test: {
            environment: 'node',
            exclude: ['e2e/**', 'node_modules/**'],
            coverage: {
                provider: 'v8',
                include: ['src/**/*.js'],
                exclude: ['src/main.js'],
                reporter: ['text', 'html', 'lcov'],
                thresholds: { lines: 75, functions: 70, branches: 70, statements: 75 },
            },
        },
    };
});
