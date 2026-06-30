import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 45_000,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,
    use: {
        baseURL: 'http://127.0.0.1:4173',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'npx vite preview --host 127.0.0.1 --port 4173',
        port: 4173,
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        {
            name: 'chromium-desktop',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'chromium-mobile-portrait',
            use: {
                browserName: 'chromium',
                viewport: { width: 390, height: 844 },
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: 'chromium-mobile-landscape',
            use: {
                ...devices['Pixel 5'],
                viewport: { width: 844, height: 390 },
                isMobile: true,
                hasTouch: true,
            },
        },
    ],
});
