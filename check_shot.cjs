const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function checkScreenshotPixels() {
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

  const colors = await page.evaluate(() => {
    const canvas = document.getElementById('c');
    const img = document.getElementById('img');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const points = [
      { name: 'bottle_center', x: 1050, y: 500 },
      { name: 'bottle_lower', x: 1050, y: 600 },
      { name: 'bottle_punt', x: 1050, y: 700 },
      { name: 'left_background', x: 200, y: 200 }
    ];

    return points.map(p => {
      const d = ctx.getImageData(p.x, p.y, 1, 1).data;
      return {
        name: p.name,
        r: d[0], g: d[1], b: d[2],
        hex: '#' + ((1 << 24) + (d[0] << 16) + (d[1] << 8) + d[2]).toString(16).slice(1)
      };
    });
  });

  console.log('Colors in p2 screenshot:', colors);
  await browser.close();
}

checkScreenshotPixels().catch(console.error);

