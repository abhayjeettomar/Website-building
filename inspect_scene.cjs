const puppeteer = require('puppeteer-core');

async function inspect() {
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

  const report = await page.evaluate(() => {
    const scene = window.__THREE_SCENE__;
    if (!scene) return 'Scene not on window';

    const meshes = [];
    scene.traverse(obj => {
      if (obj.isMesh) {
        meshes.push({
          type: obj.type,
          visible: obj.visible,
          renderOrder: obj.renderOrder,
          pos: [obj.position.x, Number(obj.position.y.toFixed(3)), obj.position.z],
          scale: [Number(obj.scale.x.toFixed(3)), Number(obj.scale.y.toFixed(3)), Number(obj.scale.z.toFixed(3))],
          matType: obj.material ? obj.material.type : null,
          matColor: obj.material && obj.material.color ? '#' + obj.material.color.getHexString() : null,
          matTransmission: obj.material ? obj.material.transmission : null,
          matOpacity: obj.material ? obj.material.opacity : null,
          matTransparent: obj.material ? obj.material.transparent : null,
        });
      }
    });

    return meshes;
  });

  console.log('Scene report (count: ' + (Array.isArray(report) ? report.length : report) + '):');
  if (Array.isArray(report)) {
    report.forEach((m, idx) => console.log(`[${idx}]`, JSON.stringify(m)));
  } else {
    console.log(report);
  }

  await browser.close();
}

inspect().catch(console.error);
