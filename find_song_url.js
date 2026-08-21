const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function findAudioUrlBuilder() {
  const html = await fetchUrl('https://www.juicewrldvault.com/');
  const scriptMatches = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)];
  
  for (const m of scriptMatches) {
    const url = 'https://www.juicewrldvault.com' + m[1];
    const code = await fetchUrl(url);
    if (code.includes('song_path') || code.includes('supabase.co/storage')) {
      console.log('Match in chunk:', m[1]);
      const matches = code.match(/https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/[a-zA-Z0-9_-]+/g);
      if (matches) console.log('Found Supabase Storage URLs:', matches);
      
      const audioUrlMatches = code.match(/(?:getSongUrl|songUrl|audioUrl|song_path)[^;]{0,120}/g);
      if (audioUrlMatches) console.log('Audio URL code snippets:', audioUrlMatches.slice(0, 8));
    }
  }
}

findAudioUrlBuilder().catch(console.error);
