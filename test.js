// Assurez-vous d'avoir "type": "module" dans votre package.json
import puppeteer from 'puppeteer-core';

(async () => {
  try {
    // Utilisez ws:// si votre instance n'est pas configurée pour SSL/TLS
    const wsUrl = 'ws://46.101.203.58:3000';
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    
    const pages = await browser.pages();
    console.log('Le navigateur a ' + pages.length + ' pages.');
    
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    await page.screenshot({ path: 'google_screenshot.png' });
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    // Fermer la connexion au navigateur (selon vos besoins)
    await browser.close();
    
  } catch (error) {
    console.error('Erreur lors de l’exécution du script :', error);
  }
})();
