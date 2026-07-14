import { defineConfig, devices } from '@playwright/test';

function previewBaseUrl() {
    const basePath = process.env.BASE_PATH;
    if (!basePath || basePath === './') {
        return 'http://127.0.0.1:4173';
    }
    const path = basePath.startsWith('/') ? basePath : `/${basePath}`;
    const normalized = path.endsWith('/') ? path : `${path}/`;
    return `http://127.0.0.1:4173${normalized}`;
}

const previewCommand =
    process.env.CI && process.env.PLAYWRIGHT_SKIP_BUILD === '1'
        ? 'npx vite preview --host 127.0.0.1 --port 4173'
        : 'npm run build && npx vite preview --host 127.0.0.1 --port 4173';

export default defineConfig({
    testDir: './e2e',
    timeout: 45_000,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,
    use: {
        baseURL: previewBaseUrl(),
        trace: 'on-first-retry',
        serviceWorkers: 'allow',
    },
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.025,
            animations: 'disabled',
            pathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
        },
    },
    webServer: {
        command: previewCommand,
        port: 4173,
        reuseExistingServer: !process.env.CI,
        env: {
            ...process.env,
            VITE_ENABLE_TEST_SEAM: 'true',
        },
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
        {
            name: 'webkit-mobile-portrait',
            use: { ...devices['iPhone 13'] },
        },
        {
            name: 'webkit-mobile-landscape',
            use: {
                browserName: 'webkit',
                ...devices['iPhone 13'],
                viewport: { width: 844, height: 390 },
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: 'webkit-tablet-portrait',
            use: {
                browserName: 'webkit',
                viewport: { width: 768, height: 1024 },
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: 'chromium-tablet-portrait',
            use: {
                browserName: 'chromium',
                viewport: { width: 768, height: 1024 },
                isMobile: true,
                hasTouch: true,
            },
        },
        {
            name: 'chromium-tablet-landscape',
            use: {
                browserName: 'chromium',
                viewport: { width: 1024, height: 768 },
                isMobile: true,
                hasTouch: true,
            },
        },
    ],
});
