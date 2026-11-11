const puppeteer = require('puppeteer-core');

async function checkColors() {
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

  // Click blood orange
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sicilian Orange'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 2500));

  // Sample pixels across vertical center of bottle
  // Bottle is on right flank: x ~ 800 - 1100, y ~ 300 - 650
  const samples = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'no canvas';
    
    // Create helper 2d canvas to sample pixels
    const c2 = document.createElement('canvas');
    c2.width = canvas.width;
    c2.height = canvas.height;
    const ctx = c2.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    const points = [
      { name: 'bottle_center', x: 1050, y: 500 },
      { name: 'bottle_lower', x: 1050, y: 600 },
      { name: 'bottle_punt', x: 1050, y: 700 },
      { name: 'background', x: 200, y: 200 }
    ];

    return points.map(p => {
      const pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
      return {
        name: p.name,
        x: p.x,
        y: p.y,
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
        a: pixel[3],
        hex: '#' + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)
      };
    });
  });

  console.log('Pixel samples:', samples);
  await browser.close();
}

checkColors().catch(console.error);

