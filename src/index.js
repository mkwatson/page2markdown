import TurndownService from 'turndown';

export default (function () {
  // 1. Create a new Turndown instance
  const turndownService = new TurndownService();

  // 2. Add a rule to remove <style>, <script>, and <link> tags entirely
  turndownService.addRule('removeStylesScriptsLinks', {
    filter: ['style', 'script', 'link'],
    replacement: () => ''
  });

  // 3. Add a rule to remove inline 'style' attributes from all elements
  turndownService.addRule('removeInlineStyles', {
    filter: (node) => node.nodeType === 1 && node.hasAttribute('style'),
    replacement: (content, node) => {
      // Remove the 'style' attribute
      node.removeAttribute('style');
      // Return the node's HTML without styles
      return turndownService.turndown(node.outerHTML);
    }
  });

  // 4. Grab the document title
  const docTitle = document.title;

  // 5. Build the metadata section with only the title in Markdown format
  const metadataSection = `# ${docTitle}\n\n`;

  // 6. Grab the full HTML of the page
  const docHtml = document.documentElement.outerHTML;

  // 7. Convert the filtered HTML to Markdown
  const bodyMarkdown = turndownService.turndown(docHtml);

  // 8. Combine metadata and body Markdown
  const fullMarkdown = metadataSection + bodyMarkdown;

  // 9. Open a new tab and display the Markdown content with a "Copy Markdown" button
  const newTab = window.open();

  if (newTab) {
    newTab.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Converted Markdown</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            background-color: #f9f9f9;
          }
          #copyButton {
            padding: 10px 20px;
            font-size: 16px;
            margin-bottom: 20px;
            cursor: pointer;
            background-color: #36c;
            color: #fff;
            border: none;
            border-radius: 4px;
          }
          #copyButton:hover {
            background-color: #3056a9;
          }
          pre {
            background-color: #fff;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: auto;
            max-height: 80vh;
          }
        </style>
      </head>
      <body>
        <button id="copyButton">Copy Markdown</button>
        <pre id="markdownContent">${fullMarkdown}</pre>
        
        <script>
          // Function to copy text to clipboard
          function copyToClipboard(text) {
            if (!navigator.clipboard) {
              // Fallback for browsers that do not support navigator.clipboard
              const textarea = document.createElement('textarea');
              textarea.value = text;
              textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
              document.body.appendChild(textarea);
              textarea.focus();
              textarea.select();
              try {
                document.execCommand('copy');
                alert('Markdown copied to clipboard!');
              } catch (err) {
                alert('Failed to copy Markdown.');
              }
              document.body.removeChild(textarea);
              return;
            }
            navigator.clipboard.writeText(text).then(function() {
              alert('Markdown copied to clipboard!');
            }, function(err) {
              alert('Failed to copy Markdown.');
            });
          }

          // Add event listener to the copy button
          document.getElementById('copyButton').addEventListener('click', function() {
            const markdown = document.getElementById('markdownContent').innerText;
            copyToClipboard(markdown);
          });
        </script>
      </body>
      </html>
    `);
    newTab.document.close();
  } else {
    console.error('Failed to open a new tab. Please allow popups for this site.');
  }
})();