const puppeteer = require('puppeteer-core');

async function inspectThreeScene() {
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

  const debugData = await page.evaluate(() => {
    // Find canvas
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'no canvas' };

    // Inspect R3F fiber root
    const key = Object.keys(canvas).find(k => k.startsWith('__reactFiber'));
    let fiber = canvas[key];
    while (fiber && !fiber.stateNode?.scene) {
      fiber = fiber.return;
    }
    const scene = fiber?.stateNode?.scene;

    // Check store state via DOM or window
    return {
      hasScene: !!scene,
      sceneChildren: scene ? scene.children.map(c => c.name || c.type) : []
    };
  });

  console.log('Debug data:', debugData);
  await browser.close();
}

inspectThreeScene().catch(console.error);

