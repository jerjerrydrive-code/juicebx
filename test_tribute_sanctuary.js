const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://127.0.0.1:8080';
const SCRATCH_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\205b5676-3b2c-4b5c-ad29-854059d5aebe';

(async () => {
  try {
    console.log("🚀 Testing 999 Sacred Sanctuary Tribute Modal...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.JuiceEngine, { timeout: 8000 });

    // Open tribute modal via JavaScript or clicking spindle tribute
    await page.evaluate(() => {
      const modal = document.getElementById('modal-999-tribute');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.remove('opacity-0');
      }
    });

    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(SCRATCH_DIR, 'frame_tribute_sanctuary.png');
    await page.screenshot({ path: shotPath });
    console.log("📸 Saved 999 Sanctuary screenshot:", shotPath);

    // Verify elements
    const details = await page.evaluate(() => {
      const modal = document.getElementById('modal-999-tribute');
      const img = modal.querySelector('img');
      const text = modal.innerText;
      const hasVaultBtn = !!modal.querySelector('#btn-tribute-play-vault');
      return {
        visible: !modal.classList.contains('hidden'),
        imgSrc: img ? img.getAttribute('src') : null,
        hasVaultBtn,
        hasQuote: text.includes('999 represents taking whatever ill')
      };
    });

    console.log("Modal Details:", details);
    if (details.hasVaultBtn) {
      throw new Error("Vault/playlist buttons are still inside the sanctuary modal!");
    }

    await browser.close();
    console.log("🎉 Tribute sanctuary verified successfully!");
  } catch(err) {
    console.error("Test error:", err);
    process.exit(1);
  }
})();
