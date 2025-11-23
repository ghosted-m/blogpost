import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  keyword: string;
  metaDescription: string;
  imagesPlacement: string;
  publishDate: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function POST(request: NextRequest) {
  try {
    const blogPost: BlogPost = await request.json();

    // Normalize slug: remove any leading slashes so routing is consistent
    if (blogPost.slug) {
      blogPost.slug = String(blogPost.slug).replace(/^\/+/, '');
    }

    // Validate required fields
    if (!blogPost.title || !blogPost.id) {
      return NextResponse.json(
        { error: 'Missing required fields: title and id' },
        { status: 400 }
      );
    }

    // Get the public directory path
    const publicDir = path.join(process.cwd(), 'public');
    const blogpostPath = path.join(publicDir, 'blogpost.json');

    // Read existing blogpost.json if it exists, otherwise start with empty array
    let blogposts: BlogPost[] = [];
    if (fs.existsSync(blogpostPath)) {
      try {
        const existingData = fs.readFileSync(blogpostPath, 'utf-8');
        blogposts = JSON.parse(existingData);
      } catch (err) {
        console.warn('Error reading blogpost.json, starting fresh:', err);
      }
    }

    // Check if this post already exists
    const existingIndex = blogposts.findIndex((p) => p.id === blogPost.id);

    if (existingIndex >= 0) {
      // Update existing post
      blogposts[existingIndex] = {
        ...blogposts[existingIndex],
        ...blogPost,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add new post
      blogposts.push({
        ...blogPost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Sort by ID descending
    blogposts.sort((a, b) => b.id - a.id);

    // Write to blogpost.json
    fs.writeFileSync(blogpostPath, JSON.stringify(blogposts, null, 2), 'utf-8');

    return NextResponse.json(
      {
        success: true,
        message: 'Post saved successfully',
        postId: blogPost.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving blog post:', error);
    return NextResponse.json(
      { error: 'Failed to save post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const blogpostPath = path.join(publicDir, 'blogpost.json');

    if (!fs.existsSync(blogpostPath)) {
      return NextResponse.json({
        posts: [],
        total: 0,
      });
    }

    const data = fs.readFileSync(blogpostPath, 'utf-8');
    const blogposts = JSON.parse(data);

    return NextResponse.json({
      posts: blogposts,
      total: blogposts.length,
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to read posts' },
      { status: 500 }
    );
  }
}
