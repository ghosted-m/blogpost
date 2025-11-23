// extracts first image, cleans HTML, removes inline styles and scripts
const sanitize = require('sanitize-html');
const cheerio = require('cheerio');
const { URL } = require('url');

function extractFirstImageFromHtml(html, baseUrl) {
  if (!html) return null;
  const $ = cheerio.load(html);
  const img = $('img').first();
  if (!img || !img.attr('src')) return null;
  let src = img.attr('src');
  // handle protocol-relative
  if (src.startsWith('//')) {
    const proto = new URL(baseUrl || 'http://example.com').protocol;
    src = proto + src;
  }
  // convert relative to absolute if baseUrl provided
  if (baseUrl && !/^https?:\/\//i.test(src)) {
    try {
      src = new URL(src, baseUrl).href;
    } catch (e) {}
  }
  return src;
}

function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return '';
  // Replace common named entities
  const named = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'"
  };
  str = str.replace(/&(lt|gt|amp|quot|apos);/g, (m) => named[m] || m);
  // numeric decimal
  str = str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
  // numeric hex
  str = str.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return str;
}

function cleanHtml(html) {
  if (!html) return '';
  // remove scripts, styles, comments and inline styles; allow basic tags
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'h3' ]),
    allowedAttributes: {
      a: [ 'href', 'name', 'target', 'rel' ],
      img: [ 'src', 'alt', 'title', 'width', 'height' ],
      '*': []
    },
    allowedSchemesByTag: {
      img: ['http','https','data']
    },
    transformTags: {
      'a': sanitize.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' })
    }
  });
}

module.exports = {
  extractFirstImageFromHtml,
  decodeHtmlEntities,
  cleanHtml
};
