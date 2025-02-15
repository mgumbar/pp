const puppeteer = require('puppeteer-core');

(async () => {
  const wsUrl = 'ws://46.101.203.58:3000';
  
  try {
    // Se connecter au navigateur externe via son WebSocket Endpoint
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    
    const pages = await browser.pages();
    console.log('Le navigateur a ' + pages.length + ' pages.');
    
    // Optionnel : réutiliser la première page si elle existe déjà
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Prendre une capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    // Pour une instance externe, il est souvent préférable de se déconnecter
    // afin de ne pas fermer complètement le navigateur distant :
    // await browser.disconnect();
    // Sinon, si vous souhaitez fermer l'instance distante :
    await browser.close();
    
  } catch (error) {
    console.error('Erreur lors de l’exécution du script :', error);
  }
})();
