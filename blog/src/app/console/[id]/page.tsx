'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './editor.module.css';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  content_html?: string;
  link?: string;
  published?: string;
  image_local?: string | null;
  image_original?: string | null;
};

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
  status: 'published' | 'draft';
};

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditorPage({ params: paramsPromise }: EditorPageProps) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<BlogPost>({
    id: postId,
    title: '',
    excerpt: '',
    slug: '',
    keyword: '',
    metaDescription: '',
    imagesPlacement: '',
    publishDate: '',
    content: '',
    status: 'draft',
  });

  const API_URL = process.env.NEXT_PUBLIC_HARVESTER_API || 'http://localhost:4000';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/posts/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data: Post = await res.json();
        setPost(data);

        // Pre-fill form with post data
        setFormData({
          id: data.id,
          title: data.title || '',
          excerpt: data.excerpt || '',
          slug: data.link ? new URL(data.link).pathname.replace(/\/$/, '') : '',
          keyword: '',
          metaDescription: data.excerpt?.substring(0, 160) || '',
          imagesPlacement: data.image_local || data.image_original || '',
          publishDate: data.published ? new Date(data.published).toISOString().split('T')[0] : '',
          content: data.content_html || '',
          status: 'draft',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, API_URL]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/blogpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to save post');
      }

      alert('Post saved successfully to blogpost.json!');
      router.push('/console');
    } catch (err) {
      alert(`Error saving post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading post...</div>;

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Link href="/console" className={styles.backLink}>
          ← Back to Console
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Link href="/console" className={styles.backLink}>
          ← Back to Console
        </Link>
        <h1>✏️ Edit Post</h1>
        <p className={styles.subtitle}>Edit and save your blog post</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={formData.slug}
            onChange={handleChange}
            placeholder="URL slug (e.g., my-post-title)"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: (e.target.value as 'published' | 'draft'),
                }))
              }
              className={styles.selectInput}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publishDate">Publish Date</label>
            <input
              id="publishDate"
              name="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="keyword">Keyword</label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={formData.keyword}
              onChange={handleChange}
              placeholder="SEO keyword"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="metaDescription">Meta Description</label>
          <input
            id="metaDescription"
            name="metaDescription"
            type="text"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="SEO meta description (up to 160 chars)"
            maxLength={160}
          />
          <small>{formData.metaDescription.length}/160</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short excerpt of the post"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imagesPlacement">Images Placement</label>
          <input
            id="imagesPlacement"
            name="imagesPlacement"
            type="text"
            value={formData.imagesPlacement}
            onChange={handleChange}
            placeholder="Image URL or local path"
          />
          {formData.imagesPlacement && (
            <div className={styles.imagePreview}>
              <img
                src={
                  formData.imagesPlacement.startsWith('http')
                    ? formData.imagesPlacement
                    : `${API_URL}/${formData.imagesPlacement}`
                }
                alt="Preview"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content (HTML)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Full post content in HTML"
            rows={10}
          />
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Post'}
          </button>
          <Link href="/console" className={styles.cancelBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
