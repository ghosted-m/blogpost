'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './posts.module.css';

// Base URL for harvester/static images. Uses NEXT_PUBLIC_HARVESTER_API when available.
const API_URL = process.env.NEXT_PUBLIC_HARVESTER_API || 'http://localhost:4000';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  image_local?: string | null;
  image_original?: string | null;
  summary?: string | null;
  link?: string;
  published?: string;
  slug?: string;
  content?: string;
  status?: 'published' | 'draft';
};

type PostsResponse = {
  page: number;
  per_page: number;
  total: number;
  items: Post[];
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const perPage = 10;
  // Read published posts from blogpost.json (blog edits only)
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/blogpost');
        if (!res.ok) throw new Error('Failed to fetch blog posts');
        const data = await res.json();
          const items: Post[] = (data.posts || []).map((b: any) => ({
          id: Number(b.id),
          title: b.title || '',
          excerpt: b.excerpt || '',
          image_local: b.imagesPlacement || null,
          image_original: null,
          summary: b.summary || null,
            // Prefer slug-based links; fall back to numeric id when slug missing
            link: b.slug
              ? (b.slug.startsWith('/') ? `/posts${b.slug}` : `/posts/${b.slug}`)
              : `/posts/${b.id}`,
          published: b.publishDate || b.createdAt || '',
          status: b.status || 'draft',
          content: b.content || '',
        }));

        // Only show published posts
        const published = items.filter((p) => p.status === 'published');

        setPosts(published.sort((a, b) => (b.published || '').localeCompare(a.published || '')));
        setTotal(published.length || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  // Filter to show only published posts
  const publishedPosts = posts.filter((post) => post.status !== 'draft');

  const totalPages = Math.ceil(publishedPosts.length / perPage);

  const getImageUrl = (post: Post): string | null => {
    if (post.image_local) {
      // Ensure we don't duplicate slashes when joining
      if (post.image_local.startsWith('/')) return `${API_URL}${post.image_local}`;
      return `${API_URL}/${post.image_local}`;
    }
    return post.image_original || null;
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Blog Posts</h1>
        <p className={styles.subtitle}>Latest posts from RSS feeds</p>
      </div>

      {error && (
        <div className={styles.error}>
          <p>⚠️ Error: {error}</p>
          <p className={styles.hint}>Make sure the harvester server is running on {API_URL}</p>
        </div>
      )}

      {loading && <div className={styles.loading}>Loading posts...</div>}

      {!loading && posts.length === 0 && !error && (
        <div className={styles.empty}>No posts found. Start the harvester to fetch posts.</div>
      )}

      {!loading && posts.length > 0 && (
        <>
          <ul className={styles.postsList}>
            {publishedPosts.map((post) => {
              const imageUrl = getImageUrl(post);
              return (
                <li key={post.id} className={styles.postItem}>
                  <div className={styles.postContent}>
                    <h2>
                      <a
                        href={post.link}
                        rel="noopener noreferrer"
                        className={styles.postTitle}
                      >
                        {post.title}
                      </a>
                    </h2>

                    {post.summary && (
                      <div className={styles.summary}>
                        <strong>Summary:</strong> {post.summary}
                      </div>
                    )}

                    <div
                      className={styles.excerpt}
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />

                    {imageUrl && (
                      <div className={styles.imageContainer}>
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className={styles.postImage}
                          onError={e => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className={styles.meta}>
                      <span className={styles.date}>
                        📅 {post.published ? new Date(post.published).toLocaleDateString() : 'N/A'}
                      </span>
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                        Read Full Article →
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationBtn}
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={styles.paginationBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
