const puppeteer = require('puppeteer-core');

async function debug() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  const info = await page.evaluate(() => {
    // Find canvas and R3F fiber root
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'No canvas found' };
    
    // Check scrollStore
    return {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    };
  });

  console.log('Scene debug info:', info);
  await browser.close();
}

debug().catch(console.error);

