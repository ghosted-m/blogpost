// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getBlogPost } from '@/lib/blog';

type BlogPost = {
  title: string;
  content: string;
  image?: string[];
  description?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = (await params) as { slug: string };
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | My Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://example.com/blog/${slug}`,
      images: post.image ? post.image.map((src) => ({ url: src })) : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = (await params) as { slug: string };
  const post: BlogPost | null = await getBlogPost(slug);
  if (!post) {
    notFound();
  }
  return (
    <>
    
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
    </>
  );
}
