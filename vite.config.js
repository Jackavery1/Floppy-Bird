import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser'],
                },
            },
        },
    },
    plugins: [
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
                    {
                        src: 'icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
                screenshots: [
                    {
                        src: 'icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        form_factor: 'narrow',
                        label: 'Floppy Bird en jeu',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,json,ico,webp,svg}'],
                navigateFallback: 'offline.html',
            },
        }),
    ],
});
