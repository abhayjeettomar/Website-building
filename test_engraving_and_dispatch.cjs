const puppeteer = require('puppeteer-core');

async function testEngravingAndDispatch() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--window-size=1440,900'
    ],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to stage 5 (engraving)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.80, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Type custom title "ROYAL BOTANIC" and initials "RB"
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const titleInput = inputs.find(i => i.placeholder && i.placeholder.includes('ABHAYJEET'));
    const monogramInput = inputs.find(i => i.placeholder === 'AT');

    if (titleInput) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(titleInput, 'ROYAL BOTANIC');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (monogramInput) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(monogramInput, 'RB');
      monogramInput.dispatchEvent(new Event('input', { bubbles: true }));
      monogramInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shots/stage5_custom_engraved.png' });
  console.log('Saved shots/stage5_custom_engraved.png');

  // Scroll to stage 6 (dispatch)
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.95, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Submit checkout form
  await page.evaluate(() => {
    const form = document.querySelector('form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'shots/stage6_order_confirmed.png' });
  console.log('Saved shots/stage6_order_confirmed.png');

  await browser.close();
}

testEngravingAndDispatch().catch(console.error);

