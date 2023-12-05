const fs = require('fs');
const path = require('path');

// Define the path to your html_example.html file and your build directory
const htmlFilePath = path.join(__dirname, 'html_example.html');
const buildDirPath = path.join(__dirname, 'build', 'static');

// Function to get the latest version numbers from the build directory
function getLatestVersionNumbers() {
    const cssFiles = fs.readdirSync(path.join(buildDirPath, 'css'));
    const jsFiles = fs.readdirSync(path.join(buildDirPath, 'js'));
    console.log(cssFiles, jsFiles)
    // Assuming filenames are like 'main.VERSION.css' or 'main.VERSION.js'
    const cssVersion = cssFiles.find(file => file.startsWith('main.') && file.endsWith('.css')).split('.')[1];
    const jsVersion = jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js')).split('.')[1];

    return { cssVersion, jsVersion };
}

// Read the HTML file
let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

// Get the latest version numbers
const { cssVersion, jsVersion } = getLatestVersionNumbers();

// Replace the version numbers in the HTML file
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.css/, `main.${cssVersion}.css`);
htmlContent = htmlContent.replace(/main\.[a-z0-9]+\.js/, `main.${jsVersion}.js`);
console.log(htmlContent)
// Write the updated content back to html_example.html
fs.writeFileSync(htmlFilePath, htmlContent);
