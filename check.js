const { JSDOM } = require('jsdom');
JSDOM.fromURL('https://jc-informatica.vercel.app/', {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  dom.window.addEventListener('error', event => {
    console.error('JSDOM Error:', event.error);
  });
  setTimeout(() => {
    console.log('HTML:', dom.window.document.body.innerHTML);
    process.exit(0);
  }, 3000);
});

