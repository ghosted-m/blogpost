# Quick Start Guide - Blog Console

## Access the Console

Visit: **http://localhost:3001/console**

## How It Works

### 1. **View Posts**
- The console displays all posts fetched from your RSS feeds
- Each post shows the title and a preview of the excerpt
- Posts are paginated (20 per page)

### 2. **Edit a Post**
- Click on any post to open the editor
- You'll see prefilled fields with data from the RSS feed

### 3. **Available Fields to Edit**

| Field | Purpose | Notes |
|-------|---------|-------|
| **Title** | Post heading | Required |
| **Slug** | URL identifier | e.g., `my-post-title` |
| **Publish Date** | Publication date | Date picker provided |
| **Keyword** | SEO keyword | For search optimization |
| **Meta Description** | SEO description | Max 160 characters (counter shows usage) |
| **Excerpt** | Short summary | Editable plain text |
| **Images Placement** | Image URL or path | Local: `images/filename.jpg` or full URL |
| **Content** | Full HTML content | Raw HTML editor |

### 4. **Save Your Changes**
- Click **"💾 Save Post"** button at the bottom
- The post is saved to `/blog/public/blogpost.json`
- Success message appears on screen
- You're redirected back to the console

### 5. **View Saved Posts**
All edited posts are stored in a single JSON file:
- **Location**: `/home/veda/Desktop/next/blog/public/blogpost.json`
- **Format**: Array of blog post objects
- **Updates**: Posts are sorted by ID (newest first)

## Example Saved Post Structure

```json
{
  "id": 2,
  "title": "My Edited Post",
  "excerpt": "This is the excerpt...",
  "slug": "my-edited-post",
  "keyword": "blog, tutorial",
  "metaDescription": "Learn about...",
  "imagesPlacement": "images/postimg_1763825402167.jpeg",
  "publishDate": "2025-11-23",
  "content": "<p>Full HTML content goes here...</p>",
  "createdAt": "2025-11-23T18:25:04.593Z",
  "updatedAt": "2025-11-23T18:27:31.472Z"
}
```

## Tips

✅ **Image Preview**: Enter an image URL/path and a preview will appear below the field

✅ **Meta Description Counter**: Track your character count (aim for 150-160 for best SEO)

✅ **Back to Console**: Click "Cancel" to discard changes and return to the list

✅ **Multiple Saves**: You can edit and save the same post multiple times - it will update in the JSON file

## Requirements

- Harvester server running on `http://localhost:4000`
- Blog dev server running on `http://localhost:3001`
- Public write permissions in `/blog/public/` directory

## Troubleshooting

**Posts not loading?**
- Make sure the harvester is running: `node rss-harvester/src/server.js`
- Check that `NEXT_PUBLIC_HARVESTER_API` env is set correctly in `blog/.env.local`

**Can't save posts?**
- Check blog dev server is running: `npm run dev -- -p 3001`
- Ensure `/blog/public/` directory is writable

**Images not showing?**
- For local images, use path: `images/filename.jpeg`
- For remote images, use full URL: `https://example.com/image.jpg`
