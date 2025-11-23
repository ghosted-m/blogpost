import React from 'react'
import { posts } from '@/lib/blog';
import Link from 'next/link';

export default function page() {
  return (
    <div>
        {posts.map((post)=>(
            (() => {
              const slug = post.slug ?? post.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={slug || post.title} className='border p-4 m-4'>
                    <h2 className='text-2xl font-bold'>{post.title}</h2>
                    <p>{post.content.substring(0, 100)}...</p>
                    <span> <Link href={`/blog/${slug}`} >Read more</Link></span>
                </div>
              )
            })()
        ))}
    </div>
  )
}
