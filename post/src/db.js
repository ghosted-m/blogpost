const path = require('path');
const fs = require('fs');

// JSON-based storage for posts
const POSTS_FILE = path.resolve(__dirname, '..', 'public', 'posts.json');

function ensurePostsFile() {
  const dir = path.dirname(POSTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readPosts() {
  ensurePostsFile();
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writePosts(posts) {
  ensurePostsFile();
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf8');
}

function upsertPost(post) {
  // post: { guid, title, link, content_html, content_md, excerpt, image_local, image_original, summary, published, status }
  const posts = readPosts();
  const index = posts.findIndex(p => p.guid === post.guid);
  
  const newPost = {
    id: index >= 0 ? posts[index].id : Math.max(...posts.map(p => p.id || 0), 0) + 1,
    ...post,
    status: post.status || 'draft',
    created_at: index >= 0 ? posts[index].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  if (index >= 0) {
    posts[index] = newPost;
  } else {
    posts.push(newPost);
  }
  
  writePosts(posts);
  return newPost;
}

function queryPosts({ offset = 0, limit = 10 }) {
  const posts = readPosts();
  return posts.sort((a, b) => {
    // Sort by published date desc, then created_at desc
    const dateA = new Date(a.published || a.created_at).getTime();
    const dateB = new Date(b.published || b.created_at).getTime();
    return dateB - dateA;
  }).slice(offset, offset + limit);
}

function countPosts() {
  return readPosts().length;
}

function getPostById(id) {
  const posts = readPosts();
  return posts.find(p => p.id === id);
}

function exportAll() {
  const posts = readPosts();
  return posts.sort((a, b) => {
    const dateA = new Date(a.published || a.created_at).getTime();
    const dateB = new Date(b.published || b.created_at).getTime();
    return dateB - dateA;
  });
}

module.exports = { upsertPost, queryPosts, countPosts, exportAll, getPostById, readPosts, writePosts, POSTS_FILE };
