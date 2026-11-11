const puppeteer = require('puppeteer-core');

async function testPourLive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Clicking Wild Alpine Juniper...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const juniperBtn = btns.find(b => b.textContent && b.textContent.includes('Alpine Juniper'));
    if (juniperBtn) juniperBtn.click();
  });

  // Capture sequence across 2 seconds
  for (let i = 1; i <= 6; i++) {
    await new Promise(r => setTimeout(r, 250));
    await page.screenshot({ path: `shots/pour_frame_${i}.png` });
    console.log(`Saved shots/pour_frame_${i}.png`);
  }

  await browser.close();
  console.log('Done testPourLive');
}

testPourLive().catch(console.error);

