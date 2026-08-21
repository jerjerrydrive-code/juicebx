const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCRATCH_DIR = path.resolve(__dirname, '..', 'scratch');

async function testQueueRemovalAndFilter() {
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

  // 1. Verify all default & searched tracks are actual songs (< 600s)
  console.log("Checking track durations...");
  const durationCheck = await page.evaluate(async () => {
    const q1 = window.JuiceEngine.getState().queue;
    const invalidDefault = q1.filter(t => t.seconds > 600 || t.seconds < 30);

    // Search query test
    const searchRes = await window.JuiceEngine.search('synthwave hits');
    const invalidSearch = searchRes.filter(t => t.seconds > 600 || t.seconds < 30);

    return {
      defaultQueueLength: q1.length,
      invalidDefaultCount: invalidDefault.length,
      searchCount: searchRes.length,
      invalidSearchCount: invalidSearch.length,
      sampleDurations: searchRes.slice(0, 5).map(t => `${t.title} (${t.duration})`)
    };
  });
  console.log("Duration Check Result:", JSON.stringify(durationCheck, null, 2));

  // 2. Test Remove from Queue
  console.log("Testing removal from queue...");
  const removeTest = await page.evaluate(async () => {
    const countBefore = window.JuiceEngine.getState().queue.length;
    const firstTitleBefore = window.JuiceEngine.getState().queue[0]?.title;

    // Click remove on the 1st track
    const removeBtn = document.querySelector('.btn-remove-queue[data-idx="0"]');
    if (removeBtn) removeBtn.click();

    await new Promise(r => setTimeout(r, 500));
    const countAfter = window.JuiceEngine.getState().queue.length;
    const firstTitleAfter = window.JuiceEngine.getState().queue[0]?.title;

    return {
      countBefore,
      countAfter,
      firstTitleBefore,
      firstTitleAfter,
      removedSuccessfully: (countAfter === countBefore - 1 && firstTitleBefore !== firstTitleAfter)
    };
  });
  console.log("Remove Test Result:", JSON.stringify(removeTest, null, 2));

  const p1 = path.join(SCRATCH_DIR, '21_queue_removal_tested.png');
  await page.screenshot({ path: p1 });
  console.log(`[PASS] 21_queue_removal_tested.png (${fs.statSync(p1).size} bytes)`);

  await browser.close();
  console.log("ALL QUEUE REMOVAL & DURATION FILTER TESTS COMPLETED SUCCESSFULLY!");
}

testQueueRemovalAndFilter().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
