"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './post.module.css';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug?: string;
  publishDate?: string;
  status?: 'published' | 'draft' | string;
};

export default function PostPage() {
  const params = useParams();
  // [...slug] is an array, join it back to handle nested paths like 'technology/is-google-...'
  const slugArray = params?.slug as string[] | undefined;
  const slug = slugArray ? (Array.isArray(slugArray) ? slugArray.join('/') : slugArray) : undefined;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/blogpost');
        if (!res.ok) throw new Error('Failed to fetch blog posts');
        const data = await res.json();

        // slug can be nested (e.g., 'technology/is-google-...')
        // stored slugs may have leading '/', so normalize both
        const normalizedSlug = slug ? decodeURIComponent(String(slug)).replace(/^\//, '') : '';
        const found = (data.posts || []).find((p: any) => {
          const pslug = p.slug ? decodeURIComponent(String(p.slug)).replace(/^\//, '') : '';
          if (normalizedSlug && pslug) return pslug === normalizedSlug;
          // fallback: if slug is numeric, allow matching by id
          if (normalizedSlug && /^[0-9]+$/.test(normalizedSlug)) return Number(p.id) === Number(normalizedSlug);
          return false;
        });

        if (!found) {
          setError('Post not found');
          setPost(null);
        } else {
          setPost({
            id: Number(found.id),
            title: found.title || '',
            excerpt: found.excerpt || '',
            content: found.content || found.content_html || '',
            slug: found.slug,
            publishDate: found.publishDate || found.createdAt || '',
            status: found.status || 'draft',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) return <div className={styles.loading}>Loading post...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post) return <div className={styles.error}>Post not found</div>;

  return (
    <main className={styles.container}>
      <article className={styles.card}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>📅 {post.publishDate ? new Date(post.publishDate).toLocaleString() : 'N/A'}</div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}
