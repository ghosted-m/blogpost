const TurndownService = require('turndown');
const turndown = new TurndownService({ headingStyle: 'atx' });

function htmlToMarkdown(html) {
  if (!html) return '';
  return turndown.turndown(html);
}

module.exports = { htmlToMarkdown };
