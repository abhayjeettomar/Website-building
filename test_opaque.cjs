const puppeteer = require('puppeteer-core');

async function testTransparent() {
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

  // Change liquid material to transparent = false and check
  await page.evaluate(() => {
    const scene = window.__THREE_SCENE__;
    if (!scene) return;
    scene.traverse(obj => {
      if (obj.isMesh && obj.material && obj.material.color && obj.material.color.getHexString() === 'f59e0b') {
        obj.material.transparent = false;
        obj.material.needsUpdate = true;
      }
    });
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'shots/test_opaque_liquid.png' });
  console.log('Saved shots/test_opaque_liquid.png');
  await browser.close();
}

testTransparent().catch(console.error);

