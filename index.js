const cron = require('node-cron');
const { exec } = require('child_process');

console.log("Scheduler démarré:");

// Planifier l'exécution toutes les 30 minutes
cron.schedule('*/1 * * * *', () => {
    console.log('Exécution du script UpdateStrongBuyFavoriteService.js');
    exec('node UpdateStrongBuyFavoriteService.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'exécution du script : ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erreur dans le script : ${stderr}`);
            return;
        }
        console.log(`Résultat : ${stdout}`);
    });
});
