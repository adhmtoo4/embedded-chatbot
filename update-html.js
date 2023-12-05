const fs = require('fs');
const path = require('path');

const htmlFilePath = path.join(__dirname, 'html_example.html');
const buildDirPath = path.join(__dirname, 'build', 'static');

function getLatestVersionNumbers() {
    const cssFiles = fs.readdirSync(path.join(buildDirPath, 'css'));
    const jsFiles = fs.readdirSync(path.join(buildDirPath, 'js'));
    console.log('before', cssFiles, jsFiles)
    const cssVersion = cssFiles.find(file => file.endsWith('.css') && !file.endsWith('.css.map')).split('.')[1];
    const jsVersion = jsFiles.find(file => file.endsWith('.js') && !file.endsWith('.js.map') && !file.includes('.LICENSE')).split('.')[1];

    return { cssVersion, jsVersion };
}

let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

const { cssVersion, jsVersion } = getLatestVersionNumbers();
console.log('After', cssVersion, jsVersion)
// Update the version numbers in the HTML content
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.css/, `main.${cssVersion}.css`);
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.js/, `main.${jsVersion}.js`);
console.log('html', htmlContent)
fs.writeFileSync(htmlFilePath, htmlContent);
