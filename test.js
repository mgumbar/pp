const puppeteer = require('puppeteer-core');

(async () => {
    /*
    // Exemple de lancement d'une nouvelle instance de navigateur avec puppeteer.launch()
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

    // Adresse de l'instance du navigateur externe lancé avec --remote-debugging-port
    const browserURL = 'http://46.101.203.58:3000';
    
    // Se connecter au navigateur externe
    const browser = await puppeteer.connect({ browserURL });
    
    // Ouvrir une nouvelle page et naviguer
    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2' });
    
    // Prendre la capture d'écran
    await page.screenshot({ path: 'google_screenshot.png' });
    
    console.log('Capture d’écran enregistrée sous google_screenshot.png');
    
    // Fermer la connexion (ne ferme pas nécessairement le navigateur externe)
    await browser.close();
})();
