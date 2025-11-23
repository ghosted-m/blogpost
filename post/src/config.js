require('dotenv').config();
const path = require('path');

module.exports = {
  FEEDS: (process.env.FEEDS || '').split(',').map(s => s.trim()).filter(Boolean),
  PORT: process.env.PORT || 4000,
  // Default data directory should be the `public` folder inside the harvester
  DATA_DIR: process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, '..', 'public'),
  IMAGES_DIR: process.env.IMAGES_DIR || 'images',
  FETCH_INTERVAL_CRON: process.env.FETCH_INTERVAL_CRON || '0 * * * *',
  MAX_ITEMS_PER_FEED: Number(process.env.MAX_ITEMS_PER_FEED || 20),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  SUMMARIZE: (process.env.SUMMARIZE || 'false').toLowerCase() === 'true',
  KEEP_HTML: (process.env.KEEP_HTML || 'true').toLowerCase() === 'true',
  USER_AGENT: process.env.USER_AGENT || 'rss-harvester/1.0'
};
