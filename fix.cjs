const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');
const lines = content.split('\n');
const fixed = lines.slice(0, 376).join('\n');
fs.writeFileSync('src/App.jsx', fixed);
