const puppeteer = require('puppeteer');

(async () => {
    // Lancement du navigateur en mode visible pour le débogage
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    // URL de la page d'analyse pour NVDA sur Yahoo Finance
    const url = 'https://fr.finance.yahoo.com/quote/NVDA/analysis/';
    await page.goto(url, {waitUntil: 'networkidle0'});

    // Optionnel : attendre quelques secondes supplémentaires pour que le contenu se charge

    // Rechercher et cliquer sur le bouton dont le texte contient "Accepter"
    await page.evaluate(() => {
        // Récupère tous les boutons présents sur la page
        const buttons = Array.from(document.querySelectorAll('button'));
        // Cherche un bouton dont le texte contient "Accepter"
        const acceptBtn = buttons.find(btn => btn.innerText && btn.innerText.includes('Accepter tout'));
        if (acceptBtn) {
            acceptBtn.click();
            console.log("Bandeau de cookies : bouton 'Accepter' cliqué.");
        } else {
            console.log("Bandeau de cookies : bouton 'Accepter' non trouvé.");
        }
    });

    // Sélecteur du tableau "Révisions à la hausse et à la baisse"
    const tableSelector = "#nimbus-app > section > section > section > article > section:nth-child(10) > div > table > tbody";

    try {
        // Augmentation du délai d'attente à 60 secondes
        await page.waitForSelector(tableSelector, {timeout: 60000});
    } catch (err) {
        console.error("Sélecteur non trouvé dans le délai imparti :", err);
        // Prendre une capture d'écran pour voir l'état de la page
        await page.screenshot({path: 'debug_table.png'});
        await browser.close();
        return;
    }

    // Extraction des données du tableau depuis le DOM
    const rowsData = await page.evaluate((selector) => {
        const rows = Array.from(document.querySelectorAll(selector + ' tr'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                recommendation: cells[0] ? cells[0].innerText.trim() : '',
                analyst: cells[1] ? cells[1].innerText.trim() : '',
                date: cells[2] ? cells[2].innerText.trim() : '',
            };
        });
    }, tableSelector);
    console.log(rowsData);
    await browser.close();
})();


