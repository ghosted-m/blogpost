# Blog Console Feature

A complete blog post management console for editing and publishing posts from RSS feeds.

## Features

### 📝 Console Page (`/console`)
- Lists all posts fetched from RSS feeds
- Displays post title and excerpt (truncated to 150 characters)
- Click any post to open the editor
- Pagination support (20 posts per page)
- Clean, responsive grid layout

### ✏️ Post Editor Page (`/console/[id]`)
- Edit all post metadata with prefilled values from the harvester
- Editable fields:
  - **Title**: Post heading
  - **Slug**: URL-friendly identifier
  - **Publish Date**: Date picker
  - **Keyword**: SEO keyword
  - **Meta Description**: SEO meta description (max 160 chars with counter)
  - **Excerpt**: Short summary of the post
  - **Images Placement**: Image URL or local path with preview
  - **Content**: Full HTML content editor

### 💾 Save to JSON
- All edited posts are saved to `/blog/public/blogpost.json`
- Each post record includes:
  - All editable fields
  - `createdAt`: Timestamp when first saved
  - `updatedAt`: Timestamp of last update
- Posts are sorted by ID in descending order
- New posts are appended; existing posts (by ID) are updated

## Usage

### Starting the Console

1. **Start the harvester** (fetches RSS feeds):
```bash
node rss-harvester/src/server.js
```

2. **Start the blog dev server**:
```bash
cd blog
npm run dev -- -p 3001
```

3. **Access the console**:
```
http://localhost:3001/console
```

### Editing a Post

1. Click on any post in the console list
2. Edit the fields as needed
3. Click "💾 Save Post" to save to `blogpost.json`
4. Click "Cancel" to go back to the console without saving

### Viewing Saved Posts

The saved posts are stored in:
```
blog/public/blogpost.json
```

Example structure:
```json
[
  {
    "id": 2,
    "title": "Post Title",
    "excerpt": "Post excerpt",
    "slug": "post-title",
    "keyword": "keyword",
    "metaDescription": "SEO meta description",
    "imagesPlacement": "images/postimg_xxx.jpeg",
    "publishDate": "2025-11-22",
    "content": "<p>HTML content</p>",
    "createdAt": "2025-11-23T18:25:04.593Z",
    "updatedAt": "2025-11-23T18:25:09.090Z"
  }
]
```

## API Endpoints

### `GET /api/blogpost`
Retrieve all saved blog posts from `blogpost.json`

**Response:**
```json
{
  "posts": [...],
  "total": 10
}
```

### `POST /api/blogpost`
Save a new or updated blog post

**Request body:**
```json
{
  "id": 2,
  "title": "Post Title",
  "excerpt": "excerpt",
  "slug": "slug",
  "keyword": "keyword",
  "metaDescription": "description",
  "imagesPlacement": "path/to/image.jpg",
  "publishDate": "2025-11-22",
  "content": "<p>html content</p>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post saved successfully",
  "postId": 2
}
```

## File Structure

```
blog/
├── src/app/
│   ├── console/
│   │   ├── page.tsx              # Console list page
│   │   ├── console.module.css    # Console styling
│   │   └── [id]/
│   │       ├── page.tsx          # Editor page
│   │       └── editor.module.css # Editor styling
│   └── api/
│       └── blogpost/
│           └── route.ts           # API endpoint
└── public/
    └── blogpost.json             # Saved posts (auto-generated)
```

## Technical Details

- **Framework**: Next.js 16+ (App Router)
- **Data Source**: RSS feeds via harvester API at `http://localhost:4000`
- **Storage**: JSON file-based (`blog/public/blogpost.json`)
- **Styling**: CSS Modules for scoped styles
- **State Management**: React hooks (useState, useEffect)

## Notes

- The console fetches posts from the harvester API (`NEXT_PUBLIC_HARVESTER_API` env var, defaults to `http://localhost:4000`)
- Images are shown in the editor with a preview if the URL is provided
- Meta descriptions are limited to 160 characters (industry standard)
- All fields are optional except `id` and `title` for saving
