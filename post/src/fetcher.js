// fetcher.js
const axios = require('axios');
const xml2js = require('xml2js');
const path = require('path');
const fs = require('fs');

const { FEEDS, DATA_DIR, IMAGES_DIR, MAX_ITEMS_PER_FEED, OPENAI_API_KEY, SUMMARIZE, KEEP_HTML, USER_AGENT } = require('./config');
const { extractFirstImageFromHtml, cleanHtml, decodeHtmlEntities } = require('./cleaner');
const downloadImage = require('./downloader');
const { htmlToMarkdown } = require('./mdconverter');
const { summarizeText } = require('./summarizer');
const { upsertPost } = require('./db');

async function fetchFeed(url) {
  const res = await axios.get(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml' }, timeout: 20000 });
  return res.data;
}

async function parseXml(xml) {
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
  const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  return Array.isArray(items) ? items : [items];
}

async function processItem(item, feedUrl) {
  const guid = (item.guid && (item.guid._ || item.guid)) || item.id || item.link || item.title;
  if (!guid) return null;

  const title = item.title && (typeof item.title === 'object' ? item.title._ : item.title) || 'Untitled';
  const link = item.link && (typeof item.link === 'object' ? (item.link.href || item.link._) : item.link) || '';
  const rawHtml = (item['content:encoded'] && (item['content:encoded']._ || item['content:encoded'])) || item.content || item.description || '';
  const baseUrl = link || feedUrl;
  // decode HTML entities first (many feeds escape HTML inside description)
  const decodedHtml = decodeHtmlEntities(rawHtml);

  // extract image BEFORE cleaning (so we can find images in HTML before sanitization)
  let imageUrl = null;
  // first, see if rss fields contain media:content/enclosure or media:thumbnail
  if (item['media:thumbnail']) {
    const mt = item['media:thumbnail'];
    imageUrl = Array.isArray(mt) ? mt[0].url || mt[0]['$']?.url : (mt.url || mt['$']?.url);
  }
  if (!imageUrl && item['media:content']) {
    const mc = item['media:content'];
    imageUrl = Array.isArray(mc) ? mc[0].url || mc[0]['$']?.url : (mc.url || mc['$']?.url);
  }
  if (!imageUrl && item.enclosure) {
    imageUrl = item.enclosure.url || (item.enclosure._ || null);
  }
  if (!imageUrl) {
    imageUrl = extractFirstImageFromHtml(decodedHtml, baseUrl);
  }

  // clean HTML (use decoded HTML)
  const cleanedHtml = cleanHtml(decodedHtml);

  // download image locally
  let image_local = null;
  if (imageUrl) {
    const imagesPath = path.join(DATA_DIR, IMAGES_DIR);
    const res = await downloadImage(imageUrl, imagesPath, 'postimg');
    if (res) image_local = path.join(IMAGES_DIR, res.filename).replace(/\\/g, '/');
  }

  // markdown conversion
  const content_md = htmlToMarkdown(cleanedHtml);

  // excerpt: use cleaned HTML (sanitized) or decoded HTML, strip tags for a plain-text excerpt
  const textSource = (cleanedHtml && String(cleanedHtml)) || decodedHtml || '';
  const excerpt = String(textSource).replace(/<[^>]+>/g, '').trim().slice(0, 250);

  // published date
  const published = item.pubDate || item.published || item.updated || '';

  // summarization (optional)
  let summary = null;
  if (SUMMARIZE && OPENAI_API_KEY) {
    const toSumm = KEEP_HTML ? cleanedHtml : content_md;
    try {
      summary = await summarizeText(toSumm, OPENAI_API_KEY);
    } catch (e) {
      summary = null;
    }
  }

  const post = {
    guid,
    title,
    link,
    content_html: KEEP_HTML ? cleanedHtml : '',
    content_md: KEEP_HTML ? '' : content_md,
    excerpt,
    image_local,
    image_original: imageUrl || null,
    summary,
    published,
    status: 'published' // Set fetched posts as published by default
  };

  upsertPost(post);
  return post;
}

async function runOnce() {
  if (!FEEDS.length) {
    console.error('No FEEDS configured. Set FEEDS in .env');
    process.exit(1);
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  for (const feed of FEEDS) {
    try {
      console.log('Fetching feed', feed);
      const xml = await fetchFeed(feed);
      const items = await parseXml(xml);
      let count = 0;
      for (const item of items) {
        if (count >= MAX_ITEMS_PER_FEED) break;
        try {
          const result = await processItem(item, feed);
          if (result) count++;
        } catch (e) {
          console.warn('processItem error', e.message || e);
        }
      }
      console.log(`Imported ${count} items from ${feed}`);
    } catch (err) {
      console.warn('Feed fetch/parse error for', feed, err.message || err);
    }
  }

  console.log('All posts saved to posts.json');
}

if (require.main === module) {
  runOnce().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { runOnce };
