const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ 
    headless: true
});
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Prendre la capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    await browser.close();
})();
