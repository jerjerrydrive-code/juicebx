const https = require('https');

const instances = [
    'pipedapi.kavin.rocks',
    'pipedapi.tokhmi.xyz',
    'pipedapi.syncpundit.io',
    'api.piped.projectsegfau.lt',
    'piped-api.garudalinux.org',
    'pipedapi.adminforge.de',
    'piped-api.lunar.icu'
];

async function checkInstance(host) {
    return new Promise((resolve) => {
        const req = https.get(`https://${host}/trending?region=US`, { timeout: 3000 }, (res) => {
            resolve({ host, status: res.statusCode });
        });
        req.on('error', (e) => resolve({ host, status: `ERROR: ${e.message}` }));
        req.on('timeout', () => { req.destroy(); resolve({ host, status: 'TIMEOUT' }); });
    });
}

async function findValidInstance() {
    console.log("Checking Piped API Instances...");
    let found = null;
    for (let host of instances) {
        const res = await checkInstance(host);
        console.log(`- ${res.host}: ${res.status}`);
        if (res.status === 200 && !found) {
            found = host;
        }
    }
    console.log(`\nBEST WORKING INSTANCE: ${found || 'NONE'}`);
}
findValidInstance();
