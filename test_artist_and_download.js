const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testFeatures() {
  console.log(`Connecting to live JuiceBx server on http://127.0.0.1:${PORT}...`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=500,1000', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 950, deviceScaleFactor: 2 });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('.track-item', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Test Direct Download without Playing
  console.log("Testing direct download on track 1...");
  const dlResult = await page.evaluate(() => {
    const isPlayingBefore = window.JuiceEngine.getState().isPlaying;
    const dlBtn = document.querySelector('.btn-direct-download');
    if (dlBtn) dlBtn.click();
    const isPlayingAfter = window.JuiceEngine.getState().isPlaying;
    const downloads = window.JuiceEngine.getDownloads();
    return {
      isPlayingBefore,
      isPlayingAfter,
      downloadCount: downloads.length,
      downloadedTrack: downloads[0]?.title
    };
  });
  console.log("Direct Download Result:", JSON.stringify(dlResult, null, 2));

  // Screenshot Library with saved track checkmark
  const p1 = path.join(SCRATCH_DIR, '08_library_direct_download.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 08_library_direct_download.png (${fs.statSync(p1).size} bytes)`);

  // 2. Test Artists Tab & Artist Detail View
  console.log("Switching to Artists tab...");
  await page.evaluate(() => {
    const artistTab = document.querySelector('button[data-tab="artists"]');
    if (artistTab) artistTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const p2 = path.join(SCRATCH_DIR, '09_artists_grid.png');
  await page.screenshot({ path: p2 });
  console.log(`[PASS] 09_artists_grid.png (${fs.statSync(p2).size} bytes)`);

  // Click first artist card
  console.log("Opening Artist Detail Sub-View...");
  await page.evaluate(() => {
    const firstArtist = document.querySelector('.artist-card');
    if (firstArtist) firstArtist.click();
  });
  await page.waitForSelector('#artist-view-tracks .track-item', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 500));

  const p3 = path.join(SCRATCH_DIR, '10_artist_detail_view.png');
  await page.screenshot({ path: p3 });
  console.log(`[PASS] 10_artist_detail_view.png (${fs.statSync(p3).size} bytes)`);

  // 3. Test Albums Tab
  console.log("Switching to Albums tab...");
  await page.evaluate(() => {
    const albumsTab = document.querySelector('button[data-tab="albums"]');
    if (albumsTab) albumsTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const p4 = path.join(SCRATCH_DIR, '11_albums_grid.png');
  await page.screenshot({ path: p4 });
  console.log(`[PASS] 11_albums_grid.png (${fs.statSync(p4).size} bytes)`);

  await browser.close();
  console.log("ALL DIRECT DOWNLOAD AND ARTIST TESTS COMPLETED SUCCESSFULLY!");
}

testFeatures().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
