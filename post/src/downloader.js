const axios = require('axios');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

async function downloadImage(imageUrl, destDir, filenameHint='img') {
  if (!imageUrl) return null;
  try {
    const res = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 20000, headers: { 'User-Agent': 'rss-harvester/1.0' }});
    const contentType = res.headers['content-type'] || mime.lookup(imageUrl) || 'application/octet-stream';
    const ext = mime.extension(contentType) || path.extname(imageUrl).split('?')[0] || 'jpg';
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const filename = `${filenameHint}_${Date.now()}.${ext}`;
    const filepath = path.join(destDir, filename);
    fs.writeFileSync(filepath, res.data);
    return { filepath, filename, urlPath: filename };
  } catch (err) {
    console.warn('downloadImage error', imageUrl, err.message || err);
    return null;
  }
}

module.exports = downloadImage;
