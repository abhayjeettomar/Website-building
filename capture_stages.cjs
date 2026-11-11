const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--window-size=1440,900'
    ],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE ERROR] ${err.toString()}`));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'shots/stage1.png' });
  console.log('Saved shots/stage1.png');

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Click on the second base: blood orange
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bloodOrangeBtn = btns.find(b => b.textContent && b.textContent.includes('Sicilian Orange'));
    if (bloodOrangeBtn) bloodOrangeBtn.click();
  });
  
  // Capture during pour
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shots/stage2_pouring.png' });
  console.log('Saved shots/stage2_pouring.png');

  // Wait for pour completion
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'shots/stage2_filled.png' });
  console.log('Saved shots/stage2_filled.png');

  // Scroll to stage 3 (exploded view)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.45, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'shots/stage3_exploded.png' });
  console.log('Saved shots/stage3_exploded.png');

  // Scroll to stage 4 (chill & ice)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.65, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'shots/stage4_chill.png' });
  console.log('Saved shots/stage4_chill.png');

  // Scroll to stage 5 (engraving)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.80, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'shots/stage5_engraved.png' });
  console.log('Saved shots/stage5_engraved.png');

  // Scroll to stage 6 (dispatch)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.95, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'shots/stage6_dispatch.png' });
  console.log('Saved shots/stage6_dispatch.png');

  console.log('Console logs:');
  consoleLogs.slice(-10).forEach(l => console.log('  ', l));

  await browser.close();
  console.log('Finished capturing all stages!');
}

run().catch(console.error);
