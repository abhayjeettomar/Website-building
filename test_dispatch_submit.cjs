const puppeteer = require('puppeteer-core');

async function testDispatch() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to stage 6
  await page.evaluate(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * 0.96, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));

  // Fill in the form and click submit
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    function setVal(input, val) {
      if (!input) return;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, val);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (inputs[0]) setVal(inputs[0], 'Abhayjeet Tomar');
    if (inputs[1]) setVal(inputs[1], '740 Park Avenue, Penthouse 12');
    if (inputs[2]) setVal(inputs[2], 'New York, NY 10021');
    if (inputs[3]) setVal(inputs[3], 'abhayjeet@atelier.luxury');

    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'shots/stage6_confirmed.png' });
  console.log('Saved shots/stage6_confirmed.png');

  await browser.close();
  console.log('Done testDispatch');
}

testDispatch().catch(console.error);
