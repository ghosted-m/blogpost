// src/lib/blog.ts
type BlogPost = {
  title: string;
  description?: string;
  content: string;
  slug?: string;
  keywords?: string[];
  image?: string[];
};
export const posts: BlogPost[] = [
  {
    title: "My First Post",
    description: "Test blog app with Next.js",
    content: "This is the content of my first post.",
    slug: "my-first-post",
    image: ["https://example.com/image1.jpg"],
  },
  {
    title: "Second Post",
    description: "Another post for testing.",
    content: "Content for the second post.",
    slug: "second-post",
    image: ["https://example.com/image2.jpg"],
  },
];
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = posts.find((post) => {
    const titleSlug = post.title.toLowerCase().replace(/\s+/g, '-');
    if (post.slug) return post.slug === slug || titleSlug === slug;
    return titleSlug === slug;
  });
  return post || null;
}
