const puppeteer = require('puppeteer-core');

(async () => {
    /*
    const browser = await puppeteer.launch({ 
        executablePath: '/usr/bin/chromium-browser',
    headless: true,
            args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-crash-reporter',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--disable-extensions'
    ]
});
*/
      const browserURL = 'http://46.101.203.58:3000';
  
  // Se connecter au navigateur externe
  const browser = await puppeteer.connect({ browserURL });
    
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Prendre la capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    await browser.close();
})();
