import { chromium } from 'playwright';

async function playGame() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
        console.log('🎮 Floppy Bird lancé!');
        console.log('✅ Corrections apportées:');
        console.log('   - Menu Scores: contenu visible');
        console.log('   - Bouton REJOUER: réduit et égalisé');
        console.log('   - Panel Game Over: agrandi (plus d\'espace)');
        console.log('   - Texte contrôles: enlevé du game over');
        console.log('\n📝 Contrôles: ESPACE/TAP pour sauter');
        console.log('   S: Scores, O: Options, K: Skins');

        // Keep browser open
        await new Promise(() => {});
    } catch (error) {
        console.error('Erreur:', error);
        await browser.close();
    }
}

playGame();
