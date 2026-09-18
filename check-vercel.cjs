const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let hasError = false;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
      hasError = true;
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.message);
    hasError = true;
  });

  await page.goto('https://jc-informatica.vercel.app/', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit to ensure React mounts
  await new Promise(r => setTimeout(r, 2000));
  
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  if (rootHtml.trim() === '') {
     console.log('ERROR: ROOT IS EMPTY!');
  } else {
     console.log('ROOT IS POPULATED. LENGTH:', rootHtml.length);
  }
  
  await browser.close();
})();
