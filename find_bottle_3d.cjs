const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function findBottleIn3D() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });

  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync('shots/p2_orange_distillate.png').toString('base64');
  await page.setContent(`
    <html>
      <body>
        <canvas id="c" width="1440" height="900"></canvas>
        <img id="img" src="data:image/png;base64,${imgBase64}" />
      </body>
    </html>
  `);

  const stats = await page.evaluate(() => {
    const canvas = document.getElementById('c');
    const img = document.getElementById('img');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, 1440, 900);
    const data = imgData.data;

    let pixelsIn3D = [];
    for (let y = 100; y < 850; y += 10) {
      for (let x = 480; x < 1400; x += 10) {
        const idx = (y * 1440 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const diff = Math.abs(r - 247) + Math.abs(g - 244) + Math.abs(b - 238);
        if (diff > 15) {
          pixelsIn3D.push({ x, y, r, g, b, diff, hex: '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) });
        }
      }
    }

    return {
      count: pixelsIn3D.length,
      samples: pixelsIn3D.slice(0, 20)
    };
  });

  console.log('3D pixels (x > 480, y > 100):', stats);
  await browser.close();
}

findBottleIn3D().catch(console.error);

