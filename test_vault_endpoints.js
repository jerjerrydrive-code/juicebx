const https = require('https');

async function testEndpoint(path) {
  try {
    const res = await fetch('https://www.juicewrldvault.com' + path, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    console.log(`[${res.status}] GET ${path}`);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Response sample:', Array.isArray(json) ? `Array(${json.length})` : typeof json, Object.keys(json).slice(0, 8));
      if (Array.isArray(json) && json.length > 0) {
        console.log('First item:', json[0]);
      } else if (json.songs || json.tracks || json.data) {
        console.log('Data sample:', (json.songs || json.tracks || json.data).slice(0, 2));
      }
    } catch(e) {
      console.log('Non-JSON text snippet:', text.slice(0, 150));
    }
  } catch(e) {
    console.error(`Error on ${path}:`, e.message);
  }
}

async function run() {
  await testEndpoint('/api/search/songs?q=Lucid+Dreams');
  await testEndpoint('/api/category-songs');
  await testEndpoint('/api/songs/shuffle-pool');
  await testEndpoint('/api/live-track');
  await testEndpoint('/api/presence/summary');
}

run();
