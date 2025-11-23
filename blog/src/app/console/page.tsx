'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './console.module.css';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  link?: string;
  published?: string;
  status?: 'published' | 'draft';
  transferred?: boolean;
  transferredStatus?: 'published' | 'draft' | string;
  image_local?: string | null;
};

type PostsResponse = {
  page: number;
  per_page: number;
  total: number;
  items: Post[];
};

export default function ConsolePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const perPage = 20;
  const API_URL = process.env.NEXT_PUBLIC_HARVESTER_API || 'http://localhost:4000';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch harvester posts
        const res = await fetch(`${API_URL}/api/posts?page=${page}&per_page=${perPage}`);
        if (!res.ok) throw new Error('Failed to fetch harvester posts');
        const harvesterData: PostsResponse = await res.json();
        const harvesterItems: Post[] = harvesterData.items || [];

        // Fetch blog edits to know which posts have been transferred to blogpost.json
        const blogRes = await fetch('/api/blogpost');
        let blogItems: any[] = [];
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          blogItems = blogData.posts || [];
        }

        const blogMap = new Map<number, any>();
        blogItems.forEach((b) => {
          const id = Number(b.id);
          if (id) blogMap.set(id, b);
        });

        // Mark harvester posts with transferred flag/status if present in blogpost.json
        const annotated = harvesterItems.map((p) => {
          const b = blogMap.get(p.id);
          return {
            ...p,
            transferred: !!b,
            transferredStatus: b?.status ?? null,
          } as Post;
        });

        setPosts(annotated);
        setTotal(harvesterItems.length || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, API_URL, perPage]);

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredPosts.length / perPage);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>📝 Blog Console</h1>
        <p className={styles.subtitle}>Manage and edit posts from RSS feeds</p>
      </div>

      <div className={styles.filterBar}>
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as 'all' | 'published' | 'draft');
            setPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
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
          <div className={styles.postsList}>
            {filteredPosts.map((post) => (
              <Link href={`/console/${post.id}`} key={post.id}>
                <div className={styles.postItem}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>
                    {post.excerpt.substring(0, 150)}
                    {post.excerpt.length > 150 ? '...' : ''}
                  </p>
                  <span className={styles.editBtn}>Edit →</span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={styles.paginationBtn}
              >
                ← Previous
              </button>
              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
