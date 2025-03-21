import TurndownService from 'turndown';
import { Readability } from '@mozilla/readability';

export default (function () {
  // 1. Load Readability and Turndown
  const turndownService = new TurndownService();

  // 2. Add rule to remove <style>, <script>, <link>, <iframe>, and <noscript> tags
  turndownService.addRule('removeNoiseElements', {
    filter: ['style', 'script', 'link', 'iframe', 'noscript'],
    replacement: () => '',
  });

  // 3. Remove inline 'style' attributes from elements
  turndownService.addRule('removeInlineStyles', {
    filter: (node) => node.nodeType === 1 && node.hasAttribute('style'),
    replacement: (content, node) => {
      node.removeAttribute('style');
      return turndownService.turndown(node.outerHTML);
    },
  });

  // 4. Get document title
  const docTitle = document.title;

  // 5. Extract main content using Readability
  const reader = new Readability(document.cloneNode(true));
  const article = reader.parse();
  const contentToConvert = article?.content || document.body.innerHTML;

  // 6. Build metadata section
  const metadataSection = `# ${article?.title || docTitle}\n\n`;

  // 7. Convert extracted content to Markdown
  const bodyMarkdown = turndownService.turndown(contentToConvert);

  // 8. Combine metadata and body Markdown
  const fullMarkdown = metadataSection + bodyMarkdown;

  // 9. Create HTML for new tab
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Converted Markdown</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f9f9f9; }
        #copyButton { padding: 10px 20px; font-size: 16px; margin-bottom: 20px; cursor: pointer; background-color: #36c; color: #fff; border: none; border-radius: 4px; }
        #copyButton:hover { background-color: #3056a9; }
        pre { background-color: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 4px; overflow: auto; max-height: 80vh; }
      </style>
    </head>
    <body>
      <button id="copyButton">Copy Markdown</button>
      <pre id="markdownContent">${fullMarkdown}</pre>
      <script>
        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            alert('Markdown copied to clipboard!');
          }, () => {
            alert('Failed to copy Markdown.');
          });
        }
        document.getElementById('copyButton').addEventListener('click', function() {
          const markdown = document.getElementById('markdownContent').innerText;
          copyToClipboard(markdown);
        });
      </script>
    </body>
    </html>
  `;

  // 10. Create Blob URL and open new tab
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  const newTab = window.open(blobUrl, '_blank', 'noopener,noreferrer');

  if (!newTab) {
    console.error('Failed to open a new tab. Please allow popups for this site.');
  }
})();
