const http = require('http');

const queries = [
  "Juice WRLD Lucid Dreams",
  "Juice WRLD All Girls Are The Same",
  "Juice WRLD Robbery",
  "Juice WRLD Lean Wit Me",
  "Juice WRLD Wishing Well",
  "Juice WRLD Armed and Dangerous",
  "Juice WRLD Righteous",
  "Juice WRLD Bandit",
  "Juice WRLD Wasted",
  "Juice WRLD Black and White",
  "Juice WRLD Legends",
  "Juice WRLD Fast",
  "Juice WRLD Hear Me Calling",
  "Juice WRLD Flaws and Sins",
  "Juice WRLD Come and Go",
  "Juice WRLD Burn",
  "Juice WRLD Already Dead",
  "Juice WRLD Cigarettes",
  "Juice WRLD Sometimes",
  "Juice WRLD Conversations",
  "Juice WRLD Hate the Other Side",
  "Juice WRLD Man of the Year",
  "Juice WRLD Lace It",
  "Juice WRLD Doomsday",
  "Juice WRLD Fine China",
  "Juice WRLD Rental",
  "Juice WRLD Red Moonlight",
  "Juice WRLD KTM Drip",
  "Juice WRLD Biscotti in the Air",
  "Juice WRLD Meadows",
  "Juice WRLD Cavalier",
  "Juice WRLD Starfire",
  "Juice WRLD Autograph",
  "Juice WRLD Off The Rip",
  "Juice WRLD Iron On Me",
  "Juice WRLD Carry On",
  "Juice WRLD Reminds Me Of The Summer",
  "Juice WRLD Purple Moncler",
  "Juice WRLD High Tide",
  "Juice WRLD McLaren Drive",
  "Juice WRLD Spanglish",
  "Juice WRLD Victorious",
  "Juice WRLD Krumps",
  "Juice WRLD Jack and Jill",
  "Juice WRLD Toxic Humans",
  "Juice WRLD Fire In My Lungs",
  "Juice WRLD Cake"
];

async function search(q) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:8080/api/search?q=${encodeURIComponent(q)}`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const arr = JSON.parse(d);
          resolve(arr[0] || null);
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  console.log('Resolving real IDs in parallel...');
  const results = [];
  const chunkSize = 5;
  for (let i = 0; i < queries.length; i += chunkSize) {
    const chunk = queries.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(async (q) => {
      const item = await search(q);
      if (item) {
        console.log(`✓ [${item.id}] ${q} -> ${item.title} (${item.duration})`);
        return {
          id: item.id,
          title: q.replace('Juice WRLD ', ''),
          artist: 'Juice WRLD',
          duration: item.duration,
          seconds: item.seconds,
          thumb: item.thumb
        };
      } else {
        console.log(`✗ Failed: ${q}`);
        return null;
      }
    }));
    results.push(...chunkResults.filter(Boolean));
  }

  const fs = require('fs');
  fs.writeFileSync('./verified_juice_tracks.json', JSON.stringify(results, null, 2));
  console.log(`Saved ${results.length} verified tracks!`);
})();
