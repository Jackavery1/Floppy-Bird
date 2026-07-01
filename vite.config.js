/// <reference types="vitest/config" />
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const root = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.BASE_PATH || './';
const pwaManifest = JSON.parse(
    readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf8'),
);

function phaserScriptSrc(basePath) {
    const normalized = basePath.endsWith('/') ? basePath : `${basePath}/`;
    return `${normalized}vendor/phaser.min.js`;
}

export default defineConfig(({ mode }) => {
    const useVendorPhaser = mode === 'production';

    return {
        base,
        resolve: {
            alias: useVendorPhaser
                ? { phaser: path.join(root, 'src/phaser-shim.js') }
                : {},
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: useVendorPhaser ? undefined : { phaser: ['phaser'] },
                },
            },
        },
        plugins: [
            {
                name: 'inject-phaser-vendor',
                transformIndexHtml: {
                    order: 'post',
                    handler(html) {
                        if (!useVendorPhaser) return html;
                        return html.replace(
                            /(\s*<script type="module")/,
                            `\n    <script src="${phaserScriptSrc(base)}" crossorigin="anonymous"></script>$1`,
                        );
                    },
                },
            },
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: [
                    'icons/*.png',
                    'vendor/*.js',
                    'manifest.webmanifest',
                    'offline.html',
                ],
                manifest: pwaManifest,
                workbox: {
                    globPatterns: ['**/*.{js,css,html,png,json,ico,webp,svg,webmanifest}'],
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
