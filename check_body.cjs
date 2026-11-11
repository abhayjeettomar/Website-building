const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function checkBodyPixels() {
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

  const rows = await page.evaluate(() => {
    const canvas = document.getElementById('c');
    const img = document.getElementById('img');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, 1440, 900);
    const data = imgData.data;

    const res = [];
    for (let y = 150; y < 850; y += 50) {
      let nonBgInRow = 0;
      let sampleX = -1;
      let sampleColor = '';
      for (let x = 700; x < 1300; x += 10) {
        const idx = (y * 1440 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const diff = Math.abs(r - 247) + Math.abs(g - 244) + Math.abs(b - 238);
        if (diff > 20) {
          nonBgInRow++;
          if (sampleX === -1) {
            sampleX = x;
            sampleColor = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          }
        }
      }
      res.push({ y, nonBgInRow, sampleX, sampleColor });
    }
    return res;
  });

  console.log('Row samples:', rows);
  await browser.close();
}

checkBodyPixels().catch(console.error);

