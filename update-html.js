const fs = require('fs');
const path = require('path');

// Read html_example.html
const htmlPath = path.join(__dirname, 'html_example.html');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Update CSS and JS links
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.css/g, 'main.NEW_VERSION.css');
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.js/g, 'main.NEW_VERSION.js');

// Write the updated content back to html_example.html
fs.writeFileSync(htmlPath, htmlContent);
