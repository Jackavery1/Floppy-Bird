/// <reference types="vitest/config" />
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const root = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.BASE_PATH || './';
const pwaScope = base === './' ? './' : (base.endsWith('/') ? base : `${base}/`);
const pwaManifest = {
    ...JSON.parse(readFileSync(path.join(root, 'public/manifest.webmanifest'), 'utf8')),
    start_url: pwaScope,
    scope: pwaScope,
};

function phaserScriptSrc(basePath) {
    const normalized = basePath.endsWith('/') ? basePath : `${basePath}/`;
    return `${normalized}vendor/phaser.min.js`;
}

function socialMetaUrls(basePath) {
    const sitePath =
        basePath === './'
            ? '/Floppy-Bird'
            : basePath.endsWith('/')
              ? basePath.slice(0, -1)
              : basePath;
    const siteUrl = (process.env.SITE_URL || `https://jackavery1.github.io${sitePath}`).replace(
        /\/$/,
        ''
    );
    return { siteUrl, imageUrl: `${siteUrl}/icons/icon-512.png` };
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
                input: {
                    main: path.join(root, 'index.html'),
                    tokens: path.join(root, 'tokens.html'),
                },
                output: {
                    manualChunks(id) {
                        const normalized = id.replace(/\\/g, '/');
                        if (normalized.includes('node_modules')) {
                            return useVendorPhaser ? undefined : 'phaser';
                        }
                        if (useVendorPhaser && normalized.includes('/src/skins/')) {
                            return 'skins';
                        }
                        if (useVendorPhaser && normalized.includes('/src/uiGameOver')) {
                            return 'ui-gameover';
                        }
                        return undefined;
                    },
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
                        const { siteUrl, imageUrl } = socialMetaUrls(base);
                        return html
                            .replace(
                                /(\s*<script type="module")/,
                                `\n    <script src="${phaserScriptSrc(base)}" crossorigin="anonymous"></script>$1`
                            )
                            .replace(
                                /<meta property="og:url" content="[^"]*" \/>/,
                                `<meta property="og:url" content="${siteUrl}/" />`
                            )
                            .replace(
                                /<meta property="og:image" content="[^"]*" \/>/,
                                `<meta property="og:image" content="${imageUrl}" />`
                            )
                            .replace(
                                /<meta name="twitter:image" content="[^"]*" \/>/,
                                `<meta name="twitter:image" content="${imageUrl}" />`
                            );
                    },
                },
            },
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: [
                    'icons/*.png',
                    'icons/*.svg',
                    'fonts/*.woff2',
                    'vendor/*.js',
                    'manifest.webmanifest',
                    'offline.html',
                    'shell-tokens.css',
                    'offline-page.css',
                ],
                manifest: pwaManifest,
                workbox: {
                    globPatterns: [
                        '**/*.{js,css,html,png,json,ico,webp,svg,webmanifest,woff2}',
                    ],
                    navigateFallback: pwaScope === './' ? 'index.html' : `${pwaScope}index.html`,
                    navigateFallbackDenylist: [/\/offline\.html$/, /\/tokens\.html$/],
                },
                devOptions: {
                    enabled: true,
                    type: 'module',
                },
            }),
        ],
        test: {
            testTimeout: 20_000,
            hookTimeout: 20_000,
            environment: 'node',
            exclude: ['e2e/**', 'node_modules/**'],
            coverage: {
                provider: 'v8',
                include: ['src/**/*.js'],
                exclude: [
                    'src/skins/skinTypes.js',
                    'src/skins/skinIds.js',
                    'src/phaser-shim.js',
                    'src/testSeam.js',
                    'src/sceneTypes.js',
                    'src/tokensPage.js',
                    'src/testSeam/**',
                ],
                reporter: ['text', 'html', 'lcov'],
                thresholds: { lines: 94, functions: 91, branches: 82, statements: 94 },
            },
        },
    };
});
