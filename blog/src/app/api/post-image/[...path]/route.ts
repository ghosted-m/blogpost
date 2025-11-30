import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getMimeType(ext: string) {
  switch (ext.toLowerCase()) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'bmp':
      return 'image/bmp';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    // pathname will look like /api/post-image/...path
    const base = '/api/post-image/';
    let rel = decodeURIComponent(url.pathname.replace(base, ''));
    rel = rel.replace(/^\/+/, '');

    if (!rel) {
      return NextResponse.json({ error: 'No image specified' }, { status: 400 });
    }

    const parts = rel.split('/').filter(Boolean);

    // Images are stored in the other package: ../post/public/images
    const imagesDir = path.join(process.cwd(), '..', 'post', 'public', 'images');
    const filePath = path.join(imagesDir, ...parts);

    // Prevent path traversal: ensure resolved path is inside imagesDir
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve(imagesDir))) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    if (!fs.existsSync(resolved)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const buffer = fs.readFileSync(resolved);
    const ext = path.extname(resolved).replace('.', '');
    const contentType = getMimeType(ext);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Error serving post image:', err);
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
  }
}
