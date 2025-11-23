const express = require('express');
const path = require('path');
const fs = require('fs');
const { PORT, DATA_DIR } = require('./config');
const { queryPosts, countPosts, getPostById } = require('./db');
const { startScheduler } = require('./scheduler');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  // Allow this resource to be embedded by cross-origin isolated pages
  // so browsers won't block the image as an opaque response when COEP/COOP is enabled
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

// serve static (public) folder (images + posts.json)
app.use(express.static(path.resolve(DATA_DIR)));

// API: GET /api/posts?page=1&per_page=10
app.get('/api/posts', (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const per_page = Math.min(100, Number(req.query.per_page || 10));
  const offset = (page - 1) * per_page;
  const items = queryPosts({ offset, limit: per_page });
  const total = countPosts();
  res.json({ page, per_page, total, items });
});

// API: GET /api/posts/:id
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = getPostById(id);
  if (!post) return res.status(404).json({ error: 'not found' });
  res.json(post);
});

// simple export endpoint to download posts.json
app.get('/api/export/json', (req, res) => {
  const file = path.join(DATA_DIR, 'posts.json');
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'no export found' });
  res.sendFile(file);
});

// start scheduler
startScheduler();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Static files served from ${path.resolve(DATA_DIR)}`);
});
