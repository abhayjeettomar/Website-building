const puppeteer = require('puppeteer-core');

async function inspectStoreLive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));

  const state1 = await page.evaluate(() => {
    // Check DOM text in volume bar
    const bar = document.querySelector('div[class*="rounded-lg bg-[#FAF7F0]"]');
    return {
      barText: bar ? bar.textContent : 'none',
    };
  });
  console.log('State at stage 2 before click:', state1);

  // Click Sicilian Orange
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sicilian Orange'));
    if (btn) btn.click();
  });

  // Check state at 500ms, 1000ms, 2000ms
  for (let t of [500, 1000, 1500, 2000]) {
    await new Promise(r => setTimeout(r, 500));
    const s = await page.evaluate(() => {
      const bar = document.querySelector('div[class*="rounded-lg bg-[#FAF7F0]"]');
      return bar ? bar.textContent : 'none';
    });
    console.log(`State at +${t}ms:`, s);
  }

  await browser.close();
}

inspectStoreLive().catch(console.error);

