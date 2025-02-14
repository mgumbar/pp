require('dotenv').config();
const puppeteer = require('puppeteer');
const {MongoClient} = require('mongodb');
const uri = process.env.MONGO_URI;
const codes = process.env.CODES.split(',');
console.log(codes);


async function run() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('marketData');
    const collection = db.collection('forecasts');
    const collectionIndices = db.collection('indices');
    console.log('Connected to MongoDB');
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
    const page = await browser.newPage();

    try {
        await page.setViewport({width: 1080, height: 1024});
        for (const code of codes) {
            try {
                console.log(`Fetching data for ${code}`);
                const url = `https://fr.tradingview.com/symbols/${code}/forecast/`;
                const urlYahoo = `https://fr.finance.yahoo.com/quote/NVDA/${code}/analysis/`;
                await page.goto(url, {waitUntil: 'networkidle2'});
                try {
                    // cette element met du temps à s'afficher et genere bcp d'erreur, donc on attend des le debut.
                    await page.waitForSelector(
                        '#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.change-JWoJqCpY.js-symbol-change-direction.up-Cg53lmZp > span:nth-child(1)',
                        {timeout: 5000}
                    );
                } catch (e) {
                }

                const baseSelector = '#js-category-content > div.forecast-root > div > div.contentWrap-P1zVT2GT.forecastPage-P1zVT2GT > div.wrap-P1zVT2GT';
                const getText = selector => page.$eval(`${baseSelector} ${selector}`, element => element.textContent.trim());
                // GLOBAL SELECTOR
                const globalBaseSelector = '';
                const getTextGlobal = selector => page.$eval(`${globalBaseSelector} ${selector}`, element => element.textContent.trim());

                //Percentage
                var percentage = await getText('> div.analysisContainer-P1zVT2GT > div.sectionHeader-QrSDBtZ9 > div > div.container-qWcO4bp9.priceLargeContainer-Cimg1AIh.detailsPriceWrap-Cimg1AIh > span.wrap-SNvPvlJ3.changeWrap-qWcO4bp9 > span:nth-child(2)');
                if (percentage == "NaN") {
                    percentage = await getText('#js-category-content > div.forecast-root > div > div.contentWrap-P1zVT2GT.forecastPage-P1zVT2GT > div.wrap-P1zVT2GT > div.analysisContainer-P1zVT2GT > div.sectionHeader-QrSDBtZ9 > div > div.container-qWcO4bp9.priceLargeContainer-Cimg1AIh.detailsPriceWrap-Cimg1AIh > span.wrap-SNvPvlJ3.changeWrap-qWcO4bp9 > span:nth-child(2)');
                }

                //Analyse
                const analyse = await getText('> div.analysisContainer-P1zVT2GT > div.sectionHeader-QrSDBtZ9 > div > div.sectionSubtitle-QrSDBtZ9.sectionSubtitle-NO4YolWC.sectionSubtitle-Cimg1AIh');

                //Current price
                const currentPrice = await getTextGlobal('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.lastContainer-JWoJqCpY > span.last-JWoJqCpY.js-symbol-last > span');

                //target price
                const targetPrice = await getTextGlobal('#js-category-content > div.forecast-root > div > div.contentWrap-P1zVT2GT.forecastPage-P1zVT2GT > div.wrap-P1zVT2GT > div.analysisContainer-P1zVT2GT > div.sectionHeader-QrSDBtZ9 > div > div.container-qWcO4bp9.priceLargeContainer-Cimg1AIh.detailsPriceWrap-Cimg1AIh > span.priceWrapper-qWcO4bp9.priceWrapper-Cimg1AIh > span.highlight-maJ2WnzA.highlight-Cimg1AIh.price-qWcO4bp9');

                //CurrentProgress
                var currentProgress = null;
                try {

                    currentProgress = await getTextGlobal('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.change-JWoJqCpY.js-symbol-change-direction.up-Cg53lmZp > span:nth-child(1)');
                } catch (e) {
                    currentProgress = await getTextGlobal('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.change-JWoJqCpY.js-symbol-change-direction.down-Cg53lmZp > span:nth-child(1)');
                }

                //CurrentProgressInPercentage
                var currentProgressInPercentage = null;
                try {
                    currentProgressInPercentage = await getTextGlobal('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.change-JWoJqCpY.js-symbol-change-direction.up-Cg53lmZp > span.js-symbol-change-pt');
                } catch (e) {
                    currentProgressInPercentage = await getTextGlobal('#js-category-content > div.tv-react-category-header > div.js-symbol-page-header-root > div > div > div > div.quotesRow-pAUXADuj > div:nth-child(1) > div > div.change-JWoJqCpY.js-symbol-change-direction.down-Cg53lmZp > span.js-symbol-change-pt');
                }

                // Rating
                const ratings = ['Strong Buy', 'Buy', 'Maintain', 'Sell', 'Strong Sell'];
                const ratingsData = {};
                for (let i = 0; i < ratings.length; i++) {
                    const rating = await getText(`> div.container-GHsBEiaH.analysisRating-P1zVT2GT > div.analystRating-GHsBEiaH > div > div.wrap-GNeDL9vy > div:nth-child(${3 + i * 3})`);
                    ratingsData[ratings[i]] = convertToDecimal(rating);
                }
                const dateTime = new Date();

                // screenshot of the page
                await page.setViewport({width: 1920, height: 2000, deviceScaleFactor: 2});
                const screenshotBuffer = await page.screenshot({encoding: "base64"});
                const screenshotBase64 = screenshotBuffer.toString('base64');

                const marketAnalystRecommendation = await getMarketAnalystRecommendation(code.split('-')[1]);
                //Record
                const data = {
                    "code": code,
                    "targetPercentage": convertToDecimal(percentage),
                    "currentPrice": convertToDecimal(currentPrice),
                    "targetPrice": convertToDecimal(targetPrice),
                    "analyse": analyse,
                    "strongBuy": ratingsData[ratings[0]],
                    "buy": ratingsData[ratings[1]],
                    "maintain": ratingsData[ratings[2]],
                    "sell": ratingsData[ratings[3]],
                    "strongSell": ratingsData[ratings[4]],
                    "currentProgress": convertToDecimal(currentProgress),
                    "currentProgressInPercentage": convertToDecimal(currentProgressInPercentage),
                    "date": dateTime.toISOString().split('T')[0],
                    "dateTime": dateTime,
                    "screenshot": screenshotBase64,
                    "marketAnalystRecommendation": marketAnalystRecommendation
                };


                console.log('Data inserted:', data);
                var query = {"code": code, "date": dateTime.toISOString().split('T')[0]};
                var update = {$set: data};
                var options = {upsert: true};
                await collection.updateOne(query, update, options);

                // liste des codes que l'application gere, elle est ensuite utilisé par le backend.
                query = {"code": code};
                update = {$set: {"code": code}};
                await collectionIndices.updateOne(query, update, options);

                console.log('----------------------------------');
            } catch
                (e) {
                console.error('Error on code :', code);
                console.error('Error on details:', e);
            }
        }

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

run();


function convertToDecimal(inputString) {
    let formattedString = inputString.replace(',', '.');
    formattedString = formattedString.replace('%', '');
    formattedString = formattedString.replace('−', '-');
    let decimalNumber = parseFloat(formattedString);
    return decimalNumber;
}

async function getMarketAnalystRecommendation(indice) {
    console.log("Fetching data from yahoo: " + indice);

    // Lancement du navigateur en mode visible pour le débogage
    const browser2 = await puppeteer.launch({ 
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
})
    const page = await browser2.newPage();

    try {
        // URL de la page d'analyse pour NVDA sur Yahoo Finance
        const url = 'https://fr.finance.yahoo.com/quote/NVDA/analysis/';
        await page.goto(url, {waitUntil: 'networkidle0'});

        // Rechercher et cliquer sur le bouton dont le texte contient "Accepter"
        await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
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

        // Attente de l'apparition du tableau
        try {
            await page.waitForSelector(tableSelector, {timeout: 60000});
        } catch (err) {
            console.error("Sélecteur non trouvé dans le délai imparti :", err);
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

        return rowsData;
    } catch (error) {
        console.error("Une erreur est survenue :", error);
    } finally {
        await browser2.close();
    }
}
