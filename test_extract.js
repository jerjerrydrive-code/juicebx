const https = require('https');

function search(query) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
        const ids = [];
        let m;
        while ((m = regex.exec(d)) !== null) {
          if (!ids.includes(m[1])) ids.push(m[1]);
        }
        resolve(ids.slice(0, 5));
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  const songs = ["Juice WRLD Lucid Dreams", "Juice WRLD Robbery", "Juice WRLD Wishing Well", "Juice WRLD Bandit", "Juice WRLD Righteous"];
  for (const s of songs) {
    const ids = await search(s);
    console.log(s, '->', ids);
  }
})();
