import { chromium } from 'playwright';

async function launchGame() {
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('🎮 Lancement du jeu Floppy Bird...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        console.log('✅ Jeu chargé!');
        console.log('📝 Contrôles:');
        console.log('  - ESPACE/TAP: Sauter');
        console.log('  - 1/2/3: Difficulté (menu)');
        console.log('  - T: Mode entraînement');
        console.log('  - D: Défi du jour');
        console.log('  - O: Options');
        console.log('  - S: Scores');
        console.log('  - K: Changer apparence');
        console.log('  - ESC: Pause');
        console.log('  - M: Menu principal');
        console.log('\n🎮 Amusez-vous!');

        // Garder le navigateur ouvert indéfiniment
        await new Promise(() => {});

    } catch (error) {
        console.error('❌ Erreur:', error);
        await browser.close();
    }
}

launchGame();
