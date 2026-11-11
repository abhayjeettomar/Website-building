const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function findBottle() {
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

    // Background is around #f7f4ed (r: 247, g: 244, b: 238)
    let minX = 1440, maxX = 0, minY = 900, maxY = 0;
    let nonBgCount = 0;
    let coloredPixels = [];

    for (let y = 0; y < 900; y += 4) {
      for (let x = 0; x < 1440; x += 4) {
        const idx = (y * 1440 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // If significantly different from background #f7f4ed
        const diff = Math.abs(r - 247) + Math.abs(g - 244) + Math.abs(b - 238);
        if (diff > 25) {
          nonBgCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          // Check if this pixel has color (e.g. orange/amber/ruby/green)
          if (r > g + 20 || b > g + 20 || g > b + 20) {
            coloredPixels.push({ x, y, r, g, b });
          }
        }
      }
    }

    return {
      nonBgCount,
      bounds: { minX, maxX, minY, maxY },
      coloredCount: coloredPixels.length,
      sampleColors: coloredPixels.slice(0, 10)
    };
  });

  console.log('Bottle location and colors:', stats);
  await browser.close();
}

findBottle().catch(console.error);

