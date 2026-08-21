const https = require('https');

const instances = [
    'vid.puffyan.us',
    'invidious.namazso.eu',
    'inv.tux.pizza',
    'invidious.flokinet.to',
    'invidious.nerdvpn.de',
    'invidious.privacyredirect.com'
];

async function checkInstance(host) {
    return new Promise((resolve) => {
        const req = https.get(`https://${host}/api/v1/search?q=test`, { timeout: 3000 }, (res) => {
            let data = '';
            res.on('data', c => data+=c);
            res.on('end', () => resolve({ host, status: res.statusCode, valid: data.includes('videoId') }));
        });
        req.on('error', (e) => resolve({ host, status: `ERROR: ${e.message}`, valid: false }));
        req.on('timeout', () => { req.destroy(); resolve({ host, status: 'TIMEOUT', valid: false }); });
    });
}

async function findValidInstance() {
    console.log("Checking Invidious API Instances...");
    for (let host of instances) {
        const res = await checkInstance(host);
        console.log(`- ${res.host}: ${res.status} (Valid JSON: ${res.valid})`);
    }
}
findValidInstance();
