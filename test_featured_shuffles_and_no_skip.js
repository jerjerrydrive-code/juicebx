const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';

(async () => {
  console.log("🚀 Testing Featured Shuffles & Song Skipping Fix...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => window.JuiceEngine);

  console.log("\n--- TEST 1: CLICKING 'Official Discography' CARD ---");
  // Find the Official Discography card and click it
  const officialCard = await page.$('.genre-card[data-genre="Juice WRLD: Official Discography"]');
  if (!officialCard) throw new Error("Official Discography card not found!");
  await officialCard.click();
  await new Promise(r => setTimeout(r, 600));

  let queueState = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      queueLength: s.queue.length,
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex],
      isPlaying: s.isPlaying
    };
  });
  console.log("Official Discography Result:", queueState);
  if (queueState.queueLength === 0) throw new Error("Official Discography queue failed to load!");

  // Wait 3 seconds to verify NO cascading skipping occurs
  console.log("Checking if track remains stable for 3 seconds without skipping...");
  const indexBefore = queueState.currentIndex;
  await new Promise(r => setTimeout(r, 3000));
  const indexAfter = await page.evaluate(() => window.JuiceEngine.getState().currentIndex);
  console.log(`Index before: ${indexBefore}, Index after 3s: ${indexAfter}`);
  if (indexAfter !== indexBefore) {
    throw new Error(`Song skipped! Index changed from ${indexBefore} to ${indexAfter}`);
  }
  console.log("✅ PASS: Official Discography loaded and stayed locked without skipping!");

  // Return to Home
  await page.evaluate(() => {
    const btn = document.querySelector('.nav-btn[data-target="view-home"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  console.log("\n--- TEST 2: CLICKING 'The Lost Vault' CARD ---");
  const vaultCard = await page.$('.genre-card[data-genre="Juice WRLD: The Lost Vault"]');
  if (!vaultCard) throw new Error("The Lost Vault card not found!");
  await vaultCard.click();
  await new Promise(r => setTimeout(r, 600));

  queueState = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      queueLength: s.queue.length,
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex],
      isPlaying: s.isPlaying
    };
  });
  console.log("The Lost Vault Result:", queueState);
  if (queueState.queueLength === 0) throw new Error("The Lost Vault queue failed to load!");

  // Wait 3 seconds to verify NO cascading skipping occurs
  console.log("Checking if track remains stable for 3 seconds without skipping...");
  const vaultIndexBefore = queueState.currentIndex;
  await new Promise(r => setTimeout(r, 3000));
  const vaultIndexAfter = await page.evaluate(() => window.JuiceEngine.getState().currentIndex);
  console.log(`Vault Index before: ${vaultIndexBefore}, Index after 3s: ${vaultIndexAfter}`);
  if (vaultIndexAfter !== vaultIndexBefore) {
    throw new Error(`Song skipped! Index changed from ${vaultIndexBefore} to ${vaultIndexAfter}`);
  }
  console.log("✅ PASS: The Lost Vault loaded and stayed locked without skipping!");

  // Return to Home and test another genre shuffle
  await page.evaluate(() => {
    const btn = document.querySelector('.nav-btn[data-target="view-home"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  console.log("\n--- TEST 3: CLICKING 'Hip-Hop & Trap' SHUFFLE CARD ---");
  const hiphopCard = await page.$('.genre-card[data-genre="hiphop_top100"]');
  if (!hiphopCard) throw new Error("Hip-Hop card not found!");
  await hiphopCard.click();
  await new Promise(r => setTimeout(r, 600));

  const hiphopQueueState = await page.evaluate(() => {
    const s = window.JuiceEngine.getState();
    return {
      queueLength: s.queue.length,
      currentIndex: s.currentIndex,
      currentTrack: s.queue[s.currentIndex]
    };
  });
  console.log("Hip-Hop Result:", hiphopQueueState);
  if (hiphopQueueState.queueLength === 0) throw new Error("Hip-Hop queue failed to load!");
  console.log("✅ PASS: Hip-Hop Shuffle loaded successfully!");

  await browser.close();
  console.log("\n🎉 ALL FEATURED SHUFFLES & PLAYBACK STABILITY TESTS PASSED WITH 100% SUCCESS!");
})();
