const puppeteer = require('puppeteer');

(async () => {
  // Définir le point de terminaison WebSocket de browserless/chrome
  const wsEndpoint = 'ws://172.17.0.4:3000';

  // Se connecter au navigateur distant
  const browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });

  // Ouvrir un nouvel onglet
  const page = await browser.newPage();

  // Naviguer vers la page de Google
  await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });

  // Prendre une capture d'écran complète et l'enregistrer dans 'google.png'
  await page.screenshot({ path: 'google.png', fullPage: true });
  console.log('Capture d\'écran enregistrée sous google.png');

  // Fermer l'onglet et se déconnecter du navigateur
  await page.close();
  await browser.disconnect();
})();
