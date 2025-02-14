const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
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
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Prendre la capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    await browser.close();
})();
