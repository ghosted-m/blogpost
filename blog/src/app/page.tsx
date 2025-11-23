import React from 'react'
import Link from 'next/link'

function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Blog</h1>
      <p>This is the blog project (ns port 3001)</p>
      
      <nav style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/about" style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
          About
        </Link>
        <Link href="/posts" style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
          Posts (from RSS)
        </Link>
      </nav>
    </div>
  )
}

export default Home
