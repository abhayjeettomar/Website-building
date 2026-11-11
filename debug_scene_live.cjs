const puppeteer = require('puppeteer-core');

async function debugSceneLive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to stage 2
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.24, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1500));

  const info = await page.evaluate(() => {
    const scene = window.__THREE_SCENE__;
    if (!scene) return { error: 'No __THREE_SCENE__' };

    const meshes = [];
    scene.traverse((obj) => {
      if (obj.isMesh || obj.isInstancedMesh) {
        const mat = obj.material;
        meshes.push({
          name: obj.name || obj.type,
          visible: obj.visible,
          renderOrder: obj.renderOrder,
          pos: [obj.position.x, obj.position.y, obj.position.z],
          scale: [obj.scale.x, obj.scale.y, obj.scale.z],
          materialType: mat ? mat.type : 'none',
          color: mat && mat.color ? '#' + mat.color.getHexString() : 'none',
          emissive: mat && mat.emissive ? '#' + mat.emissive.getHexString() : 'none',
          transmission: mat && mat.transmission !== undefined ? mat.transmission : 'none',
          opacity: mat && mat.opacity !== undefined ? mat.opacity : 'none',
          transparent: mat && mat.transparent !== undefined ? mat.transparent : 'none',
          roughness: mat && mat.roughness !== undefined ? mat.roughness : 'none',
        });
      }
    });
    return { meshCount: meshes.length, meshes };
  });

  console.log('Meshes in scene:', JSON.stringify(info, null, 2));
  await browser.close();
}

debugSceneLive().catch(console.error);

