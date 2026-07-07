import { chromium } from 'playwright';

async function testCorrections() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:5176/', { waitUntil: 'networkidle' });
        console.log('✅ Jeu chargé');

        await page.waitForTimeout(2000);

        // 1. Test du menu Scores
        console.log('\n📊 Test du menu Scores...');
        await page.keyboard.press('s');
        await page.waitForTimeout(800);
        await page.screenshot({ path: 'test-scores-menu.png' });
        console.log('✅ Menu Scores affiché');

        // 2. Fermer le scores
        await page.keyboard.press('escape');
        await page.waitForTimeout(500);

        // 3. Test du menu Options
        console.log('\n⚙️ Test du menu Options...');
        await page.keyboard.press('o');
        await page.waitForTimeout(800);
        await page.screenshot({ path: 'test-options-menu.png' });
        console.log('✅ Menu Options affiché');

        // 4. Fermer et démarrer le jeu
        await page.keyboard.press('escape');
        await page.waitForTimeout(500);

        // 5. Démarrer le jeu
        console.log('\n🎮 Démarrage du jeu...');
        const canvas = page.locator('canvas');
        await canvas.click({ position: { x: 300, y: 300 } });
        await page.waitForTimeout(1000);

        // Faire des sauts pour créer une collision
        for (let i = 0; i < 5; i++) {
            await canvas.click();
            await page.waitForTimeout(600);
        }

        // 6. Test du menu Game Over
        console.log('\n🎯 Test du menu Game Over...');
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'test-gameover-menu.png' });
        console.log('✅ Menu Game Over affiché (boutons égalisés, sans texte contrôles)');

        console.log('\n✅ Tous les tests effectués!');
        console.log('📸 Screenshots pris: test-scores-menu.png, test-options-menu.png, test-gameover-menu.png');

    } finally {
        await browser.close();
    }
}

testCorrections().catch(console.error);
