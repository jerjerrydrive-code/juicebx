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

async function inspectVault() {
  console.log('Fetching https://www.juicewrldvault.com/ ...');
  const html = await fetchUrl('https://www.juicewrldvault.com/');

  const scriptMatches = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)];
  const scripts = scriptMatches.map(m => 'https://www.juicewrldvault.com' + m[1]);
  console.log(`Found ${scripts.length} script chunks.`);

  const results = {
    supabaseUrls: new Set(),
    supabaseKeys: new Set(),
    apiEndpoints: new Set(),
    tables: new Set(),
    storageBuckets: new Set(),
    audioCdnUrls: new Set()
  };

  for (const url of scripts) {
    try {
      const code = await fetchUrl(url);

      const sbUrls = code.match(/https:\/\/[a-z0-9]+\.supabase\.co/g);
      if (sbUrls) sbUrls.forEach(u => results.supabaseUrls.add(u));

      const sbKeys = code.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g);
      if (sbKeys) sbKeys.forEach(k => results.supabaseKeys.add(k));

      const apis = code.match(/\/api\/[a-zA-Z0-9_/-]+/g);
      if (apis) apis.forEach(a => results.apiEndpoints.add(a));

      const froms = code.match(/\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g);
      if (froms) froms.forEach(f => results.tables.add(f));

      const buckets = code.match(/\.storage\.from\(['"]([a-zA-Z0-9_-]+)['"]\)/g);
      if (buckets) buckets.forEach(b => results.storageBuckets.add(b));

      const cdns = code.match(/https:\/\/[a-zA-Z0-9.-]+\/(audio|songs|tracks|mp3|music)[a-zA-Z0-9_./-]*/g);
      if (cdns) cdns.forEach(c => results.audioCdnUrls.add(c));
    } catch (e) {
      console.warn('Chunk fetch error:', url, e.message);
    }
  }

  console.log('\n================ JUICE WRLD VAULT BACKEND REPORT ================');
  console.log('Supabase Project URLs:', [...results.supabaseUrls]);
  console.log('Supabase Anon Keys:', [...results.supabaseKeys]);
  console.log('Database Tables:', [...results.tables]);
  console.log('Storage Buckets:', [...results.storageBuckets]);
  console.log('API Endpoints:', [...results.apiEndpoints]);
  console.log('Audio CDN URLs:', [...results.audioCdnUrls]);

  // Test Supabase REST query if key is found
  if (results.supabaseUrls.size > 0 && results.supabaseKeys.size > 0) {
    const sbUrl = [...results.supabaseUrls][0];
    const sbKey = [...results.supabaseKeys][0];
    console.log(`\nTesting Supabase REST API on ${sbUrl}/rest/v1/songs ...`);
    
    try {
      const testRes = await fetch(`${sbUrl}/rest/v1/songs?select=*&limit=5`, {
        headers: {
          'apikey': sbKey,
          'Authorization': `Bearer ${sbKey}`
        }
      });
      console.log('Supabase songs endpoint status:', testRes.status);
      if (testRes.ok) {
        const songs = await testRes.json();
        console.log('Sample Songs from Supabase:', songs);
      }
    } catch (e) {
      console.error('Supabase query error:', e.message);
    }
  }
}

inspectVault().catch(console.error);
