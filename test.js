const puppeteer = require('puppeteer');

(async () => {
  // Définir le point de terminaison WebSocket de browserless/chrome
  const launchArgs = JSON.stringify({
  args: [`--window-size=1920,1080`, `--user-data-dir=/tmp/chrome/data-dir`],
  headless: false,
  stealth: true,
  timeout: 5000,
});

  const wsEndpoint = `ws://172.17.0.4:3000?launch='${launchArgs}`;

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
