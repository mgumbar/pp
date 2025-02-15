const puppeteer = require('puppeteer-core');
import puppeteer from 'puppeteer-core/lib/esm/puppeteer/puppeteer-core-browser.js';

const browser = await puppeteer.connect({
  browserWSEndpoint: wsUrl,
});

alert('Browser has ' + (await browser.pages()).length + ' pages');

browser.disconnect();
(async () => {
  try {
    const browserURL = 'wss://46.101.203.58:3000';
    // Se connecter au navigateur externe lancé avec --remote-debugging-port
    const browser = await puppeteer.connect({
  browserWSEndpoint: browserURL,
});
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'google_screenshot.png' });
    
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    await browser.close();
  } catch (error) {
    console.error('Erreur lors de l’exécution du script :', error);
  }
})();
