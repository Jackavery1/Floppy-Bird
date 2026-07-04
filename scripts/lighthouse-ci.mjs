import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const URL = 'http://127.0.0.1:4173/';

/** Seuils bloquants CI (jeu canvas : perf souvent sans LCP). */
const THRESHOLDS = Object.freeze({
    accessibility: 0.9,
    'best-practices': 0.9,
    seo: 0.85,
});

/** Informatif — Phaser canvas sans LCP classique. */
const INFO_CATEGORIES = Object.freeze(['performance']);

async function waitForServer(url, attempts = 40) {
    for (let i = 0; i < attempts; i++) {
        try {
            const res = await fetch(url);
            if (res.ok) return;
        } catch {
            /* serveur pas encore prêt */
        }
        await delay(500);
    }
    throw new Error(`Serveur Lighthouse indisponible : ${url}`);
}

function spawnPreview() {
    return spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173'], {
        shell: true,
        stdio: 'ignore',
    });
}

async function runLighthouseAudit() {
    const preview = spawnPreview();
    let chrome;

    try {
        await waitForServer(URL);
        chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox'] });
        const categories = [...Object.keys(THRESHOLDS), ...INFO_CATEGORIES];
        const result = await lighthouse(URL, {
            port: chrome.port,
            onlyCategories: categories,
            output: 'json',
        });

        let failed = false;
        for (const [category, minScore] of Object.entries(THRESHOLDS)) {
            const score = result.lhr.categories[category]?.score ?? 0;
            const pct = Math.round(score * 100);
            const minPct = Math.round(minScore * 100);
            const ok = score >= minScore;
            console.log(`${ok ? '✓' : '✗'} ${category}: ${pct} (seuil ${minPct})`);
            if (!ok) failed = true;
        }
        for (const category of INFO_CATEGORIES) {
            const score = result.lhr.categories[category]?.score ?? 0;
            const pct = Math.round(score * 100);
            console.log(`ℹ ${category}: ${pct} (informatif, canvas Phaser)`);
        }

        if (failed) {
            process.exitCode = 1;
        }
    } finally {
        if (chrome) {
            try {
                await chrome.kill();
            } catch {
                /* ignore */
            }
        }
        preview.kill();
    }
}

runLighthouseAudit().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
