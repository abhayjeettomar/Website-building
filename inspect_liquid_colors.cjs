const puppeteer = require('puppeteer-core');

async function inspectLiquid() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 2000));

  // Get WebGL canvas pixel sample at center
  const centerPixel = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'no canvas';
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) return 'no webgl';
    // Sample a few pixels around the bottle center (x: 1440*0.65, y: 900*0.5)
    return {
      width: canvas.width,
      height: canvas.height,
    };
  });
  console.log('Canvas:', centerPixel);

  await page.screenshot({ path: 'shots/inspect_stage2.png' });
  console.log('Saved shots/inspect_stage2.png');

  await browser.close();
}

inspectLiquid().catch(console.error);

