import React from 'react'
import Link from 'next/link'
import News from '@/components/news'

function Home() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Blog</h1>
      <News />
    </div>
  )
}

export default Home
