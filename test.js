const puppeteer = require('puppeteer-core');

(async () => {
  const wsUrl = 'ws://46.101.203.58:3000';
  
  try {
    // Se connecter au navigateur externe via son WebSocket Endpoint
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    
    let pages = await browser.pages();
    console.log('Le navigateur a ' + pages.length + ' pages.');
    
    // Réutiliser la première page existante si elle est disponible
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    
    // Naviguer vers Google en attendant que le chargement soit complet
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    await page.waitForSelector('body');       // S'assurer que le <body> est présent
    await page.waitForTimeout(500);             // Petite pause pour plus de stabilité
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    // Déconnecter du navigateur sans le fermer (si l'instance est contrôlée à l'extérieur)
    await browser.disconnect();
    
  } catch (error) {
    console.error('Erreur lors de l’exécution du script :', error);
  }
})();
