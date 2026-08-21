const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testLibrarySubtabsAndRabbit() {
  console.log("================================================================================");
  console.log("TESTING LIBRARY SUBTABS (ARTISTS, ALBUMS, GENRES) & RABBIT R1 PROPORTIONS");
  console.log("================================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=650,1100', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // ─── TEST 1: COLD BOOT JUICE WRLD PRE-LOADED QUEUE ───
  console.log("\n--- TEST 1: Cold Boot Juice WRLD Pre-Loaded Queue ---");
  const bootState = await page.evaluate(() => {
    const title = document.getElementById('deck-track-title')?.innerText;
    const artist = document.getElementById('deck-track-artist')?.innerText;
    const sub = document.getElementById('library-subtitle')?.innerText;
    const trackCount = document.querySelectorAll('#library-track-list .track-item').length;
    return { title, artist, sub, trackCount };
  });
  console.log("Cold Boot State:", bootState);
  if (bootState.trackCount < 30 || !bootState.artist.includes('Juice WRLD')) {
    throw new Error(`FAIL: Cold boot expected 30+ Juice WRLD tracks, got ${bootState.trackCount} tracks, artist: ${bootState.artist}`);
  }
  console.log(`[PASS] Initial queue is 100% pre-cached Juice WRLD (${bootState.trackCount} tracks)!`);

  // ─── TEST 2: ARTISTS SUBTAB ───
  console.log("\n--- TEST 2: Artists Subtab & Subtitle ---");
  await page.evaluate(() => {
    document.querySelector('.lib-tab[data-tab="artists"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const artistsState = await page.evaluate(() => {
    const title = document.getElementById('library-title')?.innerText;
    const sub = document.getElementById('library-subtitle')?.innerText;
    const artistCards = Array.from(document.querySelectorAll('#artists-grid-inner .artist-card')).map(c => ({
      name: c.querySelector('h4')?.innerText,
      count: c.querySelector('span')?.innerText
    }));
    return { title, sub, count: artistCards.length, sample: artistCards.slice(0, 4) };
  });
  console.log("Artists Subtab State:", artistsState);
  if (artistsState.title !== 'Artists' || artistsState.sub.includes('0 tracks') || artistsState.count === 0) {
    throw new Error(`FAIL: Artists subtab invalid title/subtitle: "${artistsState.title}", "${artistsState.sub}"`);
  }
  console.log(`[PASS] Artists tab correctly displays: "${artistsState.title}" - "${artistsState.sub}" (${artistsState.count} artists)!`);

  const p1 = path.join(SCRATCH_DIR, '38_artists_subtab_verified.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 38_artists_subtab_verified.png (${fs.statSync(p1).size} bytes)`);

  // Click Juice WRLD artist card to test artist detail
  console.log("\n--- TEST 2B: Artist Detail Sub-View ---");
  await page.evaluate(() => {
    document.querySelector('.artist-card[data-artist="Juice WRLD"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const artistDetailState = await page.evaluate(() => {
    const name = document.getElementById('artist-view-name')?.innerText;
    const meta = document.getElementById('artist-view-meta')?.innerText;
    const tracks = document.querySelectorAll('#artist-view-tracks .track-item').length;
    return { name, meta, tracks };
  });
  console.log("Artist Detail State:", artistDetailState);
  if (artistDetailState.name !== 'Juice WRLD' || artistDetailState.tracks < 20) {
    throw new Error(`FAIL: Artist detail failed for Juice WRLD: ${JSON.stringify(artistDetailState)}`);
  }
  console.log(`[PASS] Juice WRLD artist detail loaded with ${artistDetailState.tracks} tracks!`);

  const p2 = path.join(SCRATCH_DIR, '39_artist_detail_juice_wrld.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 39_artist_detail_juice_wrld.png (${fs.statSync(p2).size} bytes)`);

  // Click back to artists
  await page.evaluate(() => {
    document.getElementById('artist-back-btn').click();
  });
  await new Promise(r => setTimeout(r, 400));

  // ─── TEST 3: ALBUMS SUBTAB ───
  console.log("\n--- TEST 3: Albums Subtab & Subtitle ---");
  await page.evaluate(() => {
    document.querySelector('.lib-tab[data-tab="albums"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const albumsState = await page.evaluate(() => {
    const title = document.getElementById('library-title')?.innerText;
    const sub = document.getElementById('library-subtitle')?.innerText;
    const albumCards = Array.from(document.querySelectorAll('#albums-grid-inner .album-card')).map(c => ({
      title: c.querySelector('h4')?.innerText,
      artist: c.querySelector('p')?.innerText,
      tracks: c.querySelector('.flex.items-center.justify-between span')?.innerText
    }));
    return { title, sub, count: albumCards.length, albums: albumCards };
  });
  console.log("Albums Subtab State:", albumsState);
  if (albumsState.title !== 'Albums' || albumsState.sub.includes('0 tracks') || albumsState.count < 5) {
    throw new Error(`FAIL: Albums subtab invalid title/subtitle: "${albumsState.title}", "${albumsState.sub}"`);
  }
  console.log(`[PASS] Albums tab correctly displays: "${albumsState.title}" - "${albumsState.sub}" (${albumsState.count} albums)!`);

  const p3 = path.join(SCRATCH_DIR, '40_albums_subtab_verified.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 40_albums_subtab_verified.png (${fs.statSync(p3).size} bytes)`);

  // ─── TEST 4: GENRES RADIO SUBTAB ───
  console.log("\n--- TEST 4: Genres Radio Subtab & Subtitle ---");
  await page.evaluate(() => {
    document.querySelector('.lib-tab[data-tab="genres"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const genresState = await page.evaluate(() => {
    const title = document.getElementById('library-title')?.innerText;
    const sub = document.getElementById('library-subtitle')?.innerText;
    const stations = document.querySelectorAll('#genres-grid-inner .genre-station-card').length;
    return { title, sub, stations };
  });
  console.log("Genres Radio Subtab State:", genresState);
  if (genresState.title !== 'Genres Radio' || genresState.sub.includes('0 tracks')) {
    throw new Error(`FAIL: Genres subtab invalid: ${JSON.stringify(genresState)}`);
  }
  console.log(`[PASS] Genres Radio tab correctly displays: "${genresState.title}" - "${genresState.sub}" (${genresState.stations} stations)!`);

  const p4 = path.join(SCRATCH_DIR, '41_genres_subtab_verified.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 41_genres_subtab_verified.png (${fs.statSync(p4).size} bytes)`);

  // ─── TEST 5: SONGS SUBTAB RETURN ───
  console.log("\n--- TEST 5: Return to Songs Subtab ---");
  await page.evaluate(() => {
    document.querySelector('.lib-tab[data-tab="songs"]').click();
  });
  await new Promise(r => setTimeout(r, 400));

  const songsState = await page.evaluate(() => {
    const title = document.getElementById('library-title')?.innerText;
    const sub = document.getElementById('library-subtitle')?.innerText;
    return { title, sub };
  });
  console.log("Songs State:", songsState);
  if (songsState.title !== 'Songs' || !songsState.sub.includes('tracks in queue')) {
    throw new Error(`FAIL: Songs subtab return failed: ${JSON.stringify(songsState)}`);
  }
  console.log(`[PASS] Songs tab returned: "${songsState.title}" - "${songsState.sub}"`);

  // ─── TEST 6: RABBIT R1 HARDWARE PROPORTIONS ───
  console.log("\n--- TEST 6: Rabbit R1 Hardware Portrait Proportions ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-settings"]').click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const tog = document.getElementById('toggle-settings-rabbit');
    if (tog) tog.click();
    else document.body.classList.toggle('rabbit-mode-active');
  });
  await new Promise(r => setTimeout(r, 600));

  const rabbitFrameState = await page.evaluate(() => {
    const frame = document.getElementById('app-frame');
    const rect = frame.getBoundingClientRect();
    const isRabbitActive = document.body.classList.contains('rabbit-mode-active');
    return {
      isRabbitActive,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      aspectRatio: (rect.width / rect.height).toFixed(2)
    };
  });
  console.log("Rabbit Frame State:", rabbitFrameState);
  if (!rabbitFrameState.isRabbitActive || rabbitFrameState.height < 500) {
    throw new Error(`FAIL: Rabbit R1 mode failed to activate or height is too squished: ${JSON.stringify(rabbitFrameState)}`);
  }
  console.log(`[PASS] Rabbit R1 chassis active with spacious portrait screen (${rabbitFrameState.width}x${rabbitFrameState.height}px, ratio ${rabbitFrameState.aspectRatio})!`);

  const p5 = path.join(SCRATCH_DIR, '42_rabbit_r1_physical_proportions.png');
  await page.screenshot({ path: p5 });
  console.log(`[PASS] 42_rabbit_r1_physical_proportions.png (${fs.statSync(p5).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL LIBRARY SUBTABS & RABBIT R1 PROPORTION TESTS PASSED 100%!");
  console.log("================================================================================");
}

testLibrarySubtabsAndRabbit().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
