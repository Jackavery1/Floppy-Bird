import { chromium } from 'playwright';

async function playGame() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        console.log('✅ Jeu chargé');

        // Attendre que le menu soit visible
        await page.waitForTimeout(2000);

        // Screenshot du menu
        await page.screenshot({ path: 'menu-screenshot.png' });
        console.log('📸 Screenshot menu pris');

        // Cliquer sur "JOUER" (difficulté NORMAL par défaut)
        const canvas = page.locator('canvas');
        await canvas.click({ position: { x: 300, y: 300 } });
        console.log('🎮 Jeu démarré!');

        // Jouer pendant un peu
        for (let i = 0; i < 5; i++) {
            await canvas.click({ position: { x: 300, y: 300 } });
            await page.waitForTimeout(800);
        }

        console.log('✈️ Sauts effectués');

        // Attendre collision
        await page.waitForTimeout(2000);

        // Screenshot du gameplay/collision
        await page.screenshot({ path: 'gameplay-screenshot.png' });
        console.log('📸 Screenshot gameplay pris');

        // Attendre game over
        await page.waitForTimeout(1000);

        // Screenshot game over
        await page.screenshot({ path: 'gameover-screenshot.png' });
        console.log('📸 Screenshot game over pris');

        console.log('✅ Test complet! Screenshots sauvegardés');

    } finally {
        await browser.close();
    }
}

playGame().catch(console.error);
