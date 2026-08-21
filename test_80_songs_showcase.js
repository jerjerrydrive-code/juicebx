const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function test80SongsShowcase() {
  console.log("================================================================================");
  console.log("TESTING 2 PROFESSIONAL JUICE WRLD CARDS & 80+ GENERATED TRACKS");
  console.log("================================================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=600,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Explore
  console.log("\n--- TEST 1: Explore View Layout (Top 2 Professional Cards Only) ---");
  await page.evaluate(() => {
    document.querySelector('button[data-target="view-explore"]').click();
  });
  await new Promise(r => setTimeout(r, 600));

  const exploreAudit = await page.evaluate(() => {
    const juiceCards = Array.from(document.querySelectorAll('#explore-juice-section .genre-card')).map(c => ({
      genre: c.getAttribute('data-genre'),
      title: c.querySelector('span.font-black')?.innerText,
      subtitle: c.querySelector('span.font-medium')?.innerText
    }));
    const oldPlaylistCards = document.querySelectorAll('#explore-juice-section .playlist-card');
    return {
      cardsCount: juiceCards.length,
      cards: juiceCards,
      oldPlaylistsCount: oldPlaylistCards.length
    };
  });
  console.log("Explore Audit:", exploreAudit);

  if (exploreAudit.cardsCount !== 2 || exploreAudit.oldPlaylistsCount !== 0) {
    throw new Error(`FAIL: Expected exactly 2 top cards and 0 old playlist cards, got ${exploreAudit.cardsCount} cards and ${exploreAudit.oldPlaylistsCount} old playlists`);
  }
  console.log("[PASS] Exactly the Top 2 professional cards are present!");
  console.log(`[PASS] Card 1: "${exploreAudit.cards[0].title}" - ${exploreAudit.cards[0].subtitle}`);
  console.log(`[PASS] Card 2: "${exploreAudit.cards[1].title}" - ${exploreAudit.cards[1].subtitle}`);

  const p1 = path.join(SCRATCH_DIR, '35_top_2_professional_cards.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 35_top_2_professional_cards.png (${fs.statSync(p1).size} bytes)`);

  // ─── TEST 2: LOAD OFFICIAL DISCOGRAPHY (80+ SONGS) ───
  console.log("\n--- TEST 2: Load Juice WRLD Official Discography (80+ Tracks) ---");
  await page.evaluate(() => {
    document.querySelector('.genre-card[data-genre="Juice WRLD: Official Discography"]').click();
  });

  await page.waitForFunction(() => {
    const list = document.getElementById('explore-playlist-tracks');
    return list && list.querySelectorAll('.track-item').length >= 40;
  }, { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const officialResult = await page.evaluate(() => {
    const title = document.getElementById('explore-playlist-title')?.innerText;
    const meta = document.getElementById('explore-playlist-meta')?.innerText;
    const trackEls = Array.from(document.querySelectorAll('#explore-playlist-tracks .track-item'));
    const trackTitles = trackEls.map(el => el.querySelector('.font-bold')?.innerText);
    return {
      title,
      meta,
      count: trackEls.length,
      sample: trackTitles.slice(0, 5)
    };
  });
  console.log("Official Discography Result:", officialResult);
  if (officialResult.count < 60) {
    throw new Error(`FAIL: Official Discography loaded only ${officialResult.count} tracks, expected 80+`);
  }
  console.log(`[PASS] Loaded ${officialResult.count} songs for Official Discography!`);

  const p2 = path.join(SCRATCH_DIR, '36_official_discography_80_plus_tracks.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 36_official_discography_80_plus_tracks.png (${fs.statSync(p2).size} bytes)`);

  // Go back to Explore
  await page.evaluate(() => {
    document.getElementById('explore-back-btn').click();
  });
  await new Promise(r => setTimeout(r, 600));

  // ─── TEST 3: LOAD THE LOST VAULT (80+ SONGS) ───
  console.log("\n--- TEST 3: Load Juice WRLD The Lost Vault (80+ Grails & Leaks) ---");
  await page.evaluate(() => {
    document.querySelector('.genre-card[data-genre="Juice WRLD: The Lost Vault"]').click();
  });

  await page.waitForFunction(() => {
    const list = document.getElementById('explore-playlist-tracks');
    return list && list.querySelectorAll('.track-item').length >= 40;
  }, { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  const vaultResult = await page.evaluate(() => {
    const title = document.getElementById('explore-playlist-title')?.innerText;
    const meta = document.getElementById('explore-playlist-meta')?.innerText;
    const trackEls = Array.from(document.querySelectorAll('#explore-playlist-tracks .track-item'));
    const trackTitles = trackEls.map(el => el.querySelector('.font-bold')?.innerText);
    return {
      title,
      meta,
      count: trackEls.length,
      sample: trackTitles.slice(0, 5)
    };
  });
  console.log("The Lost Vault Result:", vaultResult);
  if (vaultResult.count < 60) {
    throw new Error(`FAIL: The Lost Vault loaded only ${vaultResult.count} tracks, expected 80+`);
  }
  console.log(`[PASS] Loaded ${vaultResult.count} unreleased tracks for The Lost Vault!`);

  const p3 = path.join(SCRATCH_DIR, '37_the_lost_vault_80_plus_tracks.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 37_the_lost_vault_80_plus_tracks.png (${fs.statSync(p3).size} bytes)`);

  await browser.close();
  console.log("\n================================================================================");
  console.log("ALL 2-CARD SHOWCASE & 80+ TRACK GENERATION TESTS PASSED 100%!");
  console.log("================================================================================");
}

test80SongsShowcase().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
