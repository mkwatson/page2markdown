const fs = require('fs');
const path = require('path');

// Get the project root directory (one level up from scripts folder)
const projectRoot = path.join(__dirname, '..');

// Read the webpack output from the correct dist directory
const bookmarkletPath = path.join(projectRoot, 'dist', 'bookmarklet.js');
let code = fs.readFileSync(bookmarkletPath, 'utf8');

// Prepare the bookmarklet
const bookmarklet = `javascript:${encodeURIComponent(code)}`;

// Generate the HTML with the bookmarklet
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Page2Markdown Bookmarklet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 50px auto;
      max-width: 700px;
      line-height: 1.6;
    }
    h1 {
      margin-top: 0;
    }
    .bookmarklet-link {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #36c;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    }
    .bookmarklet-link:hover {
      background-color: #3056a9;
    }
    .instructions {
      margin-top: 30px;
      background: #f0f0f0;
      padding: 15px;
      border-radius: 4px;
    }
    code {
      background-color: #eee;
      padding: 2px 4px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <h1>Page2Markdown Bookmarklet</h1>

  <p>
    Drag the button below to your bookmarks bar. Then, on <strong>any webpage</strong> you're
    viewing, click the bookmarklet to convert that page into markdown in a new tab.
  </p>

  <a
    class="bookmarklet-link"
    href="${bookmarklet}"
  >
    Page2Markdown
  </a>

  <div class="instructions">
    <h2>How to Install the Bookmarklet</h2>
    <ol>
      <li>Make sure your bookmarks bar is visible in your browser.</li>
      <li>Click and drag the <strong>Page2Markdown</strong> button above to your bookmarks bar.</li>
      <li>Visit any webpage, then click the bookmarklet to generate your Markdown!</li>
    </ol>
  </div>
</body>
</html>`;

// Write the final HTML file to the correct dist directory
fs.writeFileSync(path.join(projectRoot, 'docs', 'index.html'), html);
console.log('Bookmarklet page generated successfully!');