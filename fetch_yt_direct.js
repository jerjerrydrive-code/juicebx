const https = require('https');
const fs = require('fs');

const songs = [
  "Lucid Dreams Juice WRLD",
  "All Girls Are The Same Juice WRLD",
  "Robbery Juice WRLD",
  "Lean Wit Me Juice WRLD",
  "Wishing Well Juice WRLD",
  "Armed and Dangerous Juice WRLD",
  "Righteous Juice WRLD",
  "Bandit Juice WRLD",
  "Wasted Juice WRLD",
  "Black & White Juice WRLD",
  "Legends Juice WRLD",
  "Fast Juice WRLD",
  "Hear Me Calling Juice WRLD",
  "Flaws and Sins Juice WRLD",
  "Come & Go Juice WRLD",
  "Burn Juice WRLD",
  "Already Dead Juice WRLD",
  "Cigarettes Juice WRLD",
  "Sometimes Juice WRLD",
  "Conversations Juice WRLD",
  "Hate the Other Side Juice WRLD",
  "Man of the Year Juice WRLD",
  "Lace It Juice WRLD",
  "Doomsday Cordae Juice WRLD",
  "Fine China Juice WRLD Future",
  "Rental Juice WRLD",
  "Red Moonlight Juice WRLD",
  "KTM Drip Juice WRLD",
  "Biscotti in the Air Juice WRLD",
  "Starfire Juice WRLD",
  "Autograph Juice WRLD",
  "Off The Rip Juice WRLD",
  "Iron On Me Juice WRLD",
  "Purple Moncler Juice WRLD",
  "High Tide Juice WRLD",
  "Victorious Juice WRLD",
  "The Weeknd Blinding Lights",
  "Daft Punk Starboy",
  "Harry Styles As It Was",
  "Joji Glimpse of Us",
  "Kavinsky Nightcall",
  "Travis Scott FE!N",
  "Post Malone Circles",
  "Lil Uzi Vert XO Tour Llif3",
  "Drake God's Plan"
];

function fetchSearch(query) {
  return new Promise((resolve) => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`;
    const req = https.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const match = data.match(/var ytInitialData = ({.*?});<\/script>/s);
          if (!match) return resolve(null);
          const json = JSON.parse(match[1]);
          const sections = json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
          const items = sections[0]?.itemSectionRenderer?.contents || [];
          for (const item of items) {
            if (item.videoRenderer && item.videoRenderer.videoId) {
              const vr = item.videoRenderer;
              const videoId = vr.videoId;
              const title = vr.title?.runs?.map(r => r.text).join('') || vr.title?.simpleText || '';
              const author = vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || 'Unknown';
              const duration = vr.lengthText?.simpleText || '3:30';
              const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              return resolve({ id: videoId, title, artist: author, duration, thumb });
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(4000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

(async () => {
  console.log('Querying real YouTube tracks...');
  const map = {};
  for (const q of songs) {
    const res = await fetchSearch(q);
    if (res) {
      console.log(`[FOUND] ${q} -> ${res.id} (${res.title})`);
      map[q.toLowerCase()] = res;
    } else {
      console.log(`[MISS] ${q}`);
    }
  }
  fs.writeFileSync('./verified_yt_cache.json', JSON.stringify(map, null, 2));
  console.log('Done!');
})();
